import { TILES_IN_ROW } from "../../common/data/constants"

abstract class Pair {
  readonly line: number
  readonly column: number

  protected constructor(line: number, column: number) {
    this.line = line
    this.column = column
  }
}

export class Delta2D extends Pair {
  static readonly UP: Delta2D = new Delta2D(-1, 0)
  static readonly DOWN: Delta2D = new Delta2D(1, 0)
  static readonly LEFT: Delta2D = new Delta2D(0, -1)
  static readonly RIGHT: Delta2D = new Delta2D(0, 1)

  private constructor(line: number, column: number) {
    super(line, column)
  }
}

export class Position2D extends Pair {
  constructor(line: number, column: number) {
    super(line, column)
  }

  value(): number {
    return this.line * TILES_IN_ROW + this.column
  }

  add(delta: Delta2D): Position2D {
    return new Position2D(this.line + delta.line, this.column + delta.column)
  }

  around(): Delta2D[] {
    const result: Delta2D[] = []
    if (this.line > 0) {
      result.push(Delta2D.UP)
    }
    if (this.line < TILES_IN_ROW - 1) {
      result.push(Delta2D.DOWN)
    }
    if (this.column > 0) {
      result.push(Delta2D.LEFT)
    }
    if (this.column < TILES_IN_ROW - 1) {
      result.push(Delta2D.RIGHT)
    }
    return result
  }
}

export class Position3D extends Position2D {
  readonly room: number

  constructor(room: number, line: number, column: number) {
    super(line, column)
    this.room = room
  }

  add(delta: Delta2D): Position3D {
    return new Position3D(this.room, this.line + delta.line, this.column + delta.column)
  }
}
