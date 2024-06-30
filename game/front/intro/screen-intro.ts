import {html, render} from 'uhtml'
import {Game} from '../../game'
import {TOWERS} from '../../towers/towers'

export class ScreenIntro {
  private readonly game: Game

  constructor(game: Game) {
    this.game = game
  }

  render(): void {
    console.debug('ScreenMain', 'render')
    const towers = TOWERS.map(
      (tower, towerIndex) => html`<sl-tree-item data-tower-index="${towerIndex}">${tower.name}</sl-tree-item>`,
    )
    render(
      this.game.mainDiv,
      html`<h1 id="screenMainMainTile">Tactical&thinsp;fulcrum</h1>
        <sl-tree id="screenMainTowersList" @sl-selection-change="${this.towerSelection}"> ${towers} </sl-tree>`,
    )
  }

  private towerSelection = (event: CustomEvent): void => {
    console.debug('ScreenMain', 'towerSelection', event)
    const towerIndex = parseInt(event.detail.selection[0].dataset.towerIndex)
    this.game.eventManager.notifyTowerSelection(TOWERS[towerIndex])
  }
}
