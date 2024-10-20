import { dumpDb } from "./storage/dump"
import { Game } from "./game"

export {}

declare global {
  interface Window {
    setXp(value: number): void
    clearDB(): Promise<void>
    dumpDB(): Promise<void>
    resetTower(): Promise<void>
  }
}

export function installConsole(game: Game): void {
  Window.prototype.setXp = function (value: number): void {
    game.playedTower!.playerInfo.exp = value
  }
  Window.prototype.dumpDB = async function (): Promise<void> {
    await dumpDb(game.database)
  }
  Window.prototype.clearDB = async function (): Promise<void> {
    await game.database.clear()
  }
  Window.prototype.resetTower = async function (): Promise<void> {
    await game.resetTower()
  }
}
