import {
  AtkLevelUpContent,
  DefLevelUpContent,
  HpLevelUpContent,
  KeyLevelUpContent,
  LevelUpContent,
  LevelUpContentType,
} from "../../models/play/level-up-content"
import { Color, COLORS } from "../../../common/data/color"
import { Hole, html, render } from "uhtml"
import { keyIcon, NBSP, SMALL_SPACE } from "../../../common/front/functions"
import { Game } from "../../game"
import { getLevelIndex } from "../../models/play/levels"
import { PlayerAttribute } from "../../models/attribute"
import { ScreenTower } from "./screen-tower"
import SlProgressBar from "@shoelace-style/shoelace/cdn/components/progress-bar/progress-bar.component"

import "@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js"
import "@shoelace-style/shoelace/dist/components/button/button.js"

export const enum ValueChangeType {
  UP,
  DOWN,
}

type ExpInfo = {
  levelsUpAvailable: number
  nextLevelDelta: number
  percentage: number
}

export class InfoBar {
  private static readonly HP_ID = "screenTowerInfoHpField"
  private static readonly HP_MUL_ID = "screenTowerInfoHpMulField"
  private static readonly ATK_ID = "screenTowerInfoAtkField"
  private static readonly DEF_ID = "screenTowerInfoDefField"
  private static readonly EXP_ID = "screenTowerInfoExpField"
  private static readonly EXP_NEXT_LEVEL_ID = "screenTowerInfoExpNextLevelField"
  private static readonly EXP_PROGRESS_ID = "screenTowerInfoExpProgress"
  private static readonly EXP_MUL_ID = "screenTowerInfoExpMul"
  private static readonly LEVEL_UP_ID = "screenTowerInfoLevelUp"
  private static readonly KEY_ID = "screenTowerInfoKeyField"

  private static readonly VALUE_CHANGE_TO_CLASS: Record<ValueChangeType, string> = {
    [ValueChangeType.DOWN]: "downChange",
    [ValueChangeType.UP]: "upChange",
  }

  private readonly game: Game
  private infoHp: HTMLElement
  private infoHpMul: HTMLElement
  private infoAtk: HTMLElement
  private infoDef: HTMLElement
  private infoExp: HTMLElement
  private infoExpMul: HTMLElement
  private infoExpProgress: SlProgressBar
  private infoExpNextLevel: HTMLElement
  private levelUp: HTMLElement

  private fieldsByPlayerAttribute: Record<PlayerAttribute, HTMLElement | undefined>
  private fieldsByColor: Record<Color, HTMLElement>

  constructor(game: Game) {
    this.game = game
    this.game.eventManager.registerSchemeChange(() => this.schemeChanged())
  }

  pad(value: number): string {
    return value.toString().padStart(7, NBSP)
  }

  padKey(value: number): string {
    return value.toString().padStart(2, NBSP)
  }

  renderField(id: string, description: string, value: number | string): Hole {
    return html` <div><span id="${id}">${value}</span>${SMALL_SPACE}${description}</div>`
  }

  renderBlock(fields: Hole[]): Hole {
    if (fields.length == 1) {
      const emptyHole = html` <div></div>`
      fields.push(emptyHole)
    }
    return html` <div class="screenTowerInfoBlock">${fields}</div>`
  }

  private getExpInfo(): ExpInfo {
    const currentLevel = getLevelIndex(this.game.playerTower!.playerInfo.level)
    const nextLevel = getLevelIndex(this.game.playerTower!.playerInfo.level + 1)
    const currentExp = this.game.playerTower!.playerInfo.exp

    let levelsUpAvailable = 0
    let currentNextLevel = nextLevel
    let remainingExp = currentExp - currentLevel.exp

    while (currentExp > currentNextLevel.exp) {
      levelsUpAvailable++
      remainingExp -= currentNextLevel.deltaExp
      currentNextLevel = getLevelIndex(currentNextLevel.level + 1)
    }
    return {
      nextLevelDelta: nextLevel.deltaExp,
      levelsUpAvailable: levelsUpAvailable,
      percentage: (remainingExp / currentNextLevel.deltaExp) * 100,
    }
  }

