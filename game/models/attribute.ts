const ATTRIBUTE_ATK = "atk"
const ATTRIBUTE_DEF = "def"
const ATTRIBUTE_HP = "hp"
const ATTRIBUTE_EXP = "exp"

const ATTRIBUTE_LEVEL = "level"

const ATTRIBUTE_EXP_MUL = "expMul"
const ATTRIBUTE_EXP_MUL_ADD = "expMulAdd"
const ATTRIBUTE_EXP_MUL_MUL = "expMulMul"

const ATTRIBUTE_HP_MUL = "hpMul"
const ATTRIBUTE_HP_MUL_ADD = "hpMulAdd"
const ATTRIBUTE_HP_MUL_MUL = "hpMulMul"

export const enum ItemAttribute {
  ATK = ATTRIBUTE_ATK,
  DEF = ATTRIBUTE_DEF,
  HP = ATTRIBUTE_HP,

  EXP_MUL_ADD = ATTRIBUTE_EXP_MUL_ADD,
  EXP_MUL_MUL = ATTRIBUTE_EXP_MUL_MUL,

  HP_MUL_ADD = ATTRIBUTE_HP_MUL_ADD,
  HP_MUL_MUL = ATTRIBUTE_HP_MUL_MUL,
}

export const ITEM_ATTRIBUTES: ItemAttribute[] = [
  ItemAttribute.ATK,
  ItemAttribute.DEF,
  ItemAttribute.HP,
  ItemAttribute.EXP_MUL_ADD,
  ItemAttribute.EXP_MUL_MUL,
  ItemAttribute.HP_MUL_ADD,
  ItemAttribute.HP_MUL_MUL,
]

export const enum PlayerAttribute {
  ATK = ATTRIBUTE_ATK,
  DEF = ATTRIBUTE_DEF,
  HP = ATTRIBUTE_HP,
  EXP = ATTRIBUTE_EXP,

  LEVEL = ATTRIBUTE_LEVEL,

  EXP_MUL = ATTRIBUTE_EXP_MUL,

  HP_MUL = ATTRIBUTE_HP_MUL,
}

export const PLAYER_ATTRIBUTES: PlayerAttribute[] = [
  PlayerAttribute.ATK,
  PlayerAttribute.DEF,
  PlayerAttribute.HP,
  PlayerAttribute.EXP,
  PlayerAttribute.LEVEL,
  PlayerAttribute.EXP_MUL,
  PlayerAttribute.HP_MUL,
]

export type ItemToolTipAttributes = {
  [ItemAttribute.ATK]?: number
  [ItemAttribute.DEF]?: number
  [ItemAttribute.HP]?: number
  [ItemAttribute.EXP_MUL_ADD]?: number
  [ItemAttribute.EXP_MUL_MUL]?: number
  [ItemAttribute.HP_MUL_ADD]?: number
  [ItemAttribute.HP_MUL_MUL]?: number
}

export const APPLIED_ITEM_ATTRIBUTES: PlayerAttribute[] = [
  PlayerAttribute.ATK,
  PlayerAttribute.DEF,
  PlayerAttribute.HP,
  PlayerAttribute.EXP_MUL,
  PlayerAttribute.HP_MUL,
]

export type AppliedItem = {
  [PlayerAttribute.ATK]?: number
  [PlayerAttribute.DEF]?: number
  [PlayerAttribute.HP]?: number
  [PlayerAttribute.EXP_MUL]?: number
  [PlayerAttribute.HP_MUL]?: number
}
