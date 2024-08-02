import { Action, ActionType, KillEnemy, Move, OpenDoor, PickItem, PickKey } from "../../models/play/action"
import { AppliedItem, ITEM_ATTRIBUTES, ItemAttribute, PLAYER_ATTRIBUTES, PlayerAttribute } from "../../models/attribute"
import { Container, FederatedPointerEvent, Point, Sprite, Text, Ticker } from "pixi.js"
import {
  DoorTile,
  EMPTY_TILE,
  EnemyTile,
  ItemTile,
  KeyTile,
  STARTING_POSITION_TILE,
  Tile,
  TileType,
} from "../../../common/models/tile"
import { InfoBar, ValueChangeType } from "./info-bar"
import { AbstractMap } from "../../../common/front/tower/abstract-map"
import { AnimationSource } from "../game-event-manager"
import { capitalize } from "../../../common/models/utils"
import { Delta2D } from "../../models/tuples"
import { Enemy } from "../../../common/models/enemy"
import { Game } from "../../game"
import { getTextColor } from "../../../common/front/color-scheme"
import { ItemName } from "../../../common/data/item-name"
import { Keys } from "../../../common/front/keys"
import { SMALL_SPACES_STRING } from "../../../common/front/functions"
import { SpritesToItem } from "../../../common/front/map/sprites-to-item"
import { TILES_IN_ROW } from "../../../common/data/constants"

type AttributeChangeInterval = {
  from: number
  to: number
}

export class GameMap extends AbstractMap {
  private static readonly ACTION_TIME: number = 150

  private static readonly TILE_GRAB_HIDE_BEGIN_PERCENT: number = 0.25
  private static readonly TILE_GRAB_HIDE_END_PERCENT: number = 0.75

  private static readonly TILE_SWITCH_HIDE_BEGIN_PERCENT: number = 0.25
  private static readonly TILE_SWITCH_HIDE_MIDDLE_PERCENT: number = 0.5
  private static readonly TILE_SWITCH_HIDE_END_PERCENT: number = 0.75

  private static readonly ALPHA_TILE_UNDERNEATH = 0.2

  private readonly game: Game
  // @ts-ignore
  private tiles: Container
  // @ts-ignore
  private playerSprite: null | Sprite
  // @ts-ignore
  private tickerFunction: null | ((ticker: Ticker) => void)
  private deltaBuffer: Delta2D[] = []
  private currentAction: Action | null = null
  private readonly sprites: Container[][] | null[][]
  private infoBar: InfoBar

  private static readonly ATTRIBUTE_TO_TOOL_TIP_DESCRIPTION: Record<ItemAttribute, (value: number) => string> = {
    [ItemAttribute.ATK]: (value: number): string => {
      return `+${value}${SMALL_SPACES_STRING}ATK`
    },
    [ItemAttribute.DEF]: (value: number): string => {
      return `+${value}${SMALL_SPACES_STRING}DEF`
    },
    [ItemAttribute.HP]: (value: number): string => {
      return `+${value}${SMALL_SPACES_STRING}HP`
    },
    [ItemAttribute.HP_MUL_ADD]: (value: number): string => {
      return `+${value}${SMALL_SPACES_STRING}HP multiplier`
    },
    [ItemAttribute.HP_MUL_MUL]: (value: number): string => {
      return `*${value}${SMALL_SPACES_STRING}HP multiplier `
    },
    [ItemAttribute.EXP_MUL_ADD]: (value: number): string => {
      return `+${value}${SMALL_SPACES_STRING}EXP multiplier`
    },
    [ItemAttribute.EXP_MUL_MUL]: (value: number): string => {
      return `*${value}${SMALL_SPACES_STRING}EXP multiplier `
    },
  }

