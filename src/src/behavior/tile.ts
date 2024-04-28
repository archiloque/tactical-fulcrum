import {Color} from '../data/color'
import {Enemy} from './enemy'
import {Item} from '../data/item'
import {StaircaseDirection} from '../data/staircaseDirection'

export enum TileType {
    door = 'door',
    enemy = 'enemy',
    item = 'item',
    key = 'key',
    staircase = 'staircase',
    startingPosition = 'startingPosition',
    wall = 'wall',
}

export interface Tile {
    getType(): TileType
}

export class DoorTile implements Tile {
    color: Color

    getType(): TileType {
        return TileType.door
    }
}

export class EnemyTile implements Tile {
    enemy: Enemy

    getType(): TileType {
        return TileType.enemy
    }
}

export class ItemTile implements Tile {
    item: Item

    getType(): TileType {
        return TileType.item
    }
}

export class KeyTile implements Tile {
    color: Color

    getType(): TileType {
        return TileType.key
    }
}

export class Staircase implements Tile {
    staircaseDirection: StaircaseDirection

    getType(): TileType {
        return TileType.staircase
    }
}

export class StartingPosition implements Tile {
    getType(): TileType {
        return TileType.startingPosition
    }
}

export class Wall implements Tile {
    getType(): TileType {
        return TileType.wall
    }
}
