import { DoorTile, EnemyTile, ItemTile, KeyTile, StaircaseTile, Tile, TileType } from "../../behavior/tile"
import { Color } from "../../data/color"
import { Item } from "../../data/item"
import { ScoreType } from "../../data/scoreType"
import { Sprites } from "./sprites"
import { StaircaseDirection } from "../../data/staircaseDirection"
import { EnemyType } from "../../data/enemyType"

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
      case EnemyType.fighter:
        return Sprites.enemyFighter
      case EnemyType.ranger:
        return Sprites.enemyRanger
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
      case Item.blue_potion:
        return Sprites.itemBluePotion
      case Item.golden_feather:
        return Sprites.goldenFeather
      case Item.guard_card:
        return Sprites.itemGuardCard
      case Item.guard_deck:
        return Sprites.itemGuardDeck
      case Item.life_potion:
        return Sprites.itemLifePotion
      case Item.power_card:
        return Sprites.itemPowerCard
      case Item.power_deck:
        return Sprites.itemPowerDeck
      case Item.red_potion:
        return Sprites.itemRedPotion
      default:
        return Sprites.item
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