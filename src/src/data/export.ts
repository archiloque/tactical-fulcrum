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
    private errors: Set<string>

    private static ERROR_TYPE_ENEMIES = 'enemies'

    constructor(tower: Tower) {
        this.tower = tower
        this.errors = new Set()
    }

    export(): ExportStatus {
        return new ExportStatus(JSON.stringify({
                enemies: this.tower.enemies.map(enemy => this.enemyToJson(enemy)),
            }, null, 2),
            Array.from(this.errors),
        )
    }

    private enemyToJson(enemy: Enemy) {
        this.checkNull(enemy.type, Export.ERROR_TYPE_ENEMIES)
        this.checkNotEmpty(enemy.name, Export.ERROR_TYPE_ENEMIES)
        this.checkNumber(enemy.hp, Export.ERROR_TYPE_ENEMIES)
        this.checkNumber(enemy.hp, Export.ERROR_TYPE_ENEMIES)
        this.checkNumber(enemy.atk, Export.ERROR_TYPE_ENEMIES)
        this.checkNumber(enemy.def, Export.ERROR_TYPE_ENEMIES)
        this.checkNumber(enemy.exp, Export.ERROR_TYPE_ENEMIES)
        this.checkNull(enemy.drop, Export.ERROR_TYPE_ENEMIES)

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
    private checkNull(value: any, type: string): void {
        if (value == null) {
            this.errors.add(type)
        }
    }

    private checkNotEmpty(value: string | null, type: string): void {
        if ((value == null) || (value.length == 0)) {
            this.errors.add(type)
        }
    }

    private checkNumber(value: number | null, type: string): void {
        if ((value == null) || (value == 0)) {
            this.errors.add(type)
        }
    }
}
