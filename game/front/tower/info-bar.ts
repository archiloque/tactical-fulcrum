import { Hole, html, render } from "uhtml"
import { Attribute } from "../../models/attribute"
import { Game } from "../../game"
import { ScreenTower } from "./screen-tower"

export class InfoBar {
  private static readonly HP_ID = "screenTowerInfoHp"
  private static readonly ATK_ID = "screenTowerInfoAtk"
  private static readonly DEF_ID = "screenTowerInfoDef"
  private static readonly EXP_ID = "screenTowerInfoExp"
  private static readonly CHANGE_CLASS = "change"

  private readonly game: Game
  private infoHp: HTMLElement
  private infoAtk: HTMLElement
  private infoDef: HTMLElement
  private infoExp: HTMLElement
  private fieldsById: Record<Attribute, HTMLElement>

  constructor(game: Game) {
    this.game = game
    this.game.eventManager.registerSchemeChange(() => this.schemeChanged())
  }

  pad(value: number): string {
    return value.toString().padStart(7, "\xa0")
  }

  renderField(id: string, description: string, value: number | string): Hole {
    return html` <div class="screenTowerInfoBlock">
      <div><span id="${id}">${value}</span> ${description}</div>
    </div>`
  }

  render(): void {
    console.debug("InfoBar", "render")
    const playerInfo = this.game.playerTower!.playerInfo
    render(
      document.getElementById(ScreenTower.INFO_BAR_ID),
      html` ${this.renderField(InfoBar.HP_ID, "HP", this.pad(playerInfo.hp))}
      ${this.renderField(InfoBar.ATK_ID, "ATK", this.pad(playerInfo.atk))}
      ${this.renderField(InfoBar.DEF_ID, "DEF", this.pad(playerInfo.def))}
      ${this.renderField(InfoBar.EXP_ID, "XP", this.pad(playerInfo.exp))}`,
    )
    this.infoHp = document.getElementById(InfoBar.HP_ID)!
    this.infoAtk = document.getElementById(InfoBar.ATK_ID)!
    this.infoDef = document.getElementById(InfoBar.DEF_ID)!
    this.infoExp = document.getElementById(InfoBar.EXP_ID)!
    this.fieldsById = {
      [Attribute.HP]: this.infoHp,
      [Attribute.ATK]: this.infoAtk,
      [Attribute.DEF]: this.infoDef,
      [Attribute.EXP]: this.infoExp,
    }
  }

  public startChangeField(attribute: Attribute): void {
    this.fieldsById[attribute].classList.add(InfoBar.CHANGE_CLASS)
  }

  public endChangeField(attribute: Attribute): void {
    this.fieldsById[attribute].classList.remove(InfoBar.CHANGE_CLASS)
  }

  public setFieldValue(attribute: Attribute, value: number): void {
    this.fieldsById[attribute].innerText = this.pad(value)
  }

  private schemeChanged(): void {
    this.render()
  }
}
