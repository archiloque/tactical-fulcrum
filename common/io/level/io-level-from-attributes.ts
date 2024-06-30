import {IoLevel} from './io-level'
import {Level} from '../../models/level'

export class IoLevelFromAttributes {
  static fromAttributes(value: Record<string, string | number | null>): Level {
    const result: Level = new Level()
    result.atkAdd = value[IoLevel.ATTRIBUTE_ATK_ADD] as number
    result.atkMul = value[IoLevel.ATTRIBUTE_ATK_MUL] as number
    result.defAdd = value[IoLevel.ATTRIBUTE_DEF_ADD] as number
    result.defMul = value[IoLevel.ATTRIBUTE_DEF_MUL] as number
    result.hpAdd = value[IoLevel.ATTRIBUTE_HP_ADD] as number
    result.hpMul = value[IoLevel.ATTRIBUTE_HP_MUL] as number
    result.blueKey = value[IoLevel.ATTRIBUTE_BLUE_KEY] as number
    result.crimsonKey = value[IoLevel.ATTRIBUTE_CRIMSON_KEY] as number
    result.yellowKey = value[IoLevel.ATTRIBUTE_YELLOW_KEY] as number
    return result
  }
}
