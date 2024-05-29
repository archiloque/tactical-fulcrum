import { Color } from "../data/color"
import { Enemy } from "./enemy"
import { ItemName } from "../data/item-name"
import { StaircaseDirection } from "../data/staircase-direction"

export const enum TileType {
  door = "door",
  empty = "empty",
  enemy = "enemy",
  item = "item",
  key = "key",
  staircase = "staircase",
  startingPosition = "startingPosition",
  wall = "wall",
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
  readonly item: ItemName

  constructor(item: ItemName) {
    this.item = item
  }

  getType(): TileType {
    return TileType.item
  }
}

export const ITEM_TILES: Record<ItemName, ItemTile> = {
  [ItemName.blue_potion]: new ItemTile(ItemName.blue_potion),
  [ItemName.drop_of_dream_ocean]: new ItemTile(ItemName.drop_of_dream_ocean),
  [ItemName.golden_feather]: new ItemTile(ItemName.golden_feather),
  [ItemName.guard_card]: new ItemTile(ItemName.guard_card),
  [ItemName.guard_deck]: new ItemTile(ItemName.guard_deck),
  [ItemName.guard_gem]: new ItemTile(ItemName.guard_gem),
  [ItemName.guard_piece]: new ItemTile(ItemName.guard_piece),
  [ItemName.guard_potion]: new ItemTile(ItemName.guard_potion),
  [ItemName.heavenly_potion]: new ItemTile(ItemName.heavenly_potion),
  [ItemName.life_crown]: new ItemTile(ItemName.life_crown),
  [ItemName.life_potion]: new ItemTile(ItemName.life_potion),
  [ItemName.power_card]: new ItemTile(ItemName.power_card),
  [ItemName.power_deck]: new ItemTile(ItemName.power_deck),
  [ItemName.power_gem]: new ItemTile(ItemName.power_gem),
  [ItemName.power_piece]: new ItemTile(ItemName.power_piece),
  [ItemName.power_potion]: new ItemTile(ItemName.power_potion),
  [ItemName.pulse_book_shield]: new ItemTile(ItemName.pulse_book_shield),
  [ItemName.pulse_book_sword]: new ItemTile(ItemName.pulse_book_sword),
  [ItemName.red_potion]: new ItemTile(ItemName.red_potion),
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
