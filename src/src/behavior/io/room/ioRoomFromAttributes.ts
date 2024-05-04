import {Room} from '../../room'
import {
    DOOR_TILES,
    EMPTY_TILE, EnemyTile, ITEMS_TILES,
    KEY_TILES, SCORE_TILES,
    STARTING_POSITION_TILE,
    Tile,
    TILES_TYPES,
    TileType,
    WALL_TILE,
} from '../../tile'
import {TILES_IN_ROW} from '../../../data/map'
import {Color, COLORS} from '../../../data/color'
import {Item, ITEMS} from '../../../data/item'
import {ENEMY_TYPES, EnemyType} from '../../../data/enemyType'
import {Enemy} from '../../enemy'
import {STAIRCASE_DIRECTIONS, StaircaseDirection} from '../../../data/staircaseDirection'
import {SCORE_TYPES, ScoreType} from '../../../data/scoreType'
import {IoRoom} from './ioRoom'

export class IoRoomFromAttributes {
    static fromAttributes(value: Record<string, string | any>, enemies: Enemy[]): Room {
        const result: Room = new Room()
        // @ts-ignore
        result.name = value[IoRoom.ATTRIBUTE_NAME]
        const tiles = value[IoRoom.ATTRIBUTE_TILES]
        if (Array.isArray(tiles)) {
            for (let lineIndex = 0; (lineIndex < TILES_IN_ROW) && (lineIndex < tiles.length); lineIndex++) {
                const tilesLine = tiles[lineIndex]
                if (Array.isArray(tilesLine)) {
                    for (let columnIndex = 0; (columnIndex < TILES_IN_ROW) && (columnIndex < tilesLine.length); columnIndex++) {
                        const possibleTile = IoRoomFromAttributes.createTile(tilesLine[columnIndex], enemies)
                        if (possibleTile != null) {
                            result.tiles[lineIndex][columnIndex] = possibleTile
                        }
                    }
                }
            }
        }

        return result
    }

    private static createTile(tile: Record<string, string | number>, enemies: Enemy[]): Tile | null {
        const tileTypeString = tile[IoRoom.ATTRIBUTE_TYPE]
        const tileType: TileType = TILES_TYPES.find(it => it.valueOf() === tileTypeString)
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
                case TileType.score:
                    return IoRoomFromAttributes.createTileScore(tile)
                case TileType.staircase:
                    return IoRoomFromAttributes.createTileStaircase(tile)
                case TileType.startingPosition:
                    return STARTING_POSITION_TILE
                case TileType.wall:
                    return WALL_TILE
            }
            return EMPTY_TILE
        }

        return null
    }

    private static createTileStaircase(tile: Record<string, string | number>) {
        const staircaseDirection: StaircaseDirection = STAIRCASE_DIRECTIONS.find(s => s.valueOf() === tile[IoRoom.ATTRIBUTE_DIRECTION])
        if (staircaseDirection === undefined) {
            return EMPTY_TILE
        } else {
            return STAIRCASE_DIRECTIONS[staircaseDirection]
        }
    }

    private static createTileScore(tile: Record<string, string | number>) {
        const scoreType: ScoreType = SCORE_TYPES.find(s => s.valueOf() === tile[IoRoom.ATTRIBUTE_SCORE])
        if (scoreType === undefined) {
            return EMPTY_TILE
        } else {
            return SCORE_TILES[scoreType]
        }
    }

    private static createTileKey(tile: Record<string, string | number>) {
        const keyColor: Color = COLORS.find(c => c.valueOf() === tile[IoRoom.ATTRIBUTE_COLOR])
        if (keyColor === undefined) {
            return EMPTY_TILE
        } else {
            return KEY_TILES[keyColor]
        }
    }

    private static createTileItem(tile: Record<string, string | number>) {
        const itemName: Item = ITEMS.find(i => i.valueOf() === tile[IoRoom.ATTRIBUTE_NAME])
        if (itemName === undefined) {
            return EMPTY_TILE
        } else {
            return ITEMS_TILES[itemName]
        }
    }

    private static createTileEnemy(tile: Record<string, string | number>, enemies: Enemy[]) {
        const enemyType: EnemyType = ENEMY_TYPES.find(i => i.valueOf() === tile[IoRoom.ATTRIBUTE_ENEMY_TYPE])
        if (enemyType === undefined) {
            return EMPTY_TILE
        }
        // @ts-ignore
        const enemyLevel = parseInt(tile[IoRoom.ATTRIBUTE_LEVEL])
        const enemy = enemies.find(e => (e.type == enemyType) && (e.level == enemyLevel))
        if (enemy === null) {
            return EMPTY_TILE
        } else {
            return new EnemyTile(enemy)
        }
    }

    private static createTileDoor(tile: Record<string, string | number>) {
        const doorColor: Color = COLORS.find(c => c.valueOf() === tile[IoRoom.ATTRIBUTE_COLOR])
        if (doorColor === undefined) {
            return EMPTY_TILE
        } else {
            return DOOR_TILES[doorColor]
        }
    }
}
