import {Editor} from '../../editor'
import {IOResult} from '../behavior/io/importExport'
import {html, render} from 'uhtml'
import {Tab} from './tab'
import {Import} from '../behavior/io/import'
import {Export} from '../behavior/io/export'
import {SlTextarea} from '@shoelace-style/shoelace'
import {showAlert} from './alert'

export class TabImportExport {
    private readonly editor: Editor
    private readonly tabElement: HTMLElement

    constructor(editor: Editor) {
        this.editor = editor
        this.tabElement = document.getElementById(Tab.importExport)
    }

    render(): void {
        console.debug(Tab.importExport, 'render')
        render(
            this.tabElement, html`
                    <div class="topButtons">
                        <sl-button onclick="${this.export}" variant="primary" size="large" outline>Export to text
                        </sl-button>
                        <sl-button onclick="${this.import}" variant="primary" size="large" outline>Import from text
                        </sl-button>
                    </div>
                    <sl-textarea class="textArea" resize="auto" size="small"></sl-textarea>
            `,
        )
    }

    private import = (): void => {
        const textArea: SlTextarea = <SlTextarea>document.getElementById(Tab.importExport).getElementsByClassName('textArea')[0]
        const stringData = textArea.value
        const importResult = new Import().import(stringData)
        TabImportExport.processIOResult(importResult, 'Import')
        this.editor.tower.enemies = importResult.content.enemies
        this.editor.tower.saveEnemies()
        this.editor.tower.rooms = importResult.content.rooms
        this.editor.tower.saveRooms()
    }

    private export = (): void => {
        const textArea: SlTextarea = <SlTextarea>document.getElementById(Tab.importExport.valueOf()).getElementsByClassName('textArea')[0]
        const exportResult = new Export().export(this.editor.tower)
        TabImportExport.processIOResult(exportResult, 'Export')
        textArea.value = exportResult.content
    }

    private static processIOResult(ioResult: IOResult, operationName: string): void {
        if (ioResult.errors.length === 0) {
            showAlert(`${operationName} done`, 'success', 'check2-circle')
        } else {
            showAlert(`${operationName} done but there are errors:
                    <ul>
                        ${ioResult.errors.sort().map(message => `<li>${message}</li>`).join('\n')}
                    </ul>`, 'warning', 'exclamation-triangle', 30000, true)
        }
    }
}
