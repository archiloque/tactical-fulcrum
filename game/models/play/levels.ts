export type LevelUp = {
  levelIndex: number
  startingExp: number
  deltaExpToNextLevel: number
}

const LEVELS_UPS: LevelUp[] = [
  {
    levelIndex: 0,
    deltaExpToNextLevel: 0,
    startingExp: 0,
  },
]

export function getLevelIndex(index: number): LevelUp {
  if (LEVELS_UPS.length > index) {
    return LEVELS_UPS[index]
  } else {
    let currentIndex = LEVELS_UPS.length - 1
    while (true) {
      const currentLevelUp = LEVELS_UPS[currentIndex]
      createLevelsUp(currentLevelUp.startingExp + 1)
      currentIndex++
      if (currentIndex == index) {
        return LEVELS_UPS[index]
      }
    }
  }
}

export function getLevelUp(exp: number): LevelUp {
  for (let levelUpIndex = 0; levelUpIndex < LEVELS_UPS.length; levelUpIndex++) {
    if (LEVELS_UPS[levelUpIndex].startingExp > exp) {
      return LEVELS_UPS[levelUpIndex - 1]
    }
  }
  createLevelsUp(exp)
  return getLevelUp(exp)
}

function createLevelsUp(exp: number): void {
  let maxLevel: LevelUp = LEVELS_UPS[LEVELS_UPS.length - 1]
  while (maxLevel.startingExp <= exp) {
    const newLevelNumber = maxLevel.levelIndex + 1
    const deltaExp = maxLevel.deltaExpToNextLevel + newLevelNumber * 10
    maxLevel = {
      levelIndex: newLevelNumber,
      deltaExpToNextLevel: deltaExp,
      startingExp: deltaExp + maxLevel.startingExp,
    }
    LEVELS_UPS.push(maxLevel)
  }
}
