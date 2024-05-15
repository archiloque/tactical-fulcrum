export enum RoomType {
  standard = "standard",
  nexus = "nexus",
}

export class SelectedRoom {
  readonly roomType: RoomType
  readonly index: number
  constructor(roomType: RoomType, index: number) {
    this.roomType = roomType
    this.index = index
  }
}
