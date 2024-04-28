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
// @ts-ignore
import SlTreeItem from "@shoelace-style/shoelace/cdn/components/tree-item/tree-item.component";

export class TabMap {
    private readonly editor: Editor
    private readonly tabElement: HTMLElement
    private readonly tower: Tower
    private splitPanel: HTMLElement
    private tabMapEnemies: HTMLElement
    private towerMap: TowerMap
    private tabMapLevelTree: HTMLElement

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
            <sl-split-panel id="tabMapSplitPanel" @sl-reposition="${this.resized}" position="66">
                <div id="tabMapMap"
                     slot="start"></div>
                <div
                        slot="end">
                    <sl-split-panel>
                        <div
                                slot="start">
                            <h2>Level</h2>
                            <sl-input id="tabMapLevelName" placeholder="Name"></sl-input>
                            <sl-tree id="tabMapLevelTree" selection="leaf" @sl-selection-change="${this.levelSelected}">
                            </sl-tree>
                        </div>
                        <div
                                slot="end">
                            <h2>Element</h2>
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
                        </div>
                    </sl-split-panel>
                </div>
            </sl-split-panel>`)
        this.splitPanel = document.getElementById('tabMapSplitPanel')
        this.tabMapEnemies = document.getElementById('tabMapEnemies')
        this.tabMapLevelTree = document.getElementById('tabMapLevelTree')
        document.getElementById('tabMapMap').appendChild(this.towerMap.app.canvas)
    }

    renderMap() {
        console.debug(Tab.map, 'showing')
        const enemies: Hole[] = this.editor.tower.enemies.map(enemy => html`
            <sl-tree-item>${enemy.type} ${enemy.level}</sl-tree-item>`)
        render(this.tabMapEnemies, html`Enemy ${enemies}`)
        const levels: Hole[] = this.editor.tower.levels.map((level, index) => html`
            <sl-tree-item ?selected="${index == 0}" data-index="${index}">${level.name}</sl-tree-item>`)
        render(this.tabMapLevelTree, html`Enemy ${levels}`)
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

    private levelSelected(event: CustomEvent) {
        const levelIndex = event.detail.selection[0].dataset.index
        console.debug(event)
        debugger
    }
}
