import { Hole, html } from "uhtml"
import { Buttons } from "../buttons"
import { Game } from "../../../../game"
import { MonochromeCustomIconsName } from "../../../../../common/front/icons/monochrome-custom-icons"
import { PlayedTowerModel } from "../../../../storage/models"
import SlButton from "@shoelace-style/shoelace/cdn/components/button/button.component"
import SlInput from "@shoelace-style/shoelace/cdn/components/input/input.component"

export class ButtonsSaveLoad {
  private static readonly SAVE_NAME_INPUT = "screenTowerButtonsSaveNameInput"

  private readonly buttons: Buttons
  private readonly game: Game

  constructor(buttons: Buttons) {
    this.buttons = buttons
    this.game = this.buttons.infoBar.game
  }

  content(): Hole {
    return html`
        ${Buttons.button(MonochromeCustomIconsName.LOAD, "Load", this.clickLoadButton)}
        ${Buttons.button(MonochromeCustomIconsName.SAVE, "Save", this.clickSaveButton)}
      </div>`
  }

  private clickLoadButton = async (): Promise<void> => {
    await this.showMainLoadDialog()
  }

  private clickSaveButton = async (): Promise<void> => {
    await this.showMainSaveDialog()
  }

  private async showMainLoadDialog(): Promise<void> {
    await this.game.showDialog(
      html` <sl-dialog label="Load"">
        <div slot="footer">
          <sl-button onclick="${this.hideDialog}" variant="neutral">Cancel </sl-button>
        </div>
      </sl-dialog>`,
    )
  }

  private hideDialog = async (): Promise<void> => {
    await this.game.hideDialog()
  }

  private async showMainSaveDialog(): Promise<void> {
    const playedTowerModels = await this.game.database
      .getPlayedTowerTable()
      .listByTowerName(this.game.playedTower!.tower.name)
    const savesContents: Hole[] = []
    for (const playedTowerModel of playedTowerModels) {
      savesContents[playedTowerModel.slot] = this.saveButton(playedTowerModel.slot, playedTowerModel)
    }
    if (playedTowerModels.length > 0) {
      const maxSlotValue = playedTowerModels[playedTowerModels.length - 1].slot
      for (let slot = 0; slot <= maxSlotValue; slot++) {
        if (savesContents[slot] === undefined) {
          savesContents[slot] = this.saveButton(slot, undefined)
        }
      }
    }

    await this.game.showDialog(
      html` <sl-dialog label="Save">
        <div id="screenTowerButtonsSaveDialogSaves">${savesContents}</div>
        <div slot="footer">
          <sl-button variant="primary" onclick="${this.saveDialogNewSave}">New save </sl-button>
          <sl-button onclick="${this.hideDialog}" variant="neutral">Cancel </sl-button>
        </div>
      </sl-dialog>`,
    )
  }

  private saveButton(slot: number, playedTowerModel?: PlayedTowerModel): Hole {
    const text =
      playedTowerModel === undefined
        ? "<em>Empty></em>"
        : `${playedTowerModel!.timestamp.toLocaleString()} - ${playedTowerModel!.saveName}`
    return html`<sl-button
      size="small"
      data-slot="${slot}"
      data-save-name="${playedTowerModel === undefined ? "" : playedTowerModel.saveName}"
      onclick="${this.clickOverwriteSaveButton}"
      >${text}</sl-button
    >`
  }

  private clickOverwriteSaveButton = async (event: CustomEvent): Promise<void> => {
    const data = (event.currentTarget as SlButton).dataset
    const slot = parseInt(data.slot!)
    const saveName = data.saveName!
    await this.game.hideDialog()
    await this.game.showDialog(
      html`<sl-dialog label="Overwrite save">
        <sl-input
          type="text"
          placeholder="Save name"
          id="${ButtonsSaveLoad.SAVE_NAME_INPUT}"
          value="${saveName}"
        ></sl-input>
        <div slot="footer">
          <sl-button variant="danger" onclick="${this.clickConfirmOverwriteSaveButton}" data-slot="${slot}"
            >Overwrite save
          </sl-button>
          <sl-button onclick="${this.clickSaveButton}" variant="neutral">Cancel save overwrite</sl-button>
        </div>
      </sl-dialog>`,
    )
  }

  private clickConfirmOverwriteSaveButton = async (event: CustomEvent): Promise<void> => {
    const data = (event.currentTarget as SlButton).dataset
    const slot = parseInt(data.slot!)
    const saveName = (document.getElementById(ButtonsSaveLoad.SAVE_NAME_INPUT) as SlInput).value
    await this.game.database.getPlayedTowerTable().saveOverwrite(this.game.playedTower!, slot, saveName)
    await this.game.hideDialog()
  }

  private saveDialogNewSave = async (): Promise<void> => {
    await this.game.hideDialog()
    await this.game.showDialog(html`
      <sl-dialog label="New save">
        <sl-input type="text" placeholder="Save name" id="${ButtonsSaveLoad.SAVE_NAME_INPUT}"></sl-input>
        <div slot="footer">
          <sl-button variant="primary" onclick="${this.saveNewSaveDialogSave}">Create new save</sl-button>
          <sl-button onclick="${this.saveNewSaveDialogCancel}" variant="neutral">Cancel save</sl-button>
        </div>
      </sl-dialog>
    `)
  }

  private saveNewSaveDialogCancel = async (): Promise<void> => {
    await this.game.hideDialog()
    await this.clickSaveButton()
  }

  private saveNewSaveDialogSave = async (): Promise<void> => {
    const saveName = (document.getElementById(ButtonsSaveLoad.SAVE_NAME_INPUT) as SlInput).value
    await this.game.database.getPlayedTowerTable().saveNew(this.game.playedTower!, saveName)
    await this.game.hideDialog()
  }
}
