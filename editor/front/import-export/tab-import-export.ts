import {AlertVariant, showAlert} from '../../../common/front/alert'
import {html, render} from 'uhtml'
import {Editor} from '../../editor'
import {Export} from '../../io/export'
import {Import} from '../../../common/io/import'
import {IOResult} from '../../../common/io/import-export'
import SlTabPanel from '@shoelace-style/shoelace/cdn/components/tab-panel/tab-panel.component'
import {Tab} from '../tab'

export class TabImportExport {
  private static readonly IMPORT_INPUT_ID = 'tabImportImportInput'
  private static readonly EXPORT_LINK_ID = 'tabImportExportLink'
  private readonly editor: Editor
  private readonly tabElement: SlTabPanel
  private exportFileName: string = 'tactical-fulcrum-level.json'
  private importInput: HTMLInputElement
  private tabImportExportLink: HTMLLinkElement

  constructor(editor: Editor) {
    this.editor = editor
    this.tabElement = document.getElementById(Tab.importExport) as SlTabPanel
  }

  render(): void {
    console.debug('TabImportExport', 'render')
    render(
      this.tabElement,
      html`
        <div class="topButtons">
          <sl-button ondragover=${this.onDragOver} ondrop="${this.dropImportFile}" size="large"
            >Drop file to import
          </sl-button>
          <input
            type="file"
            onchange="${this.selectImportFile}"
            id="${TabImportExport.IMPORT_INPUT_ID}"
            accept="application/json"
            class="hidden"
          />
          <sl-button onclick="${this.clickImportFile}" size="large">Select file to import</sl-button>
          <sl-button onclick="${this.export}" size="large">Export</sl-button>
          <a type="file" id="${TabImportExport.EXPORT_LINK_ID}" class="hidden" />
        </div>
      `,
    )
    this.importInput = document.getElementById(TabImportExport.IMPORT_INPUT_ID) as HTMLInputElement
    this.tabImportExportLink = document.getElementById(TabImportExport.EXPORT_LINK_ID) as HTMLLinkElement
  }

  private clickImportFile = (): void => {
    this.importInput.click()
  }

  private onDragOver = (event: DragEvent): void => {
    event.preventDefault()
  }

  private selectImportFile = async (): Promise<any> => {
    return this.processImportFiles(this.importInput.files!)
  }

  private dropImportFile = async (event: DragEvent): Promise<any> => {
    event.preventDefault()
    return this.processImportFiles(event.dataTransfer!.files)
  }

  private async processImportFiles(filesList: FileList): Promise<any> {
    const goodFiles: File[] = []
    for (const file of filesList) {
      if (file.type == 'application/json') {
        goodFiles.push(file)
      }
    }
    if (goodFiles.length == 0) {
      return showAlert(`Import failed: no JSON file found`, AlertVariant.danger, 'check2-circle')
    }
 else if (goodFiles.length > 1) {
      return showAlert(`Import failed: several JSON files found`, AlertVariant.danger, 'check2-circle')
    }
    this.exportFileName = goodFiles[0].name
    goodFiles[0].text().then((fileContent: string) => {
      const importResult = new Import().import(fileContent)
      const editorTower = this.editor.tower
      const importTower = importResult.tower
      editorTower.items = importTower.items
      editorTower.saveItems()
      editorTower.enemies = importTower.enemies
      editorTower.saveEnemies()
      editorTower.standardRooms = importTower.standardRooms
      editorTower.nexusRooms = importTower.nexusRooms
      editorTower.saveRooms()
      editorTower.levels = importTower.levels
      editorTower.saveLevels()
      editorTower.name = importTower.name
      editorTower.saveName()
      editorTower.info = importTower.info
      editorTower.saveInfo()
      TabImportExport.processIOResult(importResult, 'Import')
    })
  }

  private export = async (): Promise<any> => {
    const exportResult = new Export().export(this.editor.tower)
    this.tabImportExportLink.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' + encodeURIComponent(exportResult.content),
    )
    this.tabImportExportLink.setAttribute('download', this.exportFileName)
    this.tabImportExportLink.click()
    return TabImportExport.processIOResult(exportResult, 'Export')
  }

  private static async processIOResult(ioResult: IOResult, operationName: string): Promise<any> {
    if (ioResult.errors.length === 0) {
      return showAlert(`${operationName} done`, AlertVariant.success, 'exclamation-octagon')
    }
 else {
      return showAlert(
        `${operationName} done but there are errors:
                    <ul>
                        ${ioResult.errors
                          .sort()
                          .map(message => `<li>${message}</li>`)
                          .join('\n')}
                    </ul>`,
        AlertVariant.warning,
        'exclamation-triangle',
        30000,
        true,
      )
    }
  }
}
