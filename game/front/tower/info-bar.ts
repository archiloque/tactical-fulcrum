import { html, render } from "uhtml"
import { ColorCustomIconsName } from "../../../common/front/icons/color-custom-icons"
import { Game } from "../../game"
import { MonochromeCustomIconsName } from "../../../common/front/icons/monochrome-custom-icons"
import { ScreenTower } from "./screen-tower"

export class InfoBar {
  private static readonly HP_ID = "screenTowerInfoHp"
  private static readonly ATK_ID = "screenTowerInfoAtk"
  private static readonly DEF_ID = "screenTowerInfoDef"
  private static readonly EXP_ID = "screenTowerInfoExp"

  private readonly game: Game

  constructor(game: Game) {
    this.game = game
  }

  pad(value: number): string {
    const valueString = value.toString()
    if (valueString.length >= 7) {
      return valueString
    } else {
      return `${"\xa0".repeat(7 - valueString.length)}${valueString}`
    }
  }

  render(): void {
    render(
      document.getElementById(ScreenTower.INFO_BAR_ID),
      html` <div id="${InfoBar.HP_ID}">
          <div>
            <sl-icon aria-description="Hit points" library="tf" name="${ColorCustomIconsName.HEART}"></sl-icon
            >${this.pad(this.game.playerTower.playerInfo.hp)}
          </div>
        </div>
        <div id="${InfoBar.ATK_ID}">
          <div>
            <sl-icon aria-description="Attack" library="tf" name="${MonochromeCustomIconsName.SWORD}"></sl-icon
            >${this.pad(this.game.playerTower.playerInfo.atk)}
          </div>
        </div>
        <div id="${InfoBar.DEF_ID}">
          <div>
            <sl-icon aria-description="Defense" library="tf" name="${MonochromeCustomIconsName.SHIELD}"></sl-icon
            >${this.pad(this.game.playerTower.playerInfo.def)}
          </div>
        </div>
        <div id="${InfoBar.EXP_ID}">
          <div>
            <sl-icon aria-description="Experience" library="tf" name="${MonochromeCustomIconsName.EXPERIENCE}"></sl-icon
            >${this.pad(this.game.playerTower.playerInfo.exp)}
          </div>
        </div>`,
    )
    console.debug("InfoBar", "render")
  }
}
