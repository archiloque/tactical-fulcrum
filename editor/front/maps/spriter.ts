import { Assets, Sprite } from "pixi.js"
import { SpriteName, SPRITES } from "./sprites"
import { ColorScheme } from "../color-scheme"

export class Spriter {
  private tileSize: number

  async reload(tileSize: number, colorScheme: ColorScheme): Promise<any> {
    console.debug("Spriter", "reload", "size", tileSize, "color scheme", colorScheme)
    this.tileSize = tileSize
    Assets.cache.reset()
    const toLoad = []
    for (const [spriteName, sprite] of SPRITES.entries()) {
      toLoad.push({
        alias: spriteName.valueOf().toString(),
        src: sprite.getValue(colorScheme),
        data: {
          height: tileSize * window.devicePixelRatio,
          width: tileSize * window.devicePixelRatio,
          resolution: window.devicePixelRatio,
        },
      })
    }
    return Assets.load(toLoad)
  }

  getSprite(spriteName: SpriteName): Sprite {
    const sprite: Sprite = Sprite.from(spriteName.valueOf().toString())
    sprite.width = this.tileSize
    sprite.height = this.tileSize
    return sprite
  }
}
