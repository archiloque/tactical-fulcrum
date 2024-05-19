import {EnemyType} from '../data/enemyType'

export class Enemy {
  type: EnemyType | null
  level: number | null
  name: string | null
  hp: number | null
  atk: number | null
  def: number | null
  exp: number | null
  drop: string | null

  constructor() {}

  equals(enemy: Enemy): boolean {
    return this.level == enemy.level && this.type == enemy.type
  }
}
