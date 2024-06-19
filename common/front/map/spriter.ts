import { Assets, Sprite } from "pixi.js"
import { SpriteName, SPRITES } from "./sprites"

export class Spriter {
  private tileSize: number
  private readonly name: string
  private cache: string[] = []

  constructor(name: string) {
    this.name = name
  }

  async reload(tileSize: number): Promise<any> {
    console.debug("Spriter", "reload", "size", tileSize)
    this.tileSize = tileSize
    for (const cached of this.cache) {
      Assets.cache.remove(cached)
    }
    this.cache = []
    const toLoad = []
    for (const [spriteName, sprite] of SPRITES.entries()) {
      const alias = this.assetName(spriteName)
      this.cache.push(alias)
      toLoad.push({
        alias: alias,
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
    const sprite: Sprite = Sprite.from(this.assetName(spriteName))
    sprite.width = this.tileSize
    sprite.height = this.tileSize
    return sprite
  }

  private assetName(spriteName: SpriteName): string {
    return `${this.name}_${spriteName.valueOf().toString()}_${this.tileSize}`
  }
}
