export class PlayerPosition {
  room: number
  line: number
  column: number

  constructor(room: number, line: number, column: number) {
    this.room = room
    this.line = line
    this.column = column
  }
}
