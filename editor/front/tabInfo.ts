import { html, render } from "uhtml"
import { Editor } from "../../editor"
import SlInput from "@shoelace-style/shoelace/cdn/components/input/input.component"
import SlTabPanel from "@shoelace-style/shoelace/cdn/components/tab-panel/tab-panel.component"
import { Tab } from "./tab"

export class TabInfo {
  private readonly editor: Editor
  private readonly tabInfo: SlTabPanel

  constructor(editor: Editor) {
    this.editor = editor
    this.tabInfo = document.getElementById(Tab.info) as SlTabPanel
  }

  render(): void {
    console.debug("TabInfo", "render")
    render(
      this.tabInfo,
      html` <sl-tag variant="neutral" size="large">Tower name</sl-tag>
        <sl-input @sl-input=${this.nameChange} pattern=".+" required></sl-input>`,
    )
  }

  private nameChange = (event: CustomEvent): void => {
    const name = (event.currentTarget as SlInput).value
    this.editor.tower.name = name
    this.editor.tower.saveName()
  }
}
