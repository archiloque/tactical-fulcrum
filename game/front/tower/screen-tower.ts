import { html, render } from "uhtml"
import { Game } from "../../game"
import { GameMap } from "./game-map"
import { GameScreen } from "../game-screen"
import { InfoBar } from "./info-bar/info-bar"
import { TILES_IN_ROW } from "../../../common/data/constants"

export class ScreenTower {
  private static readonly INFO_BAR_MIN_WIDTH = 400
  private static readonly MAP_BORDER = 10
  private static readonly MAP_ID = "screenTowerMap"

  static readonly INFO_BAR_ID = "screenTowerInfoBar"

  private readonly game: Game
  private readonly map: GameMap
  private readonly infoBar: InfoBar

  constructor(game: Game) {
    this.game = game
    this.infoBar = new InfoBar(game)
    this.map = new GameMap(game, this.infoBar)
    this.infoBar.app = this.map.app
    this.game.eventManager.registerScreenChange(() => {
      if (game.displayedScreen === GameScreen.tower) {
        return this.render()
      }
    })
  }

  async init(): Promise<void> {
    return this.map.init()
  }

  render(): void {
    console.debug("ScreenTower", "render")
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const maxMapWidth = windowWidth - (ScreenTower.INFO_BAR_MIN_WIDTH + ScreenTower.MAP_BORDER)
    const maxMapHeight = windowHeight - ScreenTower.MAP_BORDER
    const maxMapDimension = Math.min(maxMapHeight, maxMapWidth)
    const tileSize = Math.floor(maxMapDimension / TILES_IN_ROW)
    const mapDimension = tileSize * TILES_IN_ROW + ScreenTower.MAP_BORDER
    const style = `grid-template-columns:${mapDimension}px ${windowWidth - mapDimension}px;height:100vh;`
    render(
      this.game.mainDiv,
      html`${this.map.toolTipHole()}
        <div id="screenTowerMain" style="${style}">
          <div id="${ScreenTower.MAP_ID}"></div>
          <div id="${ScreenTower.INFO_BAR_ID}"></div>
        </div>`,
    )
    this.infoBar.render()
    this.map.postInit()
    this.map.resize(tileSize * TILES_IN_ROW).then(() => {
      this.map.repaint()
      document.getElementById(ScreenTower.MAP_ID)!.appendChild(this.map.app.canvas)
    })
  }
}
