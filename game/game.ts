import "../assets/css/reset.css"
import "../common/common.css"
import "./game.css"

import "@shoelace-style/shoelace/dist/components/tree/tree.js"
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js"

import { EventManager } from "./front/event-manager"
import { GameScreen } from "./front/game-screen"
import { registerIcons } from "../common/front/icons/register"
import { ScreenIntro } from "./front/intro/screen-intro"
import { ScreenTower } from "./front/tower/screen-tower"

/**
 * @license
 * Copyright 2024 Julien Kirch
 * SPDX-License-Identifier: GPL-3.0
 */

registerIcons()

export class Game {
  private readonly screenIntro: ScreenIntro
  private readonly screenTower: ScreenTower
  readonly eventManager: EventManager
  readonly mainDiv: HTMLElement
  displayedScreen: GameScreen

  constructor() {
    this.mainDiv = document.getElementById("content")
    this.eventManager = new EventManager()

    this.screenIntro = new ScreenIntro(this)
    this.screenTower = new ScreenTower(this)
    this.displayedScreen = GameScreen.intro
    this.screenTower.init().then(() => {
      this.screenIntro.render()
    })
  }
}

onload = (): void => {
  new Game()
}
