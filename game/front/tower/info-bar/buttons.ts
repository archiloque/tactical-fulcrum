import { Hole, html, render } from "uhtml"
import { InfoBar } from "./info-bar"
import { MonochromeCustomIconsName } from "../../../../common/front/icons/monochrome-custom-icons"
import SlDialog from "@shoelace-style/shoelace/cdn/components/dialog/dialog.component"
import SlInput from "@shoelace-style/shoelace/cdn/components/input/input.component"
import { PlayedTowerModel } from "../../../storage/models"
import SlButton from "@shoelace-style/shoelace/cdn/components/button/button.component"

export class Buttons {
  private static readonly LOAD_DIALOG_ID = "screenTowerButtonsLoadDialog"
  private static readonly RESET_DIALOG_ID = "screenTowerButtonsResetDialog"
  private static readonly SAVE_DIALOG_ID = "screenTowerButtonsSaveDialog"
  private static readonly SAVE_DIALOG_SAVES_ID = "screenTowerButtonsSaveDialogSaves"
  private static readonly SAVE_OVERWRITE_DIALOG_ID = "screenTowerButtonsSaveDialogSaves"
  private static readonly SAVE_NEW_SAVE_DIALOG_ID = "screenTowerButtonsSaveNewSaveDialog"
  private static readonly SAVE_NEW_SAVE_DIALOG_INPUT_ID = "screenTowerButtonsSaveNewSaveDialogInput"

  private infoBar: InfoBar
  // @ts-ignore
  private loadDialog: SlDialog
  // @ts-ignore
  private resetDialog: SlDialog
  // @ts-ignore
  private saveDialog: SlDialog
  // @ts-ignore
  private saveNewSaveDialog: SlDialog
  // @ts-ignore
  private saveNewSaveDialogInput: SlInput
  // @ts-ignore
  private saveDialogSaves: Element
  // @ts-ignore
  private saveOverwriteDialog: SlDialog

  constructor(infoBar: InfoBar) {
    this.infoBar = infoBar
  }

  content(): Hole {
    return html`<sl-dialog label="Reset" id="${Buttons.RESET_DIALOG_ID}">
        Are you sure you want to reset your game?
        <div slot="footer">
          <sl-button onclick="${this.resetDialogCancel}" variant="neutral">No </sl-button>
          <sl-button onclick="${this.resetDialogConfirm}" variant="danger">Yes </sl-button>
        </div>
      </sl-dialog>
      <sl-dialog label="Load" id="${Buttons.LOAD_DIALOG_ID}">
        <div slot="footer">
          <sl-button onclick="${this.loadDialogCancel}" variant="neutral">Cancel </sl-button>
          <sl-button onclick="${this.loadDialogConfirm}" variant="danger">Yes </sl-button>
        </div>
      </sl-dialog>

      <sl-dialog label="Save" id="${Buttons.SAVE_DIALOG_ID}">
        <div id="${Buttons.SAVE_DIALOG_SAVES_ID}"></div>
        <div slot="footer">
          <sl-button variant="primary" onclick="${this.saveDialogCancelNewSave}">New save </sl-button>
          <sl-button onclick="${this.saveDialogCancel}" variant="neutral">Cancel </sl-button>
        </div>
      </sl-dialog>
      <sl-dialog label="New save" id="${Buttons.SAVE_NEW_SAVE_DIALOG_ID}">
        <sl-input type="text" placeholder="Save name" id="${Buttons.SAVE_NEW_SAVE_DIALOG_INPUT_ID}"></sl-input>
        <div slot="footer">
          <sl-button variant="primary" onclick="${this.saveNewSaveDialogSave}">Save </sl-button>
          <sl-button onclick="${this.saveNewSaveDialogCancel}" variant="neutral">Cancel </sl-button>
        </div>
      </sl-dialog>
      <sl-dialog label="Overwrite save" id="${Buttons.SAVE_OVERWRITE_DIALOG_ID}"> </sl-dialog>

      <div id="screenTowerInfoButtons">
        ${this.button(
          MonochromeCustomIconsName.FAST_BACKWARD,
          "Reset the game to its initial state",
          this.clickResetButton,
        )}
        ${this.button(MonochromeCustomIconsName.LOAD, "Load", this.clickLoadButton)}
        ${this.button(MonochromeCustomIconsName.SAVE, "Save", this.clickSaveButton)}
      </div>`
  }

