import { AppliedItem } from "../attribute"
import { Color } from "../../../common/data/color"
import { Enemy } from "../../../common/models/enemy"
import { LevelUpContent } from "./level-up-content"
import { Position3D } from "../tuples"
import { RoomType } from "../../../common/data/room-type"
import { Tile } from "../../../common/models/tile"

export const enum ActionType {
  KILL_ENEMY = "kill_enemy",
  MOVE = "move",
  OPEN_DOOR = "open_door",
  PICK_ITEM = "pick_item",
  PICK_KEY = "pick_key",
  ROOM_CHANGE = "room_change",
  LEVEL_UP = "level_up",
}

export interface Action {
  readonly player: Position3D
  readonly roomType: RoomType
  readonly type: ActionType
}

export interface ActionWithTarget extends Action {
  readonly target: Position3D
}

export interface Move extends ActionWithTarget {}

export interface RoomChange extends ActionWithTarget {}

export interface PickItem extends ActionWithTarget {
  readonly appliedItem: AppliedItem
}

export interface PickKey extends ActionWithTarget {
  readonly color: Color
}

export interface OpenDoor extends ActionWithTarget {
  readonly color: Color
}

export interface KillEnemy extends ActionWithTarget {
  readonly enemy: Enemy
  readonly dropTile: Tile
  readonly hpLost: number
  readonly expWin: number
}

export interface LevelUp extends Action {
  readonly levelUpContent: LevelUpContent
}
