import { EMPTY_TILE, EnemyTile, TileType } from "../../common/models/tile"
import {
  LOCAL_STORAGE_KEY_ENEMIES,
  LOCAL_STORAGE_KEY_INFO,
  LOCAL_STORAGE_KEY_ITEMS,
  LOCAL_STORAGE_KEY_LEVELS,
  LOCAL_STORAGE_KEY_NAME,
  LOCAL_STORAGE_KEY_ROOMS,
} from "../io/local-storage"
import { DEFAULT_ITEMS } from "../../common/data/item"
import { Enemy } from "../../common/models/enemy"
import { IoEnemyFromAttributes } from "../../common/io/enemy/io-enemy-from-attributes"
import { IoEnemyToAttributes } from "../io/enemy/io-enemy-to-attributes"
import { IoInfoFromAttributes } from "../../common/io/info/io-info-from-attributes"
import { IoInfoToAttributes } from "../io/info/io-info-to-attributes"
import { IoItemFromAttributes } from "../../common/io/item/io-item-from-attributes"
import { IoItemToAttributes } from "../io/item/io-item-to-attributes"
import { IoLevelFromAttributes } from "../../common/io/level/io-level-from-attributes"
import { IoLevelToAttributes } from "../io/level/io-level-to-attributes"
import { IOOperation } from "../../common/io/import-export"
import { IoRoomFromAttributes } from "../../common/io/room/io-room-from-attributes"
import { IoRoomToAttributes } from "../io/room/io-room-to-attributes"
import { ITEM_NAMES } from "../../common/data/item-name"
import { Level } from "../../common/models/level"
import { Room } from "../../common/models/room"
import { RoomType } from "../../common/data/room-type"
import { ScoreType } from "../../common/data/score-type"
import { Tower } from "../../common/models/tower"

export class EditorTower extends Tower {
  public removeScore(roomType: RoomType, scoreType: ScoreType): void {
    const rooms = this.getRooms(roomType)
    for (const room of rooms) {
      const selectedScoreIndex = room.scores.findIndex((score) => {
        return score.type === scoreType
      })
      if (selectedScoreIndex !== -1) {
        room.scores.splice(selectedScoreIndex, 1)
      }
    }
  }

  countEnemies(enemy: Enemy): number {
    return this.countEnemiesInRooms(enemy, this.standardRooms) + this.countEnemiesInRooms(enemy, this.nexusRooms)
  }

  private countEnemiesInRooms(enemy: Enemy, rooms: Room[]): number {
    let result = 0
    for (const room of rooms) {
      for (const tileLines of room.tiles) {
        for (const tile of tileLines) {
          if (tile.type === TileType.enemy) {
            const enemyTile = tile as EnemyTile
            if (enemyTile.enemyType === enemy.type && enemyTile.level === enemy.level) {
              result += 1
            }
          }
        }
      }
    }
    return result
  }

  deleteEnemy(enemy: Enemy): void {
    this.enemies.splice(this.enemies.indexOf(enemy), 1)
    this.saveEnemies()
    const rooms = this.standardRooms
    this.deleteEnemiesInRooms(enemy, rooms)
    this.saveRooms()
  }

  private deleteEnemiesInRooms(enemy: Enemy, rooms: Room[]): void {
    for (const room of rooms) {
      for (const tileLines of room.tiles) {
        tileLines.forEach((tile, index) => {
          if (tile.type === TileType.enemy) {
            const enemyTile = tile as EnemyTile
            if (enemyTile.enemyType === enemy.type && enemyTile.level === enemy.level) {
              tileLines[index] = EMPTY_TILE
            }
          }
        })
      }
    }
  }

  saveEnemies(): void {
    console.debug("Tower", "saveEnemies")
    localStorage.setItem(
      LOCAL_STORAGE_KEY_ENEMIES,
      JSON.stringify(this.enemies.map((e) => IoEnemyToAttributes.toAttributes(e))),
    )
  }

  deleteLevel(level: Level): void {
    this.levels.splice(this.levels.indexOf(level), 1)
    this.saveLevels()
  }

  saveLevels(): void {
    console.debug("Tower", "saveLevels")
    localStorage.setItem(
      LOCAL_STORAGE_KEY_LEVELS,
      JSON.stringify(this.levels.map((e) => IoLevelToAttributes.toAttributes(e))),
    )
  }

  saveItems(): void {
    console.debug("Tower", "saveItems")
    localStorage.setItem(LOCAL_STORAGE_KEY_ITEMS, JSON.stringify(IoItemToAttributes.toValues(this.items)))
  }

