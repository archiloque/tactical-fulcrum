import { Hole, html } from "uhtml"
import { InfoBar } from "./info-bar"
import { MonochromeCustomIconsName } from "../../../../common/front/icons/monochrome-custom-icons"
import SlDialog from "@shoelace-style/shoelace/cdn/components/dialog/dialog.component"
import SlInput from "@shoelace-style/shoelace/cdn/components/input/input.component"

export class Buttons {
  private static readonly LOAD_LEVEL_DIALOG_ID = "screenTowerButtonsLoadLevelDialog"
  private static readonly RESET_LEVEL_DIALOG_ID = "screenTowerButtonsResetLevelDialog"
  private static readonly SAVE_LEVEL_DIALOG_ID = "screenTowerButtonsSaveLevelDialog"
  private static readonly SAVE_LEVEL_NEW_SAVE_DIALOG_ID = "screenTowerButtonsSaveLeveNewSaveDialog"
  private static readonly SAVE_LEVEL_NEW_SAVE_DIALOG_INPUT_ID = "screenTowerButtonsSaveLeveNewSaveDialogInput"

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

  constructor(infoBar: InfoBar) {
    this.infoBar = infoBar
  }

  content(): Hole {
    return html`<sl-dialog label="Reset level" id="${Buttons.RESET_LEVEL_DIALOG_ID}">
        Are you sure you want to reset the level?
        <div slot="footer">
          <sl-button onclick="${this.resetLevelDialogCancel}" variant="neutral">No </sl-button>
          <sl-button onclick="${this.resetLevelDialogConfirm}" variant="danger">Yes </sl-button>
        </div>
      </sl-dialog>
      <sl-dialog label="Load level" id="${Buttons.LOAD_LEVEL_DIALOG_ID}">
        <div slot="footer">
          <sl-button onclick="${this.loadLevelDialogCancel}" variant="neutral">Cancel </sl-button>
          <sl-button onclick="${this.loadLevelDialogConfirm}" variant="danger">Yes </sl-button>
        </div>
      </sl-dialog>

      <sl-dialog label="Save level" id="${Buttons.SAVE_LEVEL_DIALOG_ID}">
        <div slot="footer">
          <sl-button variant="primary" onclick="${this.saveLevelDialogCancelNewSave}">New save </sl-button>
          <sl-button onclick="${this.saveLevelDialogCancel}" variant="neutral">Cancel </sl-button>
        </div>
      </sl-dialog>
      <sl-dialog label="New save" id="${Buttons.SAVE_LEVEL_NEW_SAVE_DIALOG_ID}">
        <sl-input type="text" placeholder="Save name" id="${Buttons.SAVE_LEVEL_NEW_SAVE_DIALOG_INPUT_ID}"></sl-input>
        <div slot="footer">
          <sl-button variant="primary" onclick="${this.saveLevelNewSaveDialogSave}">Save </sl-button>
          <sl-button onclick="${this.saveLevelNewSaveDialogCancel}" variant="neutral">Cancel </sl-button>
        </div>
      </sl-dialog>

      <div id="screenTowerInfoButtons">
        ${this.button(
          MonochromeCustomIconsName.FAST_BACKWARD,
          "Reset the level to its initial state",
          this.clickResetLevelButton,
        )}
        ${this.button(MonochromeCustomIconsName.LOAD, "Load level", this.clickLoadLevelButton)}
        ${this.button(MonochromeCustomIconsName.SAVE, "Save level", this.clickSaveLevelButton)}
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
    this.loadDialog = document.getElementById(Buttons.LOAD_LEVEL_DIALOG_ID)! as SlDialog
    this.resetDialog = document.getElementById(Buttons.RESET_LEVEL_DIALOG_ID)! as SlDialog
    this.saveDialog = document.getElementById(Buttons.SAVE_LEVEL_DIALOG_ID)! as SlDialog
    this.saveNewSaveDialog = document.getElementById(Buttons.SAVE_LEVEL_NEW_SAVE_DIALOG_ID)! as SlDialog
    this.saveNewSaveDialogInput = document.getElementById(Buttons.SAVE_LEVEL_NEW_SAVE_DIALOG_INPUT_ID)! as SlInput
  }

  private clickResetLevelButton = async (): Promise<void> => {
    await this.resetDialog.show()
  }

  private resetLevelDialogCancel = async (): Promise<void> => {
    await this.resetDialog.hide()
  }

  private resetLevelDialogConfirm = async (): Promise<void> => {
    this.infoBar.game.eventManager.notifyTowerReset()
    await this.resetDialog.hide()
  }

  private clickLoadLevelButton = async (): Promise<void> => {
    await this.loadDialog.show()
  }

  private loadLevelDialogConfirm = async (): Promise<void> => {
    await this.loadDialog.show()
  }

  private loadLevelDialogCancel = async (): Promise<void> => {
    await this.loadDialog.hide()
  }

  private clickSaveLevelButton = async (): Promise<void> => {
    await this.saveDialog.show()
  }

  private saveLevelDialogCancel = async (): Promise<void> => {
    await this.saveDialog.hide()
  }

  private saveLevelDialogCancelNewSave = async (): Promise<void> => {
    await this.saveDialog.hide()
    await this.saveNewSaveDialog.show()
  }

  private saveLevelNewSaveDialogCancel = async (): Promise<void> => {
    await this.saveNewSaveDialog.hide()
    await this.saveDialog.show()
  }

  private saveLevelNewSaveDialogSave = async (): Promise<void> => {
    const saveName = this.saveNewSaveDialogInput.value
    await this.infoBar.game.database.getPlayedTowerTable().saveNew(this.infoBar.game.playedTower!, saveName)
    await this.saveNewSaveDialog.hide()
  }
}
