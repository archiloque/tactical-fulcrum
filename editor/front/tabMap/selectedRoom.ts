export enum RoomType {
  standard = 'standard',
  nexus = 'nexus',
}

export const ROOM_TYPES: string[] = [RoomType.standard.valueOf(), RoomType.nexus.valueOf()]

export class SelectedRoom {
  readonly type: RoomType
  readonly index: number
  constructor(type: RoomType, index: number) {
    this.type = type
    this.index = index
  }
}
