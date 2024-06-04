import { html, render } from "uhtml"
import { TOWERS } from "../../towers/towers"
import { Game } from "../../game"

export class ScreenMain {
  private readonly game: Game

  constructor(game: Game) {
    this.game = game
  }

  render(): void {
    console.debug("ScreenMain", "render")
    render(document.body, html
      `<h1 id="screenMainMainTile">Tactical&thinsp;nexus</h1>
      <sl-tree id="screenMainTowersList" @sl-selection-change="${this.towerSelection}>
        ${TOWERS.map((tower, towerIndex) => html`<sl-tree-item data-tower-index="${towerIndex}">${tower.name}</sl-tree-item>`)}
      </sl-tree>`)
  }

  private towerSelection = (event: CustomEvent): void => {
    const towerIndex = parseInt(event.detail.selection[0].dataset.towerIndex)
  }
}
