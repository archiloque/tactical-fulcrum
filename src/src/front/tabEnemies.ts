import { Editor } from "../../editor"
import { Enemy } from "../behavior/enemy"
import { Hole, html, render } from "uhtml"
import { ENEMY_TYPES, EnemyType } from "../data/enemyType"
import { Tab } from "./tab"
import { Tower } from "../behavior/tower"
import { DROPS } from "../data/drop"
import SlDialog from "@shoelace-style/shoelace/cdn/components/dialog/dialog.component"
import SlInput from "@shoelace-style/shoelace/cdn/components/input/input.component"

export class TabEnemies {
  private readonly editor: Editor
  private readonly tabElement: HTMLElement
  private readonly tower: Tower
  private enemyDeletionIndex = -1
  private deleteDialog: SlDialog
  private deleteDialogMessage: HTMLElement

  constructor(editor: Editor) {
    this.editor = editor
    this.tabElement = document.getElementById(Tab.enemies)
    this.tower = this.editor.tower
  }

  private renderEnemy(enemy: Enemy, enemyIndex: number): Hole {
    const drops: Hole[] = DROPS.map(
      (item: string, index: number) =>
        html` <sl-option value="${index + 1}">${item == null ? "<Nothing>" : item}</sl-option>`,
    )
    const dropValue = DROPS.indexOf(enemy.drop)
    const enemyTypes = ENEMY_TYPES.map(
      (enemyType: string) => html` <sl-option value="${enemyType}">${enemyType}</sl-option>`,
    )
    return html` <div data-index="${enemyIndex}" class="enemyLine">
      <sl-select @sl-input="${this.typeChange}" class="type" placeholder="Type" hoist value="${enemy.type}" required>
        ${enemyTypes}
      </sl-select>
      <sl-input
        @sl-input="${this.roomChange}"
        class="room"
        type="number"
        min="1"
        pattern="[0-9]+"
        placeholder="Lv"
        no-spin-buttons
        value="${enemy.level}"
        required
      ></sl-input>
      <sl-input
        @sl-input="${this.nameChange}"
        minlength="1"
        class="name"
        type="text"
        placeholder="Name"
        value="${enemy.name}"
        required
      ></sl-input>
      <sl-input
        @sl-input="${this.hpChange}"
        type="number"
        min="1"
        pattern="[0-9]+"
        placeholder="HP"
        no-spin-buttons
        value="${enemy.hp}"
        required
      ></sl-input>
      <sl-input
        @sl-input="${this.atkChange}"
        type="number"
        min="1"
        pattern="[0-9]+"
        placeholder="Atk"
        no-spin-buttons
        value="${enemy.atk}"
        required
      ></sl-input>
      <sl-input
        @sl-input="${this.defChange}"
        type="number"
        min="1"
        pattern="[0-9]+"
        placeholder="Def"
        no-spin-buttons
        value="${enemy.def}"
        required
      ></sl-input>
      <sl-input
        @sl-input="${this.expChange}"
        type="number"
        min="1"
        pattern="[0-9]+"
        placeholder="Exp"
        no-spin-buttons
        value="${enemy.exp}"
        required
      ></sl-input>
      <sl-select @sl-input="${this.dropChange}" class="drop" placeholder="Drop" hoist value="${dropValue}" required>
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
        <div class="enemyLine validity-styles">
          <sl-tag class="type" variant="neutral" size="large">Type</sl-tag>
          <sl-tag variant="neutral" class="room" size="large">Lv</sl-tag>
          <sl-tag variant="neutral" class="name" size="large">Name</sl-tag>
          <sl-tag variant="neutral" size="large">HP</sl-tag>
          <sl-tag variant="neutral" size="large">Atk</sl-tag>
          <sl-tag variant="neutral" size="large">Def</sl-tag>
          <sl-tag variant="neutral" size="large">Exp</sl-tag>
          <sl-tag variant="neutral" class="drop" size="large">Drop</sl-tag>
          <sl-tag variant="neutral" class="delete" size="large">Delete</sl-tag>
        </div>
        ${this.tower.enemies.map((enemy: Enemy, enemyIndex: number) => this.renderEnemy(enemy, enemyIndex))}
        <div class="addButtonDiv">
          <sl-button variant="primary" onclick="${this.addEnemy}">
            <sl-icon name="plus-circle"></sl-icon>
          </sl-button>
        </div>
        <sl-dialog label="Delete enemy" id="tabEnemiesDeleteDialog">
          <div id="tabEnemiesDeleteDialogMessage"></div>
          <div slot="footer">
            <sl-button onclick="${this.deleteDialogCancel}" variant="neutral">No</sl-button>
            <sl-button onclick="${this.deleteDialogConfirm}" variant="danger">Yes</sl-button>
          </div>
        </sl-dialog>
      `,
    )
    this.deleteDialog = <SlDialog>document.getElementById("tabEnemiesDeleteDialog")
    this.deleteDialogMessage = document.getElementById("tabEnemiesDeleteDialogMessage")
  }

  private addEnemy = (): void => {
    console.debug("TabEnemies", "add enemy")
    this.tower.enemies.push(new Enemy())
    this.render()
    this.editor.tower.saveEnemies()
  }

  private deleteEnemy = async (event: PointerEvent): Promise<any> => {
    this.enemyDeletionIndex = parseInt(
      // @ts-ignore
      event.currentTarget.parentElement.dataset.index,
    )
    const enemiesCount = this.editor.tower.countEnemies(this.tower.enemies[this.enemyDeletionIndex])
    const dialogMessage = `Are you sure you want to delete this enemy? ${enemiesCount == 0 ? "It is currently unused." : `It is currently used ${enemiesCount} time(s), deleting it will remove it from the map(s).`}`
    this.deleteDialogMessage.innerText = dialogMessage
    await this.deleteDialog.show()
  }

  private deleteDialogConfirm = async (): Promise<any> => {
    await this.deleteDialog.hide()
    this.tower.deleteEnemy(this.tower.enemies[this.enemyDeletionIndex])
    this.render()
  }

  private deleteDialogCancel = async (): Promise<any> => {
    await this.deleteDialog.hide()
  }

  private atkChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValueInt(event)
    console.debug("TabEnemies", "atkChange", enemyIndex, value)
    this.tower.enemies[enemyIndex].atk = value
    this.editor.tower.saveEnemies()
  }

  private defChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValueInt(event)
    console.debug("TabEnemies", "defChange", enemyIndex, value)
    this.tower.enemies[enemyIndex].def = value
    this.editor.tower.saveEnemies()
  }

  private expChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValueInt(event)
    console.debug("TabEnemies", "expChange", enemyIndex, value)
    this.tower.enemies[enemyIndex].exp = value
    this.editor.tower.saveEnemies()
  }

  private hpChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValueInt(event)
    console.debug("TabEnemies", "hpChange", enemyIndex, value)
    this.tower.enemies[enemyIndex].hp = value
    this.editor.tower.saveEnemies()
  }

  private roomChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValueInt(event)
    console.debug("TabEnemies", "roomChange", enemyIndex, value)
    this.tower.enemies[enemyIndex].level = value
    this.editor.tower.saveEnemies()
  }

  private nameChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValue(event)
    console.debug("TabEnemies", "nameChange", enemyIndex, value)
    this.tower.enemies[enemyIndex].name = value === "" ? null : value
    this.editor.tower.saveEnemies()
  }

  private typeChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValue(event)
    console.debug("TabEnemies", "typeChange", enemyIndex, value)
    this.tower.enemies[enemyIndex].type = value === "" ? null : <EnemyType>value
    this.editor.tower.saveEnemies()
  }

  private dropChange = (event: CustomEvent): void => {
    const [enemyIndex, value] = this.getInputValue(event)
    console.debug("TabEnemies", "dropChange", enemyIndex, value)
    this.tower.enemies[enemyIndex].drop = DROPS[parseInt(value)]
    this.editor.tower.saveEnemies()
  }

  private getInputValueInt = (event: CustomEvent): [number, number | null] => {
    const [enemyIndex, stringValue] = this.getInputValue(event)
    const value: number = parseInt(stringValue)
    return [enemyIndex, isNaN(value) ? null : value]
  }

  private getInputValue = (event: CustomEvent): [number, string] => {
    const currentTarget = event.currentTarget as SlInput
    const enemyIndex = parseInt((currentTarget.parentElement as HTMLElement).dataset.index)
    return [enemyIndex, currentTarget.value]
  }
}
