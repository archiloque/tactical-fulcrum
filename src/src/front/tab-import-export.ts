import {Editor} from '../../editor'
import {Export, Import, IOStatus} from '../data/import_export'
import {html, render} from 'uhtml'
import {Tabs} from './tabs'

export class TabImportExport {
    private readonly editor: Editor
    private readonly tabElement: HTMLElement

    constructor(editor: Editor) {
        this.editor = editor
        this.tabElement = document.getElementById(Tabs.importExport)
    }

    renderImportExport() {
        console.debug(Tabs.importExport, 'showing')
        render(
            this.tabElement, html`
                    <div class="topButtons">
                        <sl-button onclick="${this.export}" variant="primary" size="large" outline>Export to text
                        </sl-button>
                        <sl-button onclick="${this.import}" variant="primary" size="large" outline>Import from text
                        </sl-button>
                    </div>
                    <div class="exportAlert"></div>
                    <sl-textarea class="textArea" resize="auto"></sl-textarea>
            `,
        )
    }

    private import = (): void => {
        const textArea = document.getElementById(Tabs.importExport).getElementsByClassName('textArea')
        // @ts-expect-error because
        const stringData = textArea[0].value;
        const importResult = new Import().import(stringData)
        const alert = this.tabElement.getElementsByClassName('exportAlert')[0]
        TabImportExport.processIOResult(importResult, alert, "import");
        this.editor.tower.enemies = importResult.content.enemies
    }

    private export = (): void => {
        const textArea = document.getElementById(Tabs.importExport).getElementsByClassName('textArea')
        const exportResult = new Export().export(this.editor.tower)
        const alert = this.tabElement.getElementsByClassName('exportAlert')[0]
        TabImportExport.processIOResult(exportResult, alert, "export");
// @ts-expect-error because
        textArea[0].value = exportResult.content
    }

    private static processIOResult(ioStatus: IOStatus, alert: Element, operationName: string) {
        if (ioStatus.errors.length == 0) {
            render(alert, html`
                <sl-alert variant="success" open>
                    <sl-icon slot="icon" name="check2-circle"></sl-icon>
                    The data has no error and the ${operationName} has been done.
                </sl-alert>`)
        } else {
            render(alert, html`
                <sl-alert variant="warning" open>
                    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                    The ${operationName} has been done but there are errors:
                    <ul>
                        ${ioStatus.errors.sort().map(message => html`
                            <li>${message}</li>`)}
                    </ul>
                </sl-alert>`)
        }
    }
}
