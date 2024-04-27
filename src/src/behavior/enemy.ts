import {EnemyType} from '../data/enemy_type'
import {Item} from '../data/item'

export class Enemy {
    type: EnemyType | null
    level: number | null
    name: string | null
    hp: number | null
    atk: number | null
    def: number | null
    exp: number | null
    drop: string | null

    constructor() {
    }
}
