import {Tower} from '../tower'
import {Enemy} from '../enemy'
import {IoEnemy} from './enemy/ioEnemy'
import {Room} from '../room'
import {IoRoom} from './room/ioRoom'
import {IOOperation, IOStatus} from './importExport'

export class ExportResult extends IOStatus {
    readonly content: string

    constructor(content: string, errors: string[]) {
        super(errors)
        this.content = content
    }
}

export class Export extends IOOperation {
    constructor() {
        super()
    }

    export(tower: Tower): ExportResult {
        const enemies = tower.enemies.map((enemy: Enemy, index: number) => {
            IoEnemy.validateEnemyExport(enemy, index + 1, this.errors)
            return IoEnemy.toAttributes(enemy)
        })
        const rooms = tower.rooms.map((room: Room, index: number) => {
            IoRoom.validateRoomExport(room, index + 1, this.errors)
            return IoRoom.toAttributes(room)
        })
        IoEnemy.validateEnemiesExport(tower.enemies, this.errors)
        IoRoom.validateRoomsExport(tower.rooms, this.errors)
        enemies.sort((e1, e2) => {
            if (e1[IoEnemy.ATTRIBUTE_TYPE] != e2[IoEnemy.ATTRIBUTE_TYPE]) {
                return (e1[IoEnemy.ATTRIBUTE_TYPE] > e2[IoEnemy.ATTRIBUTE_TYPE]) ? 1 : -1
            } else if (e1[IoEnemy.ATTRIBUTE_LEVEL] != e2[IoEnemy.ATTRIBUTE_LEVEL]) {
                return (e1[IoEnemy.ATTRIBUTE_LEVEL] as number) - (e2[IoEnemy.ATTRIBUTE_LEVEL] as number)
            } else if (e1[IoEnemy.ATTRIBUTE_NAME] != e2[IoEnemy.ATTRIBUTE_NAME]) {
                return (e1[IoEnemy.ATTRIBUTE_NAME] > e2[IoEnemy.ATTRIBUTE_NAME]) ? 1 : -1
            } else if (e1[IoEnemy.ATTRIBUTE_HP] != e2[IoEnemy.ATTRIBUTE_HP]) {
                return (e1[IoEnemy.ATTRIBUTE_HP] as number) - (e2[IoEnemy.ATTRIBUTE_HP] as number)
            } else if (e1[IoEnemy.ATTRIBUTE_ATK] != e2[IoEnemy.ATTRIBUTE_ATK]) {
                return (e1[IoEnemy.ATTRIBUTE_ATK] as number) - (e2[IoEnemy.ATTRIBUTE_ATK] as number)
            } else if (e1[IoEnemy.ATTRIBUTE_DEF] != e2[IoEnemy.ATTRIBUTE_DEF]) {
                return (e1[IoEnemy.ATTRIBUTE_DEF] as number) - (e2[IoEnemy.ATTRIBUTE_DEF] as number)
            } else if (e1[IoEnemy.ATTRIBUTE_EXP] != e2[IoEnemy.ATTRIBUTE_EXP]) {
                return (e1[IoEnemy.ATTRIBUTE_EXP] as number) - (e2[IoEnemy.ATTRIBUTE_EXP] as number)
            } else if (e1[IoEnemy.ATTRIBUTE_DROP] > e2[IoEnemy.ATTRIBUTE_DROP]) {
                return 1
            } else if (e1[IoEnemy.ATTRIBUTE_DROP] < e2[IoEnemy.ATTRIBUTE_DROP]) {
                return -1
            } else {
                return 0
            }
        })
        return new ExportResult(JSON.stringify({
                [IOOperation.ATTRIBUTE_ENEMIES]: enemies,
                [IOOperation.ATTRIBUTE_ROOMS]: rooms,
            }, null, 2),
            Array.from(this.errors),
        )
    }
}
