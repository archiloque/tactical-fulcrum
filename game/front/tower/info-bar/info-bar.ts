import { Color, COLORS } from "../../../../common/data/color"
import { Hole, html, render } from "uhtml"
import { keyIcon, NBSP, SMALL_SPACE } from "../../../../common/front/functions"
import { Application } from "pixi.js"
import { Buttons } from "./buttons"
import { ExperienceAndLevelUp } from "./experience-and-level-up"
import { Game } from "../../../game"
import { PlayerAttribute } from "../../../models/attribute"
import { renderField } from "./helpers"
import { ScreenTower } from "../screen-tower"

export const enum ValueChangeType {
  UP,
  DOWN,
}

export class InfoBar {
  static readonly ACTION_TIME: number = 150

  private static readonly ATK_ID = "screenTowerInfoAtkField"
  private static readonly DEF_ID = "screenTowerInfoDefField"
  private static readonly HP_ID = "screenTowerInfoHpField"
  private static readonly HP_MUL_ID = "screenTowerInfoHpMulField"
  private static readonly KEY_ID = "screenTowerInfoKeyField"

  private static readonly VALUE_CHANGE_TO_CLASS: Record<ValueChangeType, string> = {
    [ValueChangeType.DOWN]: "downChange",
    [ValueChangeType.UP]: "upChange",
  }

  readonly game: Game
  // @ts-ignore
  private infoHp: HTMLElement
  // @ts-ignore
  private infoHpMul: HTMLElement
  // @ts-ignore
  private infoAtk: HTMLElement
  // @ts-ignore
  private infoDef: HTMLElement

  private experienceAndLevelUp: ExperienceAndLevelUp
  private buttons: Buttons

  // @ts-ignore
  private fieldsByPlayerAttribute: Record<PlayerAttribute, HTMLElement | undefined>
  // @ts-ignore
  private fieldsByColor: Record<Color, HTMLElement>

  // @ts-ignore
  app: Application

  constructor(game: Game) {
    this.game = game
    this.game.eventManager.registerSchemeChange(() => this.render())
    this.experienceAndLevelUp = new ExperienceAndLevelUp(this)
    this.buttons = new Buttons(this)
  }

  private pad(value: number): string {
    return value.toString().padStart(7, NBSP)
  }

  private padKey(value: number): string {
    return value.toString().padStart(2, NBSP)
  }

  private renderBlock(fields: Hole[]): Hole {
    if (fields.length == 1) {
      const emptyHole = html` <div></div>`
      fields.push(emptyHole)
    }
    return html` <div class="screenTowerInfoBlock">${fields}</div>`
  }

  render(): void {
    console.debug("InfoBar", "render")
    const playerInfo = this.game.playedTower!.playerInfo

    console.debug("InfoBar", "render", playerInfo.hp)
    const hp = this.renderBlock([
      renderField(InfoBar.HP_ID, `HP${NBSP}`, this.pad(playerInfo.hp)),
      renderField(InfoBar.HP_MUL_ID, "%", playerInfo.hpMul),
    ])
    const atk = this.renderBlock([renderField(InfoBar.ATK_ID, "ATK", this.pad(playerInfo.atk))])
    const def = this.renderBlock([renderField(InfoBar.DEF_ID, "DEF", this.pad(playerInfo.def))])

    const keysContent = COLORS.map((color: Color) => {
      const divId = this.colorFieldId(color)
      return html` <div>
        <span id="${divId}">${this.padKey(playerInfo.keys[color])}</span>${SMALL_SPACE} ${keyIcon(color)}
      </div>`
    })
    const keys = html` <div id="screenTowerInfoKeys">${keysContent}</div>`

    const content = [
      hp,
      atk,
      def,
      this.experienceAndLevelUp.contentExperience(),
      this.experienceAndLevelUp.contentLevelUp(),
      keys,
      this.buttons.content(),
    ]
    const infoBar = document.getElementById(ScreenTower.INFO_BAR_ID)
    // render(infoBar, html``)
    render(infoBar, html`${content}`)

    this.experienceAndLevelUp.postRender()

    this.infoHp = document.getElementById(InfoBar.HP_ID)!
    this.infoHpMul = document.getElementById(InfoBar.HP_MUL_ID)!
    this.infoAtk = document.getElementById(InfoBar.ATK_ID)!
    this.infoDef = document.getElementById(InfoBar.DEF_ID)!

    this.fieldsByPlayerAttribute = {
      [PlayerAttribute.LEVEL]: undefined,
      [PlayerAttribute.HP]: this.infoHp,
      [PlayerAttribute.HP_MUL]: this.infoHpMul,
      [PlayerAttribute.ATK]: this.infoAtk,
      [PlayerAttribute.DEF]: this.infoDef,
      [PlayerAttribute.EXP]: this.experienceAndLevelUp.infoExp,
      [PlayerAttribute.EXP_MUL]: this.experienceAndLevelUp.infoExpMul,
    }
    this.fieldsByColor = {
      [Color.blue]: document.getElementById(this.colorFieldId(Color.blue))!,
      [Color.crimson]: document.getElementById(this.colorFieldId(Color.crimson))!,
      [Color.greenBlue]: document.getElementById(this.colorFieldId(Color.greenBlue))!,
      [Color.platinum]: document.getElementById(this.colorFieldId(Color.platinum))!,
      [Color.violet]: document.getElementById(this.colorFieldId(Color.violet))!,
      [Color.yellow]: document.getElementById(this.colorFieldId(Color.yellow))!,
    }
    this.experienceAndLevelUp.updateExpAndLevelsUp()
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
    if (field !== undefined) {
      field.classList.add(InfoBar.VALUE_CHANGE_TO_CLASS[valueChangeType])
    }
  }

  public endChangeField(attribute: PlayerAttribute, valueChangeType: ValueChangeType): void {
    const field = this.fieldsByPlayerAttribute[attribute]
    if (field !== undefined) {
      field.classList.remove(InfoBar.VALUE_CHANGE_TO_CLASS[valueChangeType])
    }
  }

  public setFieldValue(attribute: PlayerAttribute, value: number): void {
    if (attribute === PlayerAttribute.EXP) {
      this.experienceAndLevelUp.updateExpAndLevelsUp()
    } else {
      const field = this.fieldsByPlayerAttribute[attribute]
      if (field !== undefined) {
        field.innerText = this.pad(value)
      }
    }
  }
}
