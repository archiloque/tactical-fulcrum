export class PlayerInfo {
  hp: number
  atk: number
  def: number
  exp: number
  expMult: number
  hpMult: number
  blueKeys: number
  crimsonKeys: number
  violetKeys: number
  greenBlueKeys: number
  platinumKeys: number
  yellowKeys: number

  constructor(hp: number, atk: number, def: number) {
    this.hp = hp
    this.atk = atk
    this.def = def
    this.exp = 0

    this.expMult = 100
    this.hpMult = 100

    this.blueKeys = 0
    this.crimsonKeys = 0
    this.greenBlueKeys = 0
    this.platinumKeys = 0
    this.violetKeys = 0
    this.yellowKeys = 0
  }
}
