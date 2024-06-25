import { Color } from "../../../common/data/color"
import { Enemy } from "../../../common/models/enemy"
import { Item } from "../../../common/data/item"
import { PlayerPosition } from "../player-position"
import { Tile } from "../../../common/models/tile"

export const enum MoveResultType {
  MOVE = "move",
  PICK_ITEM = "pick_item",
  PICK_KEY = "pick_key",
  OPEN_DOOR = "open_door",
  KILL_ENEMY = "kill_enemy",
}

export interface MoveResult {
  getType(): MoveResultType
}

export class PlayerMove implements MoveResult {
  readonly playerPosition: PlayerPosition

  constructor(playerPosition: PlayerPosition) {
    this.playerPosition = playerPosition
  }

  getType(): MoveResultType {
    return MoveResultType.MOVE
  }
}

export class PickItem implements MoveResult {
  readonly item: Item

  constructor(item: Item) {
    this.item = item
  }

  getType(): MoveResultType {
    return MoveResultType.PICK_ITEM
  }
}

export class PickKey implements MoveResult {
  readonly color: Color

  constructor(color: Color) {
    this.color = color
  }

  getType(): MoveResultType {
    return MoveResultType.PICK_KEY
  }
}

export class OpenDoor implements MoveResult {
  readonly color: Color

  constructor(color: Color) {
    this.color = color
  }

  getType(): MoveResultType {
    return MoveResultType.OPEN_DOOR
  }
}

export class KillEnemy implements MoveResult {
  readonly enemy: Enemy
  readonly dropTile: Tile

  constructor(enemy: Enemy, dropTile: Tile) {
    this.enemy = enemy
    this.dropTile = dropTile
  }

  getType(): MoveResultType {
    return MoveResultType.KILL_ENEMY
  }
}
