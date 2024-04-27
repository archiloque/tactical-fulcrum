import {Level} from './level'
import {Enemy} from './enemy'

export class Tower {
    enemies: Enemy[]
    levels: Level[]

    constructor() {
        this.enemies = []
        this.levels = []
    }
}
