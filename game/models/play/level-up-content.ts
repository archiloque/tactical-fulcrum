import { Color } from "../../../common/data/color"
import { Level } from "../../../common/models/level"
import { PlayerInfo } from "../player-info"

export const enum LevelUpContentType {
  KEY = "key",
  ATK = "atk",
  DEF = "def",
  HP = "hp",
}

export interface LevelUpContent {
  getType(): LevelUpContentType
}

abstract class AttributeLevelUpContent implements LevelUpContent {
  private readonly number: number
  constructor(number: number) {
    this.number = number
  }

  abstract getType(): LevelUpContentType
}

export class KeyLevelUpContent implements LevelUpContent {
  private readonly color: Color
  private readonly number: number
  constructor(color: Color, number: number) {
    this.color = color
    this.number = number
  }

  getType(): LevelUpContentType {
    return LevelUpContentType.KEY
  }
}

export class AtkLevelUpContent extends AttributeLevelUpContent {
  getType(): LevelUpContentType {
    return LevelUpContentType.ATK
  }
}

export class DefLevelUpContent extends AttributeLevelUpContent {
  getType(): LevelUpContentType {
    return LevelUpContentType.ATK
  }
}

export class HpLevelUpContent extends AttributeLevelUpContent {
  getType(): LevelUpContentType {
    return LevelUpContentType.HP
  }
}

export function getLevelUpContent(playerInfo: PlayerInfo, level: Level): LevelUpContent {
  if (level.blueKey !== 0) {
    return new KeyLevelUpContent(Color.blue, level.blueKey)
  } else if (level.crimsonKey !== 0) {
    return new KeyLevelUpContent(Color.crimson, level.crimsonKey)
  } else if (level.greenBlueKey !== 0) {
    return new KeyLevelUpContent(Color.greenBlue, level.greenBlueKey)
  } else if (level.platinumKey !== 0) {
    return new KeyLevelUpContent(Color.platinum, level.platinumKey)
  } else if (level.violetKey !== 0) {
    return new KeyLevelUpContent(Color.violet, level.violetKey)
  } else if (level.yellowKey !== 0) {
    return new KeyLevelUpContent(Color.yellow, level.yellowKey)
  } else if (level.hpAdd !== 0) {
    return new HpLevelUpContent(((playerInfo.level + level.hpAdd) * playerInfo.hpMul) / 100)
  } else if (level.hpMul !== 0) {
    return new HpLevelUpContent((playerInfo.level * level.hpMul * playerInfo.hpMul) / 100)
  } else if (level.atkAdd !== 0) {
    return new AtkLevelUpContent(playerInfo.level + level.atkAdd)
  } else if (level.atkMul !== 0) {
    return new AtkLevelUpContent(playerInfo.level * level.atkMul)
  } else if (level.defAdd !== 0) {
    return new DefLevelUpContent(playerInfo.level + level.defAdd)
  } else if (level.defMul !== 0) {
    return new DefLevelUpContent(playerInfo.level * level.defMul)
  } else {
    throw new Error(`Can't deal with ${level}`)
  }
}
