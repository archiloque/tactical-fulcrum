import {Level} from './level'
import {Enemy} from './enemy'
import {Export, Import} from './import_export'

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
        localStorage.setItem(Tower.LOCAL_STORAGE_KEY_ENEMIES, JSON.stringify(this.enemies.map(e => Export.enemyToAttributes(e))))
    }

    saveLevels() {
        console.debug('Tower', 'saveLevels')
        localStorage.setItem(Tower.LOCAL_STORAGE_KEY_LEVELS, JSON.stringify(this.levels.map(l => Export.levelToAttributes(l))))
    }

    load() {
        console.debug('Tower', 'load')
        const enemiesRaw = localStorage.getItem(Tower.LOCAL_STORAGE_KEY_ENEMIES)
        if (enemiesRaw != null) {
            const enemiesJson: object[] = JSON.parse(enemiesRaw)
            this.enemies = enemiesJson.map(value => Import.enemyFromAttributes(value))
            console.debug('Tower', this.enemies.length, 'enemies loaded')
        }

        const levelsRaw = localStorage.getItem(Tower.LOCAL_STORAGE_KEY_LEVELS)
        if (levelsRaw != null) {
            const levelsJson: object[] = JSON.parse(levelsRaw)
            this.levels = levelsJson.map(value => Import.levelFromAttributes(value))
            console.debug('Tower', this.levels.length, 'levels loaded')
        }
    }
}
