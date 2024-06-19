import { EMPTY_TILE, Tile, TileType } from "../../common/models/tile"
import { Room } from "../../common/models/room"
import { TILES_IN_ROW } from "../../common/data/constants"
import { Tower } from "../../common/models/tower"

export class PlayerPosition {
  room: number
  line: number
  column: number

  constructor(room: number, line: number, column: number) {
    this.room = room
    this.line = line
    this.column = column
  }
}

export class PlayerInfo {
  hp: number
  atk: number
  def: number
  exp: number

  constructor(hp: number, atk: number, def: number) {
    this.hp = hp
    this.atk = atk
    this.def = def
    this.exp = 0
  }
}

export class PlayedTower {
  readonly tower: Tower
  readonly playerPosition: PlayerPosition
  readonly standardRooms: Tile[][][]
  readonly nexusRooms: Tile[][][]
  readonly playerInfo: PlayerInfo

  constructor(tower: Tower) {
    this.tower = tower
    this.standardRooms = this.cloneRoom(tower.standardRooms)
    this.nexusRooms = this.cloneRoom(tower.nexusRooms)
    this.playerPosition = this.findStartingPosition(this.standardRooms)
    this.playerInfo = new PlayerInfo(tower.info.hp, tower.info.atk, tower.info.def)
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
