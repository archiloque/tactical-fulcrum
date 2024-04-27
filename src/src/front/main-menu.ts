import {Editor} from '../../editor'
import {Tabs} from './tabs'
// @ts-ignore
import {html, render} from 'uhtml'

export class MainMenu {
    private readonly editor: Editor

    constructor(editor: Editor) {
        this.editor = editor
        render(document.getElementById('content'), html`
            <sl-tab-group @sl-tab-show="${this.tabShown}">
                <sl-tab slot="nav" panel="${Tabs.map}">Map</sl-tab>
                <sl-tab slot="nav" panel="${Tabs.enemies}">Enemies</sl-tab>
                <sl-tab slot="nav" panel="${Tabs.info}">Info</sl-tab>
                <sl-tab slot="nav" panel="${Tabs.importExport}">Import/Export</sl-tab>

                <sl-tab-panel id="${Tabs.map}" name="${Tabs.map}">Map</sl-tab-panel>
                <sl-tab-panel id="${Tabs.enemies}" name="${Tabs.enemies}">Enemies</sl-tab-panel>
                <sl-tab-panel id="${Tabs.info}" name="${Tabs.info}">Info</sl-tab-panel>
                <sl-tab-panel id="${Tabs.importExport}" name="${Tabs.importExport}">Import/Export</sl-tab-panel>
            </sl-tab-group>
        `)
    }

    private tabShown = (event: CustomEvent) => {
        const tab = event.detail.name
        console.debug('MainMenu: tab', tab, 'shown')
        this.editor.tabShown(tab)
    }
}
