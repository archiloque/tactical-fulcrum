import { ENEMY_TYPES, EnemyType } from "../data/enemyType"
import { Hole, html, render } from "uhtml"
import { AbstractTab } from "./abstractTab"
import { DROPS } from "../data/drop"
import { Editor } from "../editor"
import { Enemy } from "../behavior/enemy"
import { Item } from "../data/item"
import SlDialog from "@shoelace-style/shoelace/cdn/components/dialog/dialog.component"
import SlSelect from "@shoelace-style/shoelace/cdn/components/select/select.component"
import SlTabPanel from "@shoelace-style/shoelace/cdn/components/tab-panel/tab-panel.component"
import { Tab } from "./tab"

export class TabEnemies extends AbstractTab {
  private static readonly deleteDialogId = "tabEnemiesDeleteDialog"
  private static readonly deleteDialogMessageId = "tabEnemiesDeleteDialogMessage"

  private readonly editor: Editor
  private readonly tabElement: SlTabPanel
  private enemyDeletionIndex = -1
  private deleteDialog: SlDialog
  private deleteDialogMessage: HTMLElement

  constructor(editor: Editor) {
    super()
    this.editor = editor
    this.tabElement = document.getElementById(Tab.enemy) as SlTabPanel
  }

  private renderEnemy(enemy: Enemy, enemyIndex: number): Hole {
    const drops: Hole[] = DROPS.map(
      (item: string, index: number) =>
        html` <sl-option value="${index}">${item == null ? "<Nothing>" : item}</sl-option>`,
    )
    const dropValue = DROPS.indexOf(enemy.drop)
    const enemyTypes = ENEMY_TYPES.map(
      (enemyType: string) => html` <sl-option value="${enemyType}">${enemyType}</sl-option>`,
    )
    return html` <div data-index="${enemyIndex}" class="elementLine">
      <sl-select @sl-input="${this.typeChange}" class="wide" placeholder="Type" hoist value="${enemy.type}" required>
        ${enemyTypes}
      </sl-select>
      ${this.numberInput(enemy.level, this.levelChange, 1, "Lvl", "narrow")}
      <sl-input
        @sl-input="${this.nameChange}"
        minlength="1"
        class="wide"
        type="text"
        placeholder="Name"
        value="${enemy.name}"
        required
      ></sl-input>
      ${this.numberInput(enemy.hp, this.hpChange, 1, "HP")} ${this.numberInput(enemy.atk, this.atkChange, 0, "Atk")}
      ${this.numberInput(enemy.def, this.defChange, 0, "Def")} ${this.numberInput(enemy.exp, this.expChange, 0, "Exp")}
      <sl-select @sl-input="${this.dropChange}" class="wide" placeholder="Drop" hoist value="${dropValue}" required>
        ${drops}
      </sl-select>

      <sl-button onclick="${this.deleteEnemy}" variant="danger" class="delete">
        <sl-icon name="trash"></sl-icon>
      </sl-button>
    </div>`
  }

  render(): void {
    console.debug("TabEnemies", "render")
    render(
      this.tabElement,
      html`
        <div class="elementLine validity-styles">
          <sl-tag class="wide" variant="neutral" size="large">Type</sl-tag>
          ${this.tag("Lv", "narrow")} ${this.tag("Name", "wide")} ${this.tag("HP")} ${this.tag("Atk")}
          ${this.tag("Def")} ${this.tag("Exp")} ${this.tag("Drop", "wide")} ${this.tag("Delete", "delete")}
        </div>
        ${this.editor.tower.enemies.map((enemy: Enemy, enemyIndex: number) => this.renderEnemy(enemy, enemyIndex))}
        <div class="addButtonDiv">
          <sl-button variant="primary" onclick="${this.addEnemy}">
            <sl-icon name="plus-circle"></sl-icon>
          </sl-button>
        </div>
        <sl-dialog label="Delete enemy" id="${TabEnemies.deleteDialogId}">
          <div id="${TabEnemies.deleteDialogMessageId}"></div>
          <div slot="footer">
            <sl-button onclick="${this.deleteDialogCancel}" variant="neutral">No</sl-button>
            <sl-button onclick="${this.deleteDialogConfirm}" variant="danger">Yes</sl-button>
          </div>
        </sl-dialog>
      `,
    )
    this.deleteDialog = document.getElementById(TabEnemies.deleteDialogId) as SlDialog
    this.deleteDialogMessage = document.getElementById(TabEnemies.deleteDialogMessageId)
  }

  private addEnemy = (): void => {
    console.debug("TabEnemies", "add enemy")
    this.editor.tower.enemies.push(new Enemy())
    this.render()
    this.editor.tower.saveEnemies()
  }

  private deleteEnemy = async (event: PointerEvent): Promise<any> => {
    this.enemyDeletionIndex = parseInt(
      // @ts-ignore
      event.currentTarget.parentElement.dataset.index,
    )
    const enemiesCount = this.editor.tower.countEnemies(this.editor.tower.enemies[this.enemyDeletionIndex])
    const dialogMessage = `Are you sure you want to delete this enemy? ${enemiesCount == 0 ? "It is currently unused." : `It is currently used ${enemiesCount} time(s), deleting it will remove it from the map(s).`}`
    this.deleteDialogMessage.innerText = dialogMessage
    return this.deleteDialog.show()
  }

  private deleteDialogConfirm = async (): Promise<any> => {
    this.deleteDialog.hide().then(() => {
      this.editor.tower.deleteEnemy(this.editor.tower.enemies[this.enemyDeletionIndex])
      this.render()
    })
  }

  private deleteDialogCancel = async (): Promise<any> => {
    return this.deleteDialog.hide()
  }

  private intValueChanged = (event: CustomEvent, attrName: string): void => {
    const [enemyIndex, value] = this.getInputValueInt(event)
    console.debug("TabEnemies", "intValueChanged", enemyIndex, attrName, value)
    this.editor.tower.enemies[enemyIndex][attrName] = value
    this.editor.tower.saveEnemies()
  }

  private atkChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "atk")
  }

  private defChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "def")
  }

  private expChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "exp")
  }

  private hpChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "hp")
  }

  private levelChange = (event: CustomEvent): void => {
    this.intValueChanged(event, "level")
  }

  private nameChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValue(event)
    console.debug("TabEnemies", "nameChange", enemyIndex, value)
    this.editor.tower.enemies[enemyIndex].name = value === "" ? null : value
    this.editor.tower.saveEnemies()
  }

  private typeChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValueFromList(event)
    console.debug("TabEnemies", "typeChange", enemyIndex, value)
    this.editor.tower.enemies[enemyIndex].type = value === "" ? null : (value as EnemyType)
    this.editor.tower.saveEnemies()
  }

  private dropChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValueFromList(event)
    const drop = DROPS[parseInt(value)] as Item
    console.debug("TabEnemies", "dropChange", enemyIndex, drop)
    this.editor.tower.enemies[enemyIndex].drop = drop
    this.editor.tower.saveEnemies()
  }

  private getInputValueFromList = (event: CustomEvent): [number, string] => {
    const currentTarget = event.currentTarget as SlSelect
    const enemyIndex = parseInt((currentTarget.parentElement as HTMLElement).dataset.index)
    return [enemyIndex, currentTarget.value as string]
  }
}
