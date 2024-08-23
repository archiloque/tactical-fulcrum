import "@shoelace-style/shoelace/dist/components/button/button.js"
import "@shoelace-style/shoelace/dist/components/badge/badge.js"
import "@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js"

import { Application, Ticker } from "pixi.js"
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
import { AnimationSource } from "../game-event-manager"
import { ExpInfo } from "../../models/played-tower"
import { Game } from "../../game"
import { PlayerAttribute } from "../../models/attribute"
import { PlayerInfo } from "../../models/player-info"
import { ScreenTower } from "./screen-tower"
import SlButton from "@shoelace-style/shoelace/cdn/components/button/button.component"
import SlProgressBar from "@shoelace-style/shoelace/cdn/components/progress-bar/progress-bar.component"

export const enum ValueChangeType {
  UP,
  DOWN,
}

export class InfoBar {
  private static readonly ACTION_TIME: number = 150

  private static readonly HP_ID = "screenTowerInfoHpField"
  private static readonly HP_MUL_ID = "screenTowerInfoHpMulField"
  private static readonly ATK_ID = "screenTowerInfoAtkField"
  private static readonly DEF_ID = "screenTowerInfoDefField"
  private static readonly EXP_ID = "screenTowerInfoExpField"
  private static readonly EXP_NEXT_LEVEL_ID = "screenTowerInfoExpNextLevelField"
  private static readonly EXP_PROGRESS_ID = "screenTowerInfoExpProgress"
  private static readonly EXP_LEVEL_INFO_ID = "screenTowerInfoExpLevelInfo"
  private static readonly EXP_MUL_ID = "screenTowerInfoExpMul"
  private static readonly LEVEL_UP_ID = "screenTowerInfoLevelUp"
  private static readonly KEY_ID = "screenTowerInfoKeyField"

  private static readonly VALUE_CHANGE_TO_CLASS: Record<ValueChangeType, string> = {
    [ValueChangeType.DOWN]: "downChange",
    [ValueChangeType.UP]: "upChange",
  }

  private readonly game: Game
  // @ts-ignore
  private infoHp: HTMLElement
  // @ts-ignore
  private infoHpMul: HTMLElement
  // @ts-ignore
  private infoAtk: HTMLElement
  // @ts-ignore
  private infoDef: HTMLElement
  // @ts-ignore
  private infoExp: HTMLElement
  // @ts-ignore
  private infoExpMul: HTMLElement
  // @ts-ignore
  private infoExpProgress: SlProgressBar
  // @ts-ignore
  private infoExpNextLevel: HTMLElement
  // @ts-ignore
  private levelUp: HTMLElement
  // @ts-ignore
  private infoLevel: HTMLElement

  // @ts-ignore
  private fieldsByPlayerAttribute: Record<PlayerAttribute, HTMLElement | undefined>
  // @ts-ignore
  private fieldsByColor: Record<Color, HTMLElement>
  // @ts-ignore
  private currentLevelUpContent: LevelUpContent | null
  // @ts-ignore
  private tickerFunction: null | ((ticker: Ticker) => void)
  // @ts-ignore
  app: Application

  constructor(game: Game) {
    this.game = game
    this.game.eventManager.registerSchemeChange(() => this.schemeChanged())
    this.game.eventManager.registerAnimationStart((animationSource: AnimationSource) => {
      if (animationSource !== AnimationSource.GAME_MAP) {
        this.cancelCurrentAnimation()
      }
    })
  }

  private cancelCurrentAnimation(): void {
    if (this.currentLevelUpContent) {
      this.currentLevelUpContent = null
      if (this.tickerFunction !== null) {
        this.app.ticker.remove(this.tickerFunction)
        this.tickerFunction = null
      }
    }
  }

  private pad(value: number): string {
    return value.toString().padStart(7, NBSP)
  }

  private padKey(value: number): string {
    return value.toString().padStart(2, NBSP)
  }

  renderField(id: string, description: string, value: number | string): Hole {
    return html` <div>${this.renderFieldSpan(id, description, value)}</div>`
  }

