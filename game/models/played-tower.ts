import { DoorTile, EMPTY_TILE, EnemyTile, ItemTile, KeyTile, Tile, TileType } from "../../common/models/tile"
import { DropContentItem, DropContentKey, DROPS_CONTENTS, DropType } from "../../common/data/drop"
import { KillEnemy, MoveResult, OpenDoor, PickItem, PickKey, PlayerMove } from "./play/move-result"
import { calculateReachableTiles } from "./play/a-star"
import { Delta } from "./coordinates"
import { Enemy } from "../../common/models/enemy"
import { PlayerInfo } from "./player-info"
import { PlayerPosition } from "./player-position"
import { Room } from "../../common/models/room"
import { TILES_IN_ROW } from "../../common/data/constants"
import { Tower } from "../../common/models/tower"

export class PlayedTower {
  readonly tower: Tower
  playerPosition: PlayerPosition
  readonly standardRooms: Tile[][][]
  readonly nexusRooms: Tile[][][]
  readonly playerInfo: PlayerInfo
  reachableTiles: Delta[] | null[][]

  constructor(tower: Tower) {
    this.tower = tower
    this.standardRooms = this.cloneRoom(tower.standardRooms)
    this.nexusRooms = this.cloneRoom(tower.nexusRooms)
    this.playerPosition = this.findStartingPosition(this.standardRooms)
    this.playerInfo = new PlayerInfo(tower.info.hp, tower.info.atk, tower.info.def)
    this.reachableTiles = calculateReachableTiles(this.playerPosition, this.standardRooms[this.playerPosition.room])
  }

  private cloneRoom(rooms: Room[]): Tile[][][] {
    return rooms.map((room) => {
      return room.tiles.map((tilesLine) => {
        return [...tilesLine]
      })
    })
  }

  movePlayer(delta: Delta): MoveResult[] {
    const targetPlayerPosition = this.playerPosition.add(delta)
    if (this.reachableTiles[targetPlayerPosition.line][targetPlayerPosition.column] === null) {
      return []
    }
    const playerMove = new PlayerMove(targetPlayerPosition)
    this.playerPosition = targetPlayerPosition
    const targetTile: Tile =
      this.standardRooms[targetPlayerPosition.room][targetPlayerPosition.line][targetPlayerPosition.column]
    switch (targetTile.getType()) {
      case TileType.door:
        this.standardRooms[targetPlayerPosition.room][targetPlayerPosition.line][targetPlayerPosition.column] =
          EMPTY_TILE
        const doorColor = (targetTile as DoorTile).color
        return [playerMove, new OpenDoor(doorColor)]
      case TileType.empty:
        return [playerMove]
      case TileType.enemy:
        const enemy = (targetTile as EnemyTile).enemy
        const dropTile = this.getDropTile(enemy)
        this.standardRooms[targetPlayerPosition.room][targetPlayerPosition.line][targetPlayerPosition.column] = dropTile
        return [new KillEnemy(enemy, dropTile)]

      case TileType.item:
        this.standardRooms[targetPlayerPosition.room][targetPlayerPosition.line][targetPlayerPosition.column] =
          EMPTY_TILE
        const itemName = (targetTile as ItemTile).item
        const item = this.tower.items[itemName]
        return [playerMove, new PickItem(item)]
      case TileType.key:
        this.standardRooms[targetPlayerPosition.room][targetPlayerPosition.line][targetPlayerPosition.column] =
          EMPTY_TILE
        const keyColor = (targetTile as KeyTile).color
        return [playerMove, new PickKey(keyColor)]
      case TileType.staircase:
        return []
      case TileType.startingPosition:
        throw new Error("Should not happen")
      case TileType.wall:
        throw new Error("Should not happen")
    }
  }

  private findStartingPosition(rooms: Tile[][][]): PlayerPosition {
    for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
      const room = rooms[roomIndex]
      for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
        const line = room[lineIndex]
        for (let columnIndex = 0; columnIndex < TILES_IN_ROW; columnIndex++) {
          if (line[columnIndex].getType() === TileType.startingPosition) {
            line[columnIndex] = EMPTY_TILE
            return new PlayerPosition(roomIndex, lineIndex, columnIndex)
          }
        }
      }
    }
    throw new Error("No starting position found")
  }

  private getDropTile(enemy: Enemy): Tile {
    const dropName = enemy.drop
    if (dropName == null) {
      return EMPTY_TILE
    }
    const dropContent = DROPS_CONTENTS.get(dropName)
    if (dropContent === undefined) {
      throw new Error(`Unknown drop [${dropName}]`)
    }
    switch (dropContent.getType()) {
      case DropType.KEY:
        return new KeyTile((dropContent as DropContentKey).color)
      case DropType.ITEM:
        return new ItemTile((dropContent as DropContentItem).itemName)
    }
  }
}
