import { Color } from "../../../common/data/color"
import { Level } from "../../../common/models/level"
import { LevelType } from "../../../common/data/level-type"
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
  readonly number: number
  constructor(number: number) {
    this.number = number
  }

  abstract getType(): LevelUpContentType
}

export class KeyLevelUpContent implements LevelUpContent {
  readonly color: Color
  readonly number: number
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
    return LevelUpContentType.DEF
  }
}

export class HpLevelUpContent extends AttributeLevelUpContent {
  getType(): LevelUpContentType {
    return LevelUpContentType.HP
  }
}

export function getLevelUpContent(playerInfo: PlayerInfo, level: Level): LevelUpContent {
  switch (level.type) {
    case LevelType.ATK: {
      return new AtkLevelUpContent((playerInfo.level + level.add) * level.mul)
    }
    case LevelType.DEF: {
      return new DefLevelUpContent((playerInfo.level + level.add) * level.mul)
    }
    case LevelType.HP: {
      return new HpLevelUpContent(((playerInfo.level + level.add) * level.mul * playerInfo.hpMul) / 100)
    }
    case LevelType.BLUE_KEY: {
      return new KeyLevelUpContent(Color.blue, level.add)
    }
    case LevelType.CRIMSON_KEY: {
      return new KeyLevelUpContent(Color.crimson, level.add)
    }
    case LevelType.GREEN_CLUE_KEY: {
      return new KeyLevelUpContent(Color.greenBlue, level.add)
    }
    case LevelType.PLATINUM_KEY: {
      return new KeyLevelUpContent(Color.platinum, level.add)
    }
    case LevelType.VIOLENT_KEY: {
      return new KeyLevelUpContent(Color.violet, level.add)
    }
    case LevelType.YELLOW_KEY: {
      return new KeyLevelUpContent(Color.yellow, level.add)
    }
    default: {
      throw new Error(`Can't deal with ${level}`)
    }
  }
}
