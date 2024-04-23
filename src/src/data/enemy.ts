import {EnemyType} from './enemy_type'
import {Item} from './item'

export class Enemy {
    type: EnemyType | void
    level: number | void
    name: string | void
    hp: number | void
    atk: number | void
    def: number | void
    exp: number | void
    drop: Item

    constructor() {
    }
}
