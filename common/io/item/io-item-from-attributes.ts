import { IoItem } from "./io-item"
import { Item } from "../../data/item"

export class IoItemFromAttributes {
  static getValue(value: Record<string, number>, defaultItem: Item, attributeName: string): number {
    if (value[attributeName] === undefined) {
      // @ts-ignore
      return defaultItem[attributeName]
    } else {
      return value[attributeName]
    }
  }

  static fromAttributes(value: Record<string, number>, defaultItem: Item): Item {
    const atk = IoItemFromAttributes.getValue(value, defaultItem, IoItem.ATTRIBUTE_ATK)
    const def = IoItemFromAttributes.getValue(value, defaultItem, IoItem.ATTRIBUTE_DEF)
    const hp = IoItemFromAttributes.getValue(value, defaultItem, IoItem.ATTRIBUTE_HP)
    const expMulAdd = IoItemFromAttributes.getValue(value, defaultItem, IoItem.ATTRIBUTE_EXP_MUL_ADD)
    const expMulMul = IoItemFromAttributes.getValue(value, defaultItem, IoItem.ATTRIBUTE_EXP_MUL_MUL)
    const hpMulAdd = IoItemFromAttributes.getValue(value, defaultItem, IoItem.ATTRIBUTE_HP_MUL_ADD)
    const hpMulMul = IoItemFromAttributes.getValue(value, defaultItem, IoItem.ATTRIBUTE_HP_MUL_MUL)

    return new Item(atk, def, hp, expMulAdd, expMulMul, hpMulAdd, hpMulMul)
  }
}
