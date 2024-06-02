import { ColorSpriteContent, ColorSpriteName } from "./color-sprite-content"
import { MonochromeSpriteContent, MonochromeSpriteName } from "./monochrome-sprite-content"
import { ColorScheme } from "../color-scheme"

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
  private readonly spriteName: MonochromeSpriteName

  constructor(lightContent: MonochromeSpriteName) {
    super()
    this.spriteName = lightContent
  }

  getValue(colorScheme: ColorScheme): string {
    switch (colorScheme) {
      case ColorScheme.dark:
        return this.encode(MonochromeSpriteContent.get(this.spriteName).replaceAll(COLOR_BLACK, COLOR_WHITE))
      case ColorScheme.light:
        return this.encode(MonochromeSpriteContent.get(this.spriteName))
    }
  }
}

export class ColoredSprite extends Sprite {
  private readonly spriteName: ColorSpriteName
  private readonly color: SpriteColors

  constructor(lightContent: ColorSpriteName, color: SpriteColors) {
    super()
    this.spriteName = lightContent
    this.color = color
  }

  getValue(colorScheme: ColorScheme): string {
    switch (colorScheme) {
      case ColorScheme.dark:
        return this.encode(
          ColorSpriteContent.get(this.spriteName)
            .replaceAll(COLOR_BLACK, COLOR_WHITE)
            .replaceAll(COLOR_YELLOW, this.color.darkColor),
        )
      case ColorScheme.light:
        return this.encode(ColorSpriteContent.get(this.spriteName).replaceAll(COLOR_YELLOW, this.color.lightColor))
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
  [SpriteName.doorBlue, new ColoredSprite(ColorSpriteName.DOOR, COLORS_BLUE)],
  [SpriteName.doorCrimson, new ColoredSprite(ColorSpriteName.DOOR, COLORS_CRIMSON)],
  [SpriteName.doorGreenBlue, new ColoredSprite(ColorSpriteName.DOOR, COLORS_GREEN_BLUE)],
  [SpriteName.doorPlatinum, new ColoredSprite(ColorSpriteName.DOOR, COLORS_PLATINUM)],
  [SpriteName.doorViolet, new ColoredSprite(ColorSpriteName.DOOR, COLORS_VIOLET)],
  [SpriteName.doorYellow, new ColoredSprite(ColorSpriteName.DOOR, COLORS_YELLOW)],

  [SpriteName.enemyBurgeoner, new MonochromeSprite(MonochromeSpriteName.ENEMY_HAMMER)],
  [SpriteName.enemyFighter, new MonochromeSprite(MonochromeSpriteName.ENEMY_SWORD)],
  [SpriteName.enemyRanger, new MonochromeSprite(MonochromeSpriteName.ENEMY_ARROW)],
  [SpriteName.enemyShadow, new MonochromeSprite(MonochromeSpriteName.ENEMY_HIDDEN)],
  [SpriteName.enemySlasher, new MonochromeSprite(MonochromeSpriteName.ENEMY_KNIFE)],

  [SpriteName.itemBookShield, new MonochromeSprite(MonochromeSpriteName.ITEM_BOOK_SHIELD)],
  [SpriteName.itemBookSword, new MonochromeSprite(MonochromeSpriteName.ITEM_BOOK_SWORD)],
  [SpriteName.itemBluePotion, new ColoredSprite(ColorSpriteName.ITEM_POTION, COLORS_BLUE)],
  [SpriteName.itemDropOfDreamOcean, new ColoredSprite(ColorSpriteName.ITEM_DROP, COLORS_BLUE)],
  [SpriteName.itemGoldenFeather, new MonochromeSprite(MonochromeSpriteName.ITEM_FEATHER)],
  [SpriteName.itemGuardCard, new ColoredSprite(ColorSpriteName.ITEM_CARD, COLORS_BLUE)],
  [SpriteName.itemGuardDeck, new ColoredSprite(ColorSpriteName.ITEM_CARDS, COLORS_BLUE)],
  [SpriteName.itemGuardGem, new ColoredSprite(ColorSpriteName.ITEM_GEM, COLORS_BLUE)],
  [SpriteName.itemGuardPiece, new ColoredSprite(ColorSpriteName.ITEM_PIECE, COLORS_BLUE)],
  [SpriteName.itemGuardPotion, new ColoredSprite(ColorSpriteName.ITEM_JUG, COLORS_BLUE)],
  [SpriteName.itemHeavenlyPotion, new ColoredSprite(ColorSpriteName.ITEM_CARDS, COLORS_YELLOW)],
  [SpriteName.itemLifeCrown, new ColoredSprite(ColorSpriteName.ITEM_CROWN, COLORS_CRIMSON)],
  [SpriteName.itemLifePotion, new ColoredSprite(ColorSpriteName.ITEM_POTION, COLORS_GREEN)],
  [SpriteName.itemPowerCard, new ColoredSprite(ColorSpriteName.ITEM_CARD, COLORS_CRIMSON)],
  [SpriteName.itemPowerDeck, new ColoredSprite(ColorSpriteName.ITEM_CARDS, COLORS_CRIMSON)],
  [SpriteName.itemPowerGem, new ColoredSprite(ColorSpriteName.ITEM_GEM, COLORS_CRIMSON)],
  [SpriteName.itemPowerPiece, new ColoredSprite(ColorSpriteName.ITEM_PIECE, COLORS_CRIMSON)],
  [SpriteName.itemPowerPotion, new ColoredSprite(ColorSpriteName.ITEM_JUG, COLORS_CRIMSON)],
  [SpriteName.itemRedPotion, new ColoredSprite(ColorSpriteName.ITEM_POTION, COLORS_CRIMSON)],

  [SpriteName.keyBlue, new ColoredSprite(ColorSpriteName.KEY, COLORS_BLUE)],
  [SpriteName.keyCrimson, new ColoredSprite(ColorSpriteName.KEY, COLORS_CRIMSON)],
  [SpriteName.keyGreenBlue, new ColoredSprite(ColorSpriteName.KEY, COLORS_GREEN_BLUE)],
  [SpriteName.keyPlatinum, new ColoredSprite(ColorSpriteName.KEY, COLORS_PLATINUM)],
  [SpriteName.keyViolet, new ColoredSprite(ColorSpriteName.KEY, COLORS_VIOLET)],
  [SpriteName.keyYellow, new ColoredSprite(ColorSpriteName.KEY, COLORS_YELLOW)],
  [SpriteName.scoreCheck, new MonochromeSprite(MonochromeSpriteName.SCORE_CHECK)],
  [SpriteName.scoreCrown, new MonochromeSprite(MonochromeSpriteName.SCORE_CROWN)],
  [SpriteName.scoreStar, new MonochromeSprite(MonochromeSpriteName.SCORE_STAR)],
  [SpriteName.staircaseUp, new MonochromeSprite(MonochromeSpriteName.STAIRCASE_UP)],
  [SpriteName.staircaseDown, new MonochromeSprite(MonochromeSpriteName.STAIRCASE_DOWN)],
  [SpriteName.startingPosition, new MonochromeSprite(MonochromeSpriteName.STARTING_POSITION)],
  [SpriteName.wall, new MonochromeSprite(MonochromeSpriteName.WALL)],
])
