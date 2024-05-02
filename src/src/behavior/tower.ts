import {Room} from './room'
import {Enemy} from './enemy'
import {IoEnemy} from './io/ioEnemy'
import {IoRoom} from './io/ioRoom'

export class Tower {
    private static readonly LOCAL_STORAGE_KEY_ENEMIES = 'editorEnemies'
    private static readonly LOCAL_STORAGE_KEY_LEVELS = 'editorRooms'
    enemies: Enemy[]
    rooms: Room[]

    constructor() {
        this.enemies = []
        const room1 = new Room()
        room1.name = 'Room 1'
        const room2 = new Room()
        room2.name = 'Room 2'
        this.rooms = [room1, room2]
    }

    saveEnemies() {
        console.debug('Tower', 'saveEnemies')
        localStorage.setItem(Tower.LOCAL_STORAGE_KEY_ENEMIES, JSON.stringify(this.enemies.map(e => IoEnemy.toAttributes(e))))
    }

    saveRooms() {
        console.debug('Tower', 'saveRooms')
        localStorage.setItem(Tower.LOCAL_STORAGE_KEY_LEVELS, JSON.stringify(this.rooms.map(l => IoRoom.toAttributes(l))))
    }

    load() {
        console.debug('Tower', 'load')
        const enemiesRaw = localStorage.getItem(Tower.LOCAL_STORAGE_KEY_ENEMIES)
        if (enemiesRaw != null) {
            const enemiesJson: Record<string, string | number | null>[] = JSON.parse(enemiesRaw)
            this.enemies = enemiesJson.map(value => IoEnemy.fromAttributes(value))
            console.debug('Tower', this.enemies.length, 'enemies loaded')
        }

        const roomsRaw = localStorage.getItem(Tower.LOCAL_STORAGE_KEY_LEVELS)
        if (roomsRaw != null) {
            const roomsJson: Record<string, string | number | null>[] = JSON.parse(roomsRaw)
            this.rooms = roomsJson.map(value => IoRoom.fromAttributes(value))
            console.debug('Tower', this.rooms.length, 'rooms loaded')
        }
    }
}
