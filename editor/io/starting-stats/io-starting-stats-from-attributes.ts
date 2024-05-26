import { IoStartingStats } from "./io-starting-stats"
import { StartingStats } from "../../models/starting-stats"

export class IoStartingStatsFromAttributes {
  static fromAttributes(value: Record<string, string | number | null>): StartingStats {
    const result: StartingStats = new StartingStats()
    result.atk = value[IoStartingStats.ATTRIBUTE_ATK] as number
    result.def = value[IoStartingStats.ATTRIBUTE_DEF] as number
    result.hp = value[IoStartingStats.ATTRIBUTE_HP] as number
    return result
  }
}
