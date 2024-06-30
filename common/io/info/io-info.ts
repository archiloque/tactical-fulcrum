import {Info} from '../../models/info'
import {IO} from '../io'

export class IoInfo {
  static readonly ATTRIBUTE_ATK = 'atk'
  static readonly ATTRIBUTE_DEF = 'def'
  static readonly ATTRIBUTE_HP = 'hp'
  static readonly ATTRIBUTE_BRONZE_MEDAL = 'bronzeMedal'
  static readonly ATTRIBUTE_SILVER_MEDAL = 'silverMedal'
  static readonly ATTRIBUTE_GOLD_MEDAL = 'goldMedal'
  static readonly ATTRIBUTE_PLATINUM_MEDAL = 'platinumMedal'
  static readonly ATTRIBUTE_DIAMOND_MEDAL = 'diamondMedal'
  static readonly ATTRIBUTE_SUN_STONE = 'sunStone'

  static readonly ATTRIBUTES: string[] = [
    IoInfo.ATTRIBUTE_ATK,
    IoInfo.ATTRIBUTE_DEF,
    IoInfo.ATTRIBUTE_HP,
    IoInfo.ATTRIBUTE_BRONZE_MEDAL,
    IoInfo.ATTRIBUTE_SILVER_MEDAL,
    IoInfo.ATTRIBUTE_GOLD_MEDAL,
    IoInfo.ATTRIBUTE_PLATINUM_MEDAL,
    IoInfo.ATTRIBUTE_DIAMOND_MEDAL,
    IoInfo.ATTRIBUTE_SUN_STONE,
  ]

  static validateInfoImport(info: Record<string, string | number | null>, errors: string[]): void {
    for (const attributeName in info) {
      if (IoInfo.ATTRIBUTES.indexOf(attributeName) === -1) {
        errors.push(`Info has an unknown [${attributeName}] attribute`)
      }
    }
    const atk = info[IoInfo.ATTRIBUTE_ATK]
    IO.checkNumber(atk, `Info atk [${atk}] is invalid`, false, false, errors)
    const def = info[IoInfo.ATTRIBUTE_DEF]
    IO.checkNumber(def, `Info def [${def}] is invalid`, true, false, errors)
    const hp = info[IoInfo.ATTRIBUTE_HP]
    IO.checkNumber(hp, `Info hp [${hp}] is invalid`, false, false, errors)
    const bronzeMedal = info[IoInfo.ATTRIBUTE_BRONZE_MEDAL]
    IO.checkNumber(bronzeMedal, `Info bronze medal [${bronzeMedal}] is invalid`, false, false, errors)
    const silverMedal = info[IoInfo.ATTRIBUTE_SILVER_MEDAL]
    IO.checkNumber(silverMedal, `Info silver medal [${silverMedal}] is invalid`, false, false, errors)
    const goldMedal = info[IoInfo.ATTRIBUTE_GOLD_MEDAL]
    IO.checkNumber(goldMedal, `Info gold medal [${goldMedal}] is invalid`, false, false, errors)
    const platinumMedal = info[IoInfo.ATTRIBUTE_PLATINUM_MEDAL]
    IO.checkNumber(platinumMedal, `Info platinum medal [${platinumMedal}] is invalid`, false, false, errors)
    const diamondMedal = info[IoInfo.ATTRIBUTE_DIAMOND_MEDAL]
    IO.checkNumber(diamondMedal, `Info diamond medal [${diamondMedal}] is invalid`, false, true, errors)
    const sunStone = info[IoInfo.ATTRIBUTE_SUN_STONE]
    IO.checkNumber(sunStone, `Info sun stone [${sunStone}] is invalid`, false, true, errors)
  }

  static validateInfoExport(info: Info, errors: string[]): void {
    IO.checkNumber(info.atk, `Info hp [${info.atk}] is invalid`, false, false, errors)
    IO.checkNumber(info.def, `Info hp [${info.def}] is invalid`, true, false, errors)
    IO.checkNumber(info.hp, `Info hp [${info.hp}] is invalid`, false, false, errors)
    IO.checkNumber(info.bronzeMedal, `Info bronze medal [${info.bronzeMedal}] is invalid`, false, false, errors)
    IO.checkNumber(info.silverMedal, `Info silver medal [${info.silverMedal}] is invalid`, false, false, errors)
    IO.checkNumber(info.goldMedal, `Info gold medal [${info.goldMedal}] is invalid`, false, false, errors)
    IO.checkNumber(info.platinumMedal, `Info platinum medal [${info.platinumMedal}] is invalid`, false, false, errors)
    IO.checkNumber(info.diamondMedal, `Info diamond medal [${info.diamondMedal}] is invalid`, false, true, errors)
    IO.checkNumber(info.sunStone, `Info sun stone [${info.sunStone}] is invalid`, true, false, errors)
  }
}
