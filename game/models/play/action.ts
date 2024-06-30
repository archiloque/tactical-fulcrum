import {Color} from '../../../common/data/color'
import {Enemy} from '../../../common/models/enemy'
import {Item} from '../../../common/data/item'
import {Position3D} from '../tuples'
import {Tile} from '../../../common/models/tile'

export const enum ActionType {
  MOVE = 'move',
  PICK_ITEM = 'pick_item',
  PICK_KEY = 'pick_key',
  OPEN_DOOR = 'open_door',
  KILL_ENEMY = 'kill_enemy',
}

export abstract class Action {
  readonly player: Position3D
  readonly target: Position3D

  protected constructor(player: Position3D, target: Position3D) {
    this.player = player
    this.target = target
  }

  abstract getType(): ActionType
}

export class PlayerMove extends Action {
  constructor(player: Position3D, target: Position3D) {
    super(player, target)
  }

  getType(): ActionType {
    return ActionType.MOVE
  }
}

export class PickItem extends Action {
  readonly item: Item

  constructor(player: Position3D, target: Position3D, item: Item) {
    super(player, target)
    this.item = item
  }

  getType(): ActionType {
    return ActionType.PICK_ITEM
  }
}

export class PickKey extends Action {
  readonly color: Color

  constructor(player: Position3D, target: Position3D, color: Color) {
    super(player, target)
    this.color = color
  }

  getType(): ActionType {
    return ActionType.PICK_KEY
  }
}

export class OpenDoor extends Action {
  readonly color: Color

  constructor(player: Position3D, target: Position3D, color: Color) {
    super(player, target)
    this.color = color
  }

  getType(): ActionType {
    return ActionType.OPEN_DOOR
  }
}

export class KillEnemy extends Action {
  readonly enemy: Enemy
  readonly dropTile: Tile

  constructor(player: Position3D, target: Position3D, enemy: Enemy, dropTile: Tile) {
    super(player, target)
    this.enemy = enemy
    this.dropTile = dropTile
  }

  getType(): ActionType {
    return ActionType.KILL_ENEMY
  }
}
