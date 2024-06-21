import { capitalize } from "../models/utils"
import { COLORS } from "./color"
import { ITEM_NAMES } from "./item-name"

export const DROP_KEYS: string[] = COLORS.map((c) => `${capitalize(c)} key`)
export const DROP_ITEMS: string[] = ITEM_NAMES.map((it) => it.valueOf())

export const DROPS: string[] = DROP_ITEMS.concat(DROP_KEYS)
