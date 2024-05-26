import { Hole, html, render } from "uhtml"
import { Editor } from "../editor"
import { Tab } from "./tab"

export class MainMenu {
  private readonly editor: Editor
  private static readonly tabNames = [
    [Tab.map, "Maps"],
    [Tab.enemy, "Enemies"],
    [Tab.level, "Levels"],
    [Tab.info, "Info"],
    [Tab.importExport, "Import/Export"],
  ]

  constructor(editor: Editor) {
    this.editor = editor

    const tabs: Hole[] = MainMenu.tabNames.map(
      (it) => html` <sl-tab slot="nav" panel="${it[0].valueOf()}">${it[1]}</sl-tab>`,
    )
    const tabPanels: Hole[] = MainMenu.tabNames.map(
      (it) => html` <sl-tab-panel id="${it[0].valueOf()}" name="${it[0].valueOf()}">${it[1]}</sl-tab-panel>`,
    )
    render(
      document.getElementById("content"),
      html` <sl-tab-group @sl-tab-show="${this.tabShown}"> ${tabs} ${tabPanels} </sl-tab-group> `,
    )
  }

  private tabShown = async (event: CustomEvent): Promise<any> => {
    const tab: string = event.detail.name
    console.debug("MainMenu: tab", tab, "shown")
    return this.editor.tabShown(tab as Tab)
  }
}
