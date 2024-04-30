import {Level} from './level'
import {Enemy} from './enemy'
import {IoEnemy} from './io/ioEnemy'
import {IoLevel} from './io/ioLevel'

export class Tower {
    private static readonly LOCAL_STORAGE_KEY_ENEMIES = 'editorEnemies'
    private static readonly LOCAL_STORAGE_KEY_LEVELS = 'editorLevels'
    enemies: Enemy[]
    levels: Level[]

    constructor() {
        this.enemies = []
        const level1 = new Level()
        level1.name = 'Level 1'
        const level2 = new Level()
        level2.name = 'Level 2'
        this.levels = [level1, level2]
    }

    saveEnemies() {
        console.debug('Tower', 'saveEnemies')
        localStorage.setItem(Tower.LOCAL_STORAGE_KEY_ENEMIES, JSON.stringify(this.enemies.map(e => IoEnemy.toAttributes(e))))
    }

    saveLevels() {
        console.debug('Tower', 'saveLevels')
        localStorage.setItem(Tower.LOCAL_STORAGE_KEY_LEVELS, JSON.stringify(this.levels.map(l => IoLevel.toAttributes(l))))
    }

    load() {
        console.debug('Tower', 'load')
        const enemiesRaw = localStorage.getItem(Tower.LOCAL_STORAGE_KEY_ENEMIES)
        if (enemiesRaw != null) {
            const enemiesJson: Record<string, string | number | null>[] = JSON.parse(enemiesRaw)
            this.enemies = enemiesJson.map(value => IoEnemy.fromAttributes(value))
            console.debug('Tower', this.enemies.length, 'enemies loaded')
        }

        const levelsRaw = localStorage.getItem(Tower.LOCAL_STORAGE_KEY_LEVELS)
        if (levelsRaw != null) {
            const levelsJson: Record<string, string | number | null>[] = JSON.parse(levelsRaw)
            this.levels = levelsJson.map(value => IoLevel.fromAttributes(value))
            console.debug('Tower', this.levels.length, 'levels loaded')
        }
    }
}
