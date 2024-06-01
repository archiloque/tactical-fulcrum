import { IOOperation, IOResult } from "./import-export"
import { IoEnemy } from "./enemy/io-enemy"
import { IoEnemyFromAttributes } from "./enemy/io-enemy-from-attributes"
import { IoLevel } from "./level/io-level"
import { IoLevelFromAttributes } from "./level/io-level-from-attributes"
import { IoRoom } from "./room/io-room"
import { IoRoomFromAttributes } from "./room/io-room-from-attributes"
import { IoStartingStats } from "./starting-stats/io-starting-stats"
import { IoStartingStatsFromAttributes } from "./starting-stats/io-starting-stats-from-attributes"
import { Tower } from "../models/tower"
import { ITEM_NAMES } from "../data/item-name"
import { DEFAULT_ITEMS } from "../data/item"
import { IoItemFromAttributes } from "./item/io-item-from-attributes"
import { IoItem } from "./item/io-item"

export class ImportResult extends IOResult {
  readonly tower: Tower

  constructor(content: Tower, errors: string[]) {
    super(errors)
    this.tower = content
  }
}

export class Import extends IOOperation {
  constructor() {
    super()
  }

  private parsedValueInvalidArray(value: any): boolean {
    return value == null || !Array.isArray(value)
  }

  import(stringData: string): ImportResult {
    console.groupCollapsed("Import", "load")
    const tower: Tower = new Tower()
    try {
      const parsedData: any = JSON.parse(stringData)
      const towerName = parsedData[IOOperation.ATTRIBUTE_NAME]
      if (towerName != null) {
        tower.name = towerName
      } else {
        this.errors.push("Tower name is missing")
      }

      this.importEnemies(parsedData, tower)
      this.importItems(parsedData, tower)
      this.importLevels(parsedData, tower)
      this.importStartingStats(parsedData, tower)
      const rooms = parsedData[IOOperation.ATTRIBUTE_ROOMS]
      this.importStandardRooms(rooms, tower)
      this.importNexusRooms(rooms, tower)
    } catch (e) {
      this.errors.push(e.message)
    }
    console.groupEnd()
    return new ImportResult(tower, this.errors)
  }

  private importEnemies(parsedData: Record<string, string | number | null>[], tower: Tower): void {
    const enemies = parsedData[IOOperation.ATTRIBUTE_ENEMIES]
    if (this.parsedValueInvalidArray(enemies)) {
      this.errors.push("Enemies value is invalid")
    } else {
      tower.enemies = enemies.map((value: Record<string, string | number | null>, index: number) => {
        IoEnemy.validateEnemyImport(value, index + 1, this.errors)
        return IoEnemyFromAttributes.fromAttributes(value)
      })
      IoEnemy.validateEnemiesImport(enemies, this.errors)
    }
  }

  private importItems(parsedData: Record<string, number>[], tower: Tower): void {
    const items = parsedData[IOOperation.ATTRIBUTE_ITEMS]
    if (items == null) {
      this.errors.push("Items value is invalid")
    } else {
      for(const itemName of ITEM_NAMES) {
        const item = items[itemName]
        const defaultItem = DEFAULT_ITEMS[itemName]
        if(item == null) {
          tower.items[itemName] = defaultItem
        } else {
          IoItem.validateItemImport(itemName, item, this.errors)
          tower.items[itemName] = IoItemFromAttributes.fromAttributes(item, defaultItem)
        }
      }
    }
  }

  private importLevels(parsedData: Record<string, number | null>[], tower: Tower): void {
    const levels = parsedData[IOOperation.ATTRIBUTE_LEVELS]
    if (this.parsedValueInvalidArray(levels)) {
      this.errors.push("Levels value is invalid")
    } else {
      tower.levels = levels.map((value: Record<string, number | null>, index: number) => {
        IoLevel.validateLevelImport(value, index + 1, this.errors)
        return IoLevelFromAttributes.fromAttributes(value)
      })
    }
  }

  private importNexusRooms(rooms: Record<string, any>[], tower: Tower): void {
    const nexusRooms = rooms[IOOperation.ATTRIBUTE_NEXUS]
    if (nexusRooms != null) {
      if (this.parsedValueInvalidArray(nexusRooms)) {
        this.errors.push("Nexus rooms value is invalid")
      } else {
        tower.nexusRooms = nexusRooms.map((value: Record<string, string | any>, index: number) => {
          IoRoom.validateRoomImport(value, index + 1, this.errors)
          return IoRoomFromAttributes.fromAttributes(value, tower.enemies)
        })
        IoRoom.validateRoomsImport(nexusRooms, this.errors)
      }
    }
  }

  private importStandardRooms(rooms: Record<string, any>[], tower: Tower): void {
    const standardRooms = rooms[IOOperation.ATTRIBUTE_STANDARD]
    if (standardRooms != null) {
      if (this.parsedValueInvalidArray(standardRooms)) {
        this.errors.push("Standard rooms value is invalid")
      } else {
        tower.standardRooms = standardRooms.map((value: Record<string, string | any>, index: number) => {
          IoRoom.validateRoomImport(value, index + 1, this.errors)
          return IoRoomFromAttributes.fromAttributes(value, tower.enemies)
        })
        IoRoom.validateRoomsImport(standardRooms, this.errors)
      }
    }
  }

  private importStartingStats(parsedData: Record<string, string | number | null>[], tower: Tower): void {
    const startingStats = parsedData[IOOperation.ATTRIBUTE_STARTING_STATS]
    if (startingStats == null) {
      this.errors.push("Starting stats value is invalid")
    } else {
      IoStartingStats.validateStartingStatsImport(startingStats, this.errors)
      tower.startingStats = IoStartingStatsFromAttributes.fromAttributes(startingStats)
    }
  }
}
