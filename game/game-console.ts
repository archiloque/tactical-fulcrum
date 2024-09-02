import { Game } from "./game"

export {}

declare global {
  interface Window {
    setXp(value: number): void
    clearDB(): Promise<any>
    resetTower(): Promise<any>
  }
}

export function installConsole(game: Game): void {
  Window.prototype.setXp = function (value: number): void {
    game.playedTower!.playerInfo.exp = value
  }
  Window.prototype.clearDB = async function (): Promise<any> {
    await game.database.clear()
  }
  Window.prototype.resetTower = async function (): Promise<any> {
    await game.resetTower()
  }
}
