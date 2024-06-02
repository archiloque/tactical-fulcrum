import { ItemName } from "./item-name"

export class Item {
  atk: number
  def: number
  hp: number
  expMulAdd: number
  expMulMul: number
  hpMulAdd: number
  hpMulMul: number

  constructor(
    atk: number,
    def: number,
    hp: number,
    expMulAdd: number,
    expMulMul: number,
    hpMulAdd: number,
    hpMulMul: number,
  ) {
    this.atk = atk
    this.def = def
    this.hp = hp
    this.expMulAdd = expMulAdd
    this.expMulMul = expMulMul
    this.hpMulAdd = hpMulAdd
    this.hpMulMul = hpMulMul
  }

  public clone(): Item {
    return new Item(this.atk, this.def, this.hp, this.expMulAdd, this.expMulMul, this.hpMulAdd, this.hpMulMul)
  }
}

export const DEFAULT_ITEMS: Record<ItemName, Item> = {
  [ItemName.blue_potion]: new Item(0, 0, 800, 0, 1, 0, 1),
  [ItemName.drop_of_dream_ocean]: new Item(5, 5, 9999, 0, 1, 0, 1),
  [ItemName.golden_feather]: new Item(0, 0, 0, 30, 1, 0, 1),
  [ItemName.guard_card]: new Item(0, 5, 0, 0, 1, 0, 1),
  [ItemName.guard_deck]: new Item(0, 15, 0, 0, 1, 0, 1),
  [ItemName.guard_gem]: new Item(0, 2, 0, 0, 1, 0, 1),
  [ItemName.guard_piece]: new Item(0, 1, 0, 0, 1, 0, 1),
  [ItemName.guard_potion]: new Item(0, 3, 300, 0, 1, 0, 1),
  [ItemName.heavenly_potion]: new Item(3, 3, 3000, 0, 1, 0, 1),
  [ItemName.life_crown]: new Item(0, 0, 0, 0, 1, 30, 1),
  [ItemName.life_potion]: new Item(0, 0, 2000, 0, 1, 0, 1),
  [ItemName.power_card]: new Item(5, 0, 0, 0, 1, 0, 1),
  [ItemName.power_deck]: new Item(15, 0, 0, 0, 1, 0, 1),
  [ItemName.power_gem]: new Item(2, 0, 0, 0, 1, 0, 1),
  [ItemName.power_piece]: new Item(1, 0, 0, 0, 1, 0, 1),
  [ItemName.power_potion]: new Item(3, 0, 300, 0, 1, 0, 1),
  [ItemName.pulse_book_shield]: new Item(0, 50, 0, 0, 1, 0, 1),
  [ItemName.pulse_book_sword]: new Item(50, 0, 0, 0, 1, 0, 1),
  [ItemName.red_potion]: new Item(0, 0, 200, 0, 1, 0, 1),
}
