import {
  AtkLevelUpContent,
  DefLevelUpContent,
  HpLevelUpContent,
  KeyLevelUpContent,
  LevelUpContent,
  LevelUpContentType,
} from "../../../models/play/level-up-content"
import { Hole, html, render } from "uhtml"
import { InfoBar, ValueChangeType } from "./info-bar"
import { keyIcon, SMALL_SPACE } from "../../../../common/front/functions"
import { renderField, renderFieldSpan } from "./helpers"
import { AnimationSource } from "../../game-event-manager"
import { Color } from "../../../../common/data/color"
import { ExpInfo } from "../../../models/played-tower"
import { PlayerAttribute } from "../../../models/attribute"
import { PlayerInfo } from "../../../models/player-info"
import SlButton from "@shoelace-style/shoelace/cdn/components/button/button.component"
import SlProgressBar from "@shoelace-style/shoelace/cdn/components/progress-bar/progress-bar.component"
import { Ticker } from "pixi.js"

export class ExperienceAndLevelUp {
  private static readonly EXP_ID = "screenTowerInfoExpField"
  private static readonly EXP_LEVEL_INFO_ID = "screenTowerInfoExpLevelInfo"
  private static readonly EXP_MUL_ID = "screenTowerInfoExpMul"
  private static readonly EXP_NEXT_LEVEL_ID = "screenTowerInfoExpNextLevelField"
  private static readonly EXP_PROGRESS_ID = "screenTowerInfoExpProgress"
  private static readonly LEVEL_UP_ID = "screenTowerInfoLevelUp"

  // @ts-ignore
  private levelUp: HTMLElement
  // @ts-ignore
  private infoExpNextLevel: HTMLElement
  // @ts-ignore
  infoExp: HTMLElement
  // @ts-ignore
  infoExpMul: HTMLElement
  // @ts-ignore
  private infoExpProgress: SlProgressBar
  // @ts-ignore
  private infoLevel: HTMLElement
  // @ts-ignore
  private currentLevelUpContent: LevelUpContent | null
  // @ts-ignore
  private tickerFunction: null | ((ticker: Ticker) => void)

  private readonly infoBar: InfoBar

  constructor(infoBar: InfoBar) {
    this.infoBar = infoBar
    this.infoBar.game.eventManager.registerAnimationStart((animationSource: AnimationSource) => {
      if (animationSource !== AnimationSource.GAME_MAP) {
        this.cancelCurrentAnimation()
      }
    })
  }

  renderExperience(): Hole {
    const playerInfo = this.infoBar.game.playedTower!.playerInfo
    const expInfo = this.infoBar.game.playedTower!.getExpInfo()

    return html` <div id="screenTowerInfoExp">
      <div id="screenTowerInfoExpFields">
        <div id="${ExperienceAndLevelUp.EXP_LEVEL_INFO_ID}">${this.levelInfo(playerInfo, expInfo)}</div>
        <div>
          ${renderFieldSpan(ExperienceAndLevelUp.EXP_ID, "EXP", expInfo.remainingExp)}
          <span id="screenTowerInfoExpNextLevel">
            /<span id="${ExperienceAndLevelUp.EXP_NEXT_LEVEL_ID}">${expInfo.expForNextLevel}</span>
          </span>
        </div>
        ${renderField(ExperienceAndLevelUp.EXP_MUL_ID, "%", playerInfo.expMul)}
      </div>
      <sl-progress-bar id="${ExperienceAndLevelUp.EXP_PROGRESS_ID}" value="${expInfo.percentage}"></sl-progress-bar>
    </div>`
  }

  renderLevelUp(): Hole {
    return html` <div id="${ExperienceAndLevelUp.LEVEL_UP_ID}"></div>`
  }

  postRender(): void {
    console.debug("ExperienceAndLevelUp", "postRender")
    this.levelUp = document.getElementById(ExperienceAndLevelUp.LEVEL_UP_ID)!
    this.infoExpNextLevel = document.getElementById(ExperienceAndLevelUp.EXP_NEXT_LEVEL_ID)!
    this.infoExp = document.getElementById(ExperienceAndLevelUp.EXP_ID)!
    this.infoExpMul = document.getElementById(ExperienceAndLevelUp.EXP_MUL_ID)!
    this.infoExpProgress = document.getElementById(ExperienceAndLevelUp.EXP_PROGRESS_ID) as SlProgressBar
    this.infoLevel = document.getElementById(ExperienceAndLevelUp.EXP_LEVEL_INFO_ID)!
  }

