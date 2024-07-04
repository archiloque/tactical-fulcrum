import { Item } from "../../../common/data/item"
import { PlayerInfo } from "../player-info"

export class PlayItem {
  atk: number
  def: number
  hp: number

  expMulAdd: number
  expMulMul: number
  hpMulAdd: number
  hpMulMul: number

  constructor(item: Item, playerInfo: PlayerInfo) {
    this.atk = item.atk
    this.def = item.def
    this.hp = (item.hp * playerInfo.hpMult) / 100

    this.expMulAdd = (playerInfo.expMult * item.expMulAdd) / 100
    this.expMulMul = item.expMulMul
    this.hpMulAdd = (playerInfo.hpMult * item.hpMulAdd) / 100
    this.hpMulMul = item.hpMulMul
  }
}
