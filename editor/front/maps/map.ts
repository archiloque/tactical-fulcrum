import { Container, FederatedPointerEvent, Point, Text } from "pixi.js"
import { EnemyTile, ItemTile, Tile, TileType } from "../../../common/models/tile"
import { AbstractMap } from "../../../common/front/tower/abstract-map"
import { Editor } from "../../editor"
import { getTextColor } from "../../../common/front/color-scheme"
import { Room } from "../../../common/models/room"
import { RoomLayer } from "../room-layer"
import { Score } from "../../../common/models/score"
import { ScoreType } from "../../../common/data/score-type"
import { SelectedRoom } from "./selected-room"
import { SHIFT } from "../keys"
import SlTooltip from "@shoelace-style/shoelace/cdn/components/tooltip/tooltip.component"
import { SpritesToItem } from "../../../common/front/map/sprites-to-item"
import { TabMaps } from "./tab-maps"
import { TILES_IN_ROW } from "../../../common/data/constants"

export class Map extends AbstractMap {
  private readonly editor: Editor
  private scoreTiles: Container
  private selectedLayer: RoomLayer = RoomLayer.standard
  private selectedRoom: SelectedRoom | null = null
  private selectedScore: ScoreType
  private selectedTile: Tile
  private standardTiles: Container

  constructor(editor: Editor) {
    super()
    this.editor = editor
    this.editor.eventManager.registerRoomSelection((selectedRoom) => this.roomSelected(selectedRoom))
    this.editor.eventManager.registerTileSelection((selectedTile) => this.tileSelected(selectedTile))
    this.editor.eventManager.registerScoreSelection((scoreType) => this.scoreSelected(scoreType))
    this.editor.eventManager.registerSchemeChange(() => this.schemeChanged())
    this.editor.eventManager.registerLayerSelection((layer) => this.layerSelected(layer))
  }

  async init(): Promise<any> {
    console.debug("Map", "init")
    this.background.on("pointermove", (e: FederatedPointerEvent) => this.pointerMove(e))
    this.background.on("pointertap", (e: FederatedPointerEvent) => this.pointerTap(e))
    document.addEventListener("keydown", (e: KeyboardEvent) => this.keyDown(e))
    document.addEventListener("keyup", (e: KeyboardEvent) => this.keyUp(e))
    return super.init()
  }

  postInit(): void {
    console.debug("Map", "postInit")
    this.toolTip = document.getElementById(TabMaps.TOOL_TIP_ID)
    this.tooltipTip = document.getElementById(TabMaps.TOOL_TIP_TIP_ID) as SlTooltip
  }

  private layerSelected(layer: RoomLayer): void {
    this.selectedLayer = layer
    this.repaint()
  }

  private keyDown(e: KeyboardEvent): void {
    console.debug("Map", "keyDown", e)
    if (e.key == SHIFT) {
      this.app.canvas.style.cursor = "copy"
    }
  }

  private keyUp(e: KeyboardEvent): void {
    console.debug("Map", "keyUp", e)
    if (e.key == SHIFT) {
      this.app.canvas.style.cursor = "auto"
    }
  }

  private pointerTap(e: FederatedPointerEvent): void {
    const tilePosition: Point = this.tileFromEvent(e)
    console.debug("Map", "pointerTap", "position", tilePosition, "shift", e.shiftKey)
    if (this.selectedRoom != null) {
      const currentRoom: Room = this.editor.tower.getRooms(this.selectedRoom.type)[this.selectedRoom.index]
      switch (this.selectedLayer) {
        case RoomLayer.standard: {
          if (e.shiftKey) {
            const selectedTile: Tile = currentRoom.tiles[tilePosition.y][tilePosition.x]
            this.editor.eventManager.notifyTileSelection(selectedTile, true)
          } else {
            console.debug("Map", "set tile", this.selectedTile)
            currentRoom.tiles[tilePosition.y][tilePosition.x] = this.selectedTile
            this.editor.tower.saveRooms()
            this.repaint()
          }
          break
        }
        case RoomLayer.score:
          if (e.shiftKey) {
            const selectedScore = currentRoom.scores.find((score) => {
              return score.line == tilePosition.y && score.column === tilePosition.x
            })
            this.editor.eventManager.notifyScoreSelection(selectedScore == null ? null : selectedScore.type, true)
          } else {
            if (this.selectedScore == null) {
              const selectedScoreIndex = currentRoom.scores.findIndex((score) => {
                return score.line == tilePosition.y && score.column === tilePosition.x
              })
              if (selectedScoreIndex !== -1) {
                currentRoom.scores.splice(selectedScoreIndex, 1)
              }
            } else {
              this.editor.tower.removeScore(this.selectedRoom.type, this.selectedScore)
              currentRoom.scores.push(new Score(tilePosition.y, tilePosition.x, this.selectedScore))
            }
            this.editor.tower.saveRooms()
            this.repaint()
          }
          break
      }
    }
  }

