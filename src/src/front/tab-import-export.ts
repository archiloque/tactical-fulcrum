import {Editor} from '../../editor'
import {Export, Import, IOStatus} from '../behavior/import_export'
// @ts-ignore
import {html, render} from 'uhtml'
import {Tab} from './tab'

export class TabImportExport {
    private readonly editor: Editor
    private readonly tabElement: HTMLElement

    constructor(editor: Editor) {
        this.editor = editor
        this.tabElement = document.getElementById(Tab.importExport)
    }

    renderImportExport() {
        console.debug(Tab.importExport, 'showing')
        render(
            this.tabElement, html`
                    <div class="topButtons">
                        <sl-button onclick="${this.export}" variant="primary" size="large" outline>Export to text
                        </sl-button>
                        <sl-button onclick="${this.import}" variant="primary" size="large" outline>Import from text
                        </sl-button>
                    </div>
                    <div class="exportAlert"></div>
                    <sl-textarea class="textArea" resize="auto" size="small"></sl-textarea>
            `,
        )
    }

    private import = (): void => {
        const textArea = document.getElementById(Tab.importExport).getElementsByClassName('textArea')
        // @ts-ignore
        const stringData = textArea[0].value
        const importResult = new Import().import(stringData)
        const alert = this.tabElement.getElementsByClassName('exportAlert')[0]
        TabImportExport.processIOResult(importResult, alert, 'Import')
        this.editor.tower.enemies = importResult.content.enemies
        this.editor.tower.saveEnemies()
    }

    private export = (): void => {
        const textArea = document.getElementById(Tab.importExport.valueOf()).getElementsByClassName('textArea')
        const exportResult = new Export().export(this.editor.tower)
        const alert = this.tabElement.getElementsByClassName('exportAlert')[0]
        TabImportExport.processIOResult(exportResult, alert, 'Export')
        // @ts-ignore
        textArea[0].value = exportResult.content
    }

    private static processIOResult(ioStatus: IOStatus, alert: Element, operationName: string) {
        if (ioStatus.errors.length == 0) {
            render(alert, html`
                <sl-alert variant="success" open closable duration="3000">
                    <sl-icon slot="icon" name="check2-circle"></sl-icon>
                    ${operationName} done
                </sl-alert>`)
        }
 else {
            render(alert, html`
                <sl-alert variant="warning" open closable>
                    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                    ${operationName} done but there are errors:
                    <ul>
                        ${ioStatus.errors.sort().map(message => html`
                            <li>${message}</li>`)}
                    </ul>
                </sl-alert>`)
        }
        // @ts-ignore
        alert.querySelector('sl-alert').toast()
    }
}
