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

import { EMPTY_TILE } from "./models/tile"
import { EventManager } from "./front/event-manager"
import { IconSpriteContent } from "./front/icons"
import { MainMenu } from "./front/main-menu"
import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js"
import { Tab } from "./front/tab"
import { TabEnemies } from "./front/enemies/tab-enemies"
import { TabImportExport } from "./front/import-export/tab-import-export"
import { TabInfo } from "./front/info/tab-info"
import { TabItems } from "./front/items/tab-items"
import { TabLevels } from "./front/levels/tab-levels"
import { TabMaps } from "./front/maps/tab-maps"
import { Tower } from "./models/tower"

/**
 * @license
 * Copyright 2024 Julien Kirch
 * SPDX-License-Identifier: GPL-3.0
 */

registerIconLibrary("default", {
  resolver: (name) =>
    `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" ${IconSpriteContent.get(name)}</svg>`)}`,
})

export class Editor {
  readonly tower: Tower
  readonly eventManager: EventManager
  private readonly tabEnemies: TabEnemies
  private readonly tabImportExport: TabImportExport
  private readonly tabItems: TabItems
  private readonly tabMaps: TabMaps
  private readonly tabInfo: TabInfo
  private readonly tabLevels: TabLevels
  displayedTab: Tab

  constructor() {
    console.debug("Editor starting")
    this.tower = new Tower()
    this.tower.load()
    this.eventManager = new EventManager()
    new MainMenu(this)
    this.tabMaps = new TabMaps(this)
    this.tabInfo = new TabInfo(this)
    this.tabItems = new TabItems(this)
    this.tabLevels = new TabLevels(this)
    this.tabEnemies = new TabEnemies(this)
    this.tabImportExport = new TabImportExport(this)
    this.tabMaps.init().then(() => {
      setTimeout(() => {
        return this.tabMaps.render()
      }, 10)
    })
    this.eventManager.notifyTileSelection(EMPTY_TILE, false)
    this.displayedTab = Tab.map
  }

  public async tabShown(tab: Tab): Promise<any> {
    this.displayedTab = tab
    switch (tab) {
      case Tab.map:
        return this.tabMaps.render()
      case Tab.info:
        return this.tabInfo.render()
      case Tab.enemy:
        return this.tabEnemies.render()
      case Tab.item:
        return this.tabItems.render()
      case Tab.level:
        return this.tabLevels.render()
      case Tab.importExport:
        return this.tabImportExport.render()
      default:
        throw new Error(`Unknown tab [${tab}]`)
    }
  }
}

onload = (): void => {
  new Editor()
}
