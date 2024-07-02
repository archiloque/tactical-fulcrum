import { Action, ActionType, KillEnemy, OpenDoor, PickItem, PickKey, PlayerMove } from "../../models/play/action"
import { Attribute, ATTRIBUTES } from "../../models/attribute"
import { Container, FederatedPointerEvent, Sprite, Text, Ticker } from "pixi.js"
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
import { AbstractMap } from "../../../common/front/tower/abstract-map"
import { capitalize } from "../../../common/models/utils"
import { Delta2D } from "../../models/tuples"
import { Game } from "../../game"
import { getTextColor } from "../../../common/front/color-scheme"
import { InfoBar } from "./info-bar"
import { ItemName } from "../../../common/data/item-name"
import { Keys } from "../../../common/front/keys"
import { PlayItem } from "../../models/play/play-item"
import { SpritesToItem } from "../../../common/front/map/sprites-to-item"
import { TILES_IN_ROW } from "../../../common/data/constants"

type AttributeChangeInterval = {
  from: number
  to: number
}

export class GameMap extends AbstractMap {
  static readonly TILE_MOVE_TIME: number = 150

  static readonly TILE_GRAB_HIDE_BEGIN_PERCENT: number = 0.25
  static readonly TILE_GRAB_HIDE_END_PERCENT: number = 0.75

  static readonly TILE_SWITCH_HIDE_BEGIN_PERCENT: number = 0.25
  static readonly TILE_SWITCH_HIDE_MIDDLE_PERCENT: number = 0.5
  static readonly TILE_SWITCH_HIDE_END_PERCENT: number = 0.75

  private readonly game: Game
  private tiles: Container
  private playerSprite: null | Sprite
  private tickerFunction: null | ((ticker: Ticker) => void)
  private deltaBuffer: Delta2D[] = []
  private currentAction: Action | null = null
  private readonly sprites: Sprite | null[][]
  private infoBar: InfoBar

