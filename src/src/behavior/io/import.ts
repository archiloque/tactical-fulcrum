import {Tower} from '../tower'
import {IoEnemy} from './enemy/ioEnemy'
import {IoEnemyFromAttributes} from './enemy/ioEnemyFromAttributes'
import {IoRoom} from './room/ioRoom'
import {IoRoomFromAttributes} from './room/ioRoomFromAttributes'
import {IOOperation, IOResult} from './importExport'

export class ImportResult extends IOResult {
    readonly content: Tower

    constructor(content: Tower, errors: string[]) {
        super(errors)
        this.content = content
    }
}

export class Import extends IOOperation {
    constructor() {
        super()
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private parsedValueInvalid(value: any): boolean {
        return (value === null) || (!Array.isArray(value))
    }

    import(stringData: string): ImportResult {
        const tower: Tower = new Tower()
        try {
            const parsedData: any = JSON.parse(stringData)
            const enemies = parsedData[IOOperation.ATTRIBUTE_ENEMIES]
            if (this.parsedValueInvalid(enemies)) {
                this.errors.push('Enemies value is invalid')
            } else {
                tower.enemies = enemies.map((value: Record<string, string | number | null>, index: number) => {
                    IoEnemy.validateEnemyImport(value, index + 1, this.errors)
                    return IoEnemyFromAttributes.fromAttributes(value)
                })
                IoEnemy.validateEnemiesImport(enemies, this.errors)
            }
            const rooms = parsedData[IOOperation.ATTRIBUTE_ROOMS]
            if (this.parsedValueInvalid(rooms)) {
                this.errors.push('Rooms value is invalid')
            } else {
                tower.rooms = rooms.map((value: Record<string, string | any>, index: number) => {
                    IoRoom.validateRoomImport(value, index + 1, this.errors)
                    return IoRoomFromAttributes.fromAttributes(value, enemies)
                })
                IoRoom.validateRoomsImport(rooms, this.errors)
            }
        } catch (e) {
            this.errors.push(e.message)
        }
        return new ImportResult(
            tower,
            this.errors,
        )
    }
}
