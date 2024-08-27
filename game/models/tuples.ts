import { TILES_IN_ROW } from "../../common/data/constants"

export interface Position2D {
  readonly line: number
  readonly column: number
}

export interface Position3D extends Position2D {
  readonly room: number
}

export class Delta2D implements Position2D {
  static readonly UP: Delta2D = new Delta2D(-1, 0)
  static readonly DOWN: Delta2D = new Delta2D(1, 0)
  static readonly LEFT: Delta2D = new Delta2D(0, -1)
  static readonly RIGHT: Delta2D = new Delta2D(0, 1)

  line: number
  column: number

  protected constructor(line: number, column: number) {
    this.line = line
    this.column = column
  }
}

export function add2D(position: Position2D, delta: Delta2D): Position2D {
  return { line: position.line + delta.line, column: position.column + delta.column }
}

export function add3D(position: Position3D, delta: Delta2D): Position3D {
  return { room: position.room, line: position.line + delta.line, column: position.column + delta.column }
}

export function value2D(position: Position2D): number {
  return position.line * TILES_IN_ROW + position.column
}

export function around(position: Position2D): Delta2D[] {
  const result: Delta2D[] = []
  if (position.line > 0) {
    result.push(Delta2D.UP)
  }
  if (position.line < TILES_IN_ROW - 1) {
    result.push(Delta2D.DOWN)
  }
  if (position.column > 0) {
    result.push(Delta2D.LEFT)
  }
  if (position.column < TILES_IN_ROW - 1) {
    result.push(Delta2D.RIGHT)
  }
  return result
}
