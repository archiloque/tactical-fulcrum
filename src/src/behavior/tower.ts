import {Level} from './level'
import {Enemy} from './enemy'
import {Import} from './import_export'

export class Tower {
    private static readonly LOCAL_STORAGE_KEY_ENEMY = 'editorEnemies'
    enemies: Enemy[]
    levels: Level[]

    constructor() {
        this.enemies = []
        this.levels = []
    }

    saveEnemies() {
        console.debug('Tower', 'saveEnemies')
        localStorage.setItem(Tower.LOCAL_STORAGE_KEY_ENEMY, JSON.stringify(this.enemies))
    }

    load() {
        const enemiesRaw = localStorage.getItem(Tower.LOCAL_STORAGE_KEY_ENEMY)
        if (enemiesRaw != null) {
            const enemiesJson = JSON.parse(enemiesRaw)
            this.enemies = enemiesJson.map(value => Import.enemyFromJson(value))
        }
    }
}
