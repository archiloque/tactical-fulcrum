import { Application, Graphics, Sprite } from "pixi.js"
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

  readonly app: Application
  protected readonly background: Sprite
  protected readonly cursor: Graphics
  protected tileSize: number = TILES_DEFAULT_SIZE
  protected colorScheme: ColorScheme = currentColorScheme()
  protected sprites: Spriter = new Spriter()
  protected toolTip: HTMLElement
  protected tooltipTip: SlTooltip

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
}
