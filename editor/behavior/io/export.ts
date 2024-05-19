import { IOOperation, IOResult } from "./importExport"
import { Enemy } from "../enemy"
import { IoEnemy } from "./enemy/ioEnemy"
import { IoEnemyToAttributes } from "./enemy/ioEnemyToAttributes"
import { IoRoom } from "./room/ioRoom"
import { IoRoomToAttributes } from "./room/ioRoomToAttributes"
import { Room } from "../room"
import { RoomType } from "../../front/tabMap/selectedRoom"
import { Tower } from "../tower"

export class ExportResult extends IOResult {
  readonly content: string

  constructor(content: string, errors: string[]) {
    super(errors)
    this.content = content
  }
}

export class Export extends IOOperation {
  constructor() {
    super()
  }

  export(tower: Tower): ExportResult {
    const enemies = tower.enemies.map((enemy: Enemy, index: number) => {
      IoEnemy.validateEnemyExport(enemy, index + 1, this.errors)
      return IoEnemyToAttributes.toAttributes(enemy)
    })
    const standardRooms = tower.standardRooms.map((room: Room, index: number) => {
      IoRoom.validateRoomExport(room, index + 1, this.errors)
      return IoRoomToAttributes.toAttributes(room)
    })
    const nexusRooms = tower.nexusRooms.map((room: Room, index: number) => {
      IoRoom.validateRoomExport(room, index + 1, this.errors)
      return IoRoomToAttributes.toAttributes(room)
    })
    IoEnemy.validateEnemiesExport(tower.enemies, this.errors)
    IoRoom.validateRoomsExport(tower.standardRooms, RoomType.standard, this.errors)
    IoRoom.validateRoomsExport(tower.nexusRooms, RoomType.nexus, this.errors)
    enemies.sort((e1, e2) => {
      if (e1[IoEnemy.ATTRIBUTE_TYPE] !== e2[IoEnemy.ATTRIBUTE_TYPE]) {
        return e1[IoEnemy.ATTRIBUTE_TYPE] > e2[IoEnemy.ATTRIBUTE_TYPE] ? 1 : -1
      } else if (e1[IoEnemy.ATTRIBUTE_LEVEL] !== e2[IoEnemy.ATTRIBUTE_LEVEL]) {
        return (e1[IoEnemy.ATTRIBUTE_LEVEL] as number) - (e2[IoEnemy.ATTRIBUTE_LEVEL] as number)
      } else if (e1[IoEnemy.ATTRIBUTE_NAME] !== e2[IoEnemy.ATTRIBUTE_NAME]) {
        return e1[IoEnemy.ATTRIBUTE_NAME] > e2[IoEnemy.ATTRIBUTE_NAME] ? 1 : -1
      } else if (e1[IoEnemy.ATTRIBUTE_HP] !== e2[IoEnemy.ATTRIBUTE_HP]) {
        return (e1[IoEnemy.ATTRIBUTE_HP] as number) - (e2[IoEnemy.ATTRIBUTE_HP] as number)
      } else if (e1[IoEnemy.ATTRIBUTE_ATK] !== e2[IoEnemy.ATTRIBUTE_ATK]) {
        return (e1[IoEnemy.ATTRIBUTE_ATK] as number) - (e2[IoEnemy.ATTRIBUTE_ATK] as number)
      } else if (e1[IoEnemy.ATTRIBUTE_DEF] !== e2[IoEnemy.ATTRIBUTE_DEF]) {
        return (e1[IoEnemy.ATTRIBUTE_DEF] as number) - (e2[IoEnemy.ATTRIBUTE_DEF] as number)
      } else if (e1[IoEnemy.ATTRIBUTE_EXP] !== e2[IoEnemy.ATTRIBUTE_EXP]) {
        return (e1[IoEnemy.ATTRIBUTE_EXP] as number) - (e2[IoEnemy.ATTRIBUTE_EXP] as number)
      } else if (e1[IoEnemy.ATTRIBUTE_DROP] > e2[IoEnemy.ATTRIBUTE_DROP]) {
        return 1
      } else if (e1[IoEnemy.ATTRIBUTE_DROP] < e2[IoEnemy.ATTRIBUTE_DROP]) {
        return -1
      } else {
        return 0
      }
    })
    return new ExportResult(
      JSON.stringify(
        {
          [IOOperation.ATTRIBUTE_NAME]: tower.name,
          [IOOperation.ATTRIBUTE_ENEMIES]: enemies,
          [IOOperation.ATTRIBUTE_ROOMS]: {
            [IOOperation.ATTRIBUTE_STANDARD]: standardRooms,
            [IOOperation.ATTRIBUTE_NEXUS]: nexusRooms,
          },
        },
        null,
        2,
      ),
      Array.from(this.errors),
    )
  }
}
