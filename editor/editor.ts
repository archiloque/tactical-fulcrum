import "../assets/css/reset.css"
import "../common/common.css"
import "./editor.css"

import "@shoelace-style/shoelace/dist/components/alert/alert.js"
import "@shoelace-style/shoelace/dist/components/button/button.js"
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js"
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js"
import "@shoelace-style/shoelace/dist/components/icon/icon.js"
import "@shoelace-style/shoelace/dist/components/input/input.js"
import "@shoelace-style/shoelace/dist/components/option/option.js"
import "@shoelace-style/shoelace/dist/components/radio-button/radio-button.js"
import "@shoelace-style/shoelace/dist/components/radio-group/radio-group.js"
import "@shoelace-style/shoelace/dist/components/select/select.js"
import "@shoelace-style/shoelace/dist/components/split-panel/split-panel.js"
import "@shoelace-style/shoelace/dist/components/tab/tab.js"
import "@shoelace-style/shoelace/dist/components/tag/tag.js"
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js"
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js"
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js"
import "@shoelace-style/shoelace/dist/components/tree/tree.js"
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js"

import { EMPTY_TILE } from "./behavior/tile"
import { EventManager } from "./front/eventManager"
import { MainMenu } from "./front/mainMenu"
import { Tab } from "./front/tab"
import { TabEnemies } from "./front/tabEnemies"
import { TabImportExport } from "./front/tabImportExport"
import { TabInfo } from "./front/tabInfo"
import { TabMap } from "./front/tabMap/tabMap"
import { Tower } from "./behavior/tower"
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js"

/**
 * @license
 * Copyright 2014 Julien Kirch
 * SPDX-License-Identifier: GPL-3.0
 */
const rootUrl = document.location.origin
setBasePath(rootUrl)

export class Editor {
  readonly tower: Tower
  readonly eventManager: EventManager
  private readonly tabEnemies: TabEnemies
  private readonly tabImportExport: TabImportExport
  private readonly tabMap: TabMap
  private readonly tabInfo: TabInfo
  displayedTab: Tab

  constructor() {
    console.debug("Editor starting")
    this.tower = new Tower()
    this.tower.load()
    this.eventManager = new EventManager()
    new MainMenu(this)
    this.tabEnemies = new TabEnemies(this)
    this.tabImportExport = new TabImportExport(this)
    this.tabMap = new TabMap(this)
    this.tabInfo = new TabInfo(this)
    this.tabMap.init().then(() => {
      setTimeout(() => {
        this.tabMap.render()
      }, 10)
    })
    this.eventManager.notifyTileSelection(EMPTY_TILE, false)
    this.displayedTab = Tab.map
  }

  public tabShown(tab: Tab): void {
    this.displayedTab = tab
    switch (tab) {
      case Tab.map:
        this.tabMap.render()
        break
      case Tab.info:
        this.tabInfo.render()
        break
      case Tab.enemies:
        this.tabEnemies.render()
        break
      case Tab.importExport:
        this.tabImportExport.render()
        break
      default:
        throw new Error(`Unknown tab [${tab}]`)
    }
  }
}

onload = (): void => {
  new Editor()
}