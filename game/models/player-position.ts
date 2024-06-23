import { Coordinates, Delta } from "./coordinates"

export class PlayerPosition extends Coordinates {
  readonly room: number

  constructor(room: number, line: number, column: number) {
    super(line, column)
    this.room = room
  }

  add(delta: Delta): PlayerPosition {
    return new PlayerPosition(this.room, this.line + delta.line, this.column + delta.column)
  }
}
