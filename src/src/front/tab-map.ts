import {Editor} from '../../editor'
// @ts-ignore
import {Hole, html, render} from 'uhtml'
import {Tab} from './tab'
import {Tower} from '../behavior/tower'
import {COLORS} from '../data/color'
import {capitalize} from '../behavior/utils'
import {ITEMS} from '../data/item'

export class TabMap {
    private readonly editor: Editor
    private readonly tabElement: HTMLElement
    private readonly tower: Tower

    constructor(editor: Editor) {
        this.editor = editor
        this.tabElement = document.getElementById(Tab.map)
        this.tower = this.editor.tower
    }

    renderMap() {
        console.debug(Tab.map, 'showing')
        const enemies: Hole[] = this.editor.tower.enemies.map(e => html`<sl-tree-item>${e.type} ${e.level}</sl-tree-item>`)
        const keys: Hole[] = COLORS.map(c => html`<sl-tree-item>${capitalize(c)}</sl-tree-item>`)
        const items: Hole[] = ITEMS.map(i => html`<sl-tree-item>${i}</sl-tree-item>`)
        render(this.tabElement, html`
            <div id="tabMapMap"></div>
            <sl-tree selection="leaf">
                <sl-tree-item selected>Empty</sl-tree-item>
                <sl-tree-item>Wall</sl-tree-item>
                <sl-tree-item>Enemy
                    ${enemies}
                </sl-tree-item>
                <sl-tree-item>Key
                    ${keys}
                </sl-tree-item>
                <sl-tree-item>Item
                    ${items}
                </sl-tree-item>
            </sl-tree>`)
    }
}
