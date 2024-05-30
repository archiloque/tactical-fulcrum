import { DEFAULT_ITEMS, Item } from "../../data/item"
import { ITEM_NAMES, ItemName } from "../../data/item-name"
import { IoItem } from "./io-item"

export class IoItemToAttributes {
  static toValues(items: Record<ItemName, Item>): Record<ItemName, Record<string, number>> {
    const result = {}
    for (const itemName in ITEM_NAMES) {
      const value = IoItemToAttributes.toAttributes(items[itemName], DEFAULT_ITEMS[itemName])
      if (value != null) {
        result[itemName] = value
      }
    }
    // @ts-ignore
    return result
  }

  static toAttributes(item: Item, defaultItem: Item): Record<string, number> | null {
    const result = {}
    let hasValue = false
    for (const attribute of IoItem.ATTRIBUTES) {
      if (item[attribute] != defaultItem[attribute]) {
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
