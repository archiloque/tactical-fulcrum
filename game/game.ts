import "../assets/css/reset.css"
import "../common/common.css"
import "./game.css"

import "@shoelace-style/shoelace/dist/components/tree/tree.js"
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js"

import { AlertVariant, showAlert } from "../common/front/alert"
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
  private readonly screenIntro: ScreenIntro
  private readonly screenTower: ScreenTower
  readonly eventManager: GameEventManager
  readonly mainDiv: HTMLElement
  displayedScreen: GameScreen
  // @ts-ignore
  playerTower: PlayedTower | null

  constructor() {
    this.mainDiv = document.getElementById("content")!
    this.eventManager = new GameEventManager()

    this.eventManager.registerTowerSelection((selectedTower: TowerInfo) => {
      this.towerSelected(selectedTower)
    })

    this.screenIntro = new ScreenIntro(this)
    this.screenTower = new ScreenTower(this)
    this.displayedScreen = GameScreen.intro
    this.screenTower.init().then(() => {
      this.screenIntro.render()
    })

    CONSOLE: installConsole(this)
  }

  private towerSelected(selectedTower: TowerInfo): void {
    console.debug("ScreenTower", "towerSelected", selectedTower.name)
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
          this.playerTower = new PlayedTower(tower)
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
