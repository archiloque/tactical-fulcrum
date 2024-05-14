import { EventEmitter } from "pixi.js"
import { Tile } from "../behavior/tile"
import { ColorScheme } from "./colorScheme"

export class EventManager {
  private static EVENT_ROOM_SELECTION = "roomSelection"
  private static EVENT_TILE_SELECTION = "tileSelection"
  private static EVENT_SCHEME_CHANGE = "schemeChange"
  private eventEmitter: EventEmitter

  constructor() {
    this.eventEmitter = new EventEmitter()
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const colorScheme: ColorScheme = event.matches
          ? ColorScheme.dark
          : ColorScheme.light
        console.debug("EventManager", "notifySchemeChange", colorScheme)
        this.eventEmitter.emit(EventManager.EVENT_SCHEME_CHANGE, colorScheme)
      })
  }

  public registerRoomSelected(
    callBack: (selectedRoomIndex: number | null) => void,
  ): void {
    this.eventEmitter.on(
      EventManager.EVENT_ROOM_SELECTION,
      (selectedRoomIndex) => callBack(selectedRoomIndex),
    )
  }

  public notifyRoomSelected(selectedRoomIndex: number | null): void {
    console.debug("EventManager", "notifyRoomSelected", selectedRoomIndex)
    debugger
    this.eventEmitter.emit(EventManager.EVENT_ROOM_SELECTION, selectedRoomIndex)
  }

  public registerTileSelection(
    callBack: (selectedTile: Tile, updateElementTree: boolean) => void,
  ): void {
    this.eventEmitter.on(
      EventManager.EVENT_TILE_SELECTION,
      (selectedTile, updateElementTree) =>
        callBack(selectedTile, updateElementTree),
    )
  }

  public notifyTileSelection(
    selectedTile: Tile,
    updateElementTree: boolean,
  ): void {
    console.debug(
      "EventManager",
      "notifyTileSelection",
      selectedTile,
      updateElementTree,
    )
    this.eventEmitter.emit(
      EventManager.EVENT_TILE_SELECTION,
      selectedTile,
      updateElementTree,
    )
  }

  public registerSchemeChangeListener(
    callBack: (colorScheme: ColorScheme) => void,
  ): void {
    this.eventEmitter.on(EventManager.EVENT_SCHEME_CHANGE, (colorScheme) =>
      callBack(colorScheme),
    )
  }
}
