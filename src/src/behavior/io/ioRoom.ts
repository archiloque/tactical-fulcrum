import {IO} from './io'
import {Room} from '../room'
import {
    DOOR_TILES,
    EMPTY_TILE, EnemyTile, ITEMS_TILES,
    KEY_TILES, SCORE_TILES,
    STARTING_POSITION_TILE,
    Tile,
    TILES_TYPES,
    TileType,
    WALL_TILE,
} from '../tile'
import {TILES_IN_ROW} from '../../data/map'
import {Color, COLORS} from '../../data/color'
import {Item, ITEMS} from '../../data/item'
import {ENEMY_TYPES, EnemyType} from '../../data/enemyType'
import {Enemy} from '../enemy'
import {STAIRCASE_DIRECTIONS, StaircaseDirection} from '../../data/staircaseDirection'
import {SCORE_TYPES, ScoreType} from '../../data/scoreType'

export class IoRoom {
    static readonly ATTRIBUTE_NAME = 'name'
    static readonly ATTRIBUTE_TILES = 'tiles'
    static readonly ATTRIBUTE_TYPE = 'type'
    static readonly ATTRIBUTE_COLOR = 'color'
    static readonly ATTRIBUTE_ENEMY_TYPE = 'enemyType'
    static readonly ATTRIBUTE_LEVEL = 'level'
    static readonly ATTRIBUTE_DIRECTION = 'direction'
    static readonly ATTRIBUTE_SCORE = 'score'
    static readonly ATTRIBUTES: string[] = [
        IoRoom.ATTRIBUTE_NAME,
        IoRoom.ATTRIBUTE_TILES,
    ]

    static validate(room: Room, index: number, errors: string[]): void {
        IO.checkNotEmpty(room.name, `Room ${index} name [${room.name}] is invalid`, errors)
    }

    static checkAttributes(attributes: Record<string, string | any>, index: number, errors: string[]): void {
        for (const attributeName in attributes) {
            if (IoRoom.ATTRIBUTES.indexOf(attributeName) === -1) {
                errors.push(`Room ${index + 1} has an unknown [${attributeName}] attribute`)
            }
        }
        const tilesArrayArray = attributes[this.ATTRIBUTE_TILES]
        if (Array.isArray(tilesArrayArray)) {
            tilesArrayArray.forEach((tilesArray) => {
                if (!Array.isArray(tilesArray)) {
                    errors.push(`Room ${index + 1} tiles ${this.ATTRIBUTE_TILES} attribute [${tilesArray}] is not an array`)
                } else {
                    tilesArray.forEach((tile) => {
                        const type = tile[this.ATTRIBUTE_TYPE]
                        if (TILES_TYPES.map(it => it.valueOf()).indexOf(type) === -1) {
                            errors.push(`Room ${index + 1} has an invalid tile type [${type}]`)
                        }
                    })
                }
            })
        } else {
            errors.push(`Room ${index + 1} tiles ${this.ATTRIBUTE_TILES} attribute [${tilesArrayArray}] is not an array`)
        }
    }

    static validateRooms(rooms: Room[], errors: string[]) {
        const knownRooms = []
        rooms.forEach((room, index) => {
            if (knownRooms.indexOf(room.name) != -1) {
                errors.push(`Room ${index} is duplicated (same name)`)
            } else {
                knownRooms.push(room.name)
            }
        })
    }

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
                        const possibleTile = IoRoom.createTile(tilesLine[columnIndex], enemies)
                        if (possibleTile != null) {
                            result.tiles[lineIndex][columnIndex] = possibleTile
                        }
                    }
                }
            }
        }

        return result
    }

    static createTile(tile: Record<string, string | number>, enemies: Enemy[]): Tile | null {
        const tileTypeString = tile[IoRoom.ATTRIBUTE_TYPE]
        const tileType: TileType = TILES_TYPES.find(it => it.valueOf() === tileTypeString)
        if (tileType != null) {
            switch (tileType) {
                case TileType.door:
                    const doorColor: Color = COLORS.find(c => c.valueOf() === tile[this.ATTRIBUTE_COLOR])
                    if (doorColor === undefined) {
                        return EMPTY_TILE
                    } else {
                        return DOOR_TILES[doorColor]
                    }
                case TileType.empty:
                    return EMPTY_TILE
                case TileType.enemy:
                    const enemyType: EnemyType = ENEMY_TYPES.find(i => i.valueOf() === tile[this.ATTRIBUTE_ENEMY_TYPE])
                    if (enemyType === undefined) {
                        return EMPTY_TILE
                    }
                    // @ts-ignore
                    const enemyLevel = parseInt(tile[this.ATTRIBUTE_LEVEL])
                    const enemy = enemies.find(e => (e.type == enemyType) && (e.level == enemyLevel))
                    if (enemy === null) {
                        return EMPTY_TILE
                    } else {
                        return new EnemyTile(enemy)
                    }
                case TileType.item:
                    const itemName: Item = ITEMS.find(i => i.valueOf() === tile[this.ATTRIBUTE_NAME])
                    if (itemName === undefined) {
                        return EMPTY_TILE
                    } else {
                        return ITEMS_TILES[itemName]
                    }
                case TileType.key:
                    const keyColor: Color = COLORS.find(c => c.valueOf() === tile[this.ATTRIBUTE_COLOR])
                    if (keyColor === undefined) {
                        return EMPTY_TILE
                    } else {
                        return KEY_TILES[keyColor]
                    }
                case TileType.score:
                    const scoreType: ScoreType = SCORE_TYPES.find(s => s.valueOf() === tile[this.ATTRIBUTE_SCORE])
                    if (scoreType === undefined) {
                        return EMPTY_TILE
                    } else {
                        return SCORE_TILES[scoreType]
                    }

                case TileType.staircase:
                    const staircaseDirection: StaircaseDirection = STAIRCASE_DIRECTIONS.find(s => s.valueOf() === tile[this.ATTRIBUTE_DIRECTION])
                    if (staircaseDirection === undefined) {
                        return EMPTY_TILE
                    } else {
                        return STAIRCASE_DIRECTIONS[staircaseDirection]
                    }
                case TileType.startingPosition:
                    return STARTING_POSITION_TILE
                case TileType.wall:
                    return WALL_TILE
            }
            return EMPTY_TILE
        }

        return null
    }

    static toAttributes(room: Room): Record<string, string | number | null> {
        return {
            [IoRoom.ATTRIBUTE_NAME]: room.name,
        }
    }
}
