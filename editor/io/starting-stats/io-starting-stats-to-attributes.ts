import { IoStartingStats } from "./io-starting-stats"
import { StartingStats } from "../../models/starting-stats"

export class IoStartingStatsToAttributes {
  static toAttributes(startingStats: StartingStats): Record<string, number> {
    return {
      [IoStartingStats.ATTRIBUTE_ATK]: startingStats.atk,
      [IoStartingStats.ATTRIBUTE_DEF]: startingStats.def,
      [IoStartingStats.ATTRIBUTE_HP]: startingStats.hp,
    }
  }
}
