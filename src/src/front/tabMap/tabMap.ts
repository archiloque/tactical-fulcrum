import {Editor} from '../../../editor'
import {html, render} from 'uhtml'
import {Tab} from '../tab'
import {Tower} from '../../behavior/tower'
import {settings} from '@pixi/settings'
import {TabMapMap} from './tabMapMap'
import {TabMapElements} from './tabMapElements'
import {TabMapRooms} from './tabMapRooms'
import SlSplitPanel from '@shoelace-style/shoelace/cdn/components/split-panel/split-panel.component'
import {Sheets} from './sheets'

export class TabMap {
    private readonly editor: Editor
    private readonly tabElement: HTMLElement
    private readonly tower: Tower
    private splitPanel1: SlSplitPanel
    private splitPanel2: SlSplitPanel
    private tabMapMap: TabMapMap
    private tabMapElement: TabMapElements
    private tabMapRooms: TabMapRooms
    private sheets: Sheets

    constructor(editor: Editor) {
        settings.RESOLUTION = window.devicePixelRatio || 1
        this.editor = editor
        this.tabMapElement = new TabMapElements(editor)
        this.tabMapRooms = new TabMapRooms(editor)
        this.tabElement = document.getElementById(Tab.map)
        this.tower = this.editor.tower
        this.tabMapMap = new TabMapMap()
        window.addEventListener('resize', () => {
            this.resize()
        })
        this.sheets = new Sheets()
    }

    async init() {
        render(this.tabElement, html`
            <sl-split-panel id="tabMapSplitPanel1" @sl-reposition="${this.reposition}" position="25">
                <div
                        slot="start">
                    ${this.tabMapElement.init()}
                </div>

                <div
                        slot="end">
                    <sl-split-panel id="tabMapSplitPanel2" position="75">
                        <div id="tabMapMap"
                             slot="start">
                        </div>
                        <div
                                slot="end">
                            ${this.tabMapRooms.init()}
                        </div>
                    </sl-split-panel>
                </div>
            </sl-split-panel>`)
        this.splitPanel1 = <SlSplitPanel>document.getElementById('tabMapSplitPanel1')
        this.splitPanel2 = <SlSplitPanel>document.getElementById('tabMapSplitPanel2')
        document.getElementById('tabMapMap').appendChild(this.tabMapMap.app.canvas)
        this.tabMapRooms.postInit()
        this.tabMapElement.postInit()
        await Promise.all([this.tabMapMap.init(), this.sheets.load()])
    }

    render() {
        console.debug(Tab.map, 'render')
        this.tabMapElement.render()
        this.tabMapRooms.render()
        this.resize()
    }

    private reposition = (): void => {
        this.resize()
    }

    private resize() {
        const height = window.innerHeight - this.splitPanel1.getBoundingClientRect().top - 10
        const splitPanel1Percent = 1 - this.splitPanel1.position / 100
        const splitPanel2Percent = this.splitPanel2.position / 100
        const width = (window.innerWidth * splitPanel1Percent * splitPanel2Percent) - 20
        const number = Math.min(height, width)
        this.tabMapMap.resize(number)
    }
}
