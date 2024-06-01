import { DROPS } from "../../data/drop"
import { ENEMY_TYPES } from "../../data/enemy-type"
import { Enemy } from "../../models/enemy"
import { IO } from "../io"

export class IoEnemy {
  static readonly ATTRIBUTE_TYPE = "type"
  static readonly ATTRIBUTE_HP = "hp"
  static readonly ATTRIBUTE_NAME = "name"
  static readonly ATTRIBUTE_LEVEL = "level"
  static readonly ATTRIBUTE_ATK = "atk"
  static readonly ATTRIBUTE_DEF = "def"
  static readonly ATTRIBUTE_EXP = "exp"
  static readonly ATTRIBUTE_DROP = "drop"
  static readonly ATTRIBUTES: string[] = [
    IoEnemy.ATTRIBUTE_TYPE,
    IoEnemy.ATTRIBUTE_HP,
    IoEnemy.ATTRIBUTE_NAME,
    IoEnemy.ATTRIBUTE_LEVEL,
    IoEnemy.ATTRIBUTE_ATK,
    IoEnemy.ATTRIBUTE_DEF,
    IoEnemy.ATTRIBUTE_EXP,
    IoEnemy.ATTRIBUTE_DROP,
  ]

  static validateEnemyImport(enemy: Record<string, string | number | null>, index: number, errors: string[]): void {
    for (const attributeName in enemy) {
      if (IoEnemy.ATTRIBUTES.indexOf(attributeName) === -1) {
        errors.push(`Enemy ${index + 1} has an unknown [${attributeName}] attribute`)
      }
    }
    IO.checkEnum(enemy[IoEnemy.ATTRIBUTE_TYPE], ENEMY_TYPES, true, `Enemy ${index} type is invalid`, errors)
    IO.checkNumber(
      enemy[IoEnemy.ATTRIBUTE_LEVEL],
      `Enemy ${index} level [${enemy.level}] is invalid`,
      false,
      false,
      errors,
    )
    const name = enemy[IoEnemy.ATTRIBUTE_NAME]
    IO.checkNotEmpty(name, `Enemy ${index} name [${name}] is invalid`, errors)
    const hp = enemy[IoEnemy.ATTRIBUTE_HP]
    IO.checkNumber(hp, `Enemy ${index} hp [${hp}] is invalid`, false, false, errors)
    const atk = enemy[IoEnemy.ATTRIBUTE_ATK]
    IO.checkNumber(atk, `Enemy ${index} atk [${atk}] is invalid`, true, false, errors)
    const def = enemy[IoEnemy.ATTRIBUTE_DEF]
    IO.checkNumber(def, `Enemy ${index} def [${def}] is invalid`, true, false, errors)
    const exp = enemy[IoEnemy.ATTRIBUTE_EXP]
    IO.checkNumber(exp, `Enemy ${index} exp [${exp}] is invalid`, true, false, errors)
    const drop = enemy[IoEnemy.ATTRIBUTE_DROP]
    IO.checkEnum(drop, DROPS, false, `Enemy ${index} drop [${drop}] is invalid`, errors)
  }

  static validateEnemyExport(enemy: Enemy, index: number, errors: string[]): void {
    IO.checkEnum(enemy.type, ENEMY_TYPES, true, `Enemy ${index} type is invalid`, errors)
    IO.checkNumber(enemy.level, `Enemy ${index} level [${enemy.level}] is invalid`, false, false, errors)
    IO.checkNotEmpty(enemy.name, `Enemy ${index} name [${enemy.name}] is invalid`, errors)
    IO.checkNumber(enemy.hp, `Enemy ${index} hp [${enemy.hp}] is invalid`, false, false, errors)
    IO.checkNumber(enemy.atk, `Enemy ${index} atk [${enemy.atk}] is invalid`, true, false, errors)
    IO.checkNumber(enemy.def, `Enemy ${index} def [${enemy.def}] is invalid`, true, false, errors)
    IO.checkNumber(enemy.exp, `Enemy ${index} exp [${enemy.exp}] is invalid`, true, false, errors)
    IO.checkEnum(enemy.drop, DROPS, false, `Enemy ${index} drop [${enemy.drop}] is invalid`, errors)
  }

  static validateEnemiesImport(enemies: Record<string, string | number | null>[], errors: string[]): void {
    const knownEnemies = []
    enemies.forEach((enemy, index) => {
      const enemyIdentifier = `${enemy.level}|${enemy.type}`
      if (knownEnemies.indexOf(enemyIdentifier) !== -1) {
        errors.push(`Enemy ${index + 1} is duplicated (same type and level)`)
      } else {
        knownEnemies.push(enemyIdentifier)
      }
    })
  }

  static validateEnemiesExport(enemies: Enemy[], errors: string[]): void {
    const knownEnemies = []
    enemies.forEach((enemy, index) => {
      const enemyIdentifier = `${enemy.level}|${enemy.type}`
      if (knownEnemies.indexOf(enemyIdentifier) !== -1) {
        errors.push(`Enemy ${index + 1} is duplicated (same type and level)`)
      } else {
        knownEnemies.push(enemyIdentifier)
      }
    })
  }
}
