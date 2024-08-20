import { EnemyType } from "../data/enemy-type"

export class Enemy {
  // @ts-ignore
  type: EnemyType | null
  // @ts-ignore
  level: number | null
  // @ts-ignore
  name: string | null
  // @ts-ignore
  hp: number | null
  // @ts-ignore
  atk: number | null
  // @ts-ignore
  def: number | null
  // @ts-ignore
  exp: number | null
  // @ts-ignore
  drop: string | null

  constructor() {}

  equals(enemy: Enemy): boolean {
    return this.level == enemy.level && this.type == enemy.type
  }
}

export function findEnemy(enemyType: EnemyType, enemyLevel: number, enemies: Enemy[]): Enemy | undefined {
  return enemies.find((e) => e.type == enemyType && e.level === enemyLevel)
}
