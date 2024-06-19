import { Container, FederatedPointerEvent, Text } from "pixi.js"
import { EnemyTile, STARTING_POSITION_TILE, TileType } from "../../../common/models/tile"
import { AbstractMap } from "../../../common/front/tower/abstract-map"
import { Game } from "../../game"
import { getTextColor } from "../../../common/front/color-scheme"
import { ScreenTower } from "./screen-tower"
import SlTooltip from "@shoelace-style/shoelace/cdn/components/tooltip/tooltip.component"
import { SpritesToItem } from "../../../common/front/map/sprites-to-item"
import { TILES_IN_ROW } from "../../../common/data/constants"

export class Map extends AbstractMap {
  private readonly game: Game
  private tiles: Container

  constructor(game: Game) {
    super()
    this.game = game
    this.game.eventManager.registerSchemeChange(() => this.schemeChanged())
  }

  async init(): Promise<any> {
    console.debug("Map", "init")
    this.background.on("pointermove", (e: FederatedPointerEvent) => this.pointerMove(e))
    return super.init()
  }

  repaint(): void {
    if (this.tiles != null) {
      this.app.stage.removeChild(this.tiles)
      this.tiles.destroy()
    }
    this.createTiles()
    this.app.stage.addChild(this.tiles)
  }

  private createTiles(): void {
    this.tiles = new Container()
    const playerPosition = this.game.playerTower.playerPosition
    const currentRoomIndex = playerPosition.room
    const currentRoom = this.game.playerTower.standardRooms[currentRoomIndex]
    const scores = this.game.playerTower.tower.standardRooms[currentRoomIndex].scores
    for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
      for (let columnIndex = 0; columnIndex < TILES_IN_ROW; columnIndex++) {
        const currentScore = scores.find((s) => s.line === lineIndex && s.column === columnIndex)
        const currentTile = currentRoom[lineIndex][columnIndex]
        const spriteName = SpritesToItem.spriteNameFromTile(currentTile)
        const hasPlayer = lineIndex === playerPosition.line && columnIndex === playerPosition.column
        const x = this.tileSize * columnIndex
        const y = this.tileSize * lineIndex
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
        if (hasPlayer) {
          const playerSprite = this.spriter.getSprite(SpritesToItem.spriteNameFromTile(STARTING_POSITION_TILE))
          playerSprite.x = x
          playerSprite.y = y
          this.tiles.addChild(playerSprite)
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
            text: enemyTile.enemy.level,
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
    this.toolTip = document.getElementById(ScreenTower.TOOL_TIP_ID)
    this.tooltipTip = document.getElementById(ScreenTower.TOOL_TIP_TIP_ID) as SlTooltip
  }

  protected showToolTip(): void {
    if (this.toolTipTimeout != null) {
      clearTimeout(this.toolTipTimeout)
    }
  }
}
