import './reset.css'
import '@shoelace-style/shoelace/dist/themes/light.css'
import './editor.css'

import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'
import '@shoelace-style/shoelace/dist/components/tag/tag.js'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'

import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import {MainMenu} from './src/front/main-menu'
import {Tower} from './src/data/tower'
import {TabEnemies} from './src/front/tab-enemies'
import {TabImportExport} from "./src/front/tab-import-export";
import {Tabs} from "./src/front/tabs";

const rootUrl = document.location.origin
setBasePath(rootUrl)

export class Editor {
    readonly tower: Tower
    private readonly tabEnemies: TabEnemies
    private readonly tabImportExport: TabImportExport

    constructor() {
        console.info('Editor starting')
        this.tower = new Tower()
        new MainMenu(this)
        this.tabEnemies = new TabEnemies(this)
        this.tabImportExport = new TabImportExport(this);
    }

    public tabShown(tabName: Tabs): void {
        switch (tabName) {
            case Tabs.map:
                break
            case Tabs.info:
                break
            case Tabs.enemies:
                this.tabEnemies.renderEnemies()
                break
            case Tabs.importExport:
                this.tabImportExport.renderImportExport()
                break
            default:
                throw new Error(`Unknown tab [${tabName}]`)
        }
    }
}

onload = (): void => {
    new Editor()
}
