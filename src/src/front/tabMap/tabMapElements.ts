import {Editor} from '../../../editor'
import {Hole, html, render} from 'uhtml'
import {COLORS} from '../../data/color'
import {capitalize} from '../../behavior/utils'
import {ITEMS} from '../../data/item'
import SlTreeItem from '@shoelace-style/shoelace/cdn/components/tree-item/tree-item.component'

export class TabMapElements {
    private readonly editor: Editor
    private tabMapEnemies: SlTreeItem

    constructor(editor: Editor) {
        this.editor = editor
    }

    hole(): Hole {
        console.debug('TabMapElements', 'hole')
        const keys: Hole[] = COLORS.map(c => html`
            <sl-tree-item>${capitalize(c)} key</sl-tree-item>`)
        const doors: Hole[] = COLORS.map(c => html`
            <sl-tree-item>${capitalize(c)} door</sl-tree-item>`)
        const items: Hole[] = ITEMS.map(i => html`
            <sl-tree-item>${i}</sl-tree-item>`)
        return html`<h2>Element</h2>
        <sl-tree selection="leaf" @sl-selection-change="${this.selectionChanged}">
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

    init(): void {
        console.debug('TabMapElements', 'init')
        this.tabMapEnemies = <SlTreeItem>document.getElementById('tabMapEnemies')
    }

    render(): void {
        console.debug('TabMapElements', 'render')
        const enemies: Hole[] = this.editor.tower.enemies.map((enemy) => {
            const enemyName = `${(enemy.type === null) || (enemy.type.length === 0) ? '??' : enemy.type} ${(enemy.level === null) ? '??' : enemy.level} (${enemy.name})`
            return html`
                <sl-tree-item>${enemyName}</sl-tree-item>`
        })
        render(this.tabMapEnemies, html`Enemy ${enemies}`)
    }

    private selectionChanged = (event: CustomEvent): void => {
        console.debug('TabMapElements', 'selectionChanged', event.detail.selection[0])
    }
}
