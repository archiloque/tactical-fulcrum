import './reset.css'
import './editor.css'

import '@shoelace-style/shoelace/dist/components/alert/alert.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'
import '@shoelace-style/shoelace/dist/components/tag/tag.js'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import '@shoelace-style/shoelace/dist/components/tree/tree.js'
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js'

import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import {MainMenu} from './src/front/mainMenu'
import {Tower} from './src/behavior/tower'
import {TabEnemies} from './src/front/tabEnemies'
import {TabImportExport} from './src/front/tabImportExport'
import {Tab} from './src/front/tab'
import {TabMap} from './src/front/tabMap/tabMap'

const rootUrl = document.location.origin
setBasePath(rootUrl)

export class Editor {
    readonly tower: Tower
    private readonly tabEnemies: TabEnemies
    private readonly tabImportExport: TabImportExport
    private readonly tabMap: TabMap

    constructor() {
        console.info('Editor starting')
        this.tower = new Tower()
        this.tower.load()
        new MainMenu(this)
        this.tabEnemies = new TabEnemies(this)
        this.tabImportExport = new TabImportExport(this)
        this.tabMap = new TabMap(this)
        this.tabMap.init().then(() => {
            setTimeout(() => {
                this.tabMap.render()
            }, 10)
        })
    }

    public tabShown(tabName: Tab): void {
        switch (tabName) {
            case Tab.map:
                this.tabMap.render()
                break
            case Tab.info:
                break
            case Tab.enemies:
                this.tabEnemies.render()
                break
            case Tab.importExport:
                this.tabImportExport.render()
                break
            default:
                throw new Error(`Unknown tab [${tabName}]`)
        }
    }
}

onload = (): void => {
    new Editor()
}
