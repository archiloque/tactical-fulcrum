import { DEFAULT_ITEMS, Item } from "../../../common/data/item"
import { ITEM_NAMES, ItemName } from "../../../common/data/item-name"
import { IoItem } from "../../../common/io/item/io-item"

export class IoItemToAttributes {
  static toValues(items: Record<ItemName, Item>): Record<ItemName, Record<string, number>> {
    // @ts-ignore
    const result: Record<ItemName, Record<string, number>> = {}
    for (const itemName of ITEM_NAMES) {
      const value = IoItemToAttributes.toAttributes(items[itemName], DEFAULT_ITEMS[itemName])
      if (value != null) {
        result[itemName] = value
      }
    }
    // @ts-ignore
    return result
  }

  static toAttributes(item: Item, defaultItem: Item): Record<string, number> | null {
    const result: Record<string, number> = {}
    let hasValue = false
    for (const attribute of IoItem.ATTRIBUTES) {
      // @ts-ignore
      if (item[attribute] != defaultItem[attribute] && item[attribute] != null) {
        // @ts-ignore
        result[attribute] = item[attribute]
        hasValue = true
      }
    }
    if (hasValue) {
      return result
    } else {
      return null
    }
  }
}
