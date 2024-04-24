import {Tower} from './tower'
import {Enemy} from './enemy'

export class ExportStatus {
    readonly content: string
    readonly errors: string[]

    constructor(content: string, errors: string[]) {
        this.content = content
        this.errors = errors
    }
}

export class Export {
    private readonly tower: Tower
    private readonly errors: string[]

    private static ERROR_TYPE_ENEMIES = 'enemies'

    constructor(tower: Tower) {
        this.tower = tower
        this.errors = []
    }

    export(): ExportStatus {
        return new ExportStatus(JSON.stringify({
                enemies: this.tower.enemies.map((enemy: Enemy, enemyIndex: number)=> this.enemyToJson(enemy, enemyIndex)),
            }, null, 2),
            Array.from(this.errors),
        )
    }

    private enemyToJson(enemy: Enemy, enemyIndex: number) {
        this.checkNull(enemy.type, `Enemy ${enemyIndex} type is invalid`)
        this.checkNumber(enemy.level, `Enemy ${enemyIndex} level is invalid`)
        this.checkNotEmpty(enemy.name, `Enemy ${enemyIndex} name is invalid`)
        this.checkNumber(enemy.hp, `Enemy ${enemyIndex} hp is invalid`)
        this.checkNumber(enemy.atk, `Enemy ${enemyIndex} atk is invalid`)
        this.checkNumber(enemy.def, `Enemy ${enemyIndex} def is invalid`)
        this.checkNumber(enemy.exp, `Enemy ${enemyIndex} exp is invalid`)
        this.checkNull(enemy.drop, `Enemy ${enemyIndex} drop is invalid`)

        return {
            type: enemy.type ? enemy.type.valueOf() : null,
            level: enemy.level,
            name: enemy.name,
            hp: enemy.hp,
            atk: enemy.atk,
            def: enemy.def,
            exp: enemy.exp,
            drop: enemy.drop ? enemy.drop.valueOf() : null,
        }
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private checkNull(value: any, message: string): void {
        if (value == null) {
            this.errors.push(message)
        }
    }

    private checkNotEmpty(value: string | null, message: string): void {
        if ((value == null) || (value.length == 0)) {
            this.errors.push(message)
        }
    }

    private checkNumber(value: number | null, message: string): void {
        if ((value == null) || (value == 0)) {
            this.errors.push(message)
        }
    }
}