  render(): void {
    console.debug("InfoBar", "render")
    const playerInfo = this.game.playerTower!.playerInfo

    const hp = this.renderBlock([
      this.renderField(InfoBar.HP_ID, `HP${NBSP}`, this.pad(playerInfo.hp)),
      this.renderField(InfoBar.HP_MUL_ID, "%", playerInfo.hpMul),
    ])
    const atk = this.renderBlock([this.renderField(InfoBar.ATK_ID, "ATK", this.pad(playerInfo.atk))])
    const def = this.renderBlock([this.renderField(InfoBar.DEF_ID, "DEF", this.pad(playerInfo.def))])

    const expInfo = this.getExpInfo()

    const exp = html` <div id="screenTowerInfoExp">
      <div id="screenTowerInfoExpFields">
        <div>
          ${this.renderField(InfoBar.EXP_ID, "EXP", this.pad(playerInfo.exp))}
          <div>
            <div id="screenTowerInfoExpNextLevel">
              /<span id="${InfoBar.EXP_NEXT_LEVEL_ID}">${this.pad(expInfo.nextLevelDelta)}</span>
            </div>
          </div>
        </div>
        ${this.renderField(InfoBar.EXP_MUL_ID, "%", playerInfo.expMul)}
      </div>
      <sl-progress-bar id="${InfoBar.EXP_PROGRESS_ID}" value="${expInfo.percentage}"></sl-progress-bar>
    </div>`

    const levelUp = html`<div id="${InfoBar.LEVEL_UP_ID}"></div>`

    const keysContent = COLORS.map((color: Color) => {
      const divId = this.colorFieldId(color)
      return html` <div>
        <span id="${divId}">${this.padKey(playerInfo.keys[color])}</span>${SMALL_SPACE} ${keyIcon(color)}
      </div>`
    })
    const keys = html`<div id="screenTowerInfoKeys">${keysContent}</div>`

    render(document.getElementById(ScreenTower.INFO_BAR_ID), html`${hp} ${atk} ${def} ${exp} ${levelUp} ${keys}`)
    this.infoHp = document.getElementById(InfoBar.HP_ID)!
    this.infoHpMul = document.getElementById(InfoBar.HP_MUL_ID)!
    this.infoAtk = document.getElementById(InfoBar.ATK_ID)!
    this.infoDef = document.getElementById(InfoBar.DEF_ID)!
    this.infoExp = document.getElementById(InfoBar.EXP_ID)!
    this.infoExpMul = document.getElementById(InfoBar.EXP_MUL_ID)!
    this.infoExpNextLevel = document.getElementById(InfoBar.EXP_NEXT_LEVEL_ID)!
    this.infoExpProgress = document.getElementById(InfoBar.EXP_PROGRESS_ID)! as SlProgressBar
    this.levelUp = document.getElementById(InfoBar.LEVEL_UP_ID)!

    this.fieldsByPlayerAttribute = {
      [PlayerAttribute.LEVEL]: undefined,
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
    const field = this.fieldsByPlayerAttribute[attribute]
    if (field !== undefined) {
      field.innerText = this.pad(value)
      if (attribute === PlayerAttribute.EXP) {
        this.updateExp()
      }
    }
  }

  private updateExp(): void {
    const expInfo = this.getExpInfo()
    this.infoExpNextLevel.innerText = this.pad(expInfo.nextLevelDelta)
    this.infoExpProgress.value = expInfo.percentage
    if (expInfo.levelsUpAvailable !== 0) {
      const levelsUpContents: (LevelUpContent | undefined)[] = this.game.playerTower!.levelsUpContents()
      while (levelsUpContents.length < 6) {
        levelsUpContents.push(undefined)
      }
      render(
        this.levelUp,
        html`
          ${this.renderLevelUpContent(levelsUpContents[0])}${this.renderLevelUpContent(
            levelsUpContents[1],
          )}${this.renderLevelUpContent(levelsUpContents[2])}
          ${this.renderLevelUpContent(levelsUpContents[3])}${this.renderLevelUpContent(
            levelsUpContents[4],
          )}${this.renderLevelUpContent(levelsUpContents[5])}
        `,
      )
    } else {
      render(this.levelUp, html``)
    }
  }

  private renderLevelUpContent(levelUpContent: LevelUpContent | undefined): Hole {
    if (levelUpContent === undefined) {
      return html`<div></div>`
    } else {
      let content
      switch (levelUpContent.getType()) {
        case LevelUpContentType.KEY:
          const keyLevelUpContent = levelUpContent as KeyLevelUpContent
          content = html`+${keyLevelUpContent.number}${SMALL_SPACE}${keyIcon(keyLevelUpContent.color)}`
          break
        case LevelUpContentType.ATK:
          content = html`+ ${(levelUpContent as AtkLevelUpContent).number}${SMALL_SPACE}ATK`
          break
        case LevelUpContentType.DEF:
          content = html`+ ${(levelUpContent as DefLevelUpContent).number}${SMALL_SPACE}DEF`
          break
        case LevelUpContentType.HP:
          content = html`+ ${(levelUpContent as HpLevelUpContent).number}${SMALL_SPACE}HP`
          break
        default:
          throw new Error(`Unknown level up type [${levelUpContent.getType()}] ${levelUpContent}`)
      }
      return html`<sl-button variant="default">${content}</sl-button>`
    }
  }

  private schemeChanged(): void {
    this.render()
  }
}
