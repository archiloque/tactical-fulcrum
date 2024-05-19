import { Hole, html } from "uhtml"
import { ROOM_LAYERS, RoomLayer } from "../roomLayer"
import { Editor } from "../../editor"
import SlRadioGroup from "@shoelace-style/shoelace/cdn/components/radio-group/radio-group.component"
import { findEnum } from "../../behavior/functions"

export class TabMapLayer {
  private readonly editor: Editor
  private static readonly radioGroupId = "tabMapLayerRadioGroup"
  private radioGroup: SlRadioGroup

  constructor(editor: Editor) {
    this.editor = editor
  }

  hole(): Hole {
    console.debug("TabMapLayer", "hole")
    return html`<h2>Layer</h2>
      <sl-radio-group
        id="${TabMapLayer.radioGroupId}"
        @sl-change="${this.selectionChanged}"
        value="${RoomLayer.standard.valueOf()}"
      >
        <sl-radio-button value="${RoomLayer.standard.valueOf()}">Standard</sl-radio-button>
        <sl-radio-button value="${RoomLayer.score.valueOf()}">Score</sl-radio-button>
      </sl-radio-group> `
  }

  init(): void {
    console.debug("TabMapLayer", "init")
    this.radioGroup = document.getElementById(TabMapLayer.radioGroupId) as SlRadioGroup
  }

  private selectionChanged = (): void => {
    const layer = findEnum(ROOM_LAYERS, this.radioGroup.value)
    if (layer != null) {
      this.editor.eventManager.notifyLayerSelection(layer)
    }
  }
}
