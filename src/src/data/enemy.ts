import {EnemyType} from './enemy_type'
import {Item} from './item'

export class Enemy {
    type: EnemyType | null
    level: number | null
    name: string | null
    hp: number | null
    atk: number | null
    def: number | null
    exp: number | null
    drop: Item | null

    constructor() {
    }
}
