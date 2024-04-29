import {Editor} from '../../../editor'
// @ts-ignore
import {Hole, html, render} from 'uhtml'
import {COLORS} from '../../data/color'
import {capitalize} from '../../behavior/utils'
import {ITEMS} from '../../data/item'
// @ts-ignore
import SlTreeItem from '@shoelace-style/shoelace/cdn/components/tree-item/tree-item.component'

export class TabMapElements {
    private readonly editor: Editor
    private tabMapEnemies: SlTreeItem
    constructor(editor: Editor) {
        this.editor = editor
    }

    init(): Hole {
        const keys: Hole[] = COLORS.map(c => html`
            <sl-tree-item>${capitalize(c)} key</sl-tree-item>`)
        const doors: Hole[] = COLORS.map(c => html`
            <sl-tree-item>${capitalize(c)} door</sl-tree-item>`)
        const items: Hole[] = ITEMS.map(i => html`
            <sl-tree-item>${i}</sl-tree-item>`)
        return html`<h2>Element</h2>
        <sl-tree selection="leaf">
            <sl-tree-item selected>Empty</sl-tree-item>
            <sl-tree-item>Wall</sl-tree-item>
            <sl-tree-item id="tabMapEnemies">Enemy
            </sl-tree-item>
            <sl-tree-item>Key
                ${keys}
            </sl-tree-item>
            <sl-tree-item>Door
                ${doors}
            </sl-tree-item>
            <sl-tree-item>Item
                ${items}
            </sl-tree-item>
        </sl-tree>`
    }

    postInit() {
        this.tabMapEnemies = document.getElementById('tabMapEnemies')
    }

    render() {
        const enemies: Hole[] = this.editor.tower.enemies.map(enemy => html`
            <sl-tree-item>${enemy.type} ${enemy.level}</sl-tree-item>`)
        render(this.tabMapEnemies, html`Enemy ${enemies}`)
    }
}
