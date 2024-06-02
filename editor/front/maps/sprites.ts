import { ColorScheme } from "../color-scheme"
import { ColorSpriteContent } from "./color-sprite-content"
import { MonochromeSpriteContent } from "./monochrome-sprite-content"

const COLOR_BLACK = "#000"
const COLOR_WHITE = "#cccccc"
const COLOR_YELLOW = "#ff0"

class SpriteColors {
  readonly lightColor: string
  readonly darkColor: string

  constructor(lightColor: string, darkColor: string) {
    this.lightColor = lightColor
    this.darkColor = darkColor
  }
}

abstract class Sprite {
  abstract getValue(colorScheme: ColorScheme): string

  encode(value: string): string {
    return `data:image/svg+xml;base64,${btoa(value)}`
  }
}

const COLORS_YELLOW = new SpriteColors(COLOR_YELLOW, "#AAAA00")
const COLORS_BLUE = new SpriteColors("#2563eb", "#1E40AF")
const COLORS_CRIMSON = new SpriteColors("#ff0000", "#660000")
const COLORS_GREEN = new SpriteColors("#65ff00", "#3d9900")
const COLORS_GREEN_BLUE = new SpriteColors("#14b8a6", "#084a42")
const COLORS_PLATINUM = new SpriteColors("#8E8E8E", "#8E8E8E")
const COLORS_VIOLET = new SpriteColors("#a855f7", "#44067f")

export class MonochromeSprite extends Sprite {
  private readonly lightContent: MonochromeSpriteContent

  constructor(lightContent: MonochromeSpriteContent) {
    super()
    this.lightContent = lightContent
  }

  getValue(colorScheme: ColorScheme): string {
    switch (colorScheme) {
      case ColorScheme.dark:
        return this.encode(this.lightContent.replaceAll(COLOR_BLACK, COLOR_WHITE))
      case ColorScheme.light:
        return this.encode(this.lightContent)
    }
  }
}

export class ColoredSprite extends Sprite {
  private readonly lightContent: ColorSpriteContent
  private readonly color: SpriteColors

  constructor(lightContent: ColorSpriteContent, color: SpriteColors) {
    super()
    this.lightContent = lightContent
    this.color = color
  }

  getValue(colorScheme: ColorScheme): string {
    switch (colorScheme) {
      case ColorScheme.dark:
        return this.encode(this.lightContent.replaceAll(COLOR_BLACK, COLOR_WHITE).replaceAll(COLOR_YELLOW, this.color.darkColor))
      case ColorScheme.light:
        return this.encode(this.lightContent.replaceAll(COLOR_YELLOW, this.color.lightColor))
    }
  }
}

export const enum SpriteName {
  doorBlue,
  doorCrimson,
  doorGreenBlue,
  doorPlatinum,
  doorViolet,
  doorYellow,

  enemyBurgeoner,
  enemyFighter,
  enemyRanger,
  enemyShadow,
  enemySlasher,

  itemBookShield,
  itemBookSword,
  itemBluePotion,
  itemDropOfDreamOcean,
  itemGoldenFeather,
  itemGuardCard,
  itemGuardDeck,
  itemGuardGem,
  itemGuardPiece,
  itemGuardPotion,
  itemHeavenlyPotion,
  itemLifeCrown,
  itemLifePotion,
  itemRedPotion,
  itemPowerCard,
  itemPowerDeck,
  itemPowerGem,
  itemPowerPiece,
  itemPowerPotion,

  keyBlue,
  keyCrimson,
  keyGreenBlue,
  keyPlatinum,
  keyViolet,
  keyYellow,
  scoreCheck,
  scoreCrown,
  scoreStar,
  staircaseUp,
  staircaseDown,
  startingPosition,
  wall,
}

