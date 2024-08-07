import { Color, COLORS } from "./color"
import { ITEM_NAMES, ItemName } from "./item-name"
import { capitalize } from "../models/utils"

export const enum DropType {
  KEY = "key",
  ITEM = "item",
}

export interface DropContent {
  getType(): DropType
}

export class DropContentKey implements DropContent {
  readonly color: Color
  constructor(color: Color) {
    this.color = color
  }

  getType(): DropType {
    return DropType.KEY
  }
}

export class DropContentItem implements DropContent {
  readonly itemName: ItemName
  constructor(itemName: ItemName) {
    this.itemName = itemName
  }

  getType(): DropType {
    return DropType.ITEM
  }
}

export const DROPS_CONTENTS = new Map<string, DropContent>()

export const DROP_KEYS: string[] = COLORS.map((c) => {
  const name = `${capitalize(c)} key`
  DROPS_CONTENTS.set(name, new DropContentKey(c))
  return name
})
export const DROP_ITEMS: string[] = ITEM_NAMES.map((itemName) => {
  DROPS_CONTENTS.set(itemName, new DropContentItem(itemName))
  return itemName
})
export const DROPS: string[] = DROP_ITEMS.concat(DROP_KEYS)
