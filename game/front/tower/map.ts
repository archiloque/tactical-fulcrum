import { Game } from "../../game"
import { AbstractMap } from "../../../common/front/tower/abstract-map"
import SlTooltip from "@shoelace-style/shoelace/cdn/components/tooltip/tooltip.component"
import { ScreenTower } from "./screen-tower"

export class Map extends AbstractMap {
  private readonly game: Game

  constructor(game: Game) {
    super()
    this.game = game
    this.game.eventManager.registerSchemeChange((colorScheme) => this.schemeChanged(colorScheme))
  }

  async init(): Promise<any> {
    console.debug("Map", "init")
    return super.init()
  }

  repaint(): void {}

  postInit(): void {
    console.debug("Map", "postInit")
    this.toolTip = document.getElementById(ScreenTower.TOOL_TIP_ID)
    this.tooltipTip = document.getElementById(ScreenTower.TOOL_TIP_TIP_ID) as SlTooltip
  }
}
