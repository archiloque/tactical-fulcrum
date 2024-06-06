import "../assets/css/reset.css"
import "../common/common.css"
import "./game.css"

import "@shoelace-style/shoelace/dist/components/tree/tree.js"
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js"

import { EventManager } from "./front/event-manager"
import { registerIcons } from "../common/front/icons/register"
import { ScreenMain } from "./front/main/screen-main"
import { ScreenTower } from "./front/tower/screen-tower"

/**
 * @license
 * Copyright 2024 Julien Kirch
 * SPDX-License-Identifier: GPL-3.0
 */

registerIcons()

export class Game {
  private readonly screenMain: ScreenMain
  private readonly screenTower: ScreenTower
  readonly eventManager: EventManager

  constructor() {
    this.eventManager = new EventManager()
    this.screenMain = new ScreenMain(this)
    this.screenTower = new ScreenTower(this)
    this.screenMain.render()
  }
}

onload = (): void => {
  new Game()
}