  protected showToolTip(): void {
    if (this.toolTipTimeout != null) {
      clearTimeout(this.toolTipTimeout)
    }
    if (this.selectedRoom != null) {
      const currentRoom = this.editor.tower.getRooms(this.selectedRoom.type)[this.selectedRoom.index]
      const currentTile: Tile = currentRoom.tiles[this.lastMouseTile.y][this.lastMouseTile.x]
      const toolTipText = this.getToolTipText(currentTile)
      if (toolTipText != null) {
        this.tooltipTip.content = toolTipText
        const cursorPosition = this.cursor.getGlobalPosition()
        const top = this.app.canvas.offsetTop + cursorPosition.y
        const left = this.app.canvas.offsetLeft + cursorPosition.x
        this.toolTip.style.top = `${top}px`
        this.toolTip.style.left = `${left}px`
        this.tooltipTip.open = true
      }
    }
  }

  private roomSelected(selectedRoom: SelectedRoom | null): void {
    console.debug("Map", "roomSelected", selectedRoom)
    this.selectedRoom = selectedRoom
    this.repaint()
  }

  private tileSelected(tileSelected: Tile): void {
    this.selectedTile = tileSelected
  }

  private scoreSelected(scoreType: ScoreType): void {
    this.selectedScore = scoreType
  }

  repaint(): void {
    if (this.standardTiles != null) {
      this.app.stage.removeChild(this.standardTiles)
      this.standardTiles.destroy()
    }
    if (this.scoreTiles != null) {
      this.app.stage.removeChild(this.scoreTiles)
      this.scoreTiles.destroy()
    }
    this.createScoreTiles()
    this.createStandardTiles()
    switch (this.selectedLayer) {
      case RoomLayer.standard: {
        this.scoreTiles.alpha = 0.2
        this.app.stage.addChild(this.standardTiles)
        this.app.stage.addChild(this.scoreTiles)
        break
      }
      case RoomLayer.score: {
        this.standardTiles.alpha = 0.2
        this.app.stage.addChild(this.scoreTiles)
        this.app.stage.addChild(this.standardTiles)
        break
      }
    }
  }

  private createStandardTiles(): void {
    this.standardTiles = new Container()
    if (this.selectedRoom != null) {
      const currentRoom = this.editor.tower.getRooms(this.selectedRoom.type)[this.selectedRoom.index]
      for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
        for (let columnIndex = 0; columnIndex < TILES_IN_ROW; columnIndex++) {
          const currentTile = currentRoom.tiles[lineIndex][columnIndex]
          const spriteName = SpritesToItem.spriteNameFromTile(currentTile)
          if (spriteName != null) {
            const sprite = this.spriter.getSprite(spriteName)
            sprite.x = this.tileSize * columnIndex
            sprite.y = this.tileSize * lineIndex
            this.standardTiles.addChild(sprite)
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
            this.standardTiles.addChild(text)
          }
        }
      }
    }
  }

  private createScoreTiles(): void {
    this.scoreTiles = new Container()
    if (this.selectedRoom != null) {
      const currentRoom = this.editor.tower.getRooms(this.selectedRoom.type)[this.selectedRoom.index]
      for (const score of currentRoom.scores) {
        const spriteName = SpritesToItem.spriteNameFromScore(score.type)
        const sprite = this.spriter.getSprite(spriteName)
        sprite.x = this.tileSize * score.column
        sprite.y = this.tileSize * score.line
        this.scoreTiles.addChild(sprite)
      }
    }
  }

  private getToolTipText(tile: Tile): string | null {
    switch (tile.getType()) {
      case TileType.enemy:
        const enemy = (tile as EnemyTile).enemy
        return `${enemy.type == null || enemy.type.length === 0 ? "??" : enemy.type} ${enemy.level == null ? "??" : enemy.level} (${enemy.name})`
      case TileType.item:
        return (tile as ItemTile).item.valueOf()
    }
    return null
  }
}
