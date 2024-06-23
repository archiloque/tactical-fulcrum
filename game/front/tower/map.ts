import { Container, FederatedPointerEvent, Sprite, Text, Ticker } from "pixi.js"
import { Delta } from "../../models/coordinates"
import { EnemyTile, STARTING_POSITION_TILE, TileType } from "../../../common/models/tile"
import { AbstractMap } from "../../../common/front/tower/abstract-map"
import { Game } from "../../game"
import { getTextColor } from "../../../common/front/color-scheme"
import { Keys } from "../../../common/front/keys"
import { ScreenTower } from "./screen-tower"
import SlTooltip from "@shoelace-style/shoelace/cdn/components/tooltip/tooltip.component"
import { SpritesToItem } from "../../../common/front/map/sprites-to-item"
import { TILES_IN_ROW } from "../../../common/data/constants"

const TILE_MOVE_TIME: number = 150

export class Map extends AbstractMap {
  private readonly game: Game
  private tiles: Container
  private playerSprite: null | Sprite
  private tickerFunction: null | ((ticker: Ticker) => void)
  private moveBuffer: Delta[] = []
  private isMoving: boolean = false

  constructor(game: Game) {
    super()
    this.game = game
    this.game.eventManager.registerSchemeChange(() => this.schemeChanged())
  }

  async init(): Promise<any> {
    console.debug("Map", "init")
    this.background.on("pointermove", (e: FederatedPointerEvent) => this.pointerMove(e))
    document.addEventListener("keydown", (e: KeyboardEvent) => this.keyDown(e))
    return super.init()
  }

  repaint(): void {
    if (this.isMoving) {
      this.isMoving = false
      if (this.tickerFunction !== null) {
        this.app.ticker.remove(this.tickerFunction)
        this.tickerFunction = null
      }
      this.moveBuffer.length = 0
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
        const currentScore = scores.find((s) => s.line === lineIndex && s.column === columnIndex)
        const currentTile = currentRoom[lineIndex][columnIndex]
        const spriteName = SpritesToItem.spriteNameFromTile(currentTile)
        const hasPlayer = lineIndex === playerPosition.line && columnIndex === playerPosition.column
        const x = this.tileSize * columnIndex
        const y = this.tileSize * lineIndex
        if (hasPlayer) {
          this.playerSprite = this.spriter.getSprite(SpritesToItem.spriteNameFromTile(STARTING_POSITION_TILE)!)
          this.playerSprite.x = x
          this.playerSprite.y = y
          this.tiles.addChild(this.playerSprite)
        }
        if (currentScore !== undefined) {
          const scoreSpriteName = SpritesToItem.spriteNameFromScore(currentScore.type)
          const scoreSprite = this.spriter.getSprite(scoreSpriteName)
          scoreSprite.x = x
          scoreSprite.y = y
          if (spriteName !== null || hasPlayer) {
            scoreSprite.alpha = 0.2
          }
          this.tiles.addChild(scoreSprite)
        }
        if (spriteName !== null) {
          const sprite = this.spriter.getSprite(spriteName)
          sprite.x = x
          sprite.y = y
          if (hasPlayer) {
            sprite.alpha = 0.2
          }
          this.tiles.addChild(sprite)
        }
        if (currentTile.getType() === TileType.enemy) {
          const enemyTile = currentTile as EnemyTile
          const text = new Text({
            text: enemyTile.enemy.level !== null ? enemyTile.enemy.level : "",
            style: {
              fontFamily: "JetBrains Mono",
              fontSize: this.tileSize / 2,
              fill: getTextColor(),
              align: "center",
            },
          })
          text.x = this.tileSize * (columnIndex + 0.5)
          text.y = this.tileSize * (lineIndex + 0.4)
          text.anchor.x = 0.5
          if (hasPlayer) {
            text.alpha = 0.2
          }
          this.tiles.addChild(text)
        }
      }
    }
  }

  postInit(): void {
    console.debug("Map", "postInit")
    this.toolTip = document.getElementById(ScreenTower.TOOL_TIP_ID)!
    this.tooltipTip = document.getElementById(ScreenTower.TOOL_TIP_TIP_ID) as SlTooltip
  }

  protected showToolTip(): void {
    if (this.toolTipTimeout != null) {
      clearTimeout(this.toolTipTimeout)
    }
  }

  private keyDown(e: KeyboardEvent): void {
    console.debug("Map", "keyDown", e)
    switch (e.key) {
      case Keys.ARROW_RIGHT: {
        this.bufferDirection(Delta.RIGHT)
        break
      }
      case Keys.ARROW_LEFT: {
        this.bufferDirection(Delta.LEFT)
        break
      }
      case Keys.ARROW_UP: {
        this.bufferDirection(Delta.UP)
        break
      }
      case Keys.ARROW_DOWN: {
        this.bufferDirection(Delta.DOWN)
        break
      }
    }
  }

  private bufferDirection(delta: Delta) {
    this.moveBuffer.push(delta)
    if (!this.isMoving) {
      this.tryMoving()
    }
  }

  private tryMoving(): void {
    const delta = this.moveBuffer.shift()!
    console.debug("Map", "tryMoving", delta)
    const playedTower = this.game.playerTower!
    const initialPlayerPosition = playedTower.playerPosition
    const newPlayerPosition = initialPlayerPosition.add(delta)
    if (playedTower.reachableTiles[newPlayerPosition.line][newPlayerPosition.column] == null) {
      console.debug("Map", "tryMoving", "nope")
      this.moveBuffer.length = 0
      this.isMoving = false
      return
    }
    this.isMoving = true
    playedTower.playerPosition = newPlayerPosition
    let totalPercentMove = 0
    this.tickerFunction = (ticker: Ticker): void => {
      const percentMove = ticker.deltaMS / TILE_MOVE_TIME
      totalPercentMove += percentMove
      if (delta.column !== 0) {
        if (totalPercentMove > 1) {
          this.playerSprite!.x = (initialPlayerPosition.column + delta.column) * this.tileSize
          this.maybeStopMoving()
        } else {
          this.playerSprite!.x += percentMove * delta.column * this.tileSize
        }
      }
      if (delta.line !== 0) {
        if (totalPercentMove > 1) {
          this.playerSprite!.y = (initialPlayerPosition.line + delta.line) * this.tileSize
          this.maybeStopMoving()
        } else {
          this.playerSprite!.y += percentMove * delta.line * this.tileSize
        }
      }
    }
    this.app.ticker.add(this.tickerFunction)
  }

  private maybeStopMoving(): void {
    console.debug("Map", "maybeStopMoving")
    this.app.ticker.remove(this.tickerFunction)
    this.tickerFunction = null
    if (this.moveBuffer.length == 0) {
      console.debug("Map", "maybeStopMoving", "stop")
      this.isMoving = false
    } else {
      console.debug("Map", "maybeStopMoving", "go on")
      this.tryMoving()
    }
  }
}
