import { html, render } from "uhtml"
import { AbstractTab } from "../abstract-tab"
import { Editor } from "../../editor"
import SlInput from "@shoelace-style/shoelace/cdn/components/input/input.component"
import SlTabPanel from "@shoelace-style/shoelace/cdn/components/tab-panel/tab-panel.component"
import { Tab } from "../tab"

export class TabInfo extends AbstractTab {
  private readonly editor: Editor
  private readonly tabInfo: SlTabPanel

  constructor(editor: Editor) {
    super()
    this.editor = editor
    this.tabInfo = document.getElementById(Tab.info) as SlTabPanel
  }

  render(): void {
    console.debug("TabInfo", "render")
    render(
      this.tabInfo,
      html`
        <sl-input
          @sl-input=${this.nameChange}
          pattern=".+"
          value="${this.editor.tower.name}"
          required
          label="Tower name"
        ></sl-input>

        ${this.numberInput(this.editor.tower.info.atk, this.atkChange, 0, "Atk", null, "Atk")}
        ${this.numberInput(this.editor.tower.info.def, this.defChange, 0, "Def", null, "Def")}
        ${this.numberInput(this.editor.tower.info.hp, this.hpChange, 1, "HP", null, "HP")}
        ${this.numberInput(
          this.editor.tower.info.bronzeMedal,
          this.bronzeMedalChange,
          1,
          "Bronze medal",
          null,
          "Bronze Medal",
        )}
        ${this.numberInput(
          this.editor.tower.info.silverMedal,
          this.silverMedalChange,
          1,
          "Silver medal",
          null,
          "Silver medal",
        )}
        ${this.numberInput(this.editor.tower.info.goldMedal, this.goldMedalChange, 1, "Gold medal", null, "Gold medal")}
        ${this.numberInput(
          this.editor.tower.info.platinumMedal,
          this.platinumMedalChange,
          1,
          "Platinum medal",
          null,
          "Platinum medal",
        )}
        ${this.numberInput(
          this.editor.tower.info.diamondMedal,
          this.diamondMedalChange,
          1,
          "Diamond medal",
          null,
          "Diamond medal",
        )}
        ${this.numberInput(this.editor.tower.info.moonMedal, this.moonMedalChange, 1, "Moon medal", null, "Moon medal")}
      `,
    )
  }

  private nameChange = (event: CustomEvent): void => {
    const name = (event.currentTarget as SlInput).value
    this.editor.tower.name = name
    this.editor.tower.saveName()
  }

  private atkChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.info.atk = parseInt(atk)
    this.editor.tower.saveInfo()
  }

  private defChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.info.def = parseInt(atk)
    this.editor.tower.saveInfo()
  }

  private hpChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.info.hp = parseInt(atk)
    this.editor.tower.saveInfo()
  }

  private bronzeMedalChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.info.bronzeMedal = parseInt(atk)
    this.editor.tower.saveInfo()
  }

  private silverMedalChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.info.silverMedal = parseInt(atk)
    this.editor.tower.saveInfo()
  }

  private goldMedalChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.info.goldMedal = parseInt(atk)
    this.editor.tower.saveInfo()
  }

  private platinumMedalChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.info.platinumMedal = parseInt(atk)
    this.editor.tower.saveInfo()
  }

  private diamondMedalChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.info.diamondMedal = parseInt(atk)
    this.editor.tower.saveInfo()
  }

  private moonMedalChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.info.moonMedal = parseInt(atk)
    this.editor.tower.saveInfo()
  }
}
