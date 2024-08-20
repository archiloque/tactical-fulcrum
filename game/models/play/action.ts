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

export abstract class Action {
  readonly player: Position3D

  protected constructor(player: Position3D) {
    this.player = player
  }

  abstract getType(): ActionType
}

export abstract class ActionWithTarget extends Action {
  readonly target: Position3D

  protected constructor(player: Position3D, target: Position3D) {
    super(player)
    this.target = target
  }
}

export class Move extends ActionWithTarget {
  constructor(player: Position3D, target: Position3D) {
    super(player, target)
  }

  getType(): ActionType {
    return ActionType.MOVE
  }
}

export class RoomChange extends ActionWithTarget {
  constructor(player: Position3D, target: Position3D) {
    super(player, target)
  }

  getType(): ActionType {
    return ActionType.ROOM_CHANGE
  }
}

export class PickItem extends ActionWithTarget {
  readonly appliedItem: AppliedItem

  constructor(player: Position3D, target: Position3D, appliedItem: AppliedItem) {
    super(player, target)
    this.appliedItem = appliedItem
  }

  getType(): ActionType {
    return ActionType.PICK_ITEM
  }
}

export class PickKey extends ActionWithTarget {
  readonly color: Color

  constructor(player: Position3D, target: Position3D, color: Color) {
    super(player, target)
    this.color = color
  }

  getType(): ActionType {
    return ActionType.PICK_KEY
  }
}

export class OpenDoor extends ActionWithTarget {
  readonly color: Color

  constructor(player: Position3D, target: Position3D, color: Color) {
    super(player, target)
    this.color = color
  }

  getType(): ActionType {
    return ActionType.OPEN_DOOR
  }
}

export class KillEnemy extends ActionWithTarget {
  readonly enemy: Enemy
  readonly dropTile: Tile
  readonly hpLost: number
  readonly expWin: number

  constructor(player: Position3D, target: Position3D, enemy: Enemy, dropTile: Tile, hpLost: number, expWin: number) {
    super(player, target)
    this.enemy = enemy
    this.dropTile = dropTile
    this.hpLost = hpLost
    this.expWin = expWin
  }

  getType(): ActionType {
    return ActionType.KILL_ENEMY
  }
}

export class LevelUp extends Action {
  readonly levelUpContent: LevelUpContent
  constructor(player: Position3D, levelUpContent: LevelUpContent) {
    super(player)
    this.levelUpContent = levelUpContent
  }

  getType(): ActionType {
    return ActionType.LEVEL_UP
  }
}
