import {IO} from '../io'
import {Item} from '../../data/item'
import {ItemName} from '../../data/item-name'

export class IoItem {
  static readonly ATTRIBUTE_ATK = 'atk'
  static readonly ATTRIBUTE_DEF = 'def'
  static readonly ATTRIBUTE_HP = 'hp'
  static readonly ATTRIBUTE_EXP_MUL_ADD = 'expMulAdd'
  static readonly ATTRIBUTE_EXP_MUL_MUL = 'expMulMul'
  static readonly ATTRIBUTE_HP_MUL_ADD = 'hpMulAdd'
  static readonly ATTRIBUTE_HP_MUL_MUL = 'hpMulMul'

  static readonly ATTRIBUTES: string[] = [
    IoItem.ATTRIBUTE_ATK,
    IoItem.ATTRIBUTE_DEF,
    IoItem.ATTRIBUTE_HP,
    IoItem.ATTRIBUTE_EXP_MUL_ADD,
    IoItem.ATTRIBUTE_EXP_MUL_MUL,
    IoItem.ATTRIBUTE_HP_MUL_ADD,
    IoItem.ATTRIBUTE_HP_MUL_MUL,
  ]

  static validateItemImport(itemName: ItemName, item: Record<string, number | null>, errors: string[]): void {
    const atk = item[IoItem.ATTRIBUTE_ATK]
    IO.checkNumber(atk, `Item ${itemName} atk[${atk}] is invalid`, true, true, errors)
    const def = item[IoItem.ATTRIBUTE_DEF]
    IO.checkNumber(def, `Item ${itemName} def [${def}] is invalid`, true, true, errors)
    const hp = item[IoItem.ATTRIBUTE_HP]
    IO.checkNumber(hp, `Item ${itemName} hp [${hp}] is invalid`, true, true, errors)
    const expMulAdd = item[IoItem.ATTRIBUTE_EXP_MUL_ADD]
    IO.checkNumber(expMulAdd, `Item ${itemName} exp mul add [${expMulAdd}] is invalid`, true, true, errors)
    const expMulMuk = item[IoItem.ATTRIBUTE_EXP_MUL_MUL]
    IO.checkNumber(expMulMuk, `Item ${itemName} exp mul mul [${expMulMuk}] is invalid`, true, true, errors)
    const hpMulAdd = item[IoItem.ATTRIBUTE_HP_MUL_ADD]
    IO.checkNumber(hpMulAdd, `Item ${itemName} hp mul add [${hpMulAdd}] is invalid`, true, true, errors)
    const hpMulMuk = item[IoItem.ATTRIBUTE_HP_MUL_MUL]
    IO.checkNumber(hpMulMuk, `Item ${itemName} hp mul mul [${hpMulMuk}] is invalid`, true, true, errors)
  }

  static validateItemExport(itemName: ItemName, item: Item, errors: string[]): void {
    IO.checkNumber(item.atk, `Item ${itemName} atk [${item.atk}] is invalid`, true, false, errors)
    IO.checkNumber(item.def, `Item ${itemName} def [${item.def}] is invalid`, true, false, errors)
    IO.checkNumber(item.hp, `Item ${itemName} hp [${item.hp}] is invalid`, true, false, errors)
    IO.checkNumber(item.expMulAdd, `Item ${itemName} exp mul add [${item.expMulAdd}] is invalid`, true, false, errors)
    IO.checkNumber(item.expMulMul, `Item ${itemName} exp mul mul [${item.expMulMul}] is invalid`, true, false, errors)
  }
}
