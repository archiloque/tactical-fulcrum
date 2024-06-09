import { Assets, Sprite } from "pixi.js"
import { SpriteName, SPRITES } from "./sprites"

export class Spriter {
  private tileSize: number

  async reload(tileSize: number): Promise<any> {
    console.debug("Spriter", "reload", "size", tileSize)
    this.tileSize = tileSize
    Assets.cache.reset()
    const toLoad = []
    for (const [spriteName, sprite] of SPRITES.entries()) {
      toLoad.push({
        alias: spriteName.valueOf().toString(),
        src: sprite.getValue(),
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
