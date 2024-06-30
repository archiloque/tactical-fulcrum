import { Hole, html } from "uhtml"
import { ROOM_LAYERS, RoomLayer } from "../room-layer"
import { Editor } from "../../editor"
import { findEnum } from "../../../common/models/functions"
import SlRadioGroup from "@shoelace-style/shoelace/cdn/components/radio-group/radio-group.component"

export class Layer {
  private static readonly RADIO_GROUP_ID = "tabMapLayerRadioGroup"

  private readonly editor: Editor
  private radioGroup: SlRadioGroup

  constructor(editor: Editor) {
    this.editor = editor
  }

  hole(): Hole {
    console.debug("Layer", "hole")
    return html`<h2>Layer</h2>
      <sl-radio-group
        id="${Layer.RADIO_GROUP_ID}"
        @sl-change="${this.selectionChanged}"
        value="${RoomLayer.standard.valueOf()}"
      >
        <sl-radio-button value="${RoomLayer.standard.valueOf()}">Standard</sl-radio-button>
        <sl-radio-button value="${RoomLayer.score.valueOf()}">Score</sl-radio-button>
      </sl-radio-group> `
  }

  init(): void {
    console.debug("Layer", "init")
    this.radioGroup = document.getElementById(Layer.RADIO_GROUP_ID) as SlRadioGroup
  }

  private selectionChanged = (): void => {
    const layer = findEnum(ROOM_LAYERS, this.radioGroup.value)
    if (layer != null) {
      this.editor.eventManager.notifyLayerSelection(layer)
    }
  }
}
