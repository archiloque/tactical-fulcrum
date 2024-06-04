import "../assets/css/reset.css"
import "./game.css"

import { registerIcons } from "../common/front/icons/register"

/**
 * @license
 * Copyright 2024 Julien Kirch
 * SPDX-License-Identifier: GPL-3.0
 */

registerIcons()

export class Game {}

onload = (): void => {
  new Game()
}