  constructor(game: Game, infoBar: InfoBar) {
    super()
    this.game = game
    this.infoBar = infoBar
    this.game.eventManager.registerSchemeChange(() => this.schemeChanged())
    this.sprites = new Array(TILES_IN_ROW)
    for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
      this.sprites[lineIndex] = new Array(TILES_IN_ROW).fill(null, 0, TILES_IN_ROW)
    }
    this.game.eventManager.registerAnimationStart((animationSource: AnimationSource) => {
      if (animationSource !== AnimationSource.GAME_MAP) {
        this.cancelCurrentAnimation()
      }
    })
  }

  async init(): Promise<any> {
    console.debug("GameMap", "init")
    document.addEventListener("keydown", (e: KeyboardEvent) => this.keyDown(e))
    this.background.on("pointertap", (e: FederatedPointerEvent) => this.pointerTap(e))
    return super.init()
  }

  repaint(): void {
    console.debug("GameMap", "repaint")
    this.cancelCurrentAnimation()
    this.redraw(1)
  }

  private cancelCurrentAnimation(): void {
    if (this.currentAction) {
      this.currentAction = null
      if (this.tickerFunction !== null) {
        this.app.ticker.remove(this.tickerFunction)
        this.tickerFunction = null
      }
      this.deltaBuffer.length = 0
    }
  }

  private redraw(alpha: number): void {
    if (this.tiles != null) {
      this.app.stage.removeChild(this.tiles)
      this.tiles.destroy()
      this.playerSprite = null
    }
    this.createTiles(alpha)
    this.app.stage.addChild(this.tiles)
  }

  protected afterRepositionCursor(): void {
    const playerTower = this.game.playerTower!
    const tileReachable = playerTower.reachableTiles[this.lastMouseTile.y][this.lastMouseTile.x]
    if (tileReachable === null) {
      this.app.canvas.style.cursor = "not-allowed"
    } else {
      this.app.canvas.style.cursor = "auto"
    }
  }

  private createTiles(alpha: number): void {
    this.tiles = new Container()
    if (alpha !== 1) {
      this.tiles.alpha = alpha
    }
    const playerTower = this.game.playerTower!
    const playerPosition = playerTower.playerPosition
    const currentRoomIndex = playerPosition.room
    const currentRoom = playerTower.standardRooms[currentRoomIndex]
    const scores = playerTower.tower.standardRooms[currentRoomIndex].scores
    for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
      for (let columnIndex = 0; columnIndex < TILES_IN_ROW; columnIndex++) {
        const x = this.tileSize * columnIndex
        const y = this.tileSize * lineIndex

        const playerOnCurrentTile = lineIndex === playerPosition.line && columnIndex === playerPosition.column
        if (playerOnCurrentTile) {
          this.playerSprite = this.spriter.getSprite(SpritesToItem.spriteNameFromTile(STARTING_POSITION_TILE)!)
          this.playerSprite.x = x
          this.playerSprite.y = y
          this.tiles.addChild(this.playerSprite)
        }

        const currentTile = currentRoom[lineIndex][columnIndex]
        const currentScore = scores.find((s) => s.line === lineIndex && s.column === columnIndex)
        if (currentScore !== undefined) {
          const scoreSpriteName = SpritesToItem.spriteNameFromScore(currentScore.type)
          const scoreSprite = this.spriter.getSprite(scoreSpriteName)
          scoreSprite.x = x
          scoreSprite.y = y
          if (currentTile !== EMPTY_TILE || playerOnCurrentTile) {
            scoreSprite.alpha = GameMap.ALPHA_TILE_UNDERNEATH
          }
          this.tiles.addChild(scoreSprite)
        }

        if (currentTile !== EMPTY_TILE) {
          const sprite = this.createSprite(currentTile!)
          sprite.x = x
          sprite.y = y
          if (playerOnCurrentTile) {
            sprite.alpha = GameMap.ALPHA_TILE_UNDERNEATH
          }
          this.tiles.addChild(sprite)
          this.sprites[lineIndex][columnIndex] = sprite
        } else {
          this.sprites[lineIndex][columnIndex] = null
        }
      }
    }
  }

  private createSprite(tile: Tile): Container {
    const spriteName = SpritesToItem.spriteNameFromTile(tile)!
    const sprite = this.spriter.getSprite(spriteName)
    if (tile.getType() == TileType.enemy) {
      const enemyContainer = new Container()
      enemyContainer.addChild(sprite)
      const enemyTile = tile as EnemyTile
      const text = new Text({
        text: enemyTile.enemy.level !== null ? enemyTile.enemy.level : "",
        style: {
          fontFamily: "JetBrains Mono",
          fontSize: this.tileSize / 2,
          fill: getTextColor(),
          align: "center",
        },
      })
      text.x = this.tileSize * 0.5
      text.y = this.tileSize * 0.4
      text.anchor.x = 0.5
      enemyContainer.addChild(text)
      return enemyContainer
    } else {
      return sprite
    }
  }

  protected toolTipText(): string | null {
    const tile: Tile =
      this.game.playerTower!.standardRooms[this.game.playerTower!.playerPosition.room][this.lastMouseTile.y][
        this.lastMouseTile.x
      ]
    switch (tile.getType()) {
      case TileType.door:
        return `${capitalize((tile as DoorTile).color)} key`
      case TileType.empty:
        return null
      case TileType.enemy:
        const enemy = (tile as EnemyTile).enemy
        return this.toolTipTextEnemy(enemy)
      case TileType.item:
        const itemName = (tile as ItemTile).item
        return this.toolTipTextItem(itemName)
      case TileType.key:
        return `${capitalize((tile as KeyTile).color)} key`
      case TileType.staircase:
        return null
      case TileType.startingPosition:
        throw new Error("Should not happen")
      case TileType.wall:
        return null
    }
  }

  private toolTipTextEnemy(enemy: Enemy): string {
    const enemyToolTipAttributes = this.game.playerTower!.enemyToolTipAttributes(enemy)
    const dropName = enemy.drop !== null ? enemy.drop : "nothing"
    const damage = enemyToolTipAttributes.hpLost !== null ? `Damage: ${enemyToolTipAttributes.hpLost} HP` : "Unkillable"
    return `${enemy.name} ${capitalize(enemy.type!.valueOf())} lv ${enemy.level}<br>${enemy.hp} HP<br>${enemy.atk} ATK<br>${enemy.def} DEF<br>${enemy.exp} EXP<br>Drop ${dropName}<br>${damage}`
  }

  private toolTipTextItem(itemName: ItemName): string {
    const itemToolTipAttributes = this.game.playerTower!.itemToolTipAttributes(itemName)
    let result = itemName.valueOf()
    for (const attributeName of ITEM_ATTRIBUTES) {
      const attributeValue = itemToolTipAttributes[attributeName]
      if (attributeValue !== undefined) {
        const tooltipDescriptionFunction = GameMap.ATTRIBUTE_TO_TOOL_TIP_DESCRIPTION[attributeName]
        result += `<br>${tooltipDescriptionFunction(attributeValue)}`
      }
    }
    return result
  }

  private keyDown(e: KeyboardEvent): void {
    console.debug("GameMap", "keyDown", e)
    switch (e.key) {
      case Keys.ARROW_RIGHT: {
        this.bufferDirection(Delta2D.RIGHT)
        break
      }
      case Keys.ARROW_LEFT: {
        this.bufferDirection(Delta2D.LEFT)
        break
      }
      case Keys.ARROW_UP: {
        this.bufferDirection(Delta2D.UP)
        break
      }
      case Keys.ARROW_DOWN: {
        this.bufferDirection(Delta2D.DOWN)
        break
      }
    }
  }

  private bufferDirection(delta: Delta2D): void {
    this.deltaBuffer.push(delta)
    if (this.currentAction === null) {
      this.tryAction()
    }
  }

  private getAttributesChange(appliedItem: AppliedItem): Record<PlayerAttribute, AttributeChangeInterval | undefined> {
    const result = {}
    for (const attributeName of PLAYER_ATTRIBUTES) {
      // @ts-ignore
      const attributeValue = appliedItem[attributeName]
      if (attributeValue !== undefined) {
        const playerAttribute = this.game.playerTower!.playerInfo[attributeName]
        // @ts-ignore
        result[attributeName] = {
          from: playerAttribute - attributeValue,
          to: playerAttribute,
        }
      }
    }
    // @ts-ignore
    return result
  }

  private triggerMoveAction(move: Move | PickItem | PickKey): (ticker: Ticker) => void {
    let totalPercentMove: number = 0
    const deltaColumn = move.target.column - move.player.column
    const deltaLine = move.target.line - move.player.line
    let targetSprite: Container | null = null
    const existingSprite: Container | null = this.sprites[move.player.line][move.player.column]
    let attributesChange: Record<PlayerAttribute, AttributeChangeInterval | undefined>

    switch (move.getType()) {
      case ActionType.PICK_ITEM:
        targetSprite = this.sprites[move.target.line][move.target.column]
        const appliedItem = (move as PickItem).appliedItem
        attributesChange = this.getAttributesChange(appliedItem)
        for (const attribute of PLAYER_ATTRIBUTES) {
          const attributeChange = attributesChange[attribute]
          if (attributeChange !== undefined) {
            this.infoBar.startChangeField(attribute, ValueChangeType.UP)
          }
        }
        break
      case ActionType.PICK_KEY:
        targetSprite = this.sprites[move.target.line][move.target.column]
        const color = (move as PickKey).color
        this.infoBar.startChangeKey(color, ValueChangeType.UP)
        this.infoBar.setKeyValue(color, this.game.playerTower!.playerInfo.keys[color])
        break
    }

    return (ticker: Ticker): void => {
      const percentMove: number = ticker.deltaMS / GameMap.ACTION_TIME
      totalPercentMove += percentMove

      if (targetSprite !== null) {
        if (totalPercentMove >= GameMap.TILE_GRAB_HIDE_END_PERCENT) {
          this.tiles.removeChild(targetSprite)
          targetSprite = null
        } else if (totalPercentMove > GameMap.TILE_GRAB_HIDE_BEGIN_PERCENT) {
          targetSprite!.alpha =
            1 -
            (totalPercentMove - GameMap.TILE_GRAB_HIDE_BEGIN_PERCENT) /
              (GameMap.TILE_GRAB_HIDE_END_PERCENT - GameMap.TILE_GRAB_HIDE_BEGIN_PERCENT)
        }
      }

      if (existingSprite !== null) {
        if (totalPercentMove >= 1) {
          existingSprite.alpha = 1
        } else if (totalPercentMove >= 0.5) {
          existingSprite.alpha =
            (totalPercentMove - 0.5) * (1 / GameMap.ALPHA_TILE_UNDERNEATH) + GameMap.ALPHA_TILE_UNDERNEATH
        }
      }

      switch (move.getType()) {
        case ActionType.PICK_ITEM:
          if (totalPercentMove >= 1) {
            for (const attribute of PLAYER_ATTRIBUTES) {
              const attributeChange = attributesChange[attribute]
              if (attributeChange !== undefined) {
                this.infoBar.setFieldValue(attribute, attributeChange.to)
                this.infoBar.endChangeField(attribute, ValueChangeType.UP)
              }
            }
          } else {
            for (const attribute of PLAYER_ATTRIBUTES) {
              const attributeChange = attributesChange[attribute]
              if (attributeChange !== undefined) {
                const value = Math.ceil(
                  attributeChange.from + ((attributeChange.to - attributeChange.from) * totalPercentMove) / 100,
                )
                this.infoBar.setFieldValue(attribute, value)
              }
            }
          }
          break
        case ActionType.PICK_KEY:
          if (totalPercentMove >= 1) {
            const color = (move as PickKey).color
            this.infoBar.endChangeKey(color, ValueChangeType.UP)
          }
          break
      }

      if (deltaColumn !== 0) {
        if (totalPercentMove >= 1) {
          this.playerSprite!.x = (move.player.column + deltaColumn) * this.tileSize
        } else {
          this.playerSprite!.x += percentMove * deltaColumn * this.tileSize
        }
      }
      if (deltaLine !== 0) {
        if (totalPercentMove >= 1) {
          this.playerSprite!.y = (move.player.line + deltaLine) * this.tileSize
        } else {
          this.playerSprite!.y += percentMove * deltaLine * this.tileSize
        }
      }

      if (totalPercentMove >= 1) {
        this.currentMoveEnded()
      }
    }
  }

  private triggerRoomChange(): (ticker: Ticker) => void {
    let totalPercentMove: number = 0
    let switchDone = false
    return (ticker: Ticker): void => {
      const percentMove: number = ticker.deltaMS / GameMap.ACTION_TIME
      totalPercentMove += percentMove
      if (totalPercentMove >= 1) {
        this.currentMoveEnded()
      } else if (totalPercentMove >= 0.5) {
        if (!switchDone) {
          switchDone = true
          this.tiles.alpha = 0
          this.redraw(0)
        }
        this.tiles.alpha = (totalPercentMove - 0.5) * 2
      } else {
        this.tiles.alpha = 1 - totalPercentMove * 2
      }
    }
  }

  private triggerMoveAndBackAction(move: OpenDoor | KillEnemy): (ticker: Ticker) => void {
    let totalPercentMove: number = 0
    const deltaColumn = move.target.column - move.player.column
    const deltaLine = move.target.line - move.player.line
    const oldTargetSprite: Container = this.sprites[move.target.line][move.target.column]!

    const hasNewTile = move.getType() == ActionType.KILL_ENEMY && (move as KillEnemy).dropTile != EMPTY_TILE
    let newTargetSprite: null | Sprite = null
    if (hasNewTile) {
      newTargetSprite = this.spriter.getSprite(SpritesToItem.spriteNameFromTile((move as KillEnemy).dropTile)!)
      newTargetSprite.alpha = 0
      newTargetSprite.x = oldTargetSprite.x
      newTargetSprite.y = oldTargetSprite.y
      this.sprites[move.target.line][move.target.column] = newTargetSprite
    }

    let enemyHpChange: null | AttributeChangeInterval = null
    let enemyExpChange: null | AttributeChangeInterval = null

    switch (move.getType()) {
      case ActionType.KILL_ENEMY:
        const killEnemy = move as KillEnemy
        if (killEnemy.hpLost > 0) {
          this.infoBar.startChangeField(PlayerAttribute.HP, ValueChangeType.DOWN)
          enemyHpChange = {
            from: this.game.playerTower!.playerInfo.hp + killEnemy.hpLost,
            to: this.game.playerTower!.playerInfo.hp,
          }
        }
        if (killEnemy.expWin > 0) {
          this.infoBar.startChangeField(PlayerAttribute.EXP, ValueChangeType.UP)
          enemyExpChange = {
            from: this.game.playerTower!.playerInfo.exp - killEnemy.expWin,
            to: this.game.playerTower!.playerInfo.exp,
          }
        }
        break
      case ActionType.OPEN_DOOR:
        const color = (move as OpenDoor).color
        this.infoBar.startChangeKey(color, ValueChangeType.DOWN)
        this.infoBar.setKeyValue(color, this.game.playerTower!.playerInfo.keys[color])
        break
    }

    let switchDone = false
    return (ticker: Ticker): void => {
      const percentMove: number = ticker.deltaMS / GameMap.ACTION_TIME
      totalPercentMove += percentMove

      if (totalPercentMove >= GameMap.TILE_SWITCH_HIDE_END_PERCENT) {
        if (newTargetSprite !== null) {
          newTargetSprite.alpha = 1
          newTargetSprite = null
        }
      } else if (totalPercentMove > GameMap.TILE_SWITCH_HIDE_MIDDLE_PERCENT) {
        if (!switchDone) {
          switchDone = true
          oldTargetSprite!.alpha = 0
          this.tiles.removeChild(oldTargetSprite)
          if (newTargetSprite !== null) {
            this.tiles.addChild(newTargetSprite)
          }
        } else {
          if (newTargetSprite !== null) {
            newTargetSprite!.alpha =
              1 -
              (totalPercentMove - GameMap.TILE_SWITCH_HIDE_BEGIN_PERCENT) /
                (GameMap.TILE_SWITCH_HIDE_MIDDLE_PERCENT - GameMap.TILE_SWITCH_HIDE_BEGIN_PERCENT)
          }
        }
      } else if (totalPercentMove > GameMap.TILE_SWITCH_HIDE_BEGIN_PERCENT) {
        oldTargetSprite!.alpha =
          1 -
          (totalPercentMove - GameMap.TILE_SWITCH_HIDE_BEGIN_PERCENT) /
            (GameMap.TILE_SWITCH_HIDE_MIDDLE_PERCENT - GameMap.TILE_SWITCH_HIDE_BEGIN_PERCENT)
      }

      switch (move.getType()) {
        case ActionType.KILL_ENEMY:
          if (totalPercentMove >= GameMap.TILE_SWITCH_HIDE_END_PERCENT) {
            if (enemyHpChange !== null) {
              this.infoBar.setFieldValue(PlayerAttribute.HP, enemyHpChange.to)
              this.infoBar.endChangeField(PlayerAttribute.HP, ValueChangeType.DOWN)
            }
            if (enemyExpChange !== null) {
              this.infoBar.setFieldValue(PlayerAttribute.EXP, enemyExpChange.to)
              this.infoBar.endChangeField(PlayerAttribute.EXP, ValueChangeType.UP)
            }
          } else {
            if (enemyHpChange !== null) {
              const value = Math.ceil(
                enemyHpChange.from + ((enemyHpChange.to - enemyHpChange.from) * totalPercentMove) / 100,
              )
              this.infoBar.setFieldValue(PlayerAttribute.HP, value)
            }
            if (enemyExpChange !== null) {
              const value = Math.ceil(
                enemyExpChange.from + ((enemyExpChange.to - enemyExpChange.from) * totalPercentMove) / 100,
              )
              this.infoBar.setFieldValue(PlayerAttribute.EXP, value)
            }
          }
          break
        case ActionType.OPEN_DOOR:
          if (totalPercentMove >= GameMap.TILE_SWITCH_HIDE_END_PERCENT) {
            const color = (move as OpenDoor).color
            this.infoBar.endChangeKey(color, ValueChangeType.DOWN)
          }
          break
      }

      if (deltaColumn !== 0) {
        if (totalPercentMove >= 1) {
          this.playerSprite!.x = move.player.column * this.tileSize
          this.currentMoveEnded()
        } else if (totalPercentMove >= 0.5) {
          this.playerSprite!.x -= (percentMove * deltaColumn * this.tileSize) / 4
        } else {
          this.playerSprite!.x += (percentMove * deltaColumn * this.tileSize) / 4
        }
      }
      if (deltaLine !== 0) {
        if (totalPercentMove >= 1) {
          this.playerSprite!.x = move.player.column * this.tileSize
          this.currentMoveEnded()
        } else if (totalPercentMove >= 0.5) {
          this.playerSprite!.y -= (percentMove * deltaLine * this.tileSize) / 4
        } else {
          this.playerSprite!.y += (percentMove * deltaLine * this.tileSize) / 4
        }
      }
    }
  }

  private tryAction(): void {
    const delta = this.deltaBuffer.shift()!
    const action: Action | null = this.game.playerTower!.movePlayer(delta)
    console.debug("GameMap", "tryAction", delta, action === null ? null : action.getType())
    if (action === null) {
      this.deltaBuffer.length = 0
      this.currentAction = null
      return
    }
    this.currentAction = action
    this.game.eventManager.notifyAnimationStart(AnimationSource.GAME_MAP)
    switch (action.getType()) {
      case ActionType.MOVE:
        this.tickerFunction = this.triggerMoveAction(action as Move)
        break
      case ActionType.PICK_ITEM:
        this.tickerFunction = this.triggerMoveAction(action as PickItem)
        break
      case ActionType.PICK_KEY:
        this.tickerFunction = this.triggerMoveAction(action as PickKey)
        break
      case ActionType.ROOM_CHANGE:
        this.tickerFunction = this.triggerRoomChange()
        break
      case ActionType.OPEN_DOOR:
        this.tickerFunction = this.triggerMoveAndBackAction(action as OpenDoor)
        break
      case ActionType.KILL_ENEMY:
        this.tickerFunction = this.triggerMoveAndBackAction(action as KillEnemy)
        break
    }
    this.app.ticker.add(this.tickerFunction!)
  }

  private currentMoveEnded(): void {
    console.debug("GameMap", "maybeStopAction")
    if (this.tickerFunction !== null) {
      this.app.ticker.remove(this.tickerFunction)
      this.tickerFunction = null
    }
    if (this.deltaBuffer.length == 0) {
      console.debug("GameMap", "maybeStopAction", "stop")
      this.currentAction = null
    } else {
      console.debug("GameMap", "maybeStopAction", "go on")
      this.tryAction()
    }
  }

  private pointerTap(e: FederatedPointerEvent): void {
    const tilePosition: Point = this.tileFromEvent(e)
    console.debug("GameMap", "pointerTap", "tile", tilePosition)
    if (!this.currentAction && this.deltaBuffer.length == 0) {
      const pathToTile: Delta2D[] | null = this.game.playerTower!.reachableTiles[tilePosition.y][tilePosition.x]
      console.debug("GameMap", "pointerTap", "path", pathToTile)
      if (pathToTile !== null) {
        for (const pathPart of pathToTile) {
          this.bufferDirection(pathPart)
        }
      }
    }
  }
}
