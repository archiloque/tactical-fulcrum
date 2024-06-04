import { IoItem } from "./io-item"
import { Item } from "../../data/item"

export class IoItemFromAttributes {
  static fromAttributes(value: Record<string, number>, defaultItem: Item): Item {
    const atk = value[IoItem.ATTRIBUTE_ATK] || defaultItem.atk
    const def = value[IoItem.ATTRIBUTE_DEF] || defaultItem.def
    const hp = value[IoItem.ATTRIBUTE_HP] || defaultItem.hp
    const expMulAdd = value[IoItem.ATTRIBUTE_EXP_MUL_ADD] || defaultItem.expMulAdd
    const expMulMul = value[IoItem.ATTRIBUTE_EXP_MUL_MUL] || defaultItem.expMulMul
    const hpMulAdd = value[IoItem.ATTRIBUTE_HP_MUL_ADD] || defaultItem.hpMulAdd
    const hpMulMul = value[IoItem.ATTRIBUTE_HP_MUL_MUL] || defaultItem.hpMulMul

    return new Item(atk, def, hp, expMulAdd, expMulMul, hpMulAdd, hpMulMul)
  }
}
