import { AlertVariant, showAlert } from "../../../common/front/alert"
import { html, render } from "uhtml"
import { Game } from "../../game"
import { GameScreen } from "../game-screen"
import { Map } from "./map"
import { TILES_IN_ROW } from "../../../common/data/constants"
import { TowerInfo } from "../../towers/tower-info"

export class ScreenTower {
  private static readonly INFO_BAR_MIN_WIDTH = 400
  private static readonly MAP_BORDER = 10
  private static readonly MAP_ID = "screenTowerMap"
  static readonly TOOL_TIP_ID = "screenTowerToolTip"
  static readonly TOOL_TIP_TIP_ID = "screenTowerToolTipTip"

  private readonly game: Game
  private readonly map: Map

  constructor(game: Game) {
    this.game = game
    this.map = new Map(game)
    game.eventManager.registerTowerSelection((selectedTower: TowerInfo) => {
      this.towerSelected(selectedTower)
    })
    window.addEventListener("resize", () => {
      if (game.displayedScreen === GameScreen.tower) {
        return this.render()
      }
    })
  }

  async init(): Promise<any> {
    return this.map.init()
  }

  private render(): void {
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
      html` <div id="${ScreenTower.TOOL_TIP_ID}">
          <sl-tooltip id="${ScreenTower.TOOL_TIP_TIP_ID}" trigger="manual" hoist content="">
            <div id="tabMapMapToolTipElement"></div>
          </sl-tooltip>
        </div>
        <div id="screenTowerMain" style="${style}">
          <div id="${ScreenTower.MAP_ID}"></div>
          <div id="screenTowerInfoBar"></div>
        </div>`,
    )
    this.map.postInit()
    this.map.resize(tileSize * TILES_IN_ROW).then(() => {
      this.map.repaint()
      document.getElementById(ScreenTower.MAP_ID).appendChild(this.map.app.canvas)
    })
  }

  private towerSelected(selectedTower: TowerInfo): void {
    console.debug("ScreenTower", "towerSelected", selectedTower.name)
    fetch(`towers/${selectedTower.file}`).then(async (response) => {
      if (!response.ok) {
        await showAlert(`Error getting the tower file ${response.status}`, AlertVariant.danger, "check2-circle")
      } else {
        this.game.displayedScreen = GameScreen.tower
        this.render()
      }
    })
  }
}
