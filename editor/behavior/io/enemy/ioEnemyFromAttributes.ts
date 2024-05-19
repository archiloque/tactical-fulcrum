import {DROPS} from '../../../data/drop'
import {ENEMY_TYPES} from '../../../data/enemyType'
import {Enemy} from '../../enemy'
import {IoEnemy} from './ioEnemy'

export class IoEnemyFromAttributes {
  static fromAttributes(value: Record<string, string | number | null>): Enemy {
    const result: Enemy = new Enemy()
    const enemyType = value[IoEnemy.ATTRIBUTE_TYPE]
    result.type = ENEMY_TYPES.find(it => it.valueOf() === enemyType)
    if (result.type === undefined) {
      result.type = null
    }
    result.level = <number>value[IoEnemy.ATTRIBUTE_LEVEL]
    result.name = <string>value[IoEnemy.ATTRIBUTE_NAME]
    result.hp = <number>value[IoEnemy.ATTRIBUTE_HP]
    result.atk = <number>value[IoEnemy.ATTRIBUTE_ATK]
    result.def = <number>value[IoEnemy.ATTRIBUTE_DEF]
    result.exp = <number>value[IoEnemy.ATTRIBUTE_EXP]
    let drop: string = <string>value[IoEnemy.ATTRIBUTE_DROP]
    if (drop === '') {
      drop = null
    }
    result.drop = DROPS.indexOf(drop) === -1 ? null : drop
    return result
  }
}
