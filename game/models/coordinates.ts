import { TILES_IN_ROW } from "../../common/data/constants"

abstract class Pair {
  readonly line: number
  readonly column: number

  protected constructor(line: number, column: number) {
    this.line = line
    this.column = column
  }
}

export class Coordinates extends Pair {
  constructor(line: number, column: number) {
    super(line, column)
  }

  value(): number {
    return this.line * TILES_IN_ROW + this.column
  }

  add(delta: Delta): Coordinates {
    return new Coordinates(this.line + delta.line, this.column + delta.column)
  }

  around(): Delta[] {
    const result: Delta[] = []
    if (this.line > 0) {
      result.push(Delta.UP)
    }
    if (this.line < TILES_IN_ROW - 1) {
      result.push(Delta.DOWN)
    }
    if (this.column > 0) {
      result.push(Delta.LEFT)
    }
    if (this.column < TILES_IN_ROW - 1) {
      result.push(Delta.RIGHT)
    }
    return result
  }
}

export class Delta extends Pair {
  static readonly UP: Delta = new Delta(-1, 0)
  static readonly DOWN: Delta = new Delta(1, 0)
  static readonly LEFT: Delta = new Delta(0, -1)
  static readonly RIGHT: Delta = new Delta(0, 1)

  private constructor(line: number, column: number) {
    super(line, column)
  }
}
