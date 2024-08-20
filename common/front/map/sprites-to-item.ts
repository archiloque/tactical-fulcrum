import { DoorTile, EnemyTile, ItemTile, KeyTile, StaircaseTile, Tile, TileType } from "../../models/tile"
import { Color } from "../../data/color"
import { EnemyType } from "../../data/enemy-type"
import { ItemName } from "../../data/item-name"
import { ScoreType } from "../../data/score-type"
import { SpriteName } from "./sprites"
import { StaircaseDirection } from "../../data/staircase-direction"

export class SpritesToItem {
  private static spriteNameFromDoor(tile: DoorTile): SpriteName {
    switch (tile.color) {
      case Color.blue:
        return SpriteName.doorBlue
      case Color.crimson:
        return SpriteName.doorCrimson
      case Color.greenBlue:
        return SpriteName.doorGreenBlue
      case Color.platinum:
        return SpriteName.doorPlatinum
      case Color.violet:
        return SpriteName.doorViolet
      case Color.yellow:
        return SpriteName.doorYellow
    }
  }

  private static spriteNameFromEnemy(tile: EnemyTile): SpriteName {
    switch (tile.enemy.type) {
      case EnemyType.burgeoner:
        return SpriteName.enemyBurgeoner
      case EnemyType.fighter:
        return SpriteName.enemyFighter
      case EnemyType.ranger:
        return SpriteName.enemyRanger
      case EnemyType.shadow:
        return SpriteName.enemyShadow
      case EnemyType.slasher:
        return SpriteName.enemySlasher
    }
    throw new Error(`Unknown enemy type [${tile.enemy.type}]`)
  }

  private static spriteNameFromKey(tile: KeyTile): SpriteName {
    switch (tile.color) {
      case Color.blue:
        return SpriteName.keyBlue
      case Color.crimson:
        return SpriteName.keyCrimson
      case Color.greenBlue:
        return SpriteName.keyGreenBlue
      case Color.platinum:
        return SpriteName.keyPlatinum
      case Color.violet:
        return SpriteName.keyViolet
      case Color.yellow:
        return SpriteName.keyYellow
    }
  }

  private static spriteNameFromItem(tile: ItemTile): SpriteName {
    switch (tile.item) {
      case ItemName.pulse_book_shield:
        return SpriteName.itemBookShield
      case ItemName.pulse_book_sword:
        return SpriteName.itemBookSword
      case ItemName.blue_potion:
        return SpriteName.itemBluePotion
      case ItemName.drop_of_dream_ocean:
        return SpriteName.itemDropOfDreamOcean
      case ItemName.golden_feather:
        return SpriteName.itemGoldenFeather
      case ItemName.guard_card:
        return SpriteName.itemGuardCard
      case ItemName.guard_deck:
        return SpriteName.itemGuardDeck
      case ItemName.guard_gem:
        return SpriteName.itemGuardGem
      case ItemName.guard_piece:
        return SpriteName.itemGuardPiece
      case ItemName.guard_potion:
        return SpriteName.itemGuardPotion
      case ItemName.heavenly_potion:
        return SpriteName.itemHeavenlyPotion
      case ItemName.life_crown:
        return SpriteName.itemLifeCrown
      case ItemName.life_potion:
        return SpriteName.itemLifePotion
      case ItemName.power_card:
        return SpriteName.itemPowerCard
      case ItemName.power_deck:
        return SpriteName.itemPowerDeck
      case ItemName.power_gem:
        return SpriteName.itemPowerGem
      case ItemName.power_piece:
        return SpriteName.itemPowerPiece
      case ItemName.power_potion:
        return SpriteName.itemPowerPotion
      case ItemName.red_potion:
        return SpriteName.itemRedPotion
    }
  }

  static spriteNameFromScore(score: ScoreType): SpriteName {
    switch (score) {
      case ScoreType.check:
        return SpriteName.scoreCheck
      case ScoreType.crown:
        return SpriteName.scoreCrown
      case ScoreType.star:
        return SpriteName.scoreStar
    }
  }

  private static spriteNameFromStaircase(tile: StaircaseTile): SpriteName {
    switch (tile.direction) {
      case StaircaseDirection.down:
        return SpriteName.staircaseUp
      case StaircaseDirection.up:
        return SpriteName.staircaseDown
    }
  }

  static spriteNameFromTile(tile: Tile): SpriteName | null {
    switch (tile.type) {
      case TileType.empty:
        return null
      case TileType.door:
        return this.spriteNameFromDoor(tile as DoorTile)
      case TileType.enemy:
        return this.spriteNameFromEnemy(tile as EnemyTile)
      case TileType.key:
        return this.spriteNameFromKey(tile as KeyTile)
      case TileType.item:
        return this.spriteNameFromItem(tile as ItemTile)
      case TileType.staircase:
        return this.spriteNameFromStaircase(tile as StaircaseTile)
      case TileType.startingPosition:
        return SpriteName.startingPosition
      case TileType.wall:
        return SpriteName.wall
    }
  }
}
