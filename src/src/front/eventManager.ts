import {EventEmitter} from 'pixi.js'
import {Item} from "../data/item";

export class EventManager {
    private static EVENT_ROOM_SELECTED = 'roomSelected'
    private static EVENT_ITEM_SELECTED = 'itemSelected'
    private eventEmitter: EventEmitter

    constructor() {
        this.eventEmitter = new EventEmitter()
    }

    public registerRoomChange(callBack: (selectedRoomIndex: number|null) => void): void {
        this.eventEmitter.on(EventManager.EVENT_ROOM_SELECTED, selectedRoomIndex => callBack(selectedRoomIndex))
    }

    public notifyRoomChange(selectedRoomIndex: number|null): void {
        this.eventEmitter.emit(EventManager.EVENT_ROOM_SELECTED, selectedRoomIndex)
    }

    public registerItemChange(callBack: (selectedItem: Item) => void): void {
        this.eventEmitter.on(EventManager.EVENT_ITEM_SELECTED, selectedItem => callBack(selectedItem))
    }

    public notifyItemChange(selectedItem: Item): void {
        this.eventEmitter.emit(EventManager.EVENT_ITEM_SELECTED, selectedItem)
    }
}
