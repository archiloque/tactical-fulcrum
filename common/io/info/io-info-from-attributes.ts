import {Info} from '../../models/info'
import {IoInfo} from './io-info'

export class IoInfoFromAttributes {
  static fromAttributes(value: Record<string, string | number>): Info {
    const result: Info = new Info()
    result.atk = value[IoInfo.ATTRIBUTE_ATK] as number
    result.def = value[IoInfo.ATTRIBUTE_DEF] as number
    result.hp = value[IoInfo.ATTRIBUTE_HP] as number
    result.bronzeMedal = value[IoInfo.ATTRIBUTE_BRONZE_MEDAL] as number
    result.silverMedal = value[IoInfo.ATTRIBUTE_SILVER_MEDAL] as number
    result.goldMedal = value[IoInfo.ATTRIBUTE_GOLD_MEDAL] as number
    result.platinumMedal = value[IoInfo.ATTRIBUTE_PLATINUM_MEDAL] as number
    if (value[IoInfo.ATTRIBUTE_DIAMOND_MEDAL] !== undefined) {
      result.diamondMedal = value[IoInfo.ATTRIBUTE_DIAMOND_MEDAL] as number
    }
 else {
      result.diamondMedal = 0
    }
    result.sunStone = value[IoInfo.ATTRIBUTE_SUN_STONE] as number
    return result
  }
}
