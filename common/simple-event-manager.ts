import { ColorScheme } from "./front/color-scheme"
import { EventEmitter } from "pixi.js"

export class SimpleEventManager {
  private static EVENT_SCHEME_CHANGE = "schemeChange"

  protected eventEmitter: EventEmitter

  constructor() {
    this.eventEmitter = new EventEmitter()
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      const colorScheme: ColorScheme = event.matches ? ColorScheme.dark : ColorScheme.light
      console.debug("EventManager", "notifySchemeChange", colorScheme)
      this.eventEmitter.emit(SimpleEventManager.EVENT_SCHEME_CHANGE, colorScheme)
    })
  }

  public registerSchemeChange(callBack: (colorScheme: ColorScheme) => void): void {
    this.eventEmitter.on(SimpleEventManager.EVENT_SCHEME_CHANGE, (colorScheme) => callBack(colorScheme))
  }
}
