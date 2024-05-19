import { Application, Container, FederatedPointerEvent, Graphics, Point, Sprite } from "pixi.js"
import { ColorScheme, currentColorScheme } from "../colorScheme"
import { DoorTile, EnemyTile, ItemTile, KeyTile, StaircaseTile, Tile, TileType } from "../../behavior/tile"
import { TILES_DEFAULT_SIZE, TILES_IN_ROW } from "../../data/constants"
import { Color } from "../../data/color"
import { Editor } from "../../../editor"
import { Item } from "../../data/item"
import { Room } from "../../behavior/room"
import { RoomLayer } from "../roomLayer"
import { SHIFT } from "../keys"
import { Score } from "../../behavior/score"
import { ScoreType } from "../../data/scoreType"
import { SelectedRoom } from "./selectedRoom"
import SlTooltip from "@shoelace-style/shoelace/cdn/components/tooltip/tooltip.component"
import { Spriter } from "./spriter"
import { Sprites } from "./sprites"
import { StaircaseDirection } from "../../data/staircaseDirection"

export class TabMapMap {
  private static readonly BACKGROUND_COLORS = {
    [ColorScheme.dark]: "#000000",
    [ColorScheme.light]: "#FFFFFF",
  }

  readonly app: Application
  private readonly background: Sprite
  private readonly cursor: Graphics
  private tileSize: number = TILES_DEFAULT_SIZE
  private readonly lastMousePosition: Point = new Point()
  private lastMouseTile: Point = new Point(-1, -1)
  private sprites: Spriter = new Spriter()
  private readonly editor: Editor
  private selectedRoom: SelectedRoom | null = null
  private standardTiles: Container
  private scoreTiles: Container
  private mapToolTip: HTMLElement
  private toolTipTimeout: number = null
  private mapToolTipTip: SlTooltip
  private selectedTile: Tile
  private selectedLayer: RoomLayer = RoomLayer.standard
  private selectedScore: ScoreType

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
    console.debug("TabMapMap", "init")
    this.background.on("pointerenter", () => this.pointerEnter())
    this.background.on("pointerleave", () => this.pointerLeave())
    this.background.on("pointermove", (e: FederatedPointerEvent) => this.pointerMove(e))
    this.background.on("pointertap", (e: FederatedPointerEvent) => this.pointerTap(e))
    document.addEventListener("keydown", (e: KeyboardEvent) => this.keyDown(e))
    document.addEventListener("keyup", (e: KeyboardEvent) => this.keyUp(e))

