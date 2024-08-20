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

export type Tile = {
  readonly type: TileType
}

export type DoorTile = Tile & {
  readonly color: Color
}

export const DOOR_TILES: Record<Color, DoorTile> = {
  [Color.blue]: { type: TileType.door, color: Color.blue },
  [Color.crimson]: { type: TileType.door, color: Color.crimson },
  [Color.greenBlue]: { type: TileType.door, color: Color.greenBlue },
  [Color.platinum]: { type: TileType.door, color: Color.platinum },
  [Color.violet]: { type: TileType.door, color: Color.violet },
  [Color.yellow]: { type: TileType.door, color: Color.yellow },
}

export type EmptyTile = Tile & {}

export const EMPTY_TILE: EmptyTile = { type: TileType.empty }

export type EnemyTile = Tile & {
  readonly enemy: Enemy
}

export type ItemTile = Tile & {
  readonly item: ItemName
}

export const ITEM_TILES: Record<ItemName, ItemTile> = {
  [ItemName.blue_potion]: { type: TileType.item, item: ItemName.blue_potion },
  [ItemName.drop_of_dream_ocean]: { type: TileType.item, item: ItemName.drop_of_dream_ocean },
  [ItemName.golden_feather]: { type: TileType.item, item: ItemName.golden_feather },
  [ItemName.guard_card]: { type: TileType.item, item: ItemName.guard_card },
  [ItemName.guard_deck]: { type: TileType.item, item: ItemName.guard_deck },
  [ItemName.guard_gem]: { type: TileType.item, item: ItemName.guard_gem },
  [ItemName.guard_piece]: { type: TileType.item, item: ItemName.guard_piece },
  [ItemName.guard_potion]: { type: TileType.item, item: ItemName.guard_potion },
  [ItemName.heavenly_potion]: { type: TileType.item, item: ItemName.heavenly_potion },
  [ItemName.life_crown]: { type: TileType.item, item: ItemName.life_crown },
  [ItemName.life_potion]: { type: TileType.item, item: ItemName.life_potion },
  [ItemName.power_card]: { type: TileType.item, item: ItemName.power_card },
  [ItemName.power_deck]: { type: TileType.item, item: ItemName.power_deck },
  [ItemName.power_gem]: { type: TileType.item, item: ItemName.power_gem },
  [ItemName.power_piece]: { type: TileType.item, item: ItemName.power_piece },
  [ItemName.power_potion]: { type: TileType.item, item: ItemName.power_potion },
  [ItemName.pulse_book_shield]: { type: TileType.item, item: ItemName.pulse_book_shield },
  [ItemName.pulse_book_sword]: { type: TileType.item, item: ItemName.pulse_book_sword },
  [ItemName.red_potion]: { type: TileType.item, item: ItemName.red_potion },
}

export type KeyTile = Tile & {
  readonly color: Color
}

export const KEY_TILES: Record<Color, KeyTile> = {
  [Color.blue]: { type: TileType.key, color: Color.blue },
  [Color.crimson]: { type: TileType.key, color: Color.crimson },
  [Color.greenBlue]: { type: TileType.key, color: Color.greenBlue },
  [Color.platinum]: { type: TileType.key, color: Color.platinum },
  [Color.violet]: { type: TileType.key, color: Color.violet },
  [Color.yellow]: { type: TileType.key, color: Color.yellow },
}

export type StaircaseTile = Tile & {
  readonly direction: StaircaseDirection
}

export const STAIRCASE_TILES: Record<StaircaseDirection, StaircaseTile> = {
  [StaircaseDirection.down]: { type: TileType.staircase, direction: StaircaseDirection.down },
  [StaircaseDirection.up]: { type: TileType.staircase, direction: StaircaseDirection.up },
}

export type StartingPositionTile = Tile & {}

export const STARTING_POSITION_TILE: StartingPositionTile = { type: TileType.startingPosition }

export type WallTile = Tile & {}
export const WALL_TILE: WallTile = { type: TileType.wall }
