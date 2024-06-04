import "../assets/css/reset.css"
import "../common/common.css"
import "./game.css"

import { registerIcons } from "../common/front/icons/register"
import { ScreenMain } from "./front/main/screen-main"
import "@shoelace-style/shoelace/dist/components/tree/tree.js"
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js"

/**
 * @license
 * Copyright 2024 Julien Kirch
 * SPDX-License-Identifier: GPL-3.0
 */

registerIcons()

export class Game {
  private readonly screenMain: ScreenMain

  constructor() {
    this.screenMain = new ScreenMain(this)
    this.screenMain.render()
  }
}

onload = (): void => {
  new Game()
}
