import { RoomLayer } from "./room-layer"
import { ScoreType } from "../../common/data/score-type"
import { SelectedRoom } from "./maps/selected-room"
import { SimpleEventManager } from "../../common/simple-event-manager"
import { Tile } from "../../common/models/tile"

export class EventManager extends SimpleEventManager {
  private static EVENT_ROOM_SELECTION = "roomSelection"
  private static EVENT_TILE_SELECTION = "tileSelection"
  private static EVENT_SCORE_SELECTION = "scoreSelection"
  private static EVENT_LAYER_CHANGE = "layerChange"

  constructor() {
    super()
  }

  public registerRoomSelection(callBack: (selectedRoom: SelectedRoom | null) => void): void {
    this.eventEmitter.on(EventManager.EVENT_ROOM_SELECTION, (selectedRoom) => callBack(selectedRoom))
  }

  public notifyRoomSelection(selectedRoom: SelectedRoom | null): void {
    console.debug("EventManager", "notifyRoomSelection", selectedRoom)
    this.eventEmitter.emit(EventManager.EVENT_ROOM_SELECTION, selectedRoom)
  }

  public registerTileSelection(callBack: (selectedTile: Tile, updateElementTree: boolean) => void): void {
    this.eventEmitter.on(EventManager.EVENT_TILE_SELECTION, (selectedTile, updateElementTree) =>
      callBack(selectedTile, updateElementTree),
    )
  }

  public notifyTileSelection(selectedTile: Tile, updateElementTree: boolean): void {
    console.debug("EventManager", "notifyTileSelection", selectedTile, updateElementTree)
    this.eventEmitter.emit(EventManager.EVENT_TILE_SELECTION, selectedTile, updateElementTree)
  }

  public registerLayerSelection(callBack: (layer: RoomLayer) => void): void {
    this.eventEmitter.on(EventManager.EVENT_LAYER_CHANGE, (layer) => callBack(layer))
  }

  public notifyLayerSelection(layer: RoomLayer): void {
    console.debug("EventManager", "notifyLayerSelection", layer)
    this.eventEmitter.emit(EventManager.EVENT_LAYER_CHANGE, layer)
  }

  public registerScoreSelection(callBack: (scoreType: ScoreType | null, updateElementTree: boolean) => void): void {
    this.eventEmitter.on(EventManager.EVENT_SCORE_SELECTION, (scoreType, updateScoreTree) =>
      callBack(scoreType, updateScoreTree),
    )
  }

  public notifyScoreSelection(scoreType: ScoreType | null, updateScoreTree: boolean): void {
    console.debug("EventManager", "notifyScoreSelection", scoreType, updateScoreTree)
    this.eventEmitter.emit(EventManager.EVENT_SCORE_SELECTION, scoreType, updateScoreTree)
  }
}
