import { Action, KillEnemy, OpenDoor, PickItem, PickKey, PlayerMove } from "./play/action"
import { Delta2D, Position3D } from "./tuples"
import { DoorTile, EMPTY_TILE, EnemyTile, ItemTile, KeyTile, Tile, TileType } from "../../common/models/tile"
import { DropContentItem, DropContentKey, DROPS_CONTENTS, DropType } from "../../common/data/drop"
import { calculateReachableTiles } from "./play/a-star"
import { Enemy } from "../../common/models/enemy"
import { PlayerInfo } from "./player-info"
import { Room } from "../../common/models/room"
import { TILES_IN_ROW } from "../../common/data/constants"
import { Tower } from "../../common/models/tower"

export class PlayedTower {
  readonly tower: Tower
  playerPosition: Position3D
  readonly standardRooms: Tile[][][]
  readonly nexusRooms: Tile[][][]
  readonly playerInfo: PlayerInfo
  reachableTiles: Delta2D[] | null[][]

  constructor(tower: Tower) {
    this.tower = tower
    this.standardRooms = this.cloneRoom(tower.standardRooms)
    this.nexusRooms = this.cloneRoom(tower.nexusRooms)
    this.playerPosition = this.findStartingPosition(this.standardRooms)
    this.playerInfo = new PlayerInfo(tower.info.hp, tower.info.atk, tower.info.def)
    this.calculateReachableTiles()
  }

  private calculateReachableTiles(): void {
    this.reachableTiles = calculateReachableTiles(this.playerPosition, this.standardRooms[this.playerPosition.room])
  }

  private cloneRoom(rooms: Room[]): Tile[][][] {
    return rooms.map((room) => {
      return room.tiles.map((tilesLine) => {
        return [...tilesLine]
      })
    })
  }

  movePlayer(delta: Delta2D): Action | null {
    const targetPosition = this.playerPosition.add(delta)
    if (
      targetPosition.line < 0 ||
      targetPosition.line >= TILES_IN_ROW ||
      targetPosition.column < 0 ||
      targetPosition.column >= TILES_IN_ROW
    ) {
      return null
    }
    if (this.reachableTiles[targetPosition.line][targetPosition.column] === null) {
      return null
    }
    const oldPlayerPosition = this.playerPosition
    const targetTile: Tile = this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column]
    switch (targetTile.getType()) {
      case TileType.door:
        this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column] = EMPTY_TILE
        const doorColor = (targetTile as DoorTile).color
        this.calculateReachableTiles()
        return new OpenDoor(oldPlayerPosition, targetPosition, doorColor)
      case TileType.empty:
        this.playerPosition = targetPosition
        return new PlayerMove(oldPlayerPosition, targetPosition)
      case TileType.enemy:
        const enemy = (targetTile as EnemyTile).enemy
        const dropTile = this.getDropTile(enemy)
        this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column] = dropTile
        this.calculateReachableTiles()
        return new KillEnemy(oldPlayerPosition, targetPosition, enemy, dropTile)
      case TileType.item:
        this.playerPosition = targetPosition
        this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column] = EMPTY_TILE
        const itemName = (targetTile as ItemTile).item
        const item = this.tower.items[itemName]
        this.calculateReachableTiles()
        return new PickItem(oldPlayerPosition, targetPosition, item)
      case TileType.key:
        this.playerPosition = targetPosition
        this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column] = EMPTY_TILE
        const keyColor = (targetTile as KeyTile).color
        this.calculateReachableTiles()
        return new PickKey(oldPlayerPosition, targetPosition, keyColor)
      case TileType.staircase:
        return null
      case TileType.startingPosition:
        throw new Error("Should not happen")
      case TileType.wall:
        throw new Error("Should not happen")
    }
  }

  private findStartingPosition(rooms: Tile[][][]): Position3D {
    for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
      const room = rooms[roomIndex]
      for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
        const line = room[lineIndex]
        for (let columnIndex = 0; columnIndex < TILES_IN_ROW; columnIndex++) {
          if (line[columnIndex].getType() === TileType.startingPosition) {
            line[columnIndex] = EMPTY_TILE
            return new Position3D(roomIndex, lineIndex, columnIndex)
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
