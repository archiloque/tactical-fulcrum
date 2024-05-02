import {Tower} from './tower'
import {Enemy} from './enemy'
import {Room} from './room'
import {IoEnemy} from './io/ioEnemy'
import {IoRoom} from './io/ioRoom'

export abstract class IOStatus {
    readonly errors: string[]

    protected constructor(errors: string[]) {
        this.errors = errors
    }
}

export class ExportResult extends IOStatus {
    readonly content: string

    constructor(content: string, errors: string[]) {
        super(errors)
        this.content = content
    }
}

export class ImportResult extends IOStatus {
    readonly content: Tower

    constructor(content: Tower, errors: string[]) {
        super(errors)
        this.content = content
    }
}

abstract class IOOperation {
    protected readonly errors: string[]

    protected constructor() {
        this.errors = []
    }

    static readonly ATTRIBUTE_ROOMS = 'rooms'
    static readonly ATTRIBUTE_ENEMIES = 'enemies'
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
                    IoEnemy.checkAttributes(value, index + 1, this.errors)
                    const enemy: Enemy = IoEnemy.fromAttributes(value)
                    IoEnemy.validate(enemy, index + 1, this.errors)
                    return enemy
                })
            }
            const rooms = parsedData[IOOperation.ATTRIBUTE_ROOMS]
            if (this.parsedValueInvalid(rooms)) {
                this.errors.push('Rooms value is invalid')
            } else {
                tower.rooms = rooms.map((value: Record<string, string | any>, index: number) => {
                    IoRoom.checkAttributes(value, index + 1, this.errors)
                    const room: Room = IoRoom.fromAttributes(value, enemies)
                    IoRoom.validate(room, index + 1, this.errors)
                    return room
                })
            }
        } catch (e) {
            this.errors.push(e.message)
        }
        IoEnemy.validateEnemies(tower.enemies, this.errors)
        IoRoom.validateRooms(tower.rooms, this.errors)
        return new ImportResult(
            tower,
            this.errors,
        )
    }
}

export class Export extends IOOperation {
    constructor() {
        super()
    }

    export(tower: Tower): ExportResult {
        const enemies = tower.enemies.map((enemy: Enemy, index: number) => {
            IoEnemy.validate(enemy, index + 1, this.errors)
            return IoEnemy.toAttributes(enemy)
        })
        const rooms = tower.rooms.map((room: Room, index: number) => {
            IoRoom.validate(room, index + 1, this.errors)
            return IoRoom.toAttributes(room)
        })
        IoEnemy.validateEnemies(tower.enemies, this.errors)
        IoRoom.validateRooms(tower.rooms, this.errors)
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
