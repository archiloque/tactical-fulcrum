import { DoorTile, EnemyTile, ItemTile, KeyTile, StaircaseTile, Tile, TileType } from "../../models/tile"
import { IoRoom } from "./io-room"
import { Room } from "../../models/room"
import { Score } from "../../models/score"

export class IoRoomToAttributes {
  static toAttributes(room: Room): {
    [IoRoom.ATTRIBUTE_TILES]: Record<string, string | number>[][]
    [IoRoom.ATTRIBUTE_SCORES]: Record<string, string | number>[]
    [IoRoom.ATTRIBUTE_NAME]: string
  } {
    return {
      [IoRoom.ATTRIBUTE_NAME]: room.name,
      [IoRoom.ATTRIBUTE_TILES]: room.tiles.map((tilesLine) =>
        tilesLine.map((tile) => IoRoomToAttributes.createTile(tile)),
      ),
      [IoRoom.ATTRIBUTE_SCORES]: room.scores.map((score) => {
        return IoRoomToAttributes.createScore(score)
      }),
    }
  }

  private static createScore(score: Score): Record<string, string | number> {
    return {
      [IoRoom.ATTRIBUTE_LINE]: score.line,
      [IoRoom.ATTRIBUTE_COLUMN]: score.column,
      [IoRoom.ATTRIBUTE_TYPE]: score.type.valueOf(),
    }
  }

  private static createTile(tile: Tile): Record<string, string | number> {
    switch (tile.getType()) {
      case TileType.door:
        const door = tile as DoorTile
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.door,
          [IoRoom.ATTRIBUTE_COLOR]: door.color.valueOf(),
        }
      case TileType.empty:
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.empty,
        }
      case TileType.enemy:
        const enemy = tile as EnemyTile
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.enemy,
          [IoRoom.ATTRIBUTE_ENEMY_TYPE]: enemy.enemy.type,
          [IoRoom.ATTRIBUTE_ENEMY_LEVEL]: enemy.enemy.level,
        }
      case TileType.item:
        const item = tile as ItemTile
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.item,
          [IoRoom.ATTRIBUTE_NAME]: item.item.valueOf(),
        }
      case TileType.key:
        const key = tile as KeyTile
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.key,
          [IoRoom.ATTRIBUTE_COLOR]: key.color.valueOf(),
        }
      case TileType.staircase:
        const staircase = tile as StaircaseTile
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.staircase,
          [IoRoom.ATTRIBUTE_DIRECTION]: staircase.direction.valueOf(),
        }
      case TileType.startingPosition:
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.startingPosition,
        }
      case TileType.wall:
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.wall,
        }
    }
  }
}
