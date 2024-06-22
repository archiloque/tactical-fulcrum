import { Coordinates, Delta } from "./coordinates"
import { EMPTY_TILE, Tile, TileType } from "../../common/models/tile"
import { calculateReachableTiles } from "./a-star"
import { PlayerInfo } from "./player-info"
import { PlayerPosition } from "./player-position"
import { Room } from "../../common/models/room"
import { TILES_IN_ROW } from "../../common/data/constants"
import { Tower } from "../../common/models/tower"

export class PlayedTower {
  readonly tower: Tower
  readonly playerPosition: PlayerPosition
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
    this.reachableTiles = calculateReachableTiles(
      new Coordinates(this.playerPosition.line, this.playerPosition.column),
      this.standardRooms[this.playerPosition.room],
    )
  }

  private cloneRoom(rooms: Room[]): Tile[][][] {
    return rooms.map((room) => {
      return room.tiles.map((tilesLine) => {
        return [...tilesLine]
      })
    })
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
}
