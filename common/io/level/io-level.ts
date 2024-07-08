import { IO } from "../io"
import { Level } from "../../models/level"

export class IoLevel {
  static readonly ATTRIBUTE_ATK_ADD = "atkAdd"
  static readonly ATTRIBUTE_ATK_MUL = "atkMul"
  static readonly ATTRIBUTE_DEF_ADD = "defAdd"
  static readonly ATTRIBUTE_DEF_MUL = "defMul"
  static readonly ATTRIBUTE_HP_ADD = "hpAdd"
  static readonly ATTRIBUTE_HP_MUL = "hpMul"
  static readonly ATTRIBUTE_BLUE_KEY = "blueKey"
  static readonly ATTRIBUTE_CRIMSON_KEY = "crimsonKey"
  static readonly ATTRIBUTE_GREEN_BLUE_KEY = "greenBlueKey"
  static readonly ATTRIBUTE_PLATINUM_KEY = "platinumKey"
  static readonly ATTRIBUTE_VIOLET_KEY = "violetKey"
  static readonly ATTRIBUTE_YELLOW_KEY = "yellowKey"

  static validateLevelImport(enemy: Record<string, number | null>, index: number, errors: string[]): void {
    const atkAdd = enemy[IoLevel.ATTRIBUTE_ATK_ADD]
    IO.checkNumber(atkAdd, `Level ${index} atk add [${atkAdd}] is invalid`, true, false, errors)
    const atkMul = enemy[IoLevel.ATTRIBUTE_ATK_MUL]
    IO.checkNumber(atkMul, `Level ${index} atk mul [${atkMul}] is invalid`, true, false, errors)
    const defAdd = enemy[IoLevel.ATTRIBUTE_DEF_ADD]
    IO.checkNumber(defAdd, `Level ${index} def add [${defAdd}] is invalid`, true, false, errors)
    const defMul = enemy[IoLevel.ATTRIBUTE_DEF_MUL]
    IO.checkNumber(defMul, `Level ${index} def mul [${defMul}] is invalid`, true, false, errors)
    const hpAdd = enemy[IoLevel.ATTRIBUTE_HP_ADD]
    IO.checkNumber(hpAdd, `Level ${index} hp add [${hpAdd}] is invalid`, true, false, errors)
    const hpMul = enemy[IoLevel.ATTRIBUTE_HP_MUL]
    IO.checkNumber(hpMul, `Level ${index} hp mul [${hpMul}] is invalid`, true, false, errors)
    const blueKey = enemy[IoLevel.ATTRIBUTE_BLUE_KEY]
    IO.checkNumber(blueKey, `Level ${index} blue keys [${blueKey}] is invalid`, true, false, errors)
    const crimsonKey = enemy[IoLevel.ATTRIBUTE_CRIMSON_KEY]
    IO.checkNumber(crimsonKey, `Level ${index} crimson keys [${crimsonKey}] is invalid`, true, false, errors)
    const greenBlueKey = enemy[IoLevel.ATTRIBUTE_GREEN_BLUE_KEY]
    IO.checkNumber(greenBlueKey, `Level ${index} green blue keys [${greenBlueKey}] is invalid`, true, false, errors)
    const platinumKey = enemy[IoLevel.ATTRIBUTE_PLATINUM_KEY]
    IO.checkNumber(platinumKey, `Level ${index} platinum keys [${platinumKey}] is invalid`, true, false, errors)
    const violetKey = enemy[IoLevel.ATTRIBUTE_VIOLET_KEY]
    IO.checkNumber(violetKey, `Level ${index} violet keys [${violetKey}] is invalid`, true, false, errors)
    const yellowKey = enemy[IoLevel.ATTRIBUTE_YELLOW_KEY]
    IO.checkNumber(yellowKey, `Level ${index} yellow keys [${yellowKey}] is invalid`, true, false, errors)
  }

  static validateLevelExport(level: Level, index: number, errors: string[]): void {
    IO.checkNumber(level.atkAdd, `Level ${index} atk add [${level.atkAdd}] is invalid`, true, false, errors)
    IO.checkNumber(level.atkMul, `Level ${index} atk mul [${level.atkMul}] is invalid`, true, false, errors)
    IO.checkNumber(level.defAdd, `Level ${index} def add [${level.defAdd}] is invalid`, true, false, errors)
    IO.checkNumber(level.defMul, `Level ${index} def mul [${level.defMul}] is invalid`, true, false, errors)
    IO.checkNumber(level.hpAdd, `Level ${index} hp add [${level.hpAdd}] is invalid`, true, false, errors)
    IO.checkNumber(level.hpMul, `Level ${index} hp mul [${level.hpMul}] is invalid`, true, false, errors)
    IO.checkNumber(level.blueKey, `Level ${index} blue keys [${level.blueKey}] is invalid`, true, false, errors)
    IO.checkNumber(
      level.crimsonKey,
      `Level ${index} crimson keys [${level.crimsonKey}] is invalid`,
      true,
      false,
      errors,
    )
    IO.checkNumber(
      level.greenBlueKey,
      `Level ${index} green blue keys [${level.greenBlueKey}] is invalid`,
      true,
      false,
      errors,
    )
    IO.checkNumber(
      level.platinumKey,
      `Level ${index} platinum keys [${level.platinumKey}] is invalid`,
      true,
      false,
      errors,
    )
    IO.checkNumber(level.violetKey, `Level ${index} violet keys [${level.violetKey}] is invalid`, true, false, errors)
    IO.checkNumber(level.yellowKey, `Level ${index} yellow keys [${level.yellowKey}] is invalid`, true, false, errors)
  }
}
