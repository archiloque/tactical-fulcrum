import { Color } from "../../common/data/color"

export class PlayerInfo {
  hp: number
  maxHp: number
  atk: number
  def: number
  exp: number
  expMul: number
  hpMul: number
  keys: Record<Color, number>

  constructor(hp: number, atk: number, def: number) {
    this.hp = hp
    this.atk = atk
    this.def = def
    this.exp = 0

    this.expMul = 100
    this.hpMul = 100

    this.keys = {
      [Color.blue]: 0,
      [Color.crimson]: 0,
      [Color.greenBlue]: 0,
      [Color.platinum]: 0,
      [Color.violet]: 0,
      [Color.yellow]: 0,
    }
  }
}
