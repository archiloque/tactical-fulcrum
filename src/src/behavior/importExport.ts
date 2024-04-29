import {Tower} from './tower'
import {Enemy} from './enemy'
import {Level} from './level'
import {IoEnemy} from './io/ioEnemy'
import {IoLevel} from './io/ioLevel'

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

    static readonly ATTRIBUTE_LEVELS = 'levels'
    static readonly ATTRIBUTE_ENEMIES = 'enemies'
}

export class Import extends IOOperation {
    constructor() {
        super()
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private parsedValueValid(value: any) {
        return (value == null) || (!Array.isArray(value))
    }

    import(stringData: string): ImportResult {
        const tower: Tower = new Tower()
        try {
            const parsedData: any = JSON.parse(stringData)
            const enemies = parsedData[IOOperation.ATTRIBUTE_ENEMIES]
            if (!this.parsedValueValid(enemies)) {
                this.errors.push('Enemies value is invalid')
            } else {
                tower.enemies = enemies.map((value, index) => {
                    const enemy: Enemy = IoEnemy.fromAttributes(value)
                    IoEnemy.validate(enemy, index, this.errors)
                    return enemy
                })
            }
            const levels = parsedData[IOOperation.ATTRIBUTE_LEVELS]
            if (!this.parsedValueValid(levels)) {
                this.errors.push('Levels value is invalid')
            } else {
                tower.levels = levels.map((value, index) => {
                    const level: Level = IoLevel.fromAttributes(value)
                    IoLevel.validate(level, index, this.errors)
                    return level
                })
            }
        } catch (e) {
            this.errors.push(e.message)
        }
        IoEnemy.validateEnemies(tower.enemies, this.errors)
        IoLevel.validateLevels(tower.levels, this.errors)
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
            IoEnemy.validate(enemy, index, this.errors)
            return IoEnemy.toAttributes(enemy)
        })
        const levels = tower.levels.map((level: Level, index: number) => {
            IoLevel.validate(level, index, this.errors)
            return IoLevel.toAttributes(level)
        })
        IoEnemy.validateEnemies(tower.enemies, this.errors)
        IoLevel.validateLevels(tower.levels, this.errors)
        enemies.sort((e1, e2) => {
            if (e1[IoEnemy.ATTRIBUTE_TYPE] != e2[IoEnemy.ATTRIBUTE_TYPE]) {
                return (e1[IoEnemy.ATTRIBUTE_TYPE] > e2[IoEnemy.ATTRIBUTE_TYPE]) ? 1 : -1
            } else if (e1[IoEnemy.ATTRIBUTE_LEVEL] != e2[IoEnemy.ATTRIBUTE_LEVEL]) {
                return e1[IoEnemy.ATTRIBUTE_LEVEL] - e2[IoEnemy.ATTRIBUTE_LEVEL]
            } else if (e1[IoEnemy.ATTRIBUTE_NAME] != e2[IoEnemy.ATTRIBUTE_NAME]) {
                return (e1[IoEnemy.ATTRIBUTE_NAME] > e2[IoEnemy.ATTRIBUTE_NAME]) ? 1 : -1
            } else if (e1[IoEnemy.ATTRIBUTE_HP] != e2[IoEnemy.ATTRIBUTE_HP]) {
                return e1[IoEnemy.ATTRIBUTE_HP] - e2[IoEnemy.ATTRIBUTE_HP]
            } else if (e1[IoEnemy.ATTRIBUTE_ATK] != e2[IoEnemy.ATTRIBUTE_ATK]) {
                return e1[IoEnemy.ATTRIBUTE_ATK] - e2[IoEnemy.ATTRIBUTE_ATK]
            } else if (e1[IoEnemy.ATTRIBUTE_DEF] != e2[IoEnemy.ATTRIBUTE_DEF]) {
                return e1[IoEnemy.ATTRIBUTE_DEF] - e2[IoEnemy.ATTRIBUTE_DEF]
            } else if (e1[IoEnemy.ATTRIBUTE_EXP] != e2[IoEnemy.ATTRIBUTE_EXP]) {
                return e1[IoEnemy.ATTRIBUTE_EXP] - e2[IoEnemy.ATTRIBUTE_EXP]
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
                [IOOperation.ATTRIBUTE_LEVELS]: levels,
            }, null, 2),
            Array.from(this.errors),
        )
    }
}
