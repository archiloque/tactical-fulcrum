import {Assets, Sprite} from 'pixi.js'
import {SPRITES, Sprites} from './sprites'
import {ColorScheme} from '../colorScheme'

export class Spriter {
  private tileSize: number

  async reload(tileSize: number, colorScheme: ColorScheme): Promise<any> {
    console.debug('Spriter', 'reload', 'size', tileSize, 'color scheme', colorScheme)
    this.tileSize = tileSize
    Assets.cache.reset()
    return Assets.load(
      SPRITES.map((sprite) => {
        return {
          alias: sprite.valueOf(),
          src: `./sprites/${sprite.valueOf()}-${colorScheme.valueOf()}.svg`,
          data: {
            height: tileSize * window.devicePixelRatio,
            width: tileSize * window.devicePixelRatio,
            resolution: window.devicePixelRatio,
          },
        }
      }),
    )
  }

  getSprite(spriteName: Sprites): Sprite {
    const sprite: Sprite = Sprite.from(spriteName.valueOf())
    sprite.width = this.tileSize
    sprite.height = this.tileSize
    return sprite
  }
}
