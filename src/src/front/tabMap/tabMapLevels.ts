import {Editor} from '../../../editor'
// @ts-ignore
import {Hole, html, render} from 'uhtml'
// @ts-ignore
import SlInput from '@shoelace-style/shoelace/cdn/components/input/input.component'
// @ts-ignore
import SlTree from '@shoelace-style/shoelace/cdn/components/tree/tree.component'
// @ts-ignore
import SlDialog from '@shoelace-style/shoelace/cdn/components/dialog/dialog.component'
import {Level} from "../../behavior/level";

export class TabMapLevels {
    private readonly editor: Editor
    private tree: SlTree
    private levelNameInput: SlInput
    private deleteDialog: SlDialog
    private static readonly NO_LEVEL_SELECTED = -1
    selectedLevelIndex: number = TabMapLevels.NO_LEVEL_SELECTED

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
            <sl-button variant="neutral" onclick="${this.moveUp}">
                <sl-icon name="arrow-down"></sl-icon>
            </sl-button>
            <sl-button variant="danger" onclick="${this.delete}">
                <sl-icon name="trash"></sl-icon>
            </sl-button>
        </div>
        <sl-tree id="tabMapLevelTree" selection="leaf" @sl-selection-change="${this.levelSelection}">
        </sl-tree>
        <div id="tabMapLevelAdd">
            <sl-button variant="primary" onclick="${this.addLevel}">
                <sl-icon name="plus-circle"></sl-icon>
            </sl-button>
        </div>
        <sl-dialog label="Delete level" id="tabMapLevelDeleteDialog">
            Are you sure you want to delete this level?
            <div slot="footer">
                <sl-button onclick="${this.deleteDialogCancel}" variant="neutral">No</sl-button>
                <sl-button onclick="${this.deleteDialogConfirm}" variant="danger">Yes</sl-button>
            </div>
        </sl-dialog>
        `
    }

    postInit() {
        this.tree = document.getElementById('tabMapLevelTree')
        this.levelNameInput = document.getElementById('tabMapLevelName')
        this.deleteDialog = document.getElementById('tabMapLevelDeleteDialog')
        if (this.editor.tower.levels.length > 0) {
            this.levelSelected(0)
        }
    }

    render() {
        if (this.editor.tower.levels.length == 0) {
            this.levelSelected(TabMapLevels.NO_LEVEL_SELECTED)
        } else if (this.selectedLevelIndex == TabMapLevels.NO_LEVEL_SELECTED) {
            this.levelSelected(0)
        }
        console.log("TabMapLevels", "render with selected", this.selectedLevelIndex)
        const levels: Hole[] = this.editor.tower.levels.map((level, index) => {
            const id = `tabMapLevelLevel${index}`
            return html`
                <sl-tree-item id="${id}" ?selected="${index == this.selectedLevelIndex}" data-index="${index}">${level.name}</sl-tree-item>`
        })
        render(this.tree, html`Enemy ${levels}`)
    }

    private levelSelection = (event: CustomEvent): void => {
        this.levelSelected(parseInt(event.detail.selection[0].dataset.index))
    }

    private moveUp = (): void => {

    }

    private delete = (): void => {
        this.deleteDialog.show()
    }

    private moveDown = (): void => {

    }

    private addLevel = (): void => {
        console.log("TabMapLevels", "add level")
        const level: Level = new Level()
        level.name = "New level"
        this.editor.tower.levels.push(level)
        this.editor.tower.saveLevels()
        this.levelSelected(this.editor.tower.levels.length - 1)
        this.render()
    }

    private deleteDialogConfirm = (): void => {
        this.deleteDialog.hide()
        if (this.selectedLevelIndex != TabMapLevels.NO_LEVEL_SELECTED) {
            console.log("TabMapLevels", "delete level", this.selectedLevelIndex)
            this.editor.tower.levels.splice(this.selectedLevelIndex, 1)
            this.editor.tower.saveLevels()
            this.levelSelected((this.editor.tower.levels.length == 0) ? TabMapLevels.NO_LEVEL_SELECTED : 0)
            this.render()
        }
    }

    private deleteDialogCancel = (): void => {
        this.deleteDialog.hide()
    }

    private nameChanged = (): void => {
        if (this.selectedLevelIndex != TabMapLevels.NO_LEVEL_SELECTED) {
            this.editor.tower.levels[this.selectedLevelIndex].name = this.levelNameInput.value
            this.editor.tower.saveLevels()
            this.render()
        }
    }

    private levelSelected(selectedLevelIndex: number) {
        console.log("TabMapLevels", "select level", selectedLevelIndex)
        this.selectedLevelIndex = selectedLevelIndex
        if (selectedLevelIndex != TabMapLevels.NO_LEVEL_SELECTED) {
            this.levelNameInput.value = this.editor.tower.levels[this.selectedLevelIndex].name
        } else {
            this.levelNameInput.value = ''
        }
    }
}