    return Promise.all([
      this.app.init({
        background: TabMapMap.BACKGROUND_COLORS[currentColorScheme()],
      }),
      this.sprites.reload(this.tileSize, currentColorScheme()),
    ]).then(() => {
      this.app.stage.addChild(this.background)
      this.app.stage.addChild(this.cursor)
      this.repaint()
    })
  }

  postInit(): void {
    console.debug("TabMapMap", "postInit")
    this.mapToolTip = document.getElementById("tabMapMapToolTip")
    this.mapToolTipTip = document.getElementById("tabMapMapToolTipTip") as SlTooltip
  }

  resize(elementSize: number): void {
    console.debug("TabMapMap", "resize")
    const newTileSize = Math.floor(elementSize / TILES_IN_ROW)
    if (newTileSize !== this.tileSize) {
      this.tileSize = newTileSize
      const appSize = this.tileSize * TILES_IN_ROW
      this.app.renderer.resize(appSize, appSize)
      this.background.width = appSize
      this.background.height = appSize
      this.cursor.scale = this.tileSize / TILES_DEFAULT_SIZE
      this.sprites = new Spriter()
      this.sprites.reload(this.tileSize, currentColorScheme()).then(() => {
        this.repaint()
      })
      this.mapToolTip.style.width = `${newTileSize}px`
    }
  }

  private schemeChanged(colorScheme: ColorScheme): void {
    // @ts-ignore
    this.app.setBackgroundColor(TabMapMap.BACKGROUND_COLORS[colorScheme])
    this.sprites.reload(this.tileSize, colorScheme).then(() => {
      this.repaint()
    })
  }

  private layerSelected(layer: RoomLayer): void {
    this.selectedLayer = layer
    this.repaint()
  }

  private keyDown(e: KeyboardEvent): void {
    console.debug("TabMapMap", "keyDown", e)
    if (e.key == SHIFT) {
      this.app.canvas.style.cursor = "copy"
    }
  }

  private keyUp(e: KeyboardEvent): void {
    console.debug("TabMapMap", "keyUp", e)
    if (e.key == SHIFT) {
      this.app.canvas.style.cursor = "auto"
    }
  }

  private pointerTap(e: FederatedPointerEvent): void {
    const tilePosition: Point = this.tileFromEvent(e)
    console.debug("TabMapMap", "pointerTap", "position", tilePosition, "shift", e.shiftKey)
    if (this.selectedRoom != null) {
      const currentRoom: Room = this.editor.tower.getRooms(this.selectedRoom.type)[this.selectedRoom.index]
      switch (this.selectedLayer) {
        case RoomLayer.standard: {
          if (e.shiftKey) {
            const selectedTile: Tile = currentRoom.tiles[tilePosition.y][tilePosition.x]
            this.editor.eventManager.notifyTileSelection(selectedTile, true)
          } else {
            currentRoom.tiles[tilePosition.y][tilePosition.x] = this.selectedTile
            this.editor.tower.saveRooms()
            this.repaint()
          }
          break
        }
        // TODO
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
      console.debug("TabMapMap", "pointerMove", tilePosition)
      this.lastMouseTile = tilePosition
      if (this.mapToolTipTip.open) {
        this.mapToolTipTip.open = false
      }
      this.repositionCursor()
      if (this.toolTipTimeout != null) {
        clearTimeout(this.toolTipTimeout)
      }
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
        this.mapToolTipTip.content = toolTipText
        const cursorPosition = this.cursor.getGlobalPosition()
        const top = this.app.canvas.offsetTop + cursorPosition.y
        const left = this.app.canvas.offsetLeft + cursorPosition.x
        this.mapToolTip.style.top = `${top}px`
        this.mapToolTip.style.left = `${left}px`
        this.mapToolTipTip.open = true
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
    console.debug("TabMapMap", "roomSelected", selectedRoom)
    this.selectedRoom = selectedRoom
    this.repaint()
  }

  private tileSelected(tileSelected: Tile): void {
    this.selectedTile = tileSelected
  }

  private scoreSelected(scoreType: ScoreType): void {
    this.selectedScore = scoreType
  }

  private repaint(): void {
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
          const spriteName = this.spriteNameFromTile(currentTile)
          if (spriteName != null) {
            const sprite = this.sprites.getSprite(spriteName)
            sprite.x = this.tileSize * columnIndex
            sprite.y = this.tileSize * lineIndex
            this.standardTiles.addChild(sprite)
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
        const spriteName = this.spriteNameFromScore(score.type)
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

  private spriteNameFromScore(score: ScoreType): Sprites {
    switch (score) {
      case ScoreType.check:
        return Sprites.scoreCheck
      case ScoreType.crown:
        return Sprites.scoreCrown
      case ScoreType.star:
        return Sprites.scoreStar
    }
  }

  private spriteNameFromTile(tile: Tile): Sprites | null {
    switch (tile.getType()) {
      case TileType.empty:
        return null
      case TileType.door:
        switch ((tile as DoorTile).color) {
          case Color.blue:
            return Sprites.doorBlue
          case Color.crimson:
            return Sprites.doorCrimson
          case Color.greenBlue:
            return Sprites.doorGreenBlue
          case Color.platinum:
            return Sprites.doorPlatinum
          case Color.violet:
            return Sprites.doorViolet
          case Color.yellow:
            return Sprites.doorYellow
        }
        break
      case TileType.enemy:
        return Sprites.enemy
      case TileType.key:
        switch ((tile as KeyTile).color) {
          case Color.blue:
            return Sprites.keyBlue
          case Color.crimson:
            return Sprites.keyCrimson
          case Color.greenBlue:
            return Sprites.keyGreenBlue
          case Color.platinum:
            return Sprites.keyPlatinum
          case Color.violet:
            return Sprites.keyViolet
          case Color.yellow:
            return Sprites.keyYellow
        }
        break
      case TileType.item:
        switch ((tile as ItemTile).item) {
          case Item.blue_potion:
            return Sprites.itemBluePotion
          case Item.golden_feather:
            return Sprites.goldenFeather
          case Item.guard_card:
            return Sprites.itemGuardCard
          case Item.guard_deck:
            return Sprites.itemGuardDeck
          case Item.life_potion:
            return Sprites.itemLifePotion
          case Item.power_card:
            return Sprites.itemPowerCard
          case Item.power_deck:
            return Sprites.itemPowerDeck
          case Item.red_potion:
            return Sprites.itemRedPotion
          default:
            return Sprites.item
        }
      case TileType.staircase:
        switch ((tile as StaircaseTile).direction) {
          case StaircaseDirection.down:
            return Sprites.staircaseUp
          case StaircaseDirection.up:
            return Sprites.staircaseDown
        }
        break
      case TileType.startingPosition:
        return Sprites.startingPosition
      case TileType.wall:
        return Sprites.wall
    }
    console.error("TabMapMap", "spriteNameFromTile", "Unknown tile", tile.getType())
    return null
  }
}
