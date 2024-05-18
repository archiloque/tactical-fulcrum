import { Room } from "../../room"
import {
  DOOR_TILES,
  EMPTY_TILE,
  EnemyTile,
  ITEM_TILES,
  KEY_TILES,
  STAIRCASE_TILES,
  STARTING_POSITION_TILE,
  Tile,
  TILE_TYPES,
  TileType,
  WALL_TILE,
} from "../../tile"
import { TILES_IN_ROW } from "../../../data/map"
import { Color, COLORS } from "../../../data/color"
import { Item, ITEMS } from "../../../data/item"
import { ENEMY_TYPES, EnemyType } from "../../../data/enemyType"
import { Enemy } from "../../enemy"
import { STAIRCASE_DIRECTIONS, StaircaseDirection } from "../../../data/staircaseDirection"
import { SCORE_TYPES, ScoreType } from "../../../data/scoreType"
import { IoRoom } from "./ioRoom"
import { findEnum } from "../../functions"
import { Score } from "../../score"

export class IoRoomFromAttributes {
  static fromAttributes(value: Record<string, string | any>, enemies: Enemy[]): Room {
    const result: Room = new Room()
    result.name = value[IoRoom.ATTRIBUTE_NAME]
    const tiles = value[IoRoom.ATTRIBUTE_TILES]
    if (Array.isArray(tiles)) {
      for (let lineIndex = 0; lineIndex < TILES_IN_ROW && lineIndex < tiles.length; lineIndex++) {
        const tilesLine = tiles[lineIndex]
        if (Array.isArray(tilesLine)) {
          for (let columnIndex = 0; columnIndex < TILES_IN_ROW && columnIndex < tilesLine.length; columnIndex++) {
            const tileAttributes = tilesLine[columnIndex]
            const possibleTile = IoRoomFromAttributes.createTile(tileAttributes, enemies)
            console.debug("IoRoomFromAttributes", "fromAttributes", tileAttributes, possibleTile)
            if (possibleTile != null) {
              result.tiles[lineIndex][columnIndex] = possibleTile
            } else {
              console.error("IoRoomFromAttributes", "fromAttributes", tileAttributes)
            }
          }
        }
      }
    }
    const scores = value[IoRoom.ATTRIBUTE_SCORES]
    if (Array.isArray(scores)) {
      for (const score of scores) {
        const scoreType: ScoreType = findEnum(SCORE_TYPES, score[IoRoom.ATTRIBUTE_TYPE] as string)
        if (scoreType != null)
          result.scores.push(new Score(score[IoRoom.ATTRIBUTE_LINE], score[IoRoom.ATTRIBUTE_COLUMN], scoreType))
      }
    }

    return result
  }

  private static createTile(tile: Record<string, string | number>, enemies: Enemy[]): Tile | null {
    const tileType: TileType = findEnum(TILE_TYPES, tile[IoRoom.ATTRIBUTE_TYPE] as string)
    if (tileType != null) {
      switch (tileType) {
        case TileType.door:
          return IoRoomFromAttributes.createTileDoor(tile)
        case TileType.empty:
          return EMPTY_TILE
        case TileType.enemy:
          return IoRoomFromAttributes.createTileEnemy(tile, enemies)
        case TileType.item:
          return IoRoomFromAttributes.createTileItem(tile)
        case TileType.key:
          return IoRoomFromAttributes.createTileKey(tile)
        case TileType.staircase:
          return IoRoomFromAttributes.createTileStaircase(tile)
        case TileType.startingPosition:
          return STARTING_POSITION_TILE
        case TileType.wall:
          return WALL_TILE
      }
    }
    console.error("IoRoomFromAttributes", "createTile", "type", tile)
    return null
  }

  private static createTileStaircase(tile: Record<string, string | number>): Tile {
    const staircaseDirection: StaircaseDirection = findEnum(
      STAIRCASE_DIRECTIONS,
      tile[IoRoom.ATTRIBUTE_DIRECTION] as string,
    )
    if (staircaseDirection === undefined) {
      console.error("IoRoomFromAttributes", "createTileStaircase", "unknown direction", tile)
      return EMPTY_TILE
    } else {
      return STAIRCASE_TILES[staircaseDirection]
    }
  }

  private static createTileKey(tile: Record<string, string | number>): Tile {
    const keyColor: Color = findEnum(COLORS, tile[IoRoom.ATTRIBUTE_COLOR] as string)
    if (keyColor === undefined) {
      console.error("IoRoomFromAttributes", "createTileKey", "unknown color", tile)
      return EMPTY_TILE
    } else {
      return KEY_TILES[keyColor]
    }
  }

  private static createTileItem(tile: Record<string, string | number>): Tile {
    const itemName: Item = findEnum(ITEMS, tile[IoRoom.ATTRIBUTE_NAME] as string)
    if (itemName === undefined) {
      console.error("IoRoomFromAttributes", "createTileItem", "unknown item", tile)
      return EMPTY_TILE
    } else {
      return ITEM_TILES[itemName]
    }
  }

  private static createTileEnemy(tile: Record<string, string | number>, enemies: Enemy[]): Tile {
    const enemyType: EnemyType = findEnum(ENEMY_TYPES, tile[IoRoom.ATTRIBUTE_ENEMY_TYPE] as string)
    if (enemyType === undefined) {
      console.error("IoRoomFromAttributes", "createTileEnemy", "unknown enemy type", tile)
      return EMPTY_TILE
    }
    const enemyLevel = parseInt(<string>tile[IoRoom.ATTRIBUTE_ENEMY_LEVEL])
    const enemy = enemies.find((e) => e.type == enemyType && e.level === enemyLevel)
    if (enemy == null) {
      console.error("IoRoomFromAttributes", "createTileEnemy", "unknown enemy", tile)
      return EMPTY_TILE
    } else {
      return new EnemyTile(enemy)
    }
  }

  private static createTileDoor(tile: Record<string, string | number>): Tile {
    const doorColor: Color = findEnum(COLORS, tile[IoRoom.ATTRIBUTE_COLOR] as string)
    if (doorColor === undefined) {
      console.error("IoRoomFromAttributes", "createTileDoor", "unknown color", tile)
      return EMPTY_TILE
    } else {
      return DOOR_TILES[doorColor]
    }
  }
}
