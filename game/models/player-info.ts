export class PlayerInfo {
  hp: number
  atk: number
  def: number
  exp: number

  constructor(hp: number, atk: number, def: number) {
    this.hp = hp
    this.atk = atk
    this.def = def
    this.exp = 0
  }
}
