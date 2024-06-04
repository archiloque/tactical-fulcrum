import { IOOperation, IOResult } from "../../common/io/import-export"
import { ITEM_NAMES, ItemName } from "../../common/data/item-name"
import { DEFAULT_ITEMS } from "../../common/data/item"
import { Enemy } from "../../common/models/enemy"
import { IoEnemy } from "../../common/io/enemy/io-enemy"
import { IoEnemyToAttributes } from "./enemy/io-enemy-to-attributes"
import { IoInfo } from "../../common/io/info/io-info"
import { IoInfoToAttributes } from "./info/io-info-to-attributes"
import { IoItem } from "../../common/io/item/io-item"
import { IoItemToAttributes } from "./item/io-item-to-attributes"
import { IoLevel } from "../../common/io/level/io-level"
import { IoLevelToAttributes } from "./level/io-level-to-attributes"
import { IoRoom } from "../../common/io/room/io-room"
import { IoRoomToAttributes } from "./room/io-room-to-attributes"
import { Level } from "../../common/models/level"
import { Room } from "../../common/models/room"
import { RoomType } from "../../common/data/room-type"
import { Tower } from "../../common/models/tower"

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
    const info = IoInfoToAttributes.toAttributes(tower.info)
    IoInfo.validateInfoExport(tower.info, this.errors)

    // @ts-ignore
    const items: Record<ItemName, Record<string, number>> = {}
    for (const itemName of ITEM_NAMES) {
      const item = tower.items[itemName]
      IoItem.validateItemExport(itemName, item, this.errors)
      const itemAttributes = IoItemToAttributes.toAttributes(item, DEFAULT_ITEMS[itemName])
      if (itemAttributes != null) {
        items[itemName] = itemAttributes
      }
    }

    IoEnemy.validateEnemiesExport(tower.enemies, this.errors)
    const enemies = tower.enemies.map((enemy: Enemy, index: number) => {
      IoEnemy.validateEnemyExport(enemy, index + 1, this.errors)
      return IoEnemyToAttributes.toAttributes(enemy)
    })
    enemies.sort((e1, e2) => Export.sortEnemies(e1, e2))

    const levels = tower.levels.map((level: Level, index: number) => {
      IoLevel.validateLevelExport(level, index + 1, this.errors)
      return IoLevelToAttributes.toAttributes(level)
    })

    IoRoom.validateRoomsExport(tower.standardRooms, RoomType.standard, this.errors)
    IoRoom.validateRoomsExport(tower.nexusRooms, RoomType.nexus, this.errors)
    const standardRooms = tower.standardRooms.map((room: Room, index: number) => {
      IoRoom.validateRoomExport(room, index + 1, this.errors)
      return IoRoomToAttributes.toAttributes(room)
    })
    const nexusRooms = tower.nexusRooms.map((room: Room, index: number) => {
      IoRoom.validateRoomExport(room, index + 1, this.errors)
      return IoRoomToAttributes.toAttributes(room)
    })

    return new ExportResult(
      JSON.stringify(
        {
          $schema: "tower-schema.json",
          [IOOperation.ATTRIBUTE_NAME]: tower.name,
          [IOOperation.ATTRIBUTE_INFO]: info,
          [IOOperation.ATTRIBUTE_ENEMIES]: enemies,
          [IOOperation.ATTRIBUTE_ITEMS]: items,
          [IOOperation.ATTRIBUTE_LEVELS]: levels,
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

  private static sortEnemies(
    e1: Record<string, string | number | null>,
    e2: Record<string, string | number | null>,
  ): number {
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
  }
}
