import { IO } from "../io"
import { StartingStats } from "../../models/starting-stats"

export class IoStartingStats {
  static readonly ATTRIBUTE_ATK = "atk"
  static readonly ATTRIBUTE_DEF = "def"
  static readonly ATTRIBUTE_HP = "hp"
  static readonly ATTRIBUTES: string[] = [
    IoStartingStats.ATTRIBUTE_ATK,
    IoStartingStats.ATTRIBUTE_DEF,
    IoStartingStats.ATTRIBUTE_HP,
  ]

  static validateStartingStatsImport(startingStats: Record<string, string | number | null>, errors: string[]): void {
    for (const attributeName in startingStats) {
      if (IoStartingStats.ATTRIBUTES.indexOf(attributeName) === -1) {
        errors.push(`Starting stats has an unknown [${attributeName}] attribute`)
      }
    }
    const atk = startingStats[IoStartingStats.ATTRIBUTE_HP]
    IO.checkNumber(atk, `Starting stats atk [${atk}] is invalid`, false, false, errors)
    const def = startingStats[IoStartingStats.ATTRIBUTE_HP]
    IO.checkNumber(def, `Starting stats def [${def}] is invalid`, true, false, errors)
    const hp = startingStats[IoStartingStats.ATTRIBUTE_HP]
    IO.checkNumber(hp, `Starting stats hp [${hp}] is invalid`, false, false, errors)
  }

  static validateStartingStatsExport(startingStats: StartingStats, errors: string[]): void {
    IO.checkNumber(startingStats.atk, `Starting stats hp [${startingStats.atk}] is invalid`, false, false, errors)
    IO.checkNumber(startingStats.def, `Starting stats hp [${startingStats.def}] is invalid`, true, false, errors)
    IO.checkNumber(startingStats.hp, `Starting stats hp [${startingStats.hp}] is invalid`, false, false, errors)
  }
}