export const SPRITES = new Map<SpriteName, Sprite>([
  [SpriteName.doorBlue, new ColoredSprite(ColorSpriteContent.DOOR, COLORS_BLUE)],
  [SpriteName.doorCrimson, new ColoredSprite(ColorSpriteContent.DOOR, COLORS_CRIMSON)],
  [SpriteName.doorGreenBlue, new ColoredSprite(ColorSpriteContent.DOOR, COLORS_GREEN_BLUE)],
  [SpriteName.doorPlatinum, new ColoredSprite(ColorSpriteContent.DOOR, COLORS_PLATINUM)],
  [SpriteName.doorViolet, new ColoredSprite(ColorSpriteContent.DOOR, COLORS_VIOLET)],
  [SpriteName.doorYellow, new ColoredSprite(ColorSpriteContent.DOOR, COLORS_YELLOW)],

  [SpriteName.enemyBurgeoner, new MonochromeSprite(MonochromeSpriteContent.ENEMY_HAMMER)],
  [SpriteName.enemyFighter, new MonochromeSprite(MonochromeSpriteContent.ENEMY_SWORD)],
  [SpriteName.enemyRanger, new MonochromeSprite(MonochromeSpriteContent.ENEMY_ARROW)],
  [SpriteName.enemyShadow, new MonochromeSprite(MonochromeSpriteContent.ENEMY_HIDDEN)],
  [SpriteName.enemySlasher, new MonochromeSprite(MonochromeSpriteContent.ENEMY_KNIFE)],

  [SpriteName.itemBookShield, new MonochromeSprite(MonochromeSpriteContent.ITEM_BOOK_SHIELD)],
  [SpriteName.itemBookSword, new MonochromeSprite(MonochromeSpriteContent.ITEM_BOOK_SWORD)],
  [SpriteName.itemBluePotion, new ColoredSprite(ColorSpriteContent.ITEM_POTION, COLORS_BLUE)],
  [SpriteName.itemDropOfDreamOcean, new ColoredSprite(ColorSpriteContent.ITEM_DROP, COLORS_BLUE)],
  [SpriteName.itemGoldenFeather, new MonochromeSprite(MonochromeSpriteContent.ITEM_FEATHER)],
  [SpriteName.itemGuardCard, new ColoredSprite(ColorSpriteContent.ITEM_CARD, COLORS_BLUE)],
  [SpriteName.itemGuardDeck, new ColoredSprite(ColorSpriteContent.ITEM_CARDS, COLORS_BLUE)],
  [SpriteName.itemGuardGem, new ColoredSprite(ColorSpriteContent.ITEM_GEM, COLORS_BLUE)],
  [SpriteName.itemGuardPiece, new ColoredSprite(ColorSpriteContent.ITEM_PIECE, COLORS_BLUE)],
  [SpriteName.itemGuardPotion, new ColoredSprite(ColorSpriteContent.ITEM_JUG, COLORS_BLUE)],
  [SpriteName.itemHeavenlyPotion, new ColoredSprite(ColorSpriteContent.ITEM_CARDS, COLORS_YELLOW)],
  [SpriteName.itemLifeCrown, new ColoredSprite(ColorSpriteContent.ITEM_CROWN, COLORS_CRIMSON)],
  [SpriteName.itemLifePotion, new ColoredSprite(ColorSpriteContent.ITEM_POTION, COLORS_GREEN)],
  [SpriteName.itemPowerCard, new ColoredSprite(ColorSpriteContent.ITEM_CARD, COLORS_CRIMSON)],
  [SpriteName.itemPowerDeck, new ColoredSprite(ColorSpriteContent.ITEM_CARDS, COLORS_CRIMSON)],
  [SpriteName.itemPowerGem, new ColoredSprite(ColorSpriteContent.ITEM_GEM, COLORS_CRIMSON)],
  [SpriteName.itemPowerPiece, new ColoredSprite(ColorSpriteContent.ITEM_PIECE, COLORS_CRIMSON)],
  [SpriteName.itemPowerPotion, new ColoredSprite(ColorSpriteContent.ITEM_JUG, COLORS_CRIMSON)],
  [SpriteName.itemRedPotion, new ColoredSprite(ColorSpriteContent.ITEM_POTION, COLORS_CRIMSON)],

  [SpriteName.keyBlue, new ColoredSprite(ColorSpriteContent.KEY, COLORS_BLUE)],
  [SpriteName.keyCrimson, new ColoredSprite(ColorSpriteContent.KEY, COLORS_CRIMSON)],
  [SpriteName.keyGreenBlue, new ColoredSprite(ColorSpriteContent.KEY, COLORS_GREEN_BLUE)],
  [SpriteName.keyPlatinum, new ColoredSprite(ColorSpriteContent.KEY, COLORS_PLATINUM)],
  [SpriteName.keyViolet, new ColoredSprite(ColorSpriteContent.KEY, COLORS_VIOLET)],
  [SpriteName.keyYellow, new ColoredSprite(ColorSpriteContent.KEY, COLORS_YELLOW)],
  [SpriteName.scoreCheck, new MonochromeSprite(MonochromeSpriteContent.SCORE_CHECK)],
  [SpriteName.scoreCrown, new MonochromeSprite(MonochromeSpriteContent.SCORE_CROWN)],
  [SpriteName.scoreStar, new MonochromeSprite(MonochromeSpriteContent.SCORE_STAR)],
  [SpriteName.staircaseUp, new MonochromeSprite(MonochromeSpriteContent.STAIRCASE_UP)],
  [SpriteName.staircaseDown, new MonochromeSprite(MonochromeSpriteContent.STAIRCASE_DOWN)],
  [SpriteName.startingPosition, new MonochromeSprite(MonochromeSpriteContent.STARTING_POSITION)],
  [SpriteName.wall, new MonochromeSprite(MonochromeSpriteContent.WALL)],
])
