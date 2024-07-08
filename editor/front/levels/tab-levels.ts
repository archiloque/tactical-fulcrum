import { Hole, html, render } from "uhtml"
import { LEVEL_TYPES, LevelType } from "../../../common/data/level-type"
import { AbstractTab } from "../abstract-tab"
import { DefaultIconsName } from "../../../common/front/icons/default-icons"
import { Editor } from "../../editor"
import { Level } from "../../../common/models/level"
import SlTabPanel from "@shoelace-style/shoelace/cdn/components/tab-panel/tab-panel.component"
import { Tab } from "../tab"

export class TabLevels extends AbstractTab {
  private readonly editor: Editor
  private readonly tabElement: SlTabPanel
  private levelDeletionIndex = -1

  constructor(editor: Editor) {
    super()
    this.editor = editor
    this.tabElement = document.getElementById(Tab.level) as SlTabPanel
  }

  private renderLevel(level: Level, levelIndex: number): Hole {
    const levelTypes = LEVEL_TYPES.map(
      (levelType: string, index: number) => html` <sl-option value="${index}">${levelType}</sl-option>`,
    )

    const typeValue = level.type == null ? null : LEVEL_TYPES.indexOf(level.type)

    return html`<div data-index="${levelIndex}" class="elementLine">
      <sl-select @sl-input="${this.typeChange}" class="wide" placeholder="Type" hoist value="${typeValue}" required>
        ${levelTypes}
      </sl-select>
      ${this.numberInput(level.add, this.addChange, 0, "Add")} ${this.numberInput(level.mul, this.mulChange, 1, "Mul")}
      <sl-button onclick="${this.deleteLevel}" variant="danger" class="delete">
        <sl-icon name="${DefaultIconsName.TRASH}"></sl-icon>
      </sl-button>
    </div>`
  }

  render(): void {
    console.debug("TabLevels", "render")
    render(
      this.tabElement,
      html`
        <div class="elementLine validity-styles">
          <sl-tag class="wide" variant="neutral" size="large">Type</sl-tag>
          ${this.tag("Add")} ${this.tag("Mul")} ${this.tag("Delete", "delete")}
        </div>
        ${this.editor.tower.levels.map((level: Level, levelIndex: number) => this.renderLevel(level, levelIndex))}
        <div class="addButtonDiv">
          <sl-button variant="primary" onclick="${this.addLevel}">
            <sl-icon name="${DefaultIconsName.PLUS_CIRCLE}"></sl-icon>
          </sl-button>
        </div>
      `,
    )
  }

  private addLevel = (): void => {
    console.debug("TabLevels", "add level")
    this.editor.tower.levels.push(new Level())
    this.render()
    this.editor.tower.saveLevels()
  }

  private deleteLevel = async (event: PointerEvent): Promise<any> => {
    this.levelDeletionIndex = parseInt(
      // @ts-ignore
      event.currentTarget.parentElement.dataset.index,
    )
    this.editor.tower.deleteLevel(this.editor.tower.levels[this.levelDeletionIndex])
    this.render()
  }

  private typeChange = (event: CustomEvent): void => {
    const [levelIndex, value] = this.getInputValueFromList(event)
    const type = LEVEL_TYPES[parseInt(value)] as LevelType
    this.editor.tower.levels[levelIndex].type = type
    this.editor.tower.saveEnemies()
  }

  private addChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "add")
  }

  private mulChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "mul")
  }

  private intValueChanged = (event: CustomEvent, attrName: string): void => {
    const [levelIndex, value] = this.getInputValueInt(event)
    console.debug("TabLevels", "intValueChanged", levelIndex, attrName, value)
    this.editor.tower.levels[levelIndex][attrName] = value
    this.editor.tower.saveLevels()
  }
}
