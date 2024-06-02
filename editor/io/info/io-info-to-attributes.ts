import { Info } from "../../models/info"
import { IoInfo } from "./io-info"

export class IoInfoToAttributes {
  static toAttributes(info: Info): Record<string, number> {
    return {
      [IoInfo.ATTRIBUTE_ATK]: info.atk,
      [IoInfo.ATTRIBUTE_DEF]: info.def,
      [IoInfo.ATTRIBUTE_HP]: info.hp,
      [IoInfo.ATTRIBUTE_BRONZE_MEDAL]: info.bronzeMedal,
      [IoInfo.ATTRIBUTE_SILVER_MEDAL]: info.silverMedal,
      [IoInfo.ATTRIBUTE_GOLD_MEDAL]: info.goldMedal,
      [IoInfo.ATTRIBUTE_PLATINUM_MEDAL]: info.platinumMedal,
      [IoInfo.ATTRIBUTE_DIAMOND_MEDAL]: info.diamondMedal,
      [IoInfo.ATTRIBUTE_MOON_MEDAL]: info.moonMedal,
    }
  }
}
