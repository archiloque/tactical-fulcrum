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
  static readonly ATTRIBUTE_YELLOW_KEY = "yellowKey"

  static readonly ATTRIBUTES: string[] = [
    IoLevel.ATTRIBUTE_ATK_ADD,
    IoLevel.ATTRIBUTE_ATK_MUL,
    IoLevel.ATTRIBUTE_DEF_ADD,
    IoLevel.ATTRIBUTE_DEF_MUL,
    IoLevel.ATTRIBUTE_HP_ADD,
    IoLevel.ATTRIBUTE_HP_MUL,
    IoLevel.ATTRIBUTE_BLUE_KEY,
    IoLevel.ATTRIBUTE_CRIMSON_KEY,
    IoLevel.ATTRIBUTE_YELLOW_KEY,
  ]

  static validateLevelImport(enemy: Record<string, number | null>, index: number, errors: string[]): void {
    const atkAdd = enemy[IoLevel.ATTRIBUTE_ATK_ADD]
    IO.checkNumber(atkAdd, `Level ${index} atk add [${atkAdd}] is invalid`, true, errors)
    const atkMul = enemy[IoLevel.ATTRIBUTE_ATK_MUL]
    IO.checkNumber(atkMul, `Level ${index} atk mul [${atkMul}] is invalid`, true, errors)
    const defAdd = enemy[IoLevel.ATTRIBUTE_DEF_ADD]
    IO.checkNumber(defAdd, `Level ${index} def add [${defAdd}] is invalid`, true, errors)
    const defMul = enemy[IoLevel.ATTRIBUTE_DEF_MUL]
    IO.checkNumber(defMul, `Level ${index} def mul [${defMul}] is invalid`, true, errors)
    const hpAdd = enemy[IoLevel.ATTRIBUTE_HP_ADD]
    IO.checkNumber(hpAdd, `Level ${index} hp add [${hpAdd}] is invalid`, true, errors)
    const hpMul = enemy[IoLevel.ATTRIBUTE_HP_MUL]
    IO.checkNumber(hpMul, `Level ${index} hp mul [${hpMul}] is invalid`, true, errors)
    const blueKey = enemy[IoLevel.ATTRIBUTE_BLUE_KEY]
    IO.checkNumber(blueKey, `Level ${index} blue keys [${blueKey}] is invalid`, true, errors)
    const crimsonKey = enemy[IoLevel.ATTRIBUTE_CRIMSON_KEY]
    IO.checkNumber(crimsonKey, `Level ${index} crimson keys [${crimsonKey}] is invalid`, true, errors)
    const yellowKey = enemy[IoLevel.ATTRIBUTE_BLUE_KEY]
    IO.checkNumber(yellowKey, `Level ${index} yellow keys [${yellowKey}] is invalid`, true, errors)
  }

  static validateLevelExport(level: Level, index: number, errors: string[]): void {
    IO.checkNumber(level.atkAdd, `Level ${index} atk add [${level.atkAdd}] is invalid`, true, errors)
    IO.checkNumber(level.atkMul, `Level ${index} atk mul [${level.atkMul}] is invalid`, true, errors)
    IO.checkNumber(level.defAdd, `Level ${index} def add [${level.defAdd}] is invalid`, true, errors)
    IO.checkNumber(level.defMul, `Level ${index} def mul [${level.defMul}] is invalid`, true, errors)
    IO.checkNumber(level.hpAdd, `Level ${index} hp add [${level.hpAdd}] is invalid`, true, errors)
    IO.checkNumber(level.hpMul, `Level ${index} hp mul [${level.hpMul}] is invalid`, true, errors)
    IO.checkNumber(level.blueKey, `Level ${index} blue keys [${level.blueKey}] is invalid`, true, errors)
    IO.checkNumber(level.crimsonKey, `Level ${index} crimson keys [${level.crimsonKey}] is invalid`, true, errors)
    IO.checkNumber(level.yellowKey, `Level ${index} yellow keys [${level.yellowKey}] is invalid`, true, errors)
  }
}
