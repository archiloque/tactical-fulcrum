import {Enemy} from '../../../common/models/enemy'
import {IoEnemy} from '../../../common/io/enemy/io-enemy'

export class IoEnemyToAttributes {
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
