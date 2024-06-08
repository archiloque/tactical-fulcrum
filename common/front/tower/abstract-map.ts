import { Application, FederatedPointerEvent, Graphics, Point, Sprite } from "pixi.js"
import { TILES_DEFAULT_SIZE, TILES_IN_ROW } from "../../data/constants"
import { ColorScheme, currentColorScheme } from "../color-scheme"
import { Spriter } from "../../../editor/front/maps/spriter"
import SlTooltip from "@shoelace-style/shoelace/cdn/components/tooltip/tooltip.component"
import { TabMaps } from "../../../editor/front/maps/tab-maps"

export abstract class AbstractMap {
  protected static readonly BACKGROUND_COLORS = {
    [ColorScheme.dark]: "#000000",
    [ColorScheme.light]: "#FFFFFF",
  }

  protected static readonly FOREGROUND_COLORS = {
    [ColorScheme.dark]: "#cccccc",
    [ColorScheme.light]: "#000000",
  }

  private readonly lastMousePosition: Point = new Point()
  protected colorScheme: ColorScheme = currentColorScheme()
  protected lastMouseTile: Point = new Point(-1, -1)
  protected readonly background: Sprite
  protected readonly cursor: Graphics
  protected sprites: Spriter = new Spriter()
  protected tileSize: number = TILES_DEFAULT_SIZE
  protected toolTip: HTMLElement
  protected toolTipTimeout: number = null
  protected tooltipTip: SlTooltip
  readonly app: Application

  protected constructor() {
    this.app = new Application()
    this.background = new Sprite()
    this.background.eventMode = "dynamic"
    this.cursor = new Graphics().rect(0, 0, this.tileSize, this.tileSize).stroke({
      width: 1,
      color: 0xff0000,
      alignment: 1,
    })
    this.cursor.eventMode = "none"
  }

  private pointerEnter(): void {
    this.cursor.visible = true
  }

  private pointerLeave(): void {
    this.cursor.visible = false
  }

  abstract repaint(): void

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

  protected async init(): Promise<any> {
    console.debug("AbstractMap", "init")
    this.background.on("pointerenter", () => this.pointerEnter())
    this.background.on("pointerleave", () => this.pointerLeave())
    return Promise.all([
      this.app.init({
        background: AbstractMap.BACKGROUND_COLORS[currentColorScheme()],
      }),
      this.sprites.reload(this.tileSize, currentColorScheme()),
    ]).then(() => {
      this.app.stage.addChild(this.background)
      this.app.stage.addChild(this.cursor)
    })
  }

  protected schemeChanged(colorScheme: ColorScheme): void {
    this.colorScheme = colorScheme
    // @ts-ignore
    this.app.setBackgroundColor(Map.BACKGROUND_COLORS[colorScheme])
    this.sprites.reload(this.tileSize, colorScheme).then(() => {
      this.repaint()
    })
  }

  protected repositionCursor(): void {
    this.cursor.x = this.lastMouseTile.x * this.tileSize
    this.cursor.y = this.lastMouseTile.y * this.tileSize
  }

  protected tileFromEvent(e: FederatedPointerEvent): Point {
    e.getLocalPosition(this.app.stage, this.lastMousePosition)
    const x: number = this.lastMousePosition.x
    const y: number = this.lastMousePosition.y
    const tileX: number = Math.floor(x / this.tileSize)
    const tileY: number = Math.floor(y / this.tileSize)
    return new Point(tileX, tileY)
  }

  protected pointerMove(e: FederatedPointerEvent): void {
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

  protected abstract showToolTip(): void
}