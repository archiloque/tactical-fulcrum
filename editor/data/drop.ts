import {COLORS} from './color'
import {ITEMS} from './item'
import {capitalize} from '../models/utils'

export const DROP_KEYS: string[] = COLORS.map(c => `${capitalize(c)} key`)
export const DROP_ITEMS: string[] = ITEMS.map(it => it.valueOf())

export const DROPS: null | string[] = [null].concat(DROP_ITEMS).concat(DROP_KEYS)
