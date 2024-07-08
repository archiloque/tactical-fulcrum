import { IoLevel } from "./io-level"
import { Level } from "../../models/level"
import { LEVEL_TYPES } from "../../data/level-type"

export class IoLevelFromAttributes {
  static fromAttributes(value: Record<string, string | number | null>): Level {
    const result: Level = new Level()
    const levelType = value[IoLevel.ATTRIBUTE_TYPE]
    const possibleType = LEVEL_TYPES.find((it) => it === levelType)
    if (possibleType === undefined) {
      result.type = null
    } else {
      result.type = possibleType
    }

    result.add = value[IoLevel.ATTRIBUTE_ADD] as number
    result.mul = value[IoLevel.ATTRIBUTE_MUL] as number
    return result
  }
}
