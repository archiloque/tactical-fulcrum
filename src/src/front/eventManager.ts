import {EventEmitter} from 'pixi.js'

export const EVENT_ROOM_SELECT_NO_ROOM_SELECTED = -1

export class EventManager {
    private static EVENT_ROOM_SELECT = 'roomSelected'
    private eventEmitter: EventEmitter

    constructor() {
        this.eventEmitter = new EventEmitter()
    }

    public registerRoomChange(callBack: (selectedRoomIndex: number) => void): void {
        this.eventEmitter.on(EventManager.EVENT_ROOM_SELECT, selectedRoomIndex => callBack(selectedRoomIndex))
    }

    public notifyRoomChange(selectedRoomIndex: number): void {
        this.eventEmitter.emit(EventManager.EVENT_ROOM_SELECT, selectedRoomIndex)
    }
}
