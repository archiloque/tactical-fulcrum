import {Color} from '../data/color'
import {Enemy} from './enemy'
import {Item, ITEMS} from '../data/item'
import {StaircaseDirection} from '../data/staircaseDirection'

export const enum TileType {
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
    readonly color: Color

    constructor(color: Color) {
        this.color = color
    }

    getType(): TileType {
        return TileType.door
    }
}

export const DOOR_TILES: Record<Color, DoorTile> = {
    [Color.blue]: new DoorTile(Color.blue),
    [Color.crimson]: new DoorTile(Color.crimson),
    [Color.greenBlue]: new DoorTile(Color.greenBlue),
    [Color.platinum]: new DoorTile(Color.platinum),
    [Color.violet]: new DoorTile(Color.violet),
    [Color.yellow]: new DoorTile(Color.yellow),
}

export class EnemyTile implements Tile {
    readonly enemy: Enemy

    constructor(enemy: Enemy) {
        this.enemy = enemy
    }

    getType(): TileType {
        return TileType.enemy
    }
}

export class ItemTile implements Tile {
    readonly item: Item

    constructor(item: Item) {
        this.item = item
    }

    getType(): TileType {
        return TileType.item
    }
}

export const ITEMS_TILE: Record<Item, ItemTile> = {
    [Item.blue_potion]: new ItemTile(Item.blue_potion),
    [Item.drop_of_dream_ocean]: new ItemTile(Item.drop_of_dream_ocean),
    [Item.golden_feather]: new ItemTile(Item.golden_feather),
    [Item.guard_card]: new ItemTile(Item.guard_card),
    [Item.guard_deck]: new ItemTile(Item.guard_deck),
    [Item.guard_gem]: new ItemTile(Item.guard_gem),
    [Item.guard_piece]: new ItemTile(Item.guard_potion),
    [Item.guard_potion]: new ItemTile(Item.guard_potion),
    [Item.heavenly_potion]: new ItemTile(Item.heavenly_potion),
    [Item.life_crown]: new ItemTile(Item.life_crown),
    [Item.life_potion]: new ItemTile(Item.life_potion),
    [Item.power_card]: new ItemTile(Item.power_card),
    [Item.power_deck]: new ItemTile(Item.power_deck),
    [Item.power_gem]: new ItemTile(Item.power_gem),
    [Item.power_piece]: new ItemTile(Item.power_piece),
    [Item.power_potion]: new ItemTile(Item.power_potion),
    [Item.pulse_book_shield]: new ItemTile(Item.pulse_book_shield),
    [Item.pulse_book_sword]: new ItemTile(Item.pulse_book_sword),
    [Item.red_potion]: new ItemTile(Item.red_potion),

}
ITEMS.forEach(item =>
    ITEMS_TILE[item] = new ItemTile(item),
)

export class KeyTile implements Tile {
    readonly color: Color

    constructor(color: Color) {
        this.color = color
    }

    getType(): TileType {
        return TileType.key
    }
}

export const KEY_TILES: Record<Color, KeyTile> = {
    [Color.blue]: new KeyTile(Color.blue),
    [Color.crimson]: new KeyTile(Color.crimson),
    [Color.greenBlue]: new KeyTile(Color.greenBlue),
    [Color.platinum]: new KeyTile(Color.platinum),
    [Color.violet]: new KeyTile(Color.violet),
    [Color.yellow]: new KeyTile(Color.yellow),
}

export class Staircase implements Tile {
    readonly staircaseDirection: StaircaseDirection

    constructor(staircaseDirection: StaircaseDirection) {
        this.staircaseDirection = staircaseDirection
    }

    getType(): TileType {
        return TileType.staircase
    }
}

export const DOWN_STAIRCASE_TILE: Staircase = new Staircase(StaircaseDirection.down)
export const UP_STAIRCASE_TILE: Staircase = new Staircase(StaircaseDirection.up)

export class StartingPosition implements Tile {
    getType(): TileType {
        return TileType.startingPosition
    }
}

export const STARTING_POSITION_TILE: StartingPosition = new StartingPosition()

export class Wall implements Tile {
    getType(): TileType {
        return TileType.wall
    }
}

export const WALL_TILE: Wall = new Wall()
