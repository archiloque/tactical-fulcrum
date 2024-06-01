import { Hole, html, render } from "uhtml"
import { ITEM_NAMES, ItemName } from "../../data/item-name"
import { AbstractTab } from "../abstract-tab"
import { DEFAULT_ITEMS } from "../../data/item"
import { Editor } from "../../editor"
import SlTabPanel from "@shoelace-style/shoelace/cdn/components/tab-panel/tab-panel.component"
import { Tab } from "../tab"

export class TabItems extends AbstractTab {
  private readonly editor: Editor
  private readonly tabElement: SlTabPanel

  constructor(editor: Editor) {
    super()
    this.editor = editor
    this.tabElement = document.getElementById(Tab.item) as SlTabPanel
  }

  private renderField(value: number, defaultValue: number, callback: (event: CustomEvent) => void): Hole {
    const realValue = value === defaultValue ? null : value
    return html` <sl-input
      @sl-input="${callback}"
      type="number"
      min="0"
      pattern="[0-9]+"
      placeholder="${defaultValue}"
      no-spin-buttons
      value="${realValue}"
    ></sl-input>`
  }

  private renderItem(itemName: ItemName, itemIndex: number): Hole {
    const item = this.editor.tower.items[itemName]
    const defaultItem = DEFAULT_ITEMS[itemName]
    return html` <div data-index="${itemIndex}" class="elementLine">
      ${this.tag(itemName, "name")} ${this.renderField(item.atk, defaultItem.atk, this.atkChange)}
      ${this.renderField(item.def, defaultItem.def, this.defChange)}
      ${this.renderField(item.hp, defaultItem.hp, this.hpChange)}
      ${this.renderField(item.expMulAdd, defaultItem.expMulAdd, this.expMulAddChange)}
      ${this.renderField(item.expMulMul, defaultItem.expMulMul, this.expMulMulChange)}
      ${this.renderField(item.hpMulAdd, defaultItem.hpMulAdd, this.hpMulAddChange)}
      ${this.renderField(item.hpMulMul, defaultItem.hpMulMul, this.hpMulMulChange)}
    </div>`
  }

  render(): void {
    console.debug("TabItems", "render")
    render(
      this.tabElement,
      html`
        <div class="elementLine validity-styles">
          ${this.tag("Name", "name")} ${this.tag("Atk")} ${this.tag("Def")} ${this.tag("HP")} ${this.tag("Exp mul add")}
          ${this.tag("Exp mul mul")} ${this.tag("HP mul add")} ${this.tag("HP mul mul")}
        </div>
        ${ITEM_NAMES.map((itemName: ItemName, itemIndex: number) => this.renderItem(itemName, itemIndex))}
      `,
    )
  }

  private atkChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "atk")
  }

  private defChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "def")
  }

  private hpChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "hp")
  }

  private expMulAddChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "expMulAdd")
  }

  private expMulMulChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "expMulMul")
  }

  private hpMulAddChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "hpMulAdd")
  }

  private hpMulMulChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "hpMulMul")
  }

  private intValueChanged = (event: CustomEvent, attrName: string): void => {
    const [itemIndex, value] = this.getInputValueInt(event)
    console.debug("TabItems", "intValueChanged", itemIndex, attrName, value)
    this.editor.tower.items[ITEM_NAMES[itemIndex]][attrName] = value
    this.editor.tower.saveItems()
  }
}