  private button(icon: MonochromeCustomIconsName, tooltip: string, action: () => Promise<void>): Hole {
    return html`
      <div>
        <sl-tooltip content="${tooltip}">
          <sl-button size="small" onclick="${action}"><sl-icon library="tf" name="${icon}"></sl-icon></sl-button>
        </sl-tooltip>
      </div>
    `
  }

  postRender(): void {
    this.loadDialog = document.getElementById(Buttons.LOAD_DIALOG_ID)! as SlDialog
    this.resetDialog = document.getElementById(Buttons.RESET_DIALOG_ID)! as SlDialog
    this.saveDialog = document.getElementById(Buttons.SAVE_DIALOG_ID)! as SlDialog
    this.saveDialogSaves = document.getElementById(Buttons.SAVE_DIALOG_SAVES_ID)! as Element
    this.saveOverwriteDialog = document.getElementById(Buttons.SAVE_OVERWRITE_DIALOG_ID)! as SlDialog
    this.saveNewSaveDialog = document.getElementById(Buttons.SAVE_NEW_SAVE_DIALOG_ID)! as SlDialog
    this.saveNewSaveDialogInput = document.getElementById(Buttons.SAVE_NEW_SAVE_DIALOG_INPUT_ID)! as SlInput
  }

  private clickResetButton = async (): Promise<void> => {
    await this.resetDialog.show()
  }

  private resetDialogCancel = async (): Promise<void> => {
    await this.resetDialog.hide()
  }

  private resetDialogConfirm = async (): Promise<void> => {
    this.infoBar.game.eventManager.notifyTowerReset()
    await this.resetDialog.hide()
  }

  private clickLoadButton = async (): Promise<void> => {
    await this.loadDialog.show()
  }

  private loadDialogConfirm = async (): Promise<void> => {
    await this.loadDialog.show()
  }

  private loadDialogCancel = async (): Promise<void> => {
    await this.loadDialog.hide()
  }

  private saveButton(slot: number, playedTowerModel?: PlayedTowerModel): Hole {
    const text =
      playedTowerModel === undefined
        ? "<em>Empty></em>"
        : `${playedTowerModel!.timestamp.toLocaleString()} - ${playedTowerModel!.saveName}`
    return html`<sl-button
      size="small"
      data-slot="${slot}"
      data-model-id="${playedTowerModel?.id}"
      onclick="${this.clickOverwriteSaveButton}"
      >${text}</sl-button
    >`
  }

  private clickOverwriteSaveButton = async (event: CustomEvent): Promise<void> => {
    const data = (event.currentTarget as SlButton).dataset
    const slot = parseInt(data.slot!)
    const playedTowerModelId = data.modelId === undefined ? undefined : parseInt(data.modelId)
  }

  private clickSaveButton = async (): Promise<void> => {
    const playedTowerModels = await this.infoBar.game.database
      .getPlayedTowerTable()
      .list(this.infoBar.game.playedTower!.towerModelId!)
    const maxSlotValue = playedTowerModels[playedTowerModels.length - 1].slot
    const savesContents: Hole[] = []
    for (const playedTowerModel of playedTowerModels) {
      savesContents[playedTowerModel.slot] = this.saveButton(playedTowerModel.slot, playedTowerModel)
    }
    for (let slot = 0; slot <= maxSlotValue; slot++) {
      if (savesContents[slot] === undefined) {
        savesContents[slot] = this.saveButton(slot, undefined)
      }
    }
    render(this.saveDialogSaves, html`${savesContents}`)
    await this.saveDialog.show()
  }

  private saveDialogCancel = async (): Promise<void> => {
    await this.saveDialog.hide()
  }

  private saveDialogCancelNewSave = async (): Promise<void> => {
    await this.saveDialog.hide()
    await this.saveNewSaveDialog.show()
  }

  private saveNewSaveDialogCancel = async (): Promise<void> => {
    await this.saveNewSaveDialog.hide()
    await this.saveDialog.show()
  }

  private saveNewSaveDialogSave = async (): Promise<void> => {
    const saveName = this.saveNewSaveDialogInput.value
    await this.infoBar.game.database.getPlayedTowerTable().saveNew(this.infoBar.game.playedTower!, saveName)
    await this.saveNewSaveDialog.hide()
  }
}
