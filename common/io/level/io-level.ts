import { IO } from "../io"
import { Level } from "../../models/level"
import { LEVEL_TYPES } from "../../data/level-type"

export class IoLevel {
  static readonly ATTRIBUTE_TYPE = "type"
  static readonly ATTRIBUTE_ADD = "add"
  static readonly ATTRIBUTE_MUL = "mul"

  static validateLevelImport(level: Record<string, number | null>, index: number, errors: string[]): void {
    IO.checkEnum(level[IoLevel.ATTRIBUTE_TYPE], LEVEL_TYPES, true, `Level ${index} type is invalid`, errors)
    const add = level[IoLevel.ATTRIBUTE_ADD]
    IO.checkNumber(add, `Level ${index} add [${add}] is invalid`, true, false, errors)
    const mul = level[IoLevel.ATTRIBUTE_MUL]
    IO.checkNumber(mul, `Level ${index} mul [${mul}] is invalid`, false, false, errors)
  }

  static validateLevelExport(level: Level, index: number, errors: string[]): void {
    IO.checkEnum(level.type, LEVEL_TYPES, true, `Level ${index} type is invalid`, errors)
    IO.checkNumber(level.add, `Level ${index} add [${level.add}] is invalid`, true, false, errors)
    IO.checkNumber(level.mul, `Level ${index} mul [${level.mul}] is invalid`, false, false, errors)
  }
}
