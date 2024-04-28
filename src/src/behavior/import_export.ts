import {Tower} from './tower'
import {Enemy} from './enemy'
import {ENEMY_TYPES} from '../data/enemyType'
import {DROPS} from '../data/drop'
import {Level} from "./level";

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

    protected validateEnemies(enemies: Enemy[]) {
        const knownEnemies = []
        enemies.forEach((enemy, index) => {
            const enemyIdentifier = `${enemy.level}|${enemy.type}`
            if (knownEnemies.indexOf(enemyIdentifier) != -1) {
                this.errors.push(`Enemy ${index} is duplicated (samy type and level)`)
            }
 else {
                knownEnemies.push(enemyIdentifier)
            }
        })
    }

    protected validateEnemy(enemy: Enemy, enemyIndex: number) {
        this.checkEnum(enemy.type, ENEMY_TYPES, true, `Enemy ${enemyIndex} type is invalid`)
        this.checkNumber(enemy.level, `Enemy ${enemyIndex} level [${enemy.level}] is invalid`, false)
        this.checkNotEmpty(enemy.name, `Enemy ${enemyIndex} name [${enemy.name}] is invalid`)
        this.checkNumber(enemy.hp, `Enemy ${enemyIndex} hp [${enemy.hp}] is invalid`, false)
        this.checkNumber(enemy.atk, `Enemy ${enemyIndex} atk [${enemy.atk}] is invalid`, true)
        this.checkNumber(enemy.def, `Enemy ${enemyIndex} def [${enemy.def}] is invalid`, true)
        this.checkNumber(enemy.exp, `Enemy ${enemyIndex} exp [${enemy.exp}] is invalid`, true)
        this.checkEnum(enemy.drop, DROPS, false, `Enemy ${enemyIndex} drop [${enemy.drop}] is invalid`)
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private checkEnum(value: any, values: string[], mandatory: boolean, message: string): void {
        if ((value == null) || (value == '')) {
            if (mandatory) {
                this.errors.push(message)
            }
            return
        }
        if (values.indexOf(value) == -1) {
            this.errors.push(message)
        }
    }

    private checkNotEmpty(value: string | null, message: string): void {
        if ((value == null) || (value.length == 0)) {
            this.errors.push(message)
        }
    }

    private checkNumber(value: string | number | null, message: string, zeroAuthorized: boolean): void {
        if (value == null) {
            this.errors.push(message)
        }
 else if (typeof value == 'number') {
            if (zeroAuthorized) {
                if (value < 0) {
                    this.errors.push(message)
                }
            }
 else {
                if (value <= 0) {
                    this.errors.push(message)
                }
            }
        }
 else {
            const v = parseInt(value)
            if (zeroAuthorized) {
                if ((isNaN(v) || v < 0)) {
                    this.errors.push(message)
                }
            }
 else {
                if ((isNaN(v) || v <= 0)) {
                    this.errors.push(message)
                }
            }
        }
    }
}

export class Import extends IOOperation {
    constructor() {
        super()
    }

    import(stringData: string): ImportResult {
        const tower: Tower = new Tower()
        try {
            const parsedData = JSON.parse(stringData)
            if ((parsedData['enemies'] == null) || (!Array.isArray(parsedData['enemies']))) {
                this.errors.push('Enemies value is invalid')
            }
 else {
                const enemies: any[] = parsedData['enemies']
                tower.enemies = enemies.map((value, index) => {
                    const enemy: Enemy = Import.enemyFromAttributes(value)
                    this.validateEnemy(enemy, index)
                    return enemy
                })
            }
        }
 catch (e) {
            this.errors.push(e.message)
        }
        this.validateEnemies(tower.enemies)
        return new ImportResult(
            tower,
            this.errors,
        )
    }

    static enemyFromAttributes(value: object): Enemy {
        const result: Enemy = new Enemy()
        const enemyType = value['type']
        result.type = (ENEMY_TYPES.map(it => it.valueOf()).indexOf(enemyType) == -1) ? null : enemyType
        result.level = value['level']
        result.name = value['name']
        result.hp = value['hp']
        result.atk = value['atk']
        result.def = value['def']
        result.exp = value['exp']
        let drop: string = value['drop']
        if (drop == '') {
            drop = null
        }
        result.drop = (DROPS.indexOf(drop) == -1) ? null : drop
        return result
    }

    static levelFromAttributes(value: object): Level {
        const result: Level = new Level()
        result.name = value['name']
        return result
    }
}

export class Export extends IOOperation {
    constructor() {
        super()
    }

    export(tower: Tower): ExportResult {
        const enemies = tower.enemies.map((enemy: Enemy, enemyIndex: number) => {
            this.validateEnemy(enemy, enemyIndex)
            return Export.enemyToAttributes(enemy)
        })
        this.validateEnemies(tower.enemies)
        enemies.sort((e1, e2) => {
            if (e1['type'] != e2['type']) {
                return (e1['type'] > e2['type']) ? 1 : -1
            }
 else if (e1['level'] != e2['level']) {
                return e1['level'] - e2['level']
            }
 else if (e1['name'] != e2['name']) {
                return (e1['name'] > e2['name']) ? 1 : -1
            }
 else if (e1['hp'] != e2['hp']) {
                return e1['hp'] - e2['hp']
            }
 else if (e1['atk'] != e2['atk']) {
                return e1['atk'] - e2['atk']
            }
 else if (e1['def'] != e2['def']) {
                return e1['def'] - e2['def']
            }
 else if (e1['exp'] != e2['exp']) {
                return e1['exp'] - e2['exp']
            }
 else if (e1['drop'] > e2['drop']) {
                return 1
            }
 else if (e1['drop'] < e2['drop']) {
                return -1
            }
 else {
                return 0
            }
        })
        return new ExportResult(JSON.stringify({
                enemies: enemies,
            }, null, 2),
            Array.from(this.errors),
        )
    }

    static enemyToAttributes(enemy: Enemy) {
        return {
            type: enemy.type ? enemy.type.valueOf() : null,
            level: enemy.level,
            name: enemy.name,
            hp: enemy.hp,
            atk: enemy.atk,
            def: enemy.def,
            exp: enemy.exp,
            drop: enemy.drop ? enemy.drop : '',
        }
    }

    static levelToAttributes(level: Level) {
        return {
            name: level.name,
        }
    }
}
