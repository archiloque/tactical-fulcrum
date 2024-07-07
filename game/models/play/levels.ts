export type LevelUp = {
  level: number
  deltaExp: number
  exp: number
}

const LEVELS_UPS: LevelUp[] = [
  {
    level: 0,
    deltaExp: 0,
    exp: 0,
  },
]

export function getLevelIndex(index: number): LevelUp {
  if (LEVELS_UPS.length > index) {
    return LEVELS_UPS[index]
  } else {
    let currentIndex = LEVELS_UPS.length - 1
    while (true) {
      const currentLevelUp = LEVELS_UPS[currentIndex]
      createLevelsUp(currentLevelUp.exp + 1)
      currentIndex++
      if (currentIndex == index) {
        return LEVELS_UPS[index]
      }
    }
  }
}

export function getLevelUp(exp: number): LevelUp {
  for (let levelUpIndex = 0; levelUpIndex < LEVELS_UPS.length; levelUpIndex++) {
    if (LEVELS_UPS[levelUpIndex].exp > exp) {
      return LEVELS_UPS[levelUpIndex - 1]
    }
  }
  createLevelsUp(exp)
  return getLevelUp(exp)
}

function createLevelsUp(exp: number): void {
  let maxLevel: LevelUp = LEVELS_UPS[LEVELS_UPS.length - 1]
  while (maxLevel.exp <= exp) {
    const newLevelNumber = maxLevel.level + 1
    const deltaExp = maxLevel.deltaExp + newLevelNumber * 10
    maxLevel = {
      level: newLevelNumber,
      deltaExp: deltaExp,
      exp: deltaExp + maxLevel.exp,
    }
    LEVELS_UPS.push(maxLevel)
  }
}