  constructor(game: Game, infoBar: InfoBar) {
    super()
    this.game = game
    this.infoBar = infoBar
    this.game.eventManager.registerSchemeChange(() => this.schemeChanged())
    this.sprites = new Array(TILES_IN_ROW)
    for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
      this.sprites[lineIndex] = new Array(TILES_IN_ROW).fill(null, 0, TILES_IN_ROW)
    }
  }

  async init(): Promise<any> {
    console.debug("Map", "init")
    this.background.on("pointermove", (e: FederatedPointerEvent) => this.pointerMove(e))
    document.addEventListener("keydown", (e: KeyboardEvent) => this.keyDown(e))
    return super.init()
  }

  repaint(): void {
    if (this.currentAction) {
      this.currentAction = null
      if (this.tickerFunction !== null) {
        this.app.ticker.remove(this.tickerFunction)
        this.tickerFunction = null
      }
      this.deltaBuffer.length = 0
    }
    if (this.tiles != null) {
      this.app.stage.removeChild(this.tiles)
      this.tiles.destroy()
      this.playerSprite = null
    }
    this.createTiles()
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

  private createTiles(): void {
    this.tiles = new Container()
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
            scoreSprite.alpha = 0.2
          }
          this.tiles.addChild(scoreSprite)
        }

        if (currentTile !== EMPTY_TILE) {
          const sprite = this.createSprite(currentTile!)
          sprite.x = x
          sprite.y = y
          if (playerOnCurrentTile) {
            sprite.alpha = 0.2
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
        return `${enemy.name}<br>${capitalize(enemy.type!.valueOf())} lv ${enemy.level} `
      case TileType.item:
        const itemName = (tile as ItemTile).item
        const playItem: PlayItem = this.game.playerTower!.playedItem(itemName)
        return this.toolTipTextItem(itemName, playItem)
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

  static readonly ATTRIBUTE_TO_TOOL_TIP_DESCRIPTION: Map<Attribute, string> = new Map([
    [Attribute.ATK, "ATK"],
    [Attribute.DEF, "DEF"],
    [Attribute.HP, "HP"],
  ])

  protected toolTipTextItem(itemName: ItemName, playItem: PlayItem): string {
    let result = itemName.valueOf()
    for (const entry of GameMap.ATTRIBUTE_TO_TOOL_TIP_DESCRIPTION) {
      const attributeName = entry[0]
      const attributeDescription = entry[1]
      const attributeValue = playItem[attributeName.valueOf()]
      if (attributeValue != 0) {
        result += `<br>${attributeValue} ${attributeDescription}`
      }
    }
    return result
  }

  private keyDown(e: KeyboardEvent): void {
    console.debug("Map", "keyDown", e)
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

  private getAttributeChangeInterval(playItem: PlayItem, attribute: Attribute): AttributeChangeInterval | undefined {
    const playerInfo = this.game.playerTower!.playerInfo
    const attributeString = attribute.valueOf()
    if (playItem[attributeString] === 0) {
      return undefined
    } else {
      return { from: playerInfo[attributeString] - playItem[attributeString], to: playerInfo[attributeString] }
    }
  }

  private triggerMoveAction(move: PlayerMove | PickItem | PickKey) {
    let totalPercentMove: number = 0
    const deltaColumn = move.target.column - move.player.column
    const deltaLine = move.target.line - move.player.line
    let targetSprite: null | Sprite = null
    let attributesChange: Record<Attribute, AttributeChangeInterval | undefined>

    if (move.getType() === ActionType.PICK_ITEM || move.getType() === ActionType.PICK_KEY) {
      targetSprite = this.sprites[move.target.line][move.target.column]
      if (move.getType() === ActionType.PICK_ITEM) {
        const playItem = (move as PickItem).playItem
        attributesChange = {
          [Attribute.HP]: this.getAttributeChangeInterval(playItem, Attribute.HP),
          [Attribute.ATK]: this.getAttributeChangeInterval(playItem, Attribute.ATK),
          [Attribute.DEF]: this.getAttributeChangeInterval(playItem, Attribute.DEF),
          [Attribute.EXP]: undefined,
        }
      }
    }
    return (ticker: Ticker): void => {
      const percentMove: number = ticker.deltaMS / GameMap.TILE_MOVE_TIME
      totalPercentMove += percentMove

      if (targetSprite !== null) {
        if (totalPercentMove >= GameMap.TILE_GRAB_HIDE_END_PERCENT) {
          this.tiles.removeChild(targetSprite)
          targetSprite = null
          for (const attribute of ATTRIBUTES) {
            const attributeChange = attributesChange[attribute]
            if (attributeChange !== undefined) {
              const value = Math.ceil(
                attributeChange.from + ((attributeChange.to - attributeChange.from) * totalPercentMove) / 100,
              )
              this.infoBar.setFieldValue(attribute, value)
            }
          }
        } else if (totalPercentMove > GameMap.TILE_GRAB_HIDE_BEGIN_PERCENT) {
          targetSprite!.alpha =
            1 -
            (totalPercentMove - GameMap.TILE_GRAB_HIDE_BEGIN_PERCENT) /
              (GameMap.TILE_GRAB_HIDE_END_PERCENT - GameMap.TILE_GRAB_HIDE_BEGIN_PERCENT)
        }
      }

      if (move.getType() === ActionType.PICK_ITEM) {
        if (totalPercentMove >= 1) {
          for (const attribute of ATTRIBUTES) {
            const attributeChange = attributesChange[attribute]
            if (attributeChange !== undefined) {
              this.infoBar.setFieldValue(attribute, attributeChange.to)
              this.infoBar.endChangeField(attribute)
            }
          }
        } else {
          for (const attribute of ATTRIBUTES) {
            const attributeChange = attributesChange[attribute]
            if (attributeChange !== undefined) {
              this.infoBar.startChangeField(attribute)
            }
          }
        }
      }

      if (deltaColumn !== 0) {
        if (totalPercentMove >= 1) {
          this.playerSprite!.x = (move.player.column + deltaColumn) * this.tileSize
          this.currentMoveEnded()
        } else {
          this.playerSprite!.x += percentMove * deltaColumn * this.tileSize
        }
      }
      if (deltaLine !== 0) {
        if (totalPercentMove >= 1) {
          this.playerSprite!.y = (move.player.line + deltaLine) * this.tileSize
          this.currentMoveEnded()
        } else {
          this.playerSprite!.y += percentMove * deltaLine * this.tileSize
        }
      }
    }
  }

  private triggerMoveAndBackAction(move: OpenDoor | KillEnemy) {
    let totalPercentMove: number = 0
    const deltaColumn = move.target.column - move.player.column
    const deltaLine = move.target.line - move.player.line
    const oldTargetSprite: Sprite = this.sprites[move.target.line][move.target.column]

    const hasNewTile = move.getType() == ActionType.KILL_ENEMY && (move as KillEnemy).dropTile != EMPTY_TILE
    let newTargetSprite: null | Sprite = null
    if (hasNewTile) {
      newTargetSprite = this.spriter.getSprite(SpritesToItem.spriteNameFromTile((move as KillEnemy).dropTile)!)
      newTargetSprite.alpha = 0
      newTargetSprite.x = oldTargetSprite.x
      newTargetSprite.y = oldTargetSprite.y
      this.sprites[move.target.line][move.target.column] = newTargetSprite
    }
    let switchDone = false
    return (ticker: Ticker): void => {
      const percentMove: number = ticker.deltaMS / GameMap.TILE_MOVE_TIME
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
    console.debug("Map", "tryAction", delta, action === null ? null : action.getType())
    if (action === null) {
      this.deltaBuffer.length = 0
      this.currentAction = null
      return
    }
    this.currentAction = action
    switch (action.getType()) {
      case ActionType.MOVE:
        this.tickerFunction = this.triggerMoveAction(action as PlayerMove)
        break
      case ActionType.PICK_ITEM:
        this.tickerFunction = this.triggerMoveAction(action as PickItem)
        break
      case ActionType.PICK_KEY:
        this.tickerFunction = this.triggerMoveAction(action as PickKey)
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
    console.debug("Map", "maybeStopAction")
    if (this.tickerFunction !== null) {
      this.app.ticker.remove(this.tickerFunction)
      this.tickerFunction = null
    }
    if (this.deltaBuffer.length == 0) {
      console.debug("Map", "maybeStopAction", "stop")
      this.currentAction = null
    } else {
      console.debug("Map", "maybeStopAction", "go on")
      this.tryAction()
    }
  }
}