  updateExpAndLevelsUp(): void {
    console.debug("ExperienceAndLevelUp", "updateExpAndLevelsUp")
    const expInfo: ExpInfo = this.infoBar.game.playedTower!.getExpInfo()
    this.infoExpNextLevel.innerText = expInfo.expForNextLevel.toString()
    this.infoExpProgress.value = expInfo.percentage
    this.infoExp.innerText = expInfo.remainingExp.toString()
    render(this.infoLevel, this.levelInfo(this.infoBar.game.playedTower!.playerInfo, expInfo))
    if (expInfo.levelsUpAvailable !== 0) {
      const levelsUpContents: (LevelUpContent | undefined)[] = this.infoBar.game.playedTower!.levelsUpContents()
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

  private levelInfo(playerInfo: PlayerInfo, expInfo: ExpInfo): Hole {
    return html`${renderField(`${ExperienceAndLevelUp.EXP_LEVEL_INFO_ID}Field`, "LV", playerInfo.level)}
    ${expInfo.levelsUpAvailable === 0 ? html`` : html` <sl-badge>+ ${expInfo.levelsUpAvailable}</sl-badge>`}`
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

  private clickLevelUp = async (event: CustomEvent): Promise<void> => {
    const levelUpIndex = parseInt((event.currentTarget as SlButton).dataset.index!)
    console.debug("ExperienceAndLevelUp", "clickLevelUp", levelUpIndex)
    const levelUpContent = await this.infoBar.game.playedTower!.levelUp(levelUpIndex)
    this.updateExpAndLevelsUp()
    this.currentLevelUpContent = levelUpContent
    this.tickerFunction = this.triggerLevelUp(levelUpContent)
    this.infoBar.app.ticker.add(this.tickerFunction!)
  }

  private triggerLevelUp(levelUpContent: LevelUpContent): (ticker: Ticker) => void {
    let attribute: PlayerAttribute | undefined = undefined
    let valueFrom: number
    let valueTo: number
    let keyColor: Color | undefined = undefined
    switch (levelUpContent.getType()) {
      case LevelUpContentType.KEY:
        keyColor = (levelUpContent as KeyLevelUpContent).color
        valueTo = this.infoBar.game.playedTower!.playerInfo.keys[keyColor]
        valueFrom = valueTo - (levelUpContent as KeyLevelUpContent).number
        this.infoBar.startChangeKey(keyColor, ValueChangeType.UP)
        break
      case LevelUpContentType.ATK:
        attribute = PlayerAttribute.ATK
        valueTo = this.infoBar.game.playedTower!.playerInfo.atk
        valueFrom = valueTo - (levelUpContent as AtkLevelUpContent).number
        break
      case LevelUpContentType.DEF:
        attribute = PlayerAttribute.DEF
        valueTo = this.infoBar.game.playedTower!.playerInfo.def
        valueFrom = valueTo - (levelUpContent as DefLevelUpContent).number
        break
      case LevelUpContentType.HP:
        attribute = PlayerAttribute.HP
        valueTo = this.infoBar.game.playedTower!.playerInfo.hp
        valueFrom = valueTo - (levelUpContent as HpLevelUpContent).number
        break
      default:
        throw new Error(`Unknown level type [${levelUpContent.getType()}]`)
    }
    if (attribute !== undefined) {
      this.infoBar.startChangeField(attribute, ValueChangeType.UP)
    }
    this.infoBar.game.eventManager.notifyAnimationStart(AnimationSource.INFO_BAR)

    let totalPercentMove: number = 0

    return (ticker: Ticker): void => {
      const percentMove: number = ticker.deltaMS / InfoBar.ACTION_TIME
      totalPercentMove += percentMove

      if (totalPercentMove >= 1) {
        this.currentLevelUpContent = null
        if (this.tickerFunction !== null) {
          this.infoBar.app.ticker.remove(this.tickerFunction)
          this.tickerFunction = null
        }

        if (attribute != undefined) {
          this.infoBar.endChangeField(attribute, ValueChangeType.UP)
          this.infoBar.setFieldValue(attribute, valueTo)
        }
        if (keyColor != undefined) {
          this.infoBar.endChangeKey(keyColor, ValueChangeType.UP)
          this.infoBar.setKeyValue(keyColor, valueTo)
        }
      } else {
        const value = Math.ceil(valueFrom + ((valueTo - valueFrom) * totalPercentMove) / 100)
        if (attribute != undefined) {
          this.infoBar.setFieldValue(attribute, value)
        }
        if (keyColor !== undefined) {
          this.infoBar.setKeyValue(keyColor, value)
        }
      }
    }
  }

  private cancelCurrentAnimation(): void {
    if (this.currentLevelUpContent) {
      this.currentLevelUpContent = null
      if (this.tickerFunction !== null) {
        this.infoBar.app.ticker.remove(this.tickerFunction)
        this.tickerFunction = null
      }
    }
  }
}
