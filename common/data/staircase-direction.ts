export const enum StaircaseDirection {
  up = "up",
  down = "down",
}

export const STAIRCASE_DIRECTIONS = [StaircaseDirection.down, StaircaseDirection.up]

export const STAIRCASE_OPPOSITE_DIRECTION: Record<StaircaseDirection, StaircaseDirection> = {
  [StaircaseDirection.up]: StaircaseDirection.down,
  [StaircaseDirection.down]: StaircaseDirection.up,
}
