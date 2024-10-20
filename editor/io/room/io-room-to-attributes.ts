import { DoorTile, EnemyTile, ItemTile, KeyTile, StaircaseTile, Tile, TileType } from "../../../common/models/tile"
import { IoRoom } from "../../../common/io/room/io-room"
import { Room } from "../../../common/models/room"
import { Score } from "../../../common/models/score"

export class IoRoomToAttributes {
  static toAttributes(room: Room): {
    [IoRoom.ATTRIBUTE_TILES]: Record<string, string | number | null>[][]
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
      [IoRoom.ATTRIBUTE_TYPE]: score.type,
    }
  }

  private static createTile(tile: Tile): Record<string, string | number | null> {
    switch (tile.type) {
      case TileType.door:
        const doorTile = tile as DoorTile
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.door,
          [IoRoom.ATTRIBUTE_COLOR]: doorTile.color,
        }
      case TileType.empty:
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.empty,
        }
      case TileType.enemy:
        const enemyTile = tile as EnemyTile
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.enemy,
          [IoRoom.ATTRIBUTE_ENEMY_TYPE]: enemyTile.enemyType,
          [IoRoom.ATTRIBUTE_ENEMY_LEVEL]: enemyTile.level,
        }
      case TileType.item:
        const itemTile = tile as ItemTile
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.item,
          [IoRoom.ATTRIBUTE_NAME]: itemTile.item,
        }
      case TileType.key:
        const keyTile = tile as KeyTile
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.key,
          [IoRoom.ATTRIBUTE_COLOR]: keyTile.color,
        }
      case TileType.staircase:
        const staircaseTile = tile as StaircaseTile
        return {
          [IoRoom.ATTRIBUTE_TYPE]: TileType.staircase,
          [IoRoom.ATTRIBUTE_DIRECTION]: staircaseTile.direction,
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
