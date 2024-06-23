import { Container, FederatedPointerEvent, Sprite, Text, Ticker } from "pixi.js"
import { Coordinates, Delta } from "../../models/coordinates"
import { EnemyTile, STARTING_POSITION_TILE, TileType } from "../../../common/models/tile"
import { AbstractMap } from "../../../common/front/tower/abstract-map"
import { Game } from "../../game"
import { getTextColor } from "../../../common/front/color-scheme"
import { Keys } from "../../../common/front/keys"
import { ScreenTower } from "./screen-tower"
import SlTooltip from "@shoelace-style/shoelace/cdn/components/tooltip/tooltip.component"
import { SpritesToItem } from "../../../common/front/map/sprites-to-item"
import { TILES_IN_ROW } from "../../../common/data/constants"

const TILE_MOVE_TIME: number = 250

export class Map extends AbstractMap {
  private readonly game: Game
  private tiles: Container
  playerSprite: null | Sprite
  tickerFunction: (ticker: Ticker) => void | null

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
    if (e.key == Keys.ARROW_RIGHT) {
      return this.tryMoving(Delta.RIGHT)
    } else if (e.key == Keys.ARROW_LEFT) {
      return this.tryMoving(Delta.LEFT)
    }
  }

  private tryMoving(delta: Delta): void {
    console.debug("Map", "tryMoving", delta)
    const playedTower = this.game.playerTower!
    const newPlayerPosition = playedTower.playerPosition.add(delta)
    const characterMover = new CharacterMover(delta, playedTower.playerPosition, this)
    playedTower.playerPosition = newPlayerPosition
    this.tickerFunction = (ticker: Ticker): void => {
      characterMover.tick(ticker)
    }
    this.app.ticker.add(this.tickerFunction)
  }
}

class CharacterMover {
  readonly delta: Delta
  readonly initialCoordinates: Coordinates
  readonly map: Map
  private totalPercentMove: number

  constructor(delta: Delta, initialCoordinates: Coordinates, map: Map) {
    this.map = map
    this.delta = delta
    this.initialCoordinates = initialCoordinates
    this.totalPercentMove = 0
  }

  tick(ticker: Ticker): void {
    // console.debug("CharacterMover", "tick", ticker)
    if (this.delta.column !== 0) {
      const percentMove = ticker.deltaMS / TILE_MOVE_TIME
      this.totalPercentMove += percentMove
      if (this.totalPercentMove > 1) {
        console.debug("CharacterMover", "end", ticker)
        this.map.playerSprite!.x = (this.initialCoordinates.column + this.delta.column) * this.map.tileSize
        this.map.app.ticker.remove(this.map.tickerFunction)
      } else {
        this.map.playerSprite!.x += percentMove * this.delta.column * this.map.tileSize
      }
    }
  }
}
