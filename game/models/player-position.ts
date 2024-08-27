import { Position3D } from "./tuples"
import { RoomType } from "../../common/data/room-type"

export class PlayerPosition {
  standard: Position3D
  nexus: Position3D
  roomType: RoomType

  public constructor(standard: Position3D, nexus: Position3D, roomType: RoomType) {
    this.standard = standard
    this.nexus = nexus
    this.roomType = roomType
  }

  public get position(): Position3D {
    switch (this.roomType) {
      case RoomType.standard:
        return this.standard!!
      case RoomType.nexus:
        return this.nexus!!
      default:
        throw new Error("Should not happen")
    }
  }

  public set position(position: Position3D) {
    switch (this.roomType) {
      case RoomType.standard:
        this.standard = position
        return
      case RoomType.nexus:
        this.nexus = position
        return
      default:
        throw new Error("Should not happen")
    }
  }
}
