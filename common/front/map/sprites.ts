import {Colors, INITIAL_COLOR_BLACK, INITIAL_COLOR_YELLOW} from '../colors'
import {ColorSpriteContent, ColorSpriteName} from '../sprites/color-sprite-content'
import {getCssProperty, getTextColor} from '../color-scheme'
import {MonochromeSpriteContent, MonochromeSpriteName} from '../sprites/monochrome-sprite-content'
import {decodeSvg} from '../icons/decode-svg'

abstract class Sprite {
  abstract getValue(): string
}

export class MonochromeSprite extends Sprite {
  private readonly spriteName: MonochromeSpriteName

  constructor(lightContent: MonochromeSpriteName) {
    super()
    this.spriteName = lightContent
  }

  getValue(): string {
    return decodeSvg(MonochromeSpriteContent.get(this.spriteName)!.replaceAll(INITIAL_COLOR_BLACK, getTextColor()))
  }
}

export class ColoredSprite extends Sprite {
  private readonly spriteName: ColorSpriteName
  private readonly color: Colors

  constructor(lightContent: ColorSpriteName, color: Colors) {
    super()
    this.spriteName = lightContent
    this.color = color
  }

  getValue(): string {
    return decodeSvg(
      ColorSpriteContent.get(this.spriteName)!
        .replaceAll(INITIAL_COLOR_BLACK, getTextColor())
        .replaceAll(INITIAL_COLOR_YELLOW, getCssProperty(this.color.valueOf())),
    )
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
  [SpriteName.doorBlue, new ColoredSprite(ColorSpriteName.DOOR, Colors.blue)],
  [SpriteName.doorCrimson, new ColoredSprite(ColorSpriteName.DOOR, Colors.red)],
  [SpriteName.doorGreenBlue, new ColoredSprite(ColorSpriteName.DOOR, Colors.teal)],
  [SpriteName.doorPlatinum, new ColoredSprite(ColorSpriteName.DOOR, Colors.platinum)],
  [SpriteName.doorViolet, new ColoredSprite(ColorSpriteName.DOOR, Colors.violet)],
  [SpriteName.doorYellow, new ColoredSprite(ColorSpriteName.DOOR, Colors.yellow)],

  [SpriteName.enemyBurgeoner, new MonochromeSprite(MonochromeSpriteName.ENEMY_HAMMER)],
  [SpriteName.enemyFighter, new MonochromeSprite(MonochromeSpriteName.ENEMY_SWORD)],
  [SpriteName.enemyRanger, new MonochromeSprite(MonochromeSpriteName.ENEMY_ARROW)],
  [SpriteName.enemyShadow, new MonochromeSprite(MonochromeSpriteName.ENEMY_HIDDEN)],
  [SpriteName.enemySlasher, new MonochromeSprite(MonochromeSpriteName.ENEMY_KNIFE)],

  [SpriteName.itemBookShield, new MonochromeSprite(MonochromeSpriteName.ITEM_BOOK_SHIELD)],
  [SpriteName.itemBookSword, new MonochromeSprite(MonochromeSpriteName.ITEM_BOOK_SWORD)],
  [SpriteName.itemBluePotion, new ColoredSprite(ColorSpriteName.ITEM_POTION, Colors.blue)],
  [SpriteName.itemDropOfDreamOcean, new ColoredSprite(ColorSpriteName.ITEM_DROP, Colors.blue)],
  [SpriteName.itemGoldenFeather, new MonochromeSprite(MonochromeSpriteName.ITEM_FEATHER)],
  [SpriteName.itemGuardCard, new ColoredSprite(ColorSpriteName.ITEM_CARD, Colors.blue)],
  [SpriteName.itemGuardDeck, new ColoredSprite(ColorSpriteName.ITEM_CARDS, Colors.blue)],
  [SpriteName.itemGuardGem, new ColoredSprite(ColorSpriteName.ITEM_GEM, Colors.blue)],
  [SpriteName.itemGuardPiece, new ColoredSprite(ColorSpriteName.ITEM_PIECE, Colors.blue)],
  [SpriteName.itemGuardPotion, new ColoredSprite(ColorSpriteName.ITEM_JUG, Colors.blue)],
  [SpriteName.itemHeavenlyPotion, new ColoredSprite(ColorSpriteName.ITEM_POTION, Colors.yellow)],
  [SpriteName.itemLifeCrown, new ColoredSprite(ColorSpriteName.ITEM_CROWN, Colors.red)],
  [SpriteName.itemLifePotion, new ColoredSprite(ColorSpriteName.ITEM_POTION, Colors.green)],
  [SpriteName.itemPowerCard, new ColoredSprite(ColorSpriteName.ITEM_CARD, Colors.red)],
  [SpriteName.itemPowerDeck, new ColoredSprite(ColorSpriteName.ITEM_CARDS, Colors.red)],
  [SpriteName.itemPowerGem, new ColoredSprite(ColorSpriteName.ITEM_GEM, Colors.red)],
  [SpriteName.itemPowerPiece, new ColoredSprite(ColorSpriteName.ITEM_PIECE, Colors.red)],
  [SpriteName.itemPowerPotion, new ColoredSprite(ColorSpriteName.ITEM_JUG, Colors.red)],
  [SpriteName.itemRedPotion, new ColoredSprite(ColorSpriteName.ITEM_POTION, Colors.red)],

  [SpriteName.keyBlue, new ColoredSprite(ColorSpriteName.KEY, Colors.blue)],
  [SpriteName.keyCrimson, new ColoredSprite(ColorSpriteName.KEY, Colors.red)],
  [SpriteName.keyGreenBlue, new ColoredSprite(ColorSpriteName.KEY, Colors.teal)],
  [SpriteName.keyPlatinum, new ColoredSprite(ColorSpriteName.KEY, Colors.platinum)],
  [SpriteName.keyViolet, new ColoredSprite(ColorSpriteName.KEY, Colors.violet)],
  [SpriteName.keyYellow, new ColoredSprite(ColorSpriteName.KEY, Colors.yellow)],
  [SpriteName.scoreCheck, new MonochromeSprite(MonochromeSpriteName.SCORE_CHECK)],
  [SpriteName.scoreCrown, new MonochromeSprite(MonochromeSpriteName.SCORE_CROWN)],
  [SpriteName.scoreStar, new MonochromeSprite(MonochromeSpriteName.SCORE_STAR)],
  [SpriteName.staircaseUp, new MonochromeSprite(MonochromeSpriteName.STAIRCASE_UP)],
  [SpriteName.staircaseDown, new MonochromeSprite(MonochromeSpriteName.STAIRCASE_DOWN)],
  [SpriteName.startingPosition, new MonochromeSprite(MonochromeSpriteName.STARTING_POSITION)],
  [SpriteName.wall, new MonochromeSprite(MonochromeSpriteName.WALL)],
])
