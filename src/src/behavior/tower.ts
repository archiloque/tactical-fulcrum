import { Room } from "./room"
import { Enemy } from "./enemy"
import { IoEnemyFromAttributes } from "./io/enemy/ioEnemyFromAttributes"
import { IoRoomFromAttributes } from "./io/room/ioRoomFromAttributes"
import { IoEnemyToAttributes } from "./io/enemy/ioEnemyToAttributes"
import { IoRoomToAttributes } from "./io/room/ioRoomToAttributes"
import {
  LOCAL_STORAGE_KEY_ENEMIES,
  LOCAL_STORAGE_KEY_ROOMS,
} from "./io/localStorage"
import { EMPTY_TILE, EnemyTile, TileType } from "./tile"
import { IOOperation } from "./io/importExport"
import { RoomType } from "../front/tabMap/selectedRoom"

export class Tower {
  enemies: Enemy[]
  standardRooms: Room[]
  nexusRooms: Room[]

  constructor() {
    this.enemies = []
    const standardRoom = new Room()
    standardRoom.name = "Standard room"
    const nexusRoom = new Room()
    nexusRoom.name = "Nexus room"
    this.standardRooms = [standardRoom]
    this.nexusRooms = [nexusRoom]
  }

  public getRooms(roomType: RoomType): Room[] {
    switch (roomType) {
      case RoomType.standard:
        return this.standardRooms
      case RoomType.nexus:
        return this.nexusRooms
    }
  }

  countEnemies(enemy: Enemy): number {
    return (
      this.countEnemiesInRooms(enemy, this.standardRooms) +
      this.countEnemiesInRooms(enemy, this.nexusRooms)
    )
  }

  private countEnemiesInRooms(enemy: Enemy, rooms: Room[]): number {
    let result = 0
    for (const room of rooms) {
      for (const tileLines of room.tiles) {
        for (const tile of tileLines) {
          if (
            tile.getType() === TileType.enemy &&
            (tile as EnemyTile).enemy.equals(enemy)
          ) {
            result += 1
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
          if (
            tile.getType() === TileType.enemy &&
            (tile as EnemyTile).enemy.equals(enemy)
          ) {
            tileLines[index] = EMPTY_TILE
          }
        })
      }
    }
  }

  saveEnemies(): void {
    console.debug("Tower", "saveEnemies")
    localStorage.setItem(
      LOCAL_STORAGE_KEY_ENEMIES,
      JSON.stringify(
        this.enemies.map((e) => IoEnemyToAttributes.toAttributes(e)),
      ),
    )
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

  load(): void {
    console.groupCollapsed("Tower", "load")
    this.loadEnemies()
    this.loadRooms()
    console.groupEnd()
  }

  private loadRooms(): void {
    const roomsRaw = localStorage.getItem(LOCAL_STORAGE_KEY_ROOMS)
    if (roomsRaw != null) {
      const roomsJson: Record<
        string,
        Record<string, string | number | null>
      >[] = JSON.parse(roomsRaw)
      if (roomsJson[IOOperation.ATTRIBUTE_STANDARD] != null) {
        this.standardRooms = roomsJson[IOOperation.ATTRIBUTE_STANDARD].map(
          (value) => IoRoomFromAttributes.fromAttributes(value, this.enemies),
        )
        console.debug(
          "Tower",
          this.standardRooms.length,
          "standard rooms loaded",
        )
      }
      if (roomsJson[IOOperation.ATTRIBUTE_NEXUS] != null) {
        this.nexusRooms = roomsJson[IOOperation.ATTRIBUTE_NEXUS].map((value) =>
          IoRoomFromAttributes.fromAttributes(value, this.enemies),
        )
        console.debug("Tower", this.standardRooms.length, "nexus rooms loaded")
      }
    }
  }

  private loadEnemies(): void {
    const enemiesRaw = localStorage.getItem(LOCAL_STORAGE_KEY_ENEMIES)
    if (enemiesRaw != null) {
      const enemiesJson: Record<string, string | number | null>[] =
        JSON.parse(enemiesRaw)
      this.enemies = enemiesJson.map((value) =>
        IoEnemyFromAttributes.fromAttributes(value),
      )
      console.debug("Tower", this.enemies.length, "enemies loaded")
    }
  }
}