  renderFieldSpan(id: string, description: string, value: number | string): Hole {
    return html`<span id="${id}">${value}</span>${SMALL_SPACE}${description}`
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

    const hp = this.renderBlock([
      this.renderField(InfoBar.HP_ID, `HP${NBSP}`, this.pad(playerInfo.hp)),
      this.renderField(InfoBar.HP_MUL_ID, "%", playerInfo.hpMul),
    ])
    const atk = this.renderBlock([this.renderField(InfoBar.ATK_ID, "ATK", this.pad(playerInfo.atk))])
    const def = this.renderBlock([this.renderField(InfoBar.DEF_ID, "DEF", this.pad(playerInfo.def))])

    const expInfo = this.game.playedTower!.getExpInfo()

    const exp = html` <div id="screenTowerInfoExp">
      <div id="screenTowerInfoExpFields">
        <div id="${InfoBar.EXP_LEVEL_INFO_ID}">${this.levelInfo(playerInfo, expInfo)}</div>
        <div>
          ${this.renderFieldSpan(InfoBar.EXP_ID, "EXP", expInfo.remainingExp)}
          <span id="screenTowerInfoExpNextLevel">
            /<span id="${InfoBar.EXP_NEXT_LEVEL_ID}">${expInfo.expForNextLevel}</span>
          </span>
        </div>
        ${this.renderField(InfoBar.EXP_MUL_ID, "%", playerInfo.expMul)}
      </div>
      <sl-progress-bar id="${InfoBar.EXP_PROGRESS_ID}" value="${expInfo.percentage}"></sl-progress-bar>
    </div>`

    const levelUp = html` <div id="${InfoBar.LEVEL_UP_ID}"></div>`

    const keysContent = COLORS.map((color: Color) => {
      const divId = this.colorFieldId(color)
      return html` <div>
        <span id="${divId}">${this.padKey(playerInfo.keys[color])}</span>${SMALL_SPACE} ${keyIcon(color)}
      </div>`
    })
    const keys = html` <div id="screenTowerInfoKeys">${keysContent}</div>`

    render(document.getElementById(ScreenTower.INFO_BAR_ID), html`${hp} ${atk} ${def} ${exp} ${levelUp} ${keys}`)
    this.infoHp = document.getElementById(InfoBar.HP_ID)!
    this.infoHpMul = document.getElementById(InfoBar.HP_MUL_ID)!
    this.infoAtk = document.getElementById(InfoBar.ATK_ID)!
    this.infoDef = document.getElementById(InfoBar.DEF_ID)!
    this.infoExp = document.getElementById(InfoBar.EXP_ID)!
    this.infoExpMul = document.getElementById(InfoBar.EXP_MUL_ID)!
    this.infoExpNextLevel = document.getElementById(InfoBar.EXP_NEXT_LEVEL_ID)!
    this.infoExpProgress = document.getElementById(InfoBar.EXP_PROGRESS_ID) as SlProgressBar
    this.levelUp = document.getElementById(InfoBar.LEVEL_UP_ID)!
    this.infoLevel = document.getElementById(InfoBar.EXP_LEVEL_INFO_ID)!

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
    this.updateExpAndLevelsUp()
  }

