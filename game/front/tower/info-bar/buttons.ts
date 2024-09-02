import { Hole, html } from "uhtml"
import { InfoBar } from "./info-bar"
import SlDialog from "@shoelace-style/shoelace/cdn/components/dialog/dialog.component"

export class Buttons {
  private static readonly REST_LEVEL_DIALOG_ID = "screenTowerButtonsResetLevelDialog"

  private infoBar: InfoBar
  // @ts-ignore
  private resetDialog: SlDialog

  constructor(infoBar: InfoBar) {
    this.infoBar = infoBar
  }

  render(): Hole {
    return html`<sl-dialog label="Reset level" id="${Buttons.REST_LEVEL_DIALOG_ID}">
        Are you sure you want to reset the level?
        <div slot="footer">
          <sl-button onclick="${this.resetLevelDialogCancel}" variant="neutral">No </sl-button>
          <sl-button onclick="${this.resetLevelDialogConfirm}" variant="danger">Yes </sl-button>
        </div>
      </sl-dialog>
      <div id="screenTowerInfoButtons">
        <div>
          <sl-tooltip content="Reset the level to its initial state">
            <sl-button size="small" onclick="${this.clickResetLevel}"
              ><sl-icon library="tf" name="fast-backward"></sl-icon
            ></sl-button>
          </sl-tooltip>
        </div>
      </div>`
  }

  postRender(): void {
    this.resetDialog = document.getElementById(Buttons.REST_LEVEL_DIALOG_ID)! as SlDialog
  }

  private clickResetLevel = async (): Promise<void> => {
    await this.resetDialog.show()
  }

  private resetLevelDialogCancel = async (): Promise<void> => {
    await this.resetDialog.hide()
  }

  private resetLevelDialogConfirm = async (): Promise<void> => {
    this.infoBar.game.eventManager.notifyTowerReset()
    await this.resetDialog.hide()
  }
}
