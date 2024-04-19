import {EnemyType} from './enemy_type'
import {Item} from './item'

export class Enemy {
    type?: EnemyType
    level: string
    name: string
    hp: string
    atk: string
    def: string
    exp: string
    drop?: Item

    constructor() {
        this.hp = '10'
    }
}
