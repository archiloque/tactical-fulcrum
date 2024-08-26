import "../assets/css/reset.css"
import "../common/common.css"
import "./game.css"

import "@shoelace-style/shoelace/dist/components/tree/tree.js"
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js"

import { AlertVariant, showAlert } from "../common/front/alert"
import { DatabaseAccess } from "./storage/database"
import { GameEventManager } from "./front/game-event-manager"
import { GameScreen } from "./front/game-screen"
import { Import } from "../common/io/import"
import { installConsole } from "./game-console"
import { PlayedTower } from "./models/played-tower"
import { registerCustomIcons } from "../common/front/icons/custom-icons"
import { registerDefaultIcons } from "../common/front/icons/register-default"
import { ScreenIntro } from "./front/intro/screen-intro"
import { ScreenTower } from "./front/tower/screen-tower"
import { TowerInfo } from "./towers/tower-info"

/**
 * @license
 * Copyright 2024 Julien Kirch
 * SPDX-License-Identifier: GPL-3.0
 */

registerDefaultIcons()
registerCustomIcons()

export class Game {
  readonly database: DatabaseAccess
  private readonly screenIntro: ScreenIntro
  private readonly screenTower: ScreenTower
  readonly eventManager: GameEventManager
  readonly mainDiv: HTMLElement
  displayedScreen: GameScreen
  playedTower?: PlayedTower

  constructor() {
    this.database = new DatabaseAccess()
    this.mainDiv = document.getElementById("content")!
    this.eventManager = new GameEventManager()

    this.eventManager.registerTowerSelection(async (selectedTower: TowerInfo) => {
      await this.towerSelected(selectedTower)
    })

    this.screenIntro = new ScreenIntro(this)
    this.screenTower = new ScreenTower(this)
    this.displayedScreen = GameScreen.intro
    Promise.all([this.database.init(), this.screenTower.init()]).then(() => {
      this.screenIntro.render()
    })

    CONSOLE: installConsole(this)
  }

  private async towerSelected(selectedTower: TowerInfo): Promise<any> {
    console.debug("Game", "towerSelected", selectedTower.name)
    fetch(`towers/${selectedTower.file}`).then(async (response) => {
      if (!response.ok) {
        await showAlert(`Error getting the tower file ${response.status}`, AlertVariant.danger, "check2-circle")
      } else {
        const importResult = new Import().import(await response.text())
        if (importResult.errors.length != 0) {
          const errorMessage = `Error importing the tower:<ul>${importResult.errors.map((e) => `<li>${e}</li>`).join("")}</ul>`
          await showAlert(errorMessage, AlertVariant.danger, "check2-circle")
        } else {
          const tower = importResult.tower
          const towerModelId = await this.database.getTowerId(tower.name)
          this.playedTower = new PlayedTower(tower, towerModelId, this.database)
          console.debug("Game", "towerSelected", "towerModelId", towerModelId)
          const databaseCurrentPlayedTowerId = await this.database.currentPlayedTowerModelId(towerModelId)
          if (databaseCurrentPlayedTowerId === undefined) {
            this.playedTower.initNewGame()
            this.playedTower.playedTowerModelId = await this.database.initPlayedTower(this.playedTower, towerModelId)
          } else {
            await this.database.loadPlayedTower(this.playedTower, databaseCurrentPlayedTowerId!)
          }
          this.displayedScreen = GameScreen.tower
          this.screenTower.render()
        }
      }
    })
  }
}

onload = (): void => {
  new Game()
}
