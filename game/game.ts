import "../assets/css/reset.css"
import "../common/common.css"
import "./game.css"

import "@shoelace-style/shoelace/dist/components/badge/badge.js"
import "@shoelace-style/shoelace/dist/components/button/button.js"
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js"
import "@shoelace-style/shoelace/dist/components/input/input.js"
import "@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.js"
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

    this.eventManager.registerTowerReset(async () => {
      await this.resetTower()
    })

    this.screenIntro = new ScreenIntro(this)
    this.screenTower = new ScreenTower(this)
    this.displayedScreen = GameScreen.intro
    Promise.all([this.database.init(), this.screenTower.init()]).then(() => {
      this.screenIntro.render()
      CONSOLE: installConsole(this)
    })
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
          const towerModelId = await this.database.getTowerTable().getIdFromName(tower.name)
          this.playedTower = new PlayedTower(tower, towerModelId, this.database)
          console.debug("Game", "towerSelected", "towerModelId", towerModelId)
          const databaseCurrentPlayedTowerId = await this.database.getPlayedTowerTable().getCurrentId(towerModelId)
          if (databaseCurrentPlayedTowerId === undefined) {
            await this.playedTower.initNewGame()
          } else {
            await this.database.getPlayedTowerTable().load(this.playedTower, databaseCurrentPlayedTowerId!)
            this.playedTower.calculateReachableTiles()
          }
          this.displayedScreen = GameScreen.tower
          this.screenTower.render()
        }
      }
    })
  }

  async resetTower(): Promise<any> {
    console.debug("Game", "resetTower")
    await this.playedTower!!.initNewGame()
    this.screenTower.render()
  }
}

onload = (): void => {
  new Game()
}
