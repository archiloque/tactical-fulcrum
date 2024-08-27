import { StaircaseTile, Tile, TileType } from "../../../common/models/tile"
import { Position3D } from "../tuples"
import { Room } from "../../../common/models/room"
import { StaircaseDirection } from "../../../common/data/staircase-direction"
import { TILES_IN_ROW } from "../../../common/data/constants"

export function findStartingPosition(rooms: Room[]): Position3D {
  for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
    const room = rooms[roomIndex]
    for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
      const line = room.tiles[lineIndex]
      for (let columnIndex = 0; columnIndex < TILES_IN_ROW; columnIndex++) {
        if (line[columnIndex].type === TileType.startingPosition) {
          return { room: roomIndex, line: lineIndex, column: columnIndex }
        }
      }
    }
  }
  throw new Error("No starting position found")
}

export function findStaircasePosition(
  room: Tile[][],
  roomIndex: number,
  staircaseDirection: StaircaseDirection,
): Position3D {
  for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
    const line = room[lineIndex]
    for (let columnIndex = 0; columnIndex < TILES_IN_ROW; columnIndex++) {
      const currentTile = line[columnIndex]
      if (currentTile.type === TileType.staircase) {
        const staircase = currentTile as StaircaseTile
        if (staircase.direction === staircaseDirection) {
          return { room: roomIndex, line: lineIndex, column: columnIndex }
        }
      }
    }
  }
  throw new Error("No stair position found")
}