  saveName(): void {
    console.debug("Tower", "saveName")
    localStorage.setItem(LOCAL_STORAGE_KEY_NAME, this.name)
  }

  saveRooms(): void {
    console.debug("Tower", "saveRooms")
    localStorage.setItem(
      LOCAL_STORAGE_KEY_ROOMS,
      JSON.stringify({
        [IOOperation.ATTRIBUTE_STANDARD]: this.standardRooms.map((r) => {
          return IoRoomToAttributes.toAttributes(r)
        }),
        [IOOperation.ATTRIBUTE_NEXUS]: this.nexusRooms.map((r) => {
          return IoRoomToAttributes.toAttributes(r)
        }),
      }),
    )
  }

  saveInfo(): void {
    console.debug("Tower", "saveInfo")
    localStorage.setItem(LOCAL_STORAGE_KEY_INFO, JSON.stringify(IoInfoToAttributes.toAttributes(this.info)))
  }

  load(): void {
    console.groupCollapsed("Tower", "load")
    this.loadName()
    this.loadInfo()
    this.loadEnemies()
    this.loadItems()
    this.loadLevels()
    this.loadRooms()
    console.groupEnd()
  }

  private loadEnemies(): void {
    const enemiesRaw = localStorage.getItem(LOCAL_STORAGE_KEY_ENEMIES)
    if (enemiesRaw != null) {
      const enemiesJson: Record<string, string | number | null>[] = JSON.parse(enemiesRaw)
      this.enemies = enemiesJson.map((value) => IoEnemyFromAttributes.fromAttributes(value))
      console.debug("Tower", this.enemies.length, "enemies loaded")
    }
  }

  private loadItems(): void {
    const itemsRaw = localStorage.getItem(LOCAL_STORAGE_KEY_ITEMS)
    if (itemsRaw != null) {
      const itemsJson: Record<string, number>[] = JSON.parse(itemsRaw)

      for (const itemName of ITEM_NAMES) {
        // @ts-ignore
        const initialValue = itemsJson[itemName]
        if (initialValue != null) {
          this.items[itemName] = IoItemFromAttributes.fromAttributes(initialValue, DEFAULT_ITEMS[itemName])
        } else {
          this.items[itemName] = DEFAULT_ITEMS[itemName].clone()
        }
      }
      console.debug("Tower", "items loaded")
    }
  }

  private loadLevels(): void {
    const levelsRaw = localStorage.getItem(LOCAL_STORAGE_KEY_LEVELS)
    if (levelsRaw != null) {
      const levelsJson: Record<string, number | null>[] = JSON.parse(levelsRaw)
      this.levels = levelsJson.map((value) => IoLevelFromAttributes.fromAttributes(value))
      console.debug("Tower", this.levels.length, "levels loaded")
    }
  }

  private loadRooms(): void {
    const roomsRaw = localStorage.getItem(LOCAL_STORAGE_KEY_ROOMS)
    if (roomsRaw != null) {
      const roomsJson: Record<string, Record<string, string | number | null>>[] = JSON.parse(roomsRaw)
      // @ts-ignore
      if (roomsJson[IOOperation.ATTRIBUTE_STANDARD] != null) {
        // @ts-ignore
        this.standardRooms = roomsJson[IOOperation.ATTRIBUTE_STANDARD].map((value: Record<string, string | any>) =>
          IoRoomFromAttributes.fromAttributes(value, this.enemies),
        )
        console.debug("Tower", this.standardRooms.length, "standard rooms loaded")
      }
      // @ts-ignore
      if (roomsJson[IOOperation.ATTRIBUTE_NEXUS] != null) {
        // @ts-ignore
        this.nexusRooms = roomsJson[IOOperation.ATTRIBUTE_NEXUS].map((value) =>
          IoRoomFromAttributes.fromAttributes(value, this.enemies),
        )
        console.debug("Tower", this.standardRooms.length, "nexus rooms loaded")
      }
    }
  }

  private loadInfo(): void {
    const infoRaw = localStorage.getItem(LOCAL_STORAGE_KEY_INFO)
    if (infoRaw != null) {
      const infoJson: Record<string, number> = JSON.parse(infoRaw)
      this.info = IoInfoFromAttributes.fromAttributes(infoJson)
      console.debug("Tower", "info loaded")
    }
  }

  private loadName(): void {
    const nameRaw = localStorage.getItem(LOCAL_STORAGE_KEY_NAME)
    if (nameRaw != null) {
      this.name = nameRaw
      console.debug("Tower", "name loaded")
    }
  }
}
