import { Info } from "../../../common/models/info"
import { IoInfo } from "../../../common/io/info/io-info"

export class IoInfoToAttributes {
  static toAttributes(info: Info): Record<string, number> {
    const attributes = {
      [IoInfo.ATTRIBUTE_ATK]: info.atk,
      [IoInfo.ATTRIBUTE_DEF]: info.def,
      [IoInfo.ATTRIBUTE_HP]: info.hp,
      [IoInfo.ATTRIBUTE_BRONZE_MEDAL]: info.bronzeMedal,
      [IoInfo.ATTRIBUTE_SILVER_MEDAL]: info.silverMedal,
      [IoInfo.ATTRIBUTE_GOLD_MEDAL]: info.goldMedal,
      [IoInfo.ATTRIBUTE_PLATINUM_MEDAL]: info.platinumMedal,
      [IoInfo.ATTRIBUTE_SUN_STONE]: info.sunStone,
    }
    if (info.diamondMedal !== 0) {
      attributes[IoInfo.ATTRIBUTE_DIAMOND_MEDAL] = info.diamondMedal
    }
    return attributes
  }
}
