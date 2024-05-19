import {ColorScheme} from './colorScheme'
import {EventEmitter} from 'pixi.js'
import {RoomLayer} from './roomLayer'
import {ScoreType} from '../data/scoreType'
import {SelectedRoom} from './tabMap/selectedRoom'
import {Tile} from '../behavior/tile'

export class EventManager {
  private static EVENT_ROOM_SELECTION = 'roomSelection'
  private static EVENT_TILE_SELECTION = 'tileSelection'
  private static EVENT_SCORE_SELECTION = 'scoreSelection'
  private static EVENT_SCHEME_CHANGE = 'schemeChange'
  private static EVENT_LAYER_CHANGE = 'layerChange'
  private eventEmitter: EventEmitter

  constructor() {
    this.eventEmitter = new EventEmitter()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      const colorScheme: ColorScheme = event.matches ? ColorScheme.dark : ColorScheme.light
      console.debug('EventManager', 'notifySchemeChange', colorScheme)
      this.eventEmitter.emit(EventManager.EVENT_SCHEME_CHANGE, colorScheme)
    })
  }

  public registerRoomSelection(callBack: (selectedRoom: SelectedRoom | null) => void): void {
    this.eventEmitter.on(EventManager.EVENT_ROOM_SELECTION, selectedRoom => callBack(selectedRoom))
  }

  public notifyRoomSelection(selectedRoom: SelectedRoom | null): void {
    console.debug('EventManager', 'notifyRoomSelection', selectedRoom)
    this.eventEmitter.emit(EventManager.EVENT_ROOM_SELECTION, selectedRoom)
  }

  public registerTileSelection(callBack: (selectedTile: Tile, updateElementTree: boolean) => void): void {
    this.eventEmitter.on(EventManager.EVENT_TILE_SELECTION, (selectedTile, updateElementTree) =>
      callBack(selectedTile, updateElementTree),
    )
  }

  public notifyTileSelection(selectedTile: Tile, updateElementTree: boolean): void {
    console.debug('EventManager', 'notifyTileSelection', selectedTile, updateElementTree)
    this.eventEmitter.emit(EventManager.EVENT_TILE_SELECTION, selectedTile, updateElementTree)
  }

  public registerLayerSelection(callBack: (layer: RoomLayer) => void): void {
    this.eventEmitter.on(EventManager.EVENT_LAYER_CHANGE, layer => callBack(layer))
  }

  public notifyLayerSelection(layer: RoomLayer): void {
    console.debug('EventManager', 'notifyLayerSelection', layer)
    this.eventEmitter.emit(EventManager.EVENT_LAYER_CHANGE, layer)
  }

  public registerScoreSelection(callBack: (scoreType: ScoreType | null, updateElementTree: boolean) => void): void {
    this.eventEmitter.on(EventManager.EVENT_SCORE_SELECTION, (scoreType, updateScoreTree) =>
      callBack(scoreType, updateScoreTree),
    )
  }

  public notifyScoreSelection(scoreType: ScoreType | null, updateScoreTree: boolean): void {
    console.debug('EventManager', 'notifyScoreSelection', scoreType, updateScoreTree)
    this.eventEmitter.emit(EventManager.EVENT_SCORE_SELECTION, scoreType, updateScoreTree)
  }

  public registerSchemeChange(callBack: (colorScheme: ColorScheme) => void): void {
    this.eventEmitter.on(EventManager.EVENT_SCHEME_CHANGE, colorScheme => callBack(colorScheme))
  }
}
