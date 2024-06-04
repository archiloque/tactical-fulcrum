import { IoLevel } from "../../../common/io/level/io-level"
import { Level } from "../../../common/models/level"

export class IoLevelToAttributes {
  static toAttributes(level: Level): Record<string, string | number | null> {
    return {
      [IoLevel.ATTRIBUTE_ATK_ADD]: level.atkAdd,
      [IoLevel.ATTRIBUTE_ATK_MUL]: level.atkMul,
      [IoLevel.ATTRIBUTE_DEF_ADD]: level.defAdd,
      [IoLevel.ATTRIBUTE_DEF_MUL]: level.defMul,
      [IoLevel.ATTRIBUTE_HP_ADD]: level.hpAdd,
      [IoLevel.ATTRIBUTE_HP_MUL]: level.hpMul,
      [IoLevel.ATTRIBUTE_BLUE_KEY]: level.blueKey,
      [IoLevel.ATTRIBUTE_CRIMSON_KEY]: level.crimsonKey,
      [IoLevel.ATTRIBUTE_YELLOW_KEY]: level.yellowKey,
    }
  }
}
