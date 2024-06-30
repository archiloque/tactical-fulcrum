import {ScoreType} from '../data/score-type'

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
