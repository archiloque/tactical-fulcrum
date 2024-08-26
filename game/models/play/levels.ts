export interface LevelUp {
  index: number
  startingExp: number
  expForNextLevel: number
}

const LEVELS_UPS: LevelUp[] = [
  {
    index: 0,
    startingExp: 0,
    expForNextLevel: 10,
  },
]

function createNextLevel(): void {
  const newLevel = LEVELS_UPS.length
  const lastLevel = LEVELS_UPS[LEVELS_UPS.length - 1]
  LEVELS_UPS[newLevel] = {
    index: newLevel,
    startingExp: lastLevel.startingExp + lastLevel.expForNextLevel,
    expForNextLevel: lastLevel.expForNextLevel + 10 * (newLevel + 1),
  }
}

export function getLevel(index: number): LevelUp {
  if (LEVELS_UPS.length > index) {
    return LEVELS_UPS[index]
  } else {
    let currentIndex = LEVELS_UPS.length - 1
    while (true) {
      createNextLevel()
      currentIndex++
      if (currentIndex == index) {
        return LEVELS_UPS[index]
      }
    }
  }
}
