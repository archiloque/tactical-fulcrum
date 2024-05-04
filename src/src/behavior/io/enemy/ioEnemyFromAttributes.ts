import {Enemy} from '../../enemy'
import {ENEMY_TYPES} from '../../../data/enemyType'
import {DROPS} from '../../../data/drop'
import {IO} from '../io'
import {IoEnemy} from "./ioEnemy";

export class IoEnemyFromAttributes {
    static fromAttributes(value: Record<string, string | number | null>): Enemy {
        const result: Enemy = new Enemy()
        const enemyType = value[IoEnemy.ATTRIBUTE_TYPE]
        // @ts-ignore
        result.type = ENEMY_TYPES.find(it => it.valueOf() === enemyType)
        if (result.type === undefined) {
            result.type = null
        }
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
        if (drop === '') {
            drop = null
        }
        result.drop = (DROPS.indexOf(drop) === -1) ? null : drop
        return result
    }
}
