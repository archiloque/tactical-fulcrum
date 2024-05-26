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
        ${this.numberInput(this.editor.tower.startingStats.atk, this.atkChange, 0, "Atk", null, "Atk")}
        ${this.numberInput(this.editor.tower.startingStats.def, this.defChange, 0, "Def", null, "Def")}
        ${this.numberInput(this.editor.tower.startingStats.hp, this.hpChange, 1, "HP", null, "HP")}
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
    this.editor.tower.startingStats.atk = parseInt(atk)
    this.editor.tower.saveStartingStats()
  }

  private defChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.startingStats.def = parseInt(atk)
    this.editor.tower.saveStartingStats()
  }

  private hpChange = (event: CustomEvent): void => {
    const atk = (event.currentTarget as SlInput).value
    this.editor.tower.startingStats.hp = parseInt(atk)
    this.editor.tower.saveStartingStats()
  }
}
