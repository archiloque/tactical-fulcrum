import { ScoreType } from "../data/scoreType"

export class Score {
  line: number
  column: number
  type: ScoreType
  constructor(line: number, column: number, type: ScoreType) {
    this.line = line
    this.column = column
    this.type = type
  }
}
