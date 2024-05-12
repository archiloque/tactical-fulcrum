import {EventEmitter} from 'pixi.js'
import {Tile} from '../behavior/tile'

export const enum TileSelectionOrigin {
    Elements,
    Map,
    Main,
}

export class EventManager {
    private static EVENT_ROOM_SELECTION = 'roomSelection'
    private static EVENT_TILE_SELECTION = 'tileSelection'
    private eventEmitter: EventEmitter

    constructor() {
        this.eventEmitter = new EventEmitter()
    }

    public registerRoomSelected(callBack: (selectedRoomIndex: number | null) => void): void {
        this.eventEmitter.on(EventManager.EVENT_ROOM_SELECTION, selectedRoomIndex => callBack(selectedRoomIndex))
    }

    public notifyRoomSelected(selectedRoomIndex: number | null): void {
        console.debug('EventManager', 'notifyRoomSelected', selectedRoomIndex)
        this.eventEmitter.emit(EventManager.EVENT_ROOM_SELECTION, selectedRoomIndex)
    }

    public registerTileSelection(callBack: (selectedTile: Tile, updateElementTree: boolean) => void): void {
        this.eventEmitter.on(EventManager.EVENT_TILE_SELECTION, (selectedTile, updateElementTree) => callBack(selectedTile, updateElementTree))
    }

    public notifyTileSelection(selectedTile: Tile, updateElementTree: boolean): void {
        console.debug('EventManager', 'notifyTileSelection', selectedTile, updateElementTree)
        this.eventEmitter.emit(EventManager.EVENT_TILE_SELECTION, selectedTile, updateElementTree)
    }
}
