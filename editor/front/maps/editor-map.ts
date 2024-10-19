import { Container, FederatedPointerEvent, Point, Text } from "pixi.js"
import { Enemy, findEnemy } from "../../../common/models/enemy"
import { EnemyTile, ItemTile, Tile, TileType } from "../../../common/models/tile"
import { AbstractMap } from "../../../common/front/tower/abstract-map"
import { Editor } from "../../editor"
import { getTextColor } from "../../../common/front/color-scheme"
import { Keys } from "../../../common/front/keys"
import { Room } from "../../../common/models/room"
import { RoomLayer } from "../room-layer"
import { Score } from "../../../common/models/score"
import { ScoreType } from "../../../common/data/score-type"
import { SelectedRoom } from "./selected-room"
import { SpritesToItem } from "../../../common/front/map/sprites-to-item"
import { TILES_IN_ROW } from "../../../common/data/constants"

export class EditorMap extends AbstractMap {
  private readonly editor: Editor
  // @ts-ignore
  private scoreTiles: Container
  private selectedLayer: RoomLayer = RoomLayer.standard
  private selectedRoom: SelectedRoom | null = null
  // @ts-ignore
  private selectedScore: ScoreType | null
  // @ts-ignore
  private selectedTile: Tile
  // @ts-ignore
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

  async init(): Promise<void> {
    console.debug("Map", "init")
    this.background.on("pointertap", (e: FederatedPointerEvent) => this.pointerTap(e))
    document.addEventListener("keydown", (e: KeyboardEvent) => this.keyDown(e))
    document.addEventListener("keyup", (e: KeyboardEvent) => this.keyUp(e))
    return super.init()
  }

  private layerSelected(layer: RoomLayer): void {
    this.selectedLayer = layer
    this.repaint()
  }

  private keyDown(e: KeyboardEvent): void {
    console.debug("Map", "keyDown", e)
    if (e.key == Keys.SHIFT) {
      this.app.canvas.style.cursor = "copy"
    }
  }

  private keyUp(e: KeyboardEvent): void {
    console.debug("Map", "keyUp", e)
    if (e.key == Keys.SHIFT) {
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

  protected toolTipText(): string | null {
    if (this.selectedRoom === null) {
      return null
    } else {
      const currentRoom = this.editor.tower.getRooms(this.selectedRoom.type)[this.selectedRoom.index]
      const currentTile: Tile = currentRoom.tiles[this.lastMouseTile.y][this.lastMouseTile.x]
      switch (currentTile.type) {
        case TileType.enemy:
          const enemyTile = currentTile as EnemyTile
          const enemy: Enemy = findEnemy(enemyTile.enemyType, enemyTile.level, this.editor.tower.enemies)!
          return `${enemy.type == null || enemy.type.length === 0 ? "??" : enemy.type} ${enemy.level == null ? "??" : enemy.level} (${enemy.name})`
        case TileType.item:
          return (currentTile as ItemTile).item.valueOf()
      }
      return null
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

  private scoreSelected(scoreType: ScoreType | null): void {
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
          if (currentTile.type === TileType.enemy) {
            const enemyTile = currentTile as EnemyTile
            const text = new Text({
              text: enemyTile.level != null ? enemyTile.level : "",
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
}
