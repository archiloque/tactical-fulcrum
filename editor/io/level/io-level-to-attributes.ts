import { IoLevel } from "../../../common/io/level/io-level"
import { Level } from "../../../common/models/level"

export class IoLevelToAttributes {
  static toAttributes(level: Level): Record<string, string | number | null> {
    return {
      [IoLevel.ATTRIBUTE_TYPE]: level.type ? level.type : null,
      [IoLevel.ATTRIBUTE_ADD]: level.add,
      [IoLevel.ATTRIBUTE_MUL]: level.mul,
    }
  }
}
