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
import { Hole, render } from "uhtml"
import { DatabaseAccess } from "./storage/database"
import { GameEventManager } from "./front/game-event-manager"
import { GameScreen } from "./front/game-screen"
import { Import } from "../common/io/import"
import { installConsole } from "./game-console"
import { PlayedTower } from "./models/played-tower"
import { PlayedTowerModel } from "./storage/models"
import { PlayedTowerTable } from "./storage/tables/played-tower-table"
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
  private readonly dialogDiv: HTMLElement
  displayedScreen: GameScreen
  playedTower?: PlayedTower

  constructor() {
    this.database = new DatabaseAccess()
    this.mainDiv = document.getElementById("content")!
    this.dialogDiv = document.getElementById("gameDialog")!
    this.eventManager = new GameEventManager()

    this.eventManager.registerTowerSelection(async (selectedTower: TowerInfo) => {
      await this.towerSelected(selectedTower)
    })

    this.eventManager.registerTowerReset(async () => {
      await this.resetTower()
    })
    this.eventManager.registerTowerLoad(async (slot) => {
      await this.towerLoad(slot)
    })

    this.screenIntro = new ScreenIntro(this)
    this.screenTower = new ScreenTower(this)
    this.displayedScreen = GameScreen.intro
    Promise.all([this.database.init(), this.screenTower.init()]).then(() => {
      this.screenIntro.render()
      CONSOLE: installConsole(this)
    })
  }

  public static async fetchTowerFile(towerInfo: TowerInfo): Promise<Response> {
    console.debug("Game", "fetchTowerFile", towerInfo.name)
    return fetch(`towers/${towerInfo.file}`)
  }

  private async towerSelected(selectedTower: TowerInfo): Promise<void> {
    console.debug("Game", "towerSelected", selectedTower.name)
    Game.fetchTowerFile(selectedTower).then(async (response) => {
      if (!response.ok) {
        await showAlert(`Error getting the tower file ${response.status}`, AlertVariant.danger, "check2-circle")
      } else {
        const importResult = new Import().import(await response.text())
        if (importResult.errors.length != 0) {
          const errorMessage = `Error importing the tower:<ul>${importResult.errors.map((e) => `<li>${e}</li>`).join("")}</ul>`
          await showAlert(errorMessage, AlertVariant.danger, "check2-circle")
        } else {
          const tower = importResult.tower
          await this.database.getTowerTable().insertIfMissing(tower.name)
          this.playedTower = new PlayedTower(tower, this.database)
          console.debug("Game", "towerSelected", "towerModel")
          const playedTowerModel: PlayedTowerModel | undefined = await this.database
            .getPlayedTowerTable()
            .getCurrent(tower.name)
          if (playedTowerModel === undefined) {
            await this.playedTower.initNewGame()
          } else {
            await this.database
              .getPlayedTowerTable()
              .initPlayedTower(this.playedTower, playedTowerModel!, PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT)
          }
          this.displayedScreen = GameScreen.tower
          this.screenTower.render()
        }
      }
    })
  }

  async resetTower(): Promise<void> {
    console.debug("Game", "resetTower")
    await this.playedTower!!.initNewGame()
    this.screenTower.render()
  }

  async towerLoad(slot: number): Promise<void> {
    console.debug("Game", "towerLoad", slot)
    const currentTower = this.playedTower!!.tower
    const playedTowerModel: PlayedTowerModel = await this.database.getPlayedTowerTable().get(currentTower.name, slot)
    this.playedTower = new PlayedTower(currentTower, this.database)
    await this.database.getPlayedTowerTable().initPlayedTower(this.playedTower!!, playedTowerModel!, slot)
    this.displayedScreen = GameScreen.tower
    this.screenTower.render()
  }

  public async hideDialog(): Promise<void> {
    console.debug("Game", "hideDialog")
    this.eventManager.notifyDialogHidden()
    const promises: Promise<void>[] = []
    for (const dialog of this.dialogDiv.getElementsByTagName("sl-dialog")) {
      promises.push(dialog.hide())
    }
    await Promise.all(promises)
  }

  public async showDialog(hole: Hole): Promise<void> {
    console.debug("Game", "showDialog")
    this.eventManager.notifyDialogShown()
    render(this.dialogDiv, hole)
    const promises: Promise<void>[] = []
    for (const dialog of this.dialogDiv.getElementsByTagName("sl-dialog")) {
      promises.push(dialog.show())
    }
    await Promise.all(promises)
  }
}

onload = (): void => {
  new Game()
}
