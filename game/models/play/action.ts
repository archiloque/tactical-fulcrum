import { AppliedItem } from "../attribute"
import { Color } from "../../../common/data/color"
import { Enemy } from "../../../common/models/enemy"
import { LevelUpContent } from "./level-up-content"
import { Position3D } from "../tuples"
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

export type Action = {
  readonly player: Position3D
  readonly type: ActionType
}

export type ActionWithTarget = Action & {
  readonly target: Position3D
}

export type Move = ActionWithTarget & {}

export type RoomChange = ActionWithTarget & {}

export type PickItem = ActionWithTarget & {
  readonly appliedItem: AppliedItem
}

export type PickKey = ActionWithTarget & {
  readonly color: Color
}

export type OpenDoor = ActionWithTarget & {
  readonly color: Color
}

export type KillEnemy = ActionWithTarget & {
  readonly enemy: Enemy
  readonly dropTile: Tile
  readonly hpLost: number
  readonly expWin: number
}

export type LevelUp = Action & {
  readonly levelUpContent: LevelUpContent
}
