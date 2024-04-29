import {Editor} from '../../../editor'
// @ts-ignore
import {Hole, html, render} from 'uhtml'
// @ts-ignore
import SlInput from '@shoelace-style/shoelace/cdn/components/input/input.component'
// @ts-ignore
import SlTree from '@shoelace-style/shoelace/cdn/components/tree/tree.component'

export class TabMapLevels {
    private readonly editor: Editor
    private tabMapLevelTree: SlTree
    selectedLevelIndex: number = null
    private tabMapLevelName: SlInput

    constructor(editor: Editor) {
        this.editor = editor
    }

    init(): Hole {
        return html`<h2>Level</h2>
        <sl-input id="tabMapLevelName" @sl-input="${this.nameChanged}" placeholder="Name"></sl-input>
        <div id="tabMapLevelButtons">
            <sl-button variant="neutral" onclick="${this.moveUp}">
                <sl-icon name="arrow-up"></sl-icon>
            </sl-button>
            <sl-button variant="danger" onclick="${this.delete}">
                <sl-icon name="trash"></sl-icon>
            </sl-button>
            <sl-button variant="neutral" onclick="${this.moveUp}">
                <sl-icon name="arrow-down"></sl-icon>
            </sl-button>
        </div>
        <sl-tree id="tabMapLevelTree" selection="leaf" @sl-selection-change="${this.levelSelection}">
        </sl-tree>`
    }

    postInit() {
        this.tabMapLevelTree = document.getElementById('tabMapLevelTree')
        this.tabMapLevelName = document.getElementById('tabMapLevelName')
        if (this.editor.tower.levels.length > 0) {
            this.levelSelected(0)
        }
    }

    render() {
        const levels: Hole[] = this.editor.tower.levels.map((level, index) => {
            const id = `tabMapLevelLevel${index}`
            return html`<sl-tree-item id="${id}" ?selected="${index == 0}" data-index="${index}">${level.name}</sl-tree-item>`
        })
        render(this.tabMapLevelTree, html`Enemy ${levels}`)
    }

    private levelSelection = (event: CustomEvent): void => {
        this.levelSelected(parseInt(event.detail.selection[0].dataset.index))
    }

    private moveUp = (): void => {

}

    private delete = (): void => {

    }

    private moveDown = (): void => {

    }

    private nameChanged = (): void => {
        if (this.selectedLevelIndex != -1) {
            this.editor.tower.levels[this.selectedLevelIndex].name = this.tabMapLevelName.value
            this.editor.tower.saveLevels()
            this.render()
        }
    }

    private levelSelected(selectedLevelIndex: number) {
        this.selectedLevelIndex = selectedLevelIndex
        this.tabMapLevelName.value = this.editor.tower.levels[this.selectedLevelIndex].name
    }
}
