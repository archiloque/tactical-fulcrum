import { Game } from "./game"

export {}

declare global {
  interface Window {
    setXp(value: number): void
  }
}

export function installConsole(game: Game): void {
  Window.prototype.setXp = function (value: number): void {
    game.playerTower!.playerInfo.exp = value
  }
}
