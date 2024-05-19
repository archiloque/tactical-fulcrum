import {Color} from '../data/color'
import {Enemy} from './enemy'
import {Item} from '../data/item'
import {StaircaseDirection} from '../data/staircaseDirection'

export const enum TileType {
  door = 'door',
  empty = 'empty',
  enemy = 'enemy',
  item = 'item',
  key = 'key',
  staircase = 'staircase',
  startingPosition = 'startingPosition',
  wall = 'wall',
}

export const TILE_TYPES: TileType[] = [
  TileType.door,
  TileType.empty,
  TileType.enemy,
  TileType.item,
  TileType.key,
  TileType.staircase,
  TileType.startingPosition,
  TileType.wall,
]

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

export class EmptyTile implements Tile {
  getType(): TileType {
    return TileType.empty
  }
}

export const EMPTY_TILE: EmptyTile = new EmptyTile()

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

export const ITEM_TILES: Record<Item, ItemTile> = {
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

export class StaircaseTile implements Tile {
  readonly direction: StaircaseDirection

  constructor(staircaseDirection: StaircaseDirection) {
    this.direction = staircaseDirection
  }

  getType(): TileType {
    return TileType.staircase
  }
}

export const STAIRCASE_TILES: Record<StaircaseDirection, StaircaseTile> = {
  [StaircaseDirection.down]: new StaircaseTile(StaircaseDirection.down),
  [StaircaseDirection.up]: new StaircaseTile(StaircaseDirection.up),
}

export class StartingPositionTile implements Tile {
  getType(): TileType {
    return TileType.startingPosition
  }
}

export const STARTING_POSITION_TILE: StartingPositionTile = new StartingPositionTile()

export class WallTile implements Tile {
  getType(): TileType {
    return TileType.wall
  }
}

export const WALL_TILE: WallTile = new WallTile()
