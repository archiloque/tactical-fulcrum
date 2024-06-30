import {Hole, html, render} from 'uhtml'
import {Game} from '../../game'
import {ScreenTower} from './screen-tower'

export class InfoBar {
  private static readonly HP_ID = 'screenTowerInfoHp'
  private static readonly ATK_ID = 'screenTowerInfoAtk'
  private static readonly DEF_ID = 'screenTowerInfoDef'
  private static readonly EXP_ID = 'screenTowerInfoExp'

  private readonly game: Game

  constructor(game: Game) {
    this.game = game
    this.game.eventManager.registerSchemeChange(() => this.schemeChanged())
  }

  pad(value: number): string {
    return value.toString().padStart(7, '\xa0')
  }

  renderField(id: string, description: string, value: number | string): Hole {
    return html` <div id="${id}">
      <div>${value} ${description}</div>
    </div>`
  }

  render(): void {
    const playerInfo = this.game.playerTower!.playerInfo
    render(
      document.getElementById(ScreenTower.INFO_BAR_ID),
      html` ${this.renderField(InfoBar.HP_ID, 'HP', this.pad(playerInfo.hp))}
      ${this.renderField(InfoBar.ATK_ID, 'ATK', this.pad(playerInfo.atk))}
      ${this.renderField(InfoBar.DEF_ID, 'DEF', this.pad(playerInfo.def))}
      ${this.renderField(InfoBar.EXP_ID, 'XP', this.pad(playerInfo.exp))}`,
    )
    console.debug('InfoBar', 'render')
  }

  private schemeChanged(): void {
    this.render()
  }
}
