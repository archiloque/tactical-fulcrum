const ATTRIBUTE_ATK = "atk"
const ATTRIBUTE_DEF = "def"
const ATTRIBUTE_HP = "hp"
const ATTRIBUTE_EXP = "exp"

const ATTRIBUTE_EXP_MUL = "expMul"
const ATTRIBUTE_EXP_MUL_ADD = "expMulAdd"
const ATTRIBUTE_EXP_MUL_MUL = "expMulMul"

const ATTRIBUTE_HP_MUL = "hpMul"
const ATTRIBUTE_HP_MUL_ADD = "hpMulAdd"
const ATTRIBUTE_HP_MUL_MUL = "hpMulMul"

export enum ItemAttribute {
  ATK = ATTRIBUTE_ATK,
  DEF = ATTRIBUTE_DEF,
  HP = ATTRIBUTE_HP,

  EXP_MUL_ADD = ATTRIBUTE_EXP_MUL_ADD,
  EXP_MUL_MUL = ATTRIBUTE_EXP_MUL_MUL,

  HP_MUL_ADD = ATTRIBUTE_HP_MUL_ADD,
  HP_MUL_MUL = ATTRIBUTE_HP_MUL_MUL,
}

export enum PlayerAttribute {
  ATK = ATTRIBUTE_ATK,
  DEF = ATTRIBUTE_DEF,
  HP = ATTRIBUTE_HP,
  EXP = ATTRIBUTE_EXP,

  EXP_MUL = ATTRIBUTE_EXP_MUL,

  HP_MUL = ATTRIBUTE_HP_MUL,
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

export const PLAYER_ATTRIBUTES: PlayerAttribute[] = [
  PlayerAttribute.ATK,
  PlayerAttribute.DEF,
  PlayerAttribute.HP,
  PlayerAttribute.EXP,
  PlayerAttribute.EXP_MUL,
  PlayerAttribute.HP_MUL,
]

export type ItemToolTipAttributes = {
  [ItemAttribute.ATK]: number | undefined
  [ItemAttribute.DEF]: number | undefined
  [ItemAttribute.HP]: number | undefined
  [ItemAttribute.EXP_MUL_ADD]: number | undefined
  [ItemAttribute.EXP_MUL_MUL]: number | undefined
  [ItemAttribute.HP_MUL_ADD]: number | undefined
  [ItemAttribute.HP_MUL_MUL]: number | undefined
}

export const APPLIED_ITEM_ATTRIBUTES: PlayerAttribute[] = [
  PlayerAttribute.ATK,
  PlayerAttribute.DEF,
  PlayerAttribute.HP,
  PlayerAttribute.EXP_MUL,
  PlayerAttribute.HP_MUL,
]

export type AppliedItem = {
  [PlayerAttribute.ATK]: number | undefined
  [PlayerAttribute.DEF]: number | undefined
  [PlayerAttribute.HP]: number | undefined
  [PlayerAttribute.EXP_MUL]: number | undefined
  [PlayerAttribute.HP_MUL]: number | undefined
}
