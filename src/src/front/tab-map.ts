import {Editor} from '../../editor'
// @ts-ignore
import {Hole, html, render} from 'uhtml'
import {Tab} from './tab'
import {Tower} from '../behavior/tower'
import {COLORS} from '../data/color'
import {capitalize} from '../behavior/utils'
import {ITEMS} from '../data/item'
// @ts-ignore
import {settings} from '@pixi/settings'
import {TowerMap} from './tower-map'

export class TabMap {
    private readonly editor: Editor
    private readonly tabElement: HTMLElement
    private readonly tower: Tower
    private splitPanel: HTMLElement
    private tabMapEnemies: HTMLElement
    private towerMap: TowerMap

    constructor(editor: Editor) {
        settings.RESOLUTION = window.devicePixelRatio || 1
        this.editor = editor
        this.tabElement = document.getElementById(Tab.map)
        this.tower = this.editor.tower
        this.towerMap = new TowerMap()
        window.addEventListener('resize', () => {
            this.resize()
        })
    }

    async init() {
        await this.towerMap.init()
        const keys: Hole[] = COLORS.map(c => html`
            <sl-tree-item>${capitalize(c)}</sl-tree-item>`)
        const items: Hole[] = ITEMS.map(i => html`
            <sl-tree-item>${i}</sl-tree-item>`)
        render(this.tabElement, html`
            <sl-split-panel id="tabMapSplitPanel" @sl-reposition="${this.resized}" position="75">
                <div id="tabMapMap"
                     slot="start"></div>
                <div
                        slot="end">
                    <sl-tree selection="leaf">
                        <sl-tree-item selected>Empty</sl-tree-item>
                        <sl-tree-item>Wall</sl-tree-item>
                        <sl-tree-item id="tabMapEnemies">Enemy
                        </sl-tree-item>
                        <sl-tree-item>Key
                            ${keys}
                        </sl-tree-item>
                        <sl-tree-item>Item
                            ${items}
                        </sl-tree-item>
                    </sl-tree>
                </div>`)
        this.splitPanel = document.getElementById('tabMapSplitPanel')
        this.tabMapEnemies = document.getElementById('tabMapEnemies')
        document.getElementById('tabMapMap').appendChild(this.towerMap.app.canvas)
    }

    renderMap() {
        console.debug(Tab.map, 'showing')
        const enemies: Hole[] = this.editor.tower.enemies.map(e => html`
            <sl-tree-item>${e.type} ${e.level}</sl-tree-item>`)
        render(this.tabMapEnemies, html`Enemy ${enemies}`)
        this.resize()
    }

    private resized = (): void => {
        this.resize()
    }

    private resize() {
        const height = window.innerHeight - this.splitPanel.getBoundingClientRect().top - 10
        // @ts-ignore
        const width = (window.innerWidth * this.splitPanel.position / 100) - 10
        const number = Math.min(height, width)
        this.towerMap.resize(number)
    }
}
