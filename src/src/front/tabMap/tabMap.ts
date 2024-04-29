import {Editor} from '../../../editor'
// @ts-ignore
import {html, render} from 'uhtml'
import {Tab} from '../tab'
import {Tower} from '../../behavior/tower'
// @ts-ignore
import {settings} from '@pixi/settings'
import {TabMapMap} from './tabMapMap'
import {TabMapElements} from './tabMapElements'
import {TabMapLevels} from './tabMapLevels'
// @ts-ignore
import SlSplitPanel from '@shoelace-style/shoelace/cdn/components/split-panel/split-panel.component'

export class TabMap {
    private readonly editor: Editor
    private readonly tabElement: HTMLElement
    private readonly tower: Tower
    private splitPanel: SlSplitPanel
    private towerMap: TabMapMap
    private tabMapElement: TabMapElements
    private tabMapLevels: TabMapLevels

    constructor(editor: Editor) {
        settings.RESOLUTION = window.devicePixelRatio || 1
        this.editor = editor
        this.tabMapElement = new TabMapElements(editor)
        this.tabMapLevels = new TabMapLevels(editor)
        this.tabElement = document.getElementById(Tab.map)
        this.tower = this.editor.tower
        this.towerMap = new TabMapMap()
        window.addEventListener('resize', () => {
            this.resize()
        })
    }

    async init() {
        await this.towerMap.init()
        render(this.tabElement, html`
            <sl-split-panel id="tabMapSplitPanel" @sl-reposition="${this.reposition}" position="66">
                <div id="tabMapMap"
                     slot="start"></div>
                <div
                        slot="end">
                    <sl-split-panel>
                        <div
                                slot="start">
                            ${this.tabMapElement.init()}
                        </div>
                        <div
                                slot="end">
                            ${this.tabMapLevels.init()}
                        </div>
                    </sl-split-panel>
                </div>
            </sl-split-panel>`)
        this.splitPanel = document.getElementById('tabMapSplitPanel')
        document.getElementById('tabMapMap').appendChild(this.towerMap.app.canvas)
        this.tabMapLevels.postInit()
        this.tabMapElement.postInit()
    }

    render() {
        console.debug(Tab.map, 'showing')
        this.tabMapElement.render()
        this.tabMapLevels.render()
        this.resize()
    }

    private reposition = (): void => {
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
