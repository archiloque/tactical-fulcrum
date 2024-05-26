import { DoorTile, EnemyTile, ItemTile, KeyTile, StaircaseTile, Tile, TileType } from "../../models/tile"
import { Color } from "../../data/color"
import { EnemyType } from "../../data/enemy-type"
import { Item } from "../../data/item"
import { ScoreType } from "../../data/score-type"
import { Sprites } from "./sprites"
import { StaircaseDirection } from "../../data/staircase-direction"

export class SpritesToItem {
  private static spriteNameFromDoor(tile: DoorTile): Sprites {
    switch (tile.color) {
      case Color.blue:
        return Sprites.doorBlue
      case Color.crimson:
        return Sprites.doorCrimson
      case Color.greenBlue:
        return Sprites.doorGreenBlue
      case Color.platinum:
        return Sprites.doorPlatinum
      case Color.violet:
        return Sprites.doorViolet
      case Color.yellow:
        return Sprites.doorYellow
    }
  }

  private static spriteNameFromEnemy(tile: EnemyTile): Sprites {
    switch (tile.enemy.type) {
      case EnemyType.burgeoner:
        return Sprites.enemyBurgeoner
      case EnemyType.fighter:
        return Sprites.enemyFighter
      case EnemyType.ranger:
        return Sprites.enemyRanger
      case EnemyType.shadow:
        return Sprites.enemyShadow
      case EnemyType.slasher:
        return Sprites.enemySlasher
    }
  }

  private static spriteNameFromKey(tile: KeyTile): Sprites {
    switch (tile.color) {
      case Color.blue:
        return Sprites.keyBlue
      case Color.crimson:
        return Sprites.keyCrimson
      case Color.greenBlue:
        return Sprites.keyGreenBlue
      case Color.platinum:
        return Sprites.keyPlatinum
      case Color.violet:
        return Sprites.keyViolet
      case Color.yellow:
        return Sprites.keyYellow
    }
  }

  private static spriteNameFromItem(tile: ItemTile): Sprites {
    switch (tile.item) {
      case Item.pulse_book_shield:
        return Sprites.itemBookShield
      case Item.pulse_book_sword:
        return Sprites.itemBookSword
      case Item.blue_potion:
        return Sprites.itemBluePotion
      case Item.drop_of_dream_ocean:
        return Sprites.itemDropOfDreamOcean
      case Item.golden_feather:
        return Sprites.itemGoldenFeather
      case Item.guard_card:
        return Sprites.itemGuardCard
      case Item.guard_deck:
        return Sprites.itemGuardDeck
      case Item.guard_gem:
        return Sprites.itemGuardGem
      case Item.guard_piece:
        return Sprites.itemGuardPiece
      case Item.guard_potion:
        return Sprites.itemGuardPotion
      case Item.heavenly_potion:
        return Sprites.itemHeavenlyPotion
      case Item.life_crown:
        return Sprites.itemLifeCrown
      case Item.life_potion:
        return Sprites.itemLifePotion
      case Item.power_card:
        return Sprites.itemPowerCard
      case Item.power_deck:
        return Sprites.itemPowerDeck
      case Item.power_gem:
        return Sprites.itemPowerGem
      case Item.power_piece:
        return Sprites.itemPowerPiece
      case Item.power_potion:
        return Sprites.itemPowerPotion
      case Item.red_potion:
        return Sprites.itemRedPotion
    }
  }

  static spriteNameFromScore(score: ScoreType): Sprites {
    switch (score) {
      case ScoreType.check:
        return Sprites.scoreCheck
      case ScoreType.crown:
        return Sprites.scoreCrown
      case ScoreType.star:
        return Sprites.scoreStar
    }
  }

  private static spriteNameFromStaircase(tile: StaircaseTile): Sprites {
    switch (tile.direction) {
      case StaircaseDirection.down:
        return Sprites.staircaseUp
      case StaircaseDirection.up:
        return Sprites.staircaseDown
    }
  }

  static spriteNameFromTile(tile: Tile): Sprites {
    switch (tile.getType()) {
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
        return Sprites.startingPosition
      case TileType.wall:
        return Sprites.wall
    }
  }
}
