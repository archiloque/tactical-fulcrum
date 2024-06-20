import { html, render } from "uhtml"
import { ColorCustomIconsName } from "../../../common/front/icons/color-custom-icons"
import { Game } from "../../game"
import { ScreenTower } from "./screen-tower"
import { MonochromeCustomIconsName } from "../../../common/front/icons/monochrome-custom-icons"

export class InfoBar {
  private static readonly HP_ID = "screenTowerInfoHp"
  private static readonly ATK_ID = "screenTowerInfoAtk"
  private static readonly DEF_ID = "screenTowerInfoDef"

  private readonly game: Game

  constructor(game: Game) {
    this.game = game
  }

  render(): void {
    render(
      document.getElementById(ScreenTower.INFO_BAR_ID),
      html` <div id="${InfoBar.HP_ID}">
        <sl-icon aria-description="Hit points" library="tf" name="${ColorCustomIconsName.HEART}"></sl-icon>${this.game.playerTower.playerInfo.hp}
      </div><div id="${InfoBar.ATK_ID}">
        <sl-icon aria-description="Attack" library="tf" name="${MonochromeCustomIconsName.SWORD}"></sl-icon>${this.game.playerTower.playerInfo.atk}
      </div><div id="${InfoBar.DEF_ID}">
        <sl-icon aria-description="Defense" library="tf" name="${MonochromeCustomIconsName.SHIELD}"></sl-icon>${this.game.playerTower.playerInfo.def}
      </div>`,
    )
    console.debug("InfoBar", "render")
  }
}
