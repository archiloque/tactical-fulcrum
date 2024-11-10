import { Hole, html } from "uhtml"
import { ButtonsSaveLoad } from "./buttons/buttons-save-load"
import { InfoBar } from "./info-bar"
import { MonochromeCustomIconsName } from "../../../../common/front/icons/monochrome-custom-icons"

export class Buttons {
  readonly infoBar: InfoBar
  private readonly buttonsSaveLoad: ButtonsSaveLoad

  constructor(infoBar: InfoBar) {
    this.infoBar = infoBar
    this.buttonsSaveLoad = new ButtonsSaveLoad(this)
  }

  content(): Hole {
    console.debug("Buttons", "content")
    return html`<div id="screenTowerInfoButtons">
      ${Buttons.button(MonochromeCustomIconsName.BACKWARD, "Undo move", this.clickResetButton)}
      ${Buttons.button(MonochromeCustomIconsName.FORWARD, "Redo move", this.clickResetButton)}
      ${Buttons.button(
        MonochromeCustomIconsName.FAST_BACKWARD,
        "Reset the game to its initial state",
        this.clickResetButton,
      )}
      ${this.buttonsSaveLoad.content()}
    </div>`
  }

  public static button(icon: MonochromeCustomIconsName, tooltip: string, action: () => Promise<void>): Hole {
    return html`
      <div>
        <sl-tooltip content="${tooltip}">
          <sl-button size="small" onclick="${action}"><sl-icon library="tf" name="${icon}"></sl-icon></sl-button>
        </sl-tooltip>
      </div>
    `
  }

  private clickResetButton = async (): Promise<void> => {
    await this.infoBar.game.showDialog(
      html`<sl-dialog label="Reset">
        Are you sure you want to reset your game?
        <div slot="footer">
          <sl-button onclick="${this.resetDialogCancel}" variant="neutral">No </sl-button>
          <sl-button onclick="${this.resetDialogConfirm}" variant="danger">Yes </sl-button>
        </div>
      </sl-dialog>`,
    )
  }

  private resetDialogCancel = async (): Promise<void> => {
    await this.infoBar.game.hideDialog()
  }

  private resetDialogConfirm = async (): Promise<void> => {
    this.infoBar.game.eventManager.notifyTowerReset()
    await this.infoBar.game.hideDialog()
  }
}
