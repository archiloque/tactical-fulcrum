import { Application, Container, FederatedPointerEvent, Graphics, Point, Sprite, Text } from "pixi.js"
import { ColorScheme, currentColorScheme } from "../../../common/front/color-scheme"
import { EnemyTile, ItemTile, Tile, TileType } from "../../../common/models/tile"
import { TILES_DEFAULT_SIZE, TILES_IN_ROW } from "../../../common/data/constants"
import { Editor } from "../../editor"
import { Room } from "../../../common/models/room"
import { RoomLayer } from "../room-layer"
import { Score } from "../../../common/models/score"
import { ScoreType } from "../../../common/data/score-type"
import { SelectedRoom } from "./selected-room"
import { SHIFT } from "../keys"
import SlTooltip from "@shoelace-style/shoelace/cdn/components/tooltip/tooltip.component"
import { Spriter } from "./spriter"
import { SpritesToItem } from "./sprites-to-item"
import { TabMaps } from "./tab-maps"

export class Map {
  private static readonly BACKGROUND_COLORS = {
    [ColorScheme.dark]: "#000000",
    [ColorScheme.light]: "#FFFFFF",
  }

  private static readonly FOREGROUND_COLORS = {
    [ColorScheme.dark]: "#cccccc",
    [ColorScheme.light]: "#000000",
  }

  readonly app: Application
  private readonly background: Sprite
  private readonly cursor: Graphics
  private readonly editor: Editor
  private colorScheme: ColorScheme = currentColorScheme()
  private lastMouseTile: Point = new Point(-1, -1)
  private toolTip: HTMLElement
  private tooltipTip: SlTooltip
  private readonly lastMousePosition: Point = new Point()
  private scoreTiles: Container
  private selectedLayer: RoomLayer = RoomLayer.standard
  private selectedRoom: SelectedRoom | null = null
  private selectedScore: ScoreType
  private selectedTile: Tile
  private sprites: Spriter = new Spriter()
  private standardTiles: Container
  private tileSize: number = TILES_DEFAULT_SIZE
  private toolTipTimeout: number = null

  constructor(editor: Editor) {
    this.app = new Application()
    this.background = new Sprite()
    this.background.eventMode = "dynamic"
    this.cursor = new Graphics().rect(0, 0, this.tileSize, this.tileSize).stroke({
      width: 1,
      color: 0xff0000,
      alignment: 1,
    })
    this.cursor.eventMode = "none"
    this.editor = editor
    this.editor.eventManager.registerRoomSelection((selectedRoom) => this.roomSelected(selectedRoom))
    this.editor.eventManager.registerTileSelection((selectedTile) => this.tileSelected(selectedTile))
    this.editor.eventManager.registerScoreSelection((scoreType) => this.scoreSelected(scoreType))
    this.editor.eventManager.registerSchemeChange((colorScheme) => this.schemeChanged(colorScheme))
    this.editor.eventManager.registerLayerSelection((layer) => this.layerSelected(layer))
  }

  async init(): Promise<any> {
    console.debug("Map", "init")
    this.background.on("pointerenter", () => this.pointerEnter())
    this.background.on("pointerleave", () => this.pointerLeave())
    this.background.on("pointermove", (e: FederatedPointerEvent) => this.pointerMove(e))
    this.background.on("pointertap", (e: FederatedPointerEvent) => this.pointerTap(e))
    document.addEventListener("keydown", (e: KeyboardEvent) => this.keyDown(e))
    document.addEventListener("keyup", (e: KeyboardEvent) => this.keyUp(e))

    return Promise.all([
      this.app.init({
        background: Map.BACKGROUND_COLORS[currentColorScheme()],
      }),
      this.sprites.reload(this.tileSize, currentColorScheme()),
    ]).then(() => {
      this.app.stage.addChild(this.background)
      this.app.stage.addChild(this.cursor)
    })
  }

  postInit(): void {
    console.debug("Map", "postInit")
    this.toolTip = document.getElementById(TabMaps.tooltipId)
    this.tooltipTip = document.getElementById(TabMaps.tooltipTipId) as SlTooltip
  }

  async resize(elementSize: number): Promise<any> {
    console.debug("Map", "resize")
    const newTileSize = Math.floor(elementSize / TILES_IN_ROW)
    if (newTileSize !== this.tileSize) {
      this.tileSize = newTileSize
      const appSize = this.tileSize * TILES_IN_ROW
      this.app.renderer.resize(appSize, appSize)
      this.background.width = appSize
      this.background.height = appSize
      this.cursor.scale = this.tileSize / TILES_DEFAULT_SIZE
      this.sprites = new Spriter()
      this.toolTip.style.width = `${newTileSize}px`
      return this.sprites.reload(this.tileSize, currentColorScheme()).then(() => this.repaint())
    }
  }

  private schemeChanged(colorScheme: ColorScheme): void {
    this.colorScheme = colorScheme
    // @ts-ignore
    this.app.setBackgroundColor(Map.BACKGROUND_COLORS[colorScheme])
    this.sprites.reload(this.tileSize, colorScheme).then(() => {
      this.repaint()
    })
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

  private pointerMove(e: FederatedPointerEvent): void {
    const tilePosition: Point = this.tileFromEvent(e)
    if (!this.lastMouseTile.equals(tilePosition)) {
      console.debug("Map", "pointerMove", tilePosition)
      this.lastMouseTile = tilePosition
      if (this.tooltipTip.open) {
        this.tooltipTip.open = false
      }
      this.repositionCursor()
      if (this.toolTipTimeout != null) {
        clearTimeout(this.toolTipTimeout)
      }
      // @ts-ignore
      this.toolTipTimeout = setTimeout(() => {
        this.showToolTip()
      }, 200)
    }
  }

  private tileFromEvent(e: FederatedPointerEvent): Point {
    e.getLocalPosition(this.app.stage, this.lastMousePosition)
    const x: number = this.lastMousePosition.x
    const y: number = this.lastMousePosition.y
    const tileX: number = Math.floor(x / this.tileSize)
    const tileY: number = Math.floor(y / this.tileSize)
    return new Point(tileX, tileY)
  }

  private showToolTip(): void {
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

  private pointerEnter(): void {
    this.cursor.visible = true
  }

  private pointerLeave(): void {
    this.cursor.visible = false
  }

  private repositionCursor(): void {
    this.cursor.x = this.lastMouseTile.x * this.tileSize
    this.cursor.y = this.lastMouseTile.y * this.tileSize
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
            const sprite = this.sprites.getSprite(spriteName)
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
                fill: Map.FOREGROUND_COLORS[this.colorScheme],
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
        const sprite = this.sprites.getSprite(spriteName)
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
