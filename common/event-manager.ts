import { ColorScheme } from "./front/color-scheme"
import { EventEmitter } from "pixi.js"

export abstract class EventManager {
  private static EVENT_SCHEME_CHANGE = "schemeChange"
  private static EVENT_SCREEN_CHANGE = "screenChange"

  protected eventEmitter: EventEmitter

  protected constructor() {
    this.eventEmitter = new EventEmitter()
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      const colorScheme: ColorScheme = event.matches ? ColorScheme.dark : ColorScheme.light
      console.debug("EventManager", "notifySchemeChange", colorScheme)
      this.eventEmitter.emit(EventManager.EVENT_SCHEME_CHANGE, colorScheme)
    })
    window.addEventListener("resize", () => {
      this.eventEmitter.emit(EventManager.EVENT_SCREEN_CHANGE)
    })
    screen.orientation.addEventListener("change", () => {
      this.eventEmitter.emit(EventManager.EVENT_SCREEN_CHANGE)
    })
  }

  public registerSchemeChange(callBack: (colorScheme: ColorScheme) => void): void {
    this.eventEmitter.on(EventManager.EVENT_SCHEME_CHANGE, (colorScheme) => callBack(colorScheme))
  }

  public registerScreenChange(callBack: () => void): void {
    this.eventEmitter.on(EventManager.EVENT_SCREEN_CHANGE, () => callBack())
  }
}
