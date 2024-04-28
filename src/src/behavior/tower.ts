import {Level} from './level'
import {Enemy} from './enemy'
import {Import} from './import_export'

export class Tower {
    private static readonly LOCAL_STORAGE_KEY_ENEMY = 'editorEnemies'
    enemies: Enemy[]
    levels: Level[]

    constructor() {
        this.enemies = []
        const level1 = new Level();
        level1.name = "Level 1"
        const level2 = new Level();
        level2.name = "Level 2"
        this.levels = [level1, level2]
    }

    saveEnemies() {
        console.debug('Tower', 'saveEnemies')
        localStorage.setItem(Tower.LOCAL_STORAGE_KEY_ENEMY, JSON.stringify(this.enemies))
    }

    load() {
        console.debug('Tower', 'load')
        const enemiesRaw = localStorage.getItem(Tower.LOCAL_STORAGE_KEY_ENEMY)
        if (enemiesRaw != null) {
            const enemiesJson: object[] = JSON.parse(enemiesRaw)
            this.enemies = enemiesJson.map(value => Import.enemyFromJson(value))
        }
    }
}
