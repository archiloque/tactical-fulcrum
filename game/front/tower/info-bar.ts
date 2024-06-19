import { html, render } from "uhtml"
import { ColorCustomIconsName } from "../../../common/front/icons/color-custom-icons"
import { Game } from "../../game"
import { ScreenTower } from "./screen-tower"

export class InfoBar {
  private static readonly HP_ID = "screenTowerHp"

  private readonly game: Game

  constructor(game: Game) {
    this.game = game
  }

  render(): void {
    render(
      document.getElementById(ScreenTower.INFO_BAR_ID),
      html` <div id="${InfoBar.HP_ID}">
        <sl-icon library="tf" name="${ColorCustomIconsName.HEART}"></sl-icon>${this.game.playerTower.playerInfo.hp}
      </div>`,
    )
    console.debug("InfoBar", "render")
  }
}
