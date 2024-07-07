import { Color } from "../../common/data/color"

export type PlayerInfo = {
  hp: number
  maxHp: number
  atk: number
  def: number
  exp: number
  expMul: number
  hpMul: number
  level: number
  keys: Record<Color, number>
}

export function createPlayerInfo(hp: number, atk: number, def: number): PlayerInfo {
  return {
    hp: hp,
    maxHp: hp,
    atk: atk,
    def: def,
    exp: 0,

    expMul: 100,
    hpMul: 100,

    level: 0,

    keys: {
      [Color.blue]: 0,
      [Color.crimson]: 0,
      [Color.greenBlue]: 0,
      [Color.platinum]: 0,
      [Color.violet]: 0,
      [Color.yellow]: 0,
    },
  }
}
