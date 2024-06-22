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
      result.push(UP)
    }
    if (this.line < TILES_IN_ROW - 1) {
      result.push(DOWN)
    }
    if (this.column > 0) {
      result.push(LEFT)
    }
    if (this.column < TILES_IN_ROW - 1) {
      result.push(RIGHT)
    }
    return result
  }
}

export class Delta extends Pair {
  constructor(line: number, column: number) {
    super(line, column)
  }
}

export const UP: Delta = new Delta(-1, 0)
export const DOWN: Delta = new Delta(1, 0)
export const LEFT: Delta = new Delta(0, -1)
export const RIGHT: Delta = new Delta(0, 1)
