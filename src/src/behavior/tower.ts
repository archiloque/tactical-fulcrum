import { Room } from "./room"
import { Enemy } from "./enemy"
import { IoEnemyFromAttributes } from "./io/enemy/ioEnemyFromAttributes"
import { IoRoomFromAttributes } from "./io/room/ioRoomFromAttributes"
import { IoEnemyToAttributes } from "./io/enemy/ioEnemyToAttributes"
import { IoRoomToAttributes } from "./io/room/ioRoomToAttributes"
import {
  LOCAL_STORAGE_KEY_ENEMIES,
  LOCAL_STORAGE_KEY_LEVELS,
} from "./io/localStorage"
import { EMPTY_TILE, EnemyTile, TileType } from "./tile"

export class Tower {
  enemies: Enemy[]
  rooms: Room[]

  constructor() {
    this.enemies = []
    const room1 = new Room()
    room1.name = "Room 1"
    const room2 = new Room()
    room2.name = "Room 2"
    this.rooms = [room1, room2]
  }

  countEnemies(enemy: Enemy): number {
    let result = 0
    for (const room of this.rooms) {
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
    for (const room of this.rooms) {
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
    this.saveRooms()
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
      LOCAL_STORAGE_KEY_LEVELS,
      JSON.stringify(this.rooms.map((l) => IoRoomToAttributes.toAttributes(l))),
    )
  }

  load(): void {
    console.groupCollapsed("Tower", "load")
    const enemiesRaw = localStorage.getItem(LOCAL_STORAGE_KEY_ENEMIES)
    if (enemiesRaw != null) {
      const enemiesJson: Record<string, string | number | null>[] =
        JSON.parse(enemiesRaw)
      this.enemies = enemiesJson.map((value) =>
        IoEnemyFromAttributes.fromAttributes(value),
      )
      console.debug("Tower", this.enemies.length, "enemies loaded")
    }

    const roomsRaw = localStorage.getItem(LOCAL_STORAGE_KEY_LEVELS)
    if (roomsRaw != null) {
      const roomsJson: Record<string, string | number | null>[] =
        JSON.parse(roomsRaw)
      this.rooms = roomsJson.map((value) =>
        IoRoomFromAttributes.fromAttributes(value, this.enemies),
      )
      console.debug("Tower", this.rooms.length, "rooms loaded")
    }
    console.groupEnd()
  }
}
