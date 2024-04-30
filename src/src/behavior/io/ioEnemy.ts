import {Enemy} from '../enemy'
import {ENEMY_TYPES} from '../../data/enemyType'
import {DROPS} from '../../data/drop'
import {IO} from './io'

export class IoEnemy {
    static readonly ATTRIBUTE_TYPE = 'type'
    static readonly ATTRIBUTE_HP = 'hp'
    static readonly ATTRIBUTE_NAME = 'name'
    static readonly ATTRIBUTE_LEVEL = 'level'
    static readonly ATTRIBUTE_ATK = 'atk'
    static readonly ATTRIBUTE_DEF = 'def'
    static readonly ATTRIBUTE_EXP = 'exp'
    static readonly ATTRIBUTE_DROP = 'drop'

    static validate(enemy: Enemy, index: number, errors: string[]) {
        IO.checkEnum(enemy.type, ENEMY_TYPES, true, `Enemy ${index} type is invalid`, errors)
        IO.checkNumber(enemy.level, `Enemy ${index} level [${enemy.level}] is invalid`, false, errors)
        IO.checkNotEmpty(enemy.name, `Enemy ${index} name [${enemy.name}] is invalid`, errors)
        IO.checkNumber(enemy.hp, `Enemy ${index} hp [${enemy.hp}] is invalid`, false, errors)
        IO.checkNumber(enemy.atk, `Enemy ${index} atk [${enemy.atk}] is invalid`, true, errors)
        IO.checkNumber(enemy.def, `Enemy ${index} def [${enemy.def}] is invalid`, true, errors)
        IO.checkNumber(enemy.exp, `Enemy ${index} exp [${enemy.exp}] is invalid`, true, errors)
        IO.checkEnum(enemy.drop, DROPS, false, `Enemy ${index} drop [${enemy.drop}] is invalid`, errors)
    }

    static validateEnemies(enemies: Enemy[], errors: string[]) {
        const knownEnemies = []
        enemies.forEach((enemy, index) => {
            const enemyIdentifier = `${enemy.level}|${enemy.type}`
            if (knownEnemies.indexOf(enemyIdentifier) != -1) {
                errors.push(`Enemy ${index} is duplicated (same type and level)`)
            } else {
                knownEnemies.push(enemyIdentifier)
            }
        })
    }

    static fromAttributes(value: Record<string, string | number | null>): Enemy {
        const result: Enemy = new Enemy()
        const enemyType = value[IoEnemy.ATTRIBUTE_TYPE]
        // @ts-ignore
        result.type = (ENEMY_TYPES.map(it => it.valueOf()).indexOf(enemyType) == -1) ? null : enemyType
        // @ts-ignore
        result.level = value[IoEnemy.ATTRIBUTE_LEVEL]
        // @ts-ignore
        result.name = value[IoEnemy.ATTRIBUTE_NAME]
        // @ts-ignore
        result.hp = value[IoEnemy.ATTRIBUTE_HP]
        // @ts-ignore
        result.atk = value[IoEnemy.ATTRIBUTE_ATK]
        // @ts-ignore
        result.def = value[IoEnemy.ATTRIBUTE_DEF]
        // @ts-ignore
        result.exp = value[IoEnemy.ATTRIBUTE_EXP]
        // @ts-ignore
        let drop: string = value[IoEnemy.ATTRIBUTE_DROP]
        if (drop == '') {
            drop = null
        }
        result.drop = (DROPS.indexOf(drop) == -1) ? null : drop
        return result
    }

    static toAttributes(enemy: Enemy): Record<string, string | number | null> {
        return {
            [IoEnemy.ATTRIBUTE_TYPE]: enemy.type ? enemy.type.valueOf() : null,
            [IoEnemy.ATTRIBUTE_LEVEL]: enemy.level,
            [IoEnemy.ATTRIBUTE_NAME]: enemy.name,
            [IoEnemy.ATTRIBUTE_HP]: enemy.hp,
            [IoEnemy.ATTRIBUTE_ATK]: enemy.atk,
            [IoEnemy.ATTRIBUTE_DEF]: enemy.def,
            [IoEnemy.ATTRIBUTE_EXP]: enemy.exp,
            [IoEnemy.ATTRIBUTE_DROP]: enemy.drop ? enemy.drop : '',
        }
    }
}
