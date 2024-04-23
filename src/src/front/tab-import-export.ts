import {Editor} from '../../editor'
import {Export} from '../data/export'
import {render, html} from 'uhtml';
import {Tabs} from "./tabs";

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
                        <sl-button onclick="${this.export}" variant="primary" size="large" outline>Export to text</sl-button>
                        <sl-button variant="primary" size="large" outline>Import from text</sl-button>
                    </div>
                    <sl-textarea class="textArea" resize="auto"></sl-textarea>
                `
        )
    }

    private export = (): void => {
        let textArea = document.getElementById(Tabs.importExport).getElementsByClassName("textArea");
        // @ts-ignore
        textArea[0].value = Export.export(this.editor.tower);
    }
}