  private levelInfo(playerInfo: PlayerInfo, expInfo: ExpInfo): Hole {
    return html`${this.renderField(`${InfoBar.EXP_LEVEL_INFO_ID}Field`, "LV", playerInfo.level)}
    ${expInfo.levelsUpAvailable === 0 ? html`` : html` <sl-badge>+ ${expInfo.levelsUpAvailable}</sl-badge>`}`
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
      if (attribute !== PlayerAttribute.EXP) {
        field.innerText = this.pad(value)
      }
      if (attribute === PlayerAttribute.EXP || attribute === PlayerAttribute.HP_MUL) {
        this.updateExpAndLevelsUp()
      }
    }
  }

  private updateExpAndLevelsUp(): void {
    console.debug("InfoBar", "updateExpAndLevelsUp")
    const expInfo: ExpInfo = this.game.playedTower!.getExpInfo()
    this.infoExpNextLevel.innerText = expInfo.expForNextLevel.toString()
    this.infoExpProgress.value = expInfo.percentage
    this.infoExp.innerText = expInfo.remainingExp.toString()
    render(this.infoLevel, this.levelInfo(this.game.playedTower!.playerInfo, expInfo))
    if (expInfo.levelsUpAvailable !== 0) {
      const levelsUpContents: (LevelUpContent | undefined)[] = this.game.playedTower!.levelsUpContents()
      while (levelsUpContents.length < 6) {
        levelsUpContents.push(undefined)
      }
      render(
        this.levelUp,
        html`
          ${this.renderLevelUpContent(levelsUpContents[0], 0)}${this.renderLevelUpContent(
            levelsUpContents[1],
            1,
          )}${this.renderLevelUpContent(levelsUpContents[2], 2)}
          ${this.renderLevelUpContent(levelsUpContents[3], 3)}${this.renderLevelUpContent(
            levelsUpContents[4],
            4,
          )}${this.renderLevelUpContent(levelsUpContents[5], 5)}
        `,
      )
    } else {
      render(this.levelUp, html``)
    }
  }

  private renderLevelUpContent(levelUpContent: LevelUpContent | undefined, index: number): Hole {
    if (levelUpContent === undefined) {
      return html` <div></div>`
    } else {
      let content: Hole
      switch (levelUpContent.getType()) {
        case LevelUpContentType.KEY:
          const keyLevelUpContent = levelUpContent as KeyLevelUpContent
          content = html`+${keyLevelUpContent.number}${SMALL_SPACE}${keyIcon(keyLevelUpContent.color)}`
          break
        case LevelUpContentType.ATK:
          content = html`+${(levelUpContent as AtkLevelUpContent).number}${SMALL_SPACE}ATK`
          break
        case LevelUpContentType.DEF:
          content = html`+${(levelUpContent as DefLevelUpContent).number}${SMALL_SPACE}DEF`
          break
        case LevelUpContentType.HP:
          content = html`+${(levelUpContent as HpLevelUpContent).number}${SMALL_SPACE}HP`
          break
        default:
          throw new Error(`Unknown level up type [${levelUpContent.getType()}] ${levelUpContent}`)
      }
      return html` <sl-button size="large" variant="default" onclick="${this.clickLevelUp}" data-index="${index}"
        >${content}
      </sl-button>`
    }
  }

  private clickLevelUp = (event: CustomEvent): void => {
    const levelUpIndex = parseInt((event.currentTarget as SlButton).dataset.index!)
    console.debug("InfoBar", "clickLevelUp", levelUpIndex)
    const levelUpContent = this.game.playedTower!.levelUp(levelUpIndex)
    this.updateExpAndLevelsUp()
    this.currentLevelUpContent = levelUpContent
    this.tickerFunction = this.triggerLevelUp(levelUpContent)
    this.app.ticker.add(this.tickerFunction!)
  }

  private triggerLevelUp(levelUpContent: LevelUpContent): (ticker: Ticker) => void {
    let attribute: PlayerAttribute | undefined = undefined
    let valueFrom: number
    let valueTo: number
    let keyColor: Color | undefined = undefined
    switch (levelUpContent.getType()) {
      case LevelUpContentType.KEY:
        keyColor = (levelUpContent as KeyLevelUpContent).color
        valueTo = this.game.playedTower!.playerInfo.keys[keyColor]
        valueFrom = valueTo - (levelUpContent as KeyLevelUpContent).number
        this.startChangeKey(keyColor, ValueChangeType.UP)
        break
      case LevelUpContentType.ATK:
        attribute = PlayerAttribute.ATK
        valueTo = this.game.playedTower!.playerInfo.atk
        valueFrom = valueTo - (levelUpContent as AtkLevelUpContent).number
        break
      case LevelUpContentType.DEF:
        attribute = PlayerAttribute.DEF
        valueTo = this.game.playedTower!.playerInfo.def
        valueFrom = valueTo - (levelUpContent as DefLevelUpContent).number
        break
      case LevelUpContentType.HP:
        attribute = PlayerAttribute.HP
        valueTo = this.game.playedTower!.playerInfo.hp
        valueFrom = valueTo - (levelUpContent as HpLevelUpContent).number
        break
      default:
        throw new Error(`Unknown level type [${levelUpContent.getType()}]`)
    }
    if (attribute !== undefined) {
      this.startChangeField(attribute, ValueChangeType.UP)
    }
    this.game.eventManager.notifyAnimationStart(AnimationSource.INFO_BAR)

    let totalPercentMove: number = 0

    return (ticker: Ticker): void => {
      const percentMove: number = ticker.deltaMS / InfoBar.ACTION_TIME
      totalPercentMove += percentMove

      if (totalPercentMove >= 1) {
        this.currentLevelUpContent = null
        if (this.tickerFunction !== null) {
          this.app.ticker.remove(this.tickerFunction)
          this.tickerFunction = null
        }

        if (attribute != undefined) {
          this.endChangeField(attribute, ValueChangeType.UP)
          this.setFieldValue(attribute, valueTo)
        }
        if (keyColor != undefined) {
          this.endChangeKey(keyColor, ValueChangeType.UP)
          this.setKeyValue(keyColor, valueTo)
        }
      } else {
        const value = Math.ceil(valueFrom + ((valueTo - valueFrom) * totalPercentMove) / 100)
        if (attribute != undefined) {
          this.setFieldValue(attribute, value)
        }
        if (keyColor !== undefined) {
          this.setKeyValue(keyColor, value)
        }
      }
    }
  }

  private schemeChanged(): void {
    this.render()
  }
}
