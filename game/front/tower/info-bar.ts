import { Color, COLORS } from "../../../common/data/color"
import { Hole, html, render } from "uhtml"
import { Game } from "../../game"
import { htmlUnsafe } from "../../../common/front/functions"
import { PlayerAttribute } from "../../models/attribute"
import { ScreenTower } from "./screen-tower"

export const enum ValueChangeType {
  UP,
  DOWN,
}

export class InfoBar {
  private static readonly HP_ID = "screenTowerInfoHp"
  private static readonly HP_MUL_ID = "screenTowerInfoHpMul"
  private static readonly ATK_ID = "screenTowerInfoAtk"
  private static readonly DEF_ID = "screenTowerInfoDef"
  private static readonly EXP_ID = "screenTowerInfoExp"
  private static readonly EXP_MUL_ID = "screenTowerInfoExpMul"
  private static readonly KEY_ID = "screenTowerInfoKey"

  private static readonly VALUE_CHANGE_TO_CLASS: Record<ValueChangeType, string> = {
    [ValueChangeType.DOWN]: "downChange",
    [ValueChangeType.UP]: "upChange",
  }

  private static SMALL_SPACE = htmlUnsafe(`<span class='small'> </span>`)

  private readonly game: Game
  private infoHp: HTMLElement
  private infoHpMul: HTMLElement
  private infoAtk: HTMLElement
  private infoDef: HTMLElement
  private infoExp: HTMLElement
  private infoExpMul: HTMLElement
  private fieldsByPlayerAttribute: Record<PlayerAttribute, HTMLElement>
  private fieldsByColor: Record<Color, HTMLElement>

  static NBSP = "\xa0"

  constructor(game: Game) {
    this.game = game
    this.game.eventManager.registerSchemeChange(() => this.schemeChanged())
  }

  pad(value: number): string {
    return value.toString().padStart(7, InfoBar.NBSP)
  }

  padKey(value: number): string {
    return value.toString().padStart(2, InfoBar.NBSP)
  }

  renderField(id: string, description: string, value: number | string): Hole {
    return html` <div><span id="${id}">${value}</span>${InfoBar.SMALL_SPACE}${description}</div>`
  }

  renderBlock(fields: Hole[]): Hole {
    if (fields.length == 1) {
      const emptyHole = html` <div></div>`
      fields.push(emptyHole)
    }
    return html` <div class="screenTowerInfoBlock">${fields}</div>`
  }

  render(): void {
    console.debug("InfoBar", "render")
    const playerInfo = this.game.playerTower!.playerInfo

    const hp = this.renderBlock([
      this.renderField(InfoBar.HP_ID, `HP${InfoBar.NBSP}`, this.pad(playerInfo.hp)),
      this.renderField(InfoBar.HP_MUL_ID, "%", playerInfo.hpMul),
    ])
    const atk = this.renderBlock([this.renderField(InfoBar.ATK_ID, "ATK", this.pad(playerInfo.atk))])
    const def = this.renderBlock([this.renderField(InfoBar.DEF_ID, "DEF", this.pad(playerInfo.def))])

    const exp = this.renderBlock([
      this.renderField(InfoBar.EXP_ID, "EXP", this.pad(playerInfo.exp)),
      this.renderField(InfoBar.EXP_MUL_ID, "%", playerInfo.expMul),
    ])

    const keysContent = COLORS.map((color: Color) => {
      const divId = this.colorFieldId(color)
      const iconName = `key${color}`
      return html` <div>
        <span id="${divId}">${this.padKey(playerInfo.keys[color])}</span>${InfoBar.SMALL_SPACE}
        <sl-icon library="tf" name="${iconName}"></sl-icon>
      </div>`
    })
    const keys = html`<div id="screenTowerInfoKeys">${keysContent}</div>`

    render(document.getElementById(ScreenTower.INFO_BAR_ID), html`${hp} ${atk} ${def} ${exp} ${keys}`)
    this.infoHp = document.getElementById(InfoBar.HP_ID)!
    this.infoHpMul = document.getElementById(InfoBar.HP_MUL_ID)!
    this.infoAtk = document.getElementById(InfoBar.ATK_ID)!
    this.infoDef = document.getElementById(InfoBar.DEF_ID)!
    this.infoExp = document.getElementById(InfoBar.EXP_ID)!
    this.infoExpMul = document.getElementById(InfoBar.EXP_MUL_ID)!
    this.fieldsByPlayerAttribute = {
      [PlayerAttribute.HP]: this.infoHp,
      [PlayerAttribute.HP_MUL]: this.infoHpMul,
      [PlayerAttribute.ATK]: this.infoAtk,
      [PlayerAttribute.DEF]: this.infoDef,
      [PlayerAttribute.EXP]: this.infoExp,
      [PlayerAttribute.EXP_MUL]: this.infoExpMul,
    }
    this.fieldsByColor = {
      [Color.blue]: document.getElementById(this.colorFieldId(Color.blue))!,
      [Color.crimson]: document.getElementById(this.colorFieldId(Color.crimson))!,
      [Color.greenBlue]: document.getElementById(this.colorFieldId(Color.greenBlue))!,
      [Color.platinum]: document.getElementById(this.colorFieldId(Color.platinum))!,
      [Color.violet]: document.getElementById(this.colorFieldId(Color.violet))!,
      [Color.yellow]: document.getElementById(this.colorFieldId(Color.yellow))!,
    }
  }

  private colorFieldId(color: Color): string {
    return `${InfoBar.KEY_ID}${color}`
  }

  public startChangeKey(color: Color, valueChangeType: ValueChangeType): void {
    const field = this.fieldsByColor[color]
    field.classList.add(InfoBar.VALUE_CHANGE_TO_CLASS[valueChangeType])
  }

  public setKeyValue(color: Color, value: number): void {
    const field = this.fieldsByColor[color]
    field.innerText = this.padKey(value)
  }

  public endChangeKey(color: Color, valueChangeType: ValueChangeType): void {
    const field = this.fieldsByColor[color]
    field.classList.remove(InfoBar.VALUE_CHANGE_TO_CLASS[valueChangeType])
  }

  public startChangeField(attribute: PlayerAttribute, valueChangeType: ValueChangeType): void {
    const field = this.fieldsByPlayerAttribute[attribute]
    field.classList.add(InfoBar.VALUE_CHANGE_TO_CLASS[valueChangeType])
  }

  public endChangeField(attribute: PlayerAttribute, valueChangeType: ValueChangeType): void {
    const field = this.fieldsByPlayerAttribute[attribute]
    field.classList.remove(InfoBar.VALUE_CHANGE_TO_CLASS[valueChangeType])
  }

  public setFieldValue(attribute: PlayerAttribute, value: number): void {
    const field = this.fieldsByPlayerAttribute[attribute]
    field.innerText = this.pad(value)
  }

  private schemeChanged(): void {
    this.render()
  }
}
