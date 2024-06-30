import {Hole, html, render} from 'uhtml'
import {AbstractTab} from '../abstract-tab'
import {DefaultIconsName} from '../../../common/front/icons/default-icons'
import {Editor} from '../../editor'
import {Level} from '../../../common/models/level'
import SlTabPanel from '@shoelace-style/shoelace/cdn/components/tab-panel/tab-panel.component'
import {Tab} from '../tab'

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
    return html`<div data-index="${levelIndex}" class="elementLine">
      ${this.numberInput(level.atkAdd, this.atkAddChange, 0, 'Atk add')}
      ${this.numberInput(level.atkMul, this.atkMulChange, 0, 'Atk mul')}
      ${this.numberInput(level.defAdd, this.defAddChange, 0, 'Def add')}
      ${this.numberInput(level.defMul, this.defMulChange, 0, 'Def mul')}
      ${this.numberInput(level.hpAdd, this.hpAddChange, 0, 'HP add')}
      ${this.numberInput(level.hpMul, this.hpMulChange, 0, 'HP mul')}
      ${this.numberInput(level.blueKey, this.blueKeyChange, 0, 'Blue keys')}
      ${this.numberInput(level.crimsonKey, this.crimsonKeyChange, 0, 'Crimson keys')}
      ${this.numberInput(level.yellowKey, this.yellowKeyChange, 0, 'Yellow keys')}
      <sl-button onclick="${this.deleteLevel}" variant="danger" class="delete">
        <sl-icon name="${DefaultIconsName.TRASH}"></sl-icon>
      </sl-button>
    </div>`
  }

  render(): void {
    console.debug('TabLevels', 'render')
    render(
      this.tabElement,
      html`
        <div class="elementLine validity-styles">
          ${this.tag('Atk add')} ${this.tag('Atk mul')} ${this.tag('Def add')} ${this.tag('Def mul')}
          ${this.tag('Hp add')} ${this.tag('Hp mul')} ${this.tag('Blue key')} ${this.tag('Crimson key')}
          ${this.tag('Yellow key')} ${this.tag('Delete', 'delete')}
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
    console.debug('TabLevels', 'add level')
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

  private atkAddChange = (event: CustomEvent): void => {
    this.intValueChanged(event, 'atkAdd')
  }

  private atkMulChange = (event: CustomEvent): void => {
    this.intValueChanged(event, 'atkMul')
  }

  private defAddChange = (event: CustomEvent): void => {
    this.intValueChanged(event, 'defAdd')
  }

  private defMulChange = (event: CustomEvent): void => {
    this.intValueChanged(event, 'defMul')
  }

  private hpAddChange = (event: CustomEvent): void => {
    this.intValueChanged(event, 'hpAdd')
  }

  private hpMulChange = (event: CustomEvent): void => {
    this.intValueChanged(event, 'hpMul')
  }

  private blueKeyChange = (event: CustomEvent): void => {
    this.intValueChanged(event, 'blueKey')
  }

  private crimsonKeyChange = (event: CustomEvent): void => {
    this.intValueChanged(event, 'crimsonKey')
  }

  private yellowKeyChange = (event: CustomEvent): void => {
    this.intValueChanged(event, 'yellowKey')
  }

  private intValueChanged = (event: CustomEvent, attrName: string): void => {
    const [levelIndex, value] = this.getInputValueInt(event)
    console.debug('TabEnemies', 'intValueChanged', levelIndex, attrName, value)
    this.editor.tower.levels[levelIndex][attrName] = value
    this.editor.tower.saveLevels()
  }
}
