import {Editor} from '../../editor'
import {Export} from '../data/export'
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
                        <sl-button variant="primary" size="large" outline>Import from text</sl-button>
                    </div>
                    <div class="exportAlert"></div>
                    <sl-textarea class="textArea" resize="auto"></sl-textarea>
            `,
        )
    }

    private export = (): void => {
        const textArea = document.getElementById(Tabs.importExport).getElementsByClassName('textArea')
        const exportStatus = new Export(this.editor.tower).export()
        const alert = this.tabElement.getElementsByClassName('exportAlert')[0]
        if (exportStatus.errors.length == 0) {
            render(alert, html`
                <sl-alert variant="success" open>
                    <sl-icon slot="icon" name="check2-circle"></sl-icon>
                    The data has no error and the export is done.
                </sl-alert>`)
        }
 else {
            const errors = exportStatus.errors.join(', ')
            render(alert, html`
                <sl-alert variant="warning" open>
                    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                    The data has error(s) in ${errors}. The export has been done but beware!
                </sl-alert>`)
        }
        // @ts-expect-error because
        textArea[0].value = exportStatus.content
    }
}
