import { Assets, Sprite } from "pixi.js"
import { SpriteName, SPRITES } from "./sprites"
import { getCurrentColorScheme } from "../color-scheme"

export class Spriter {
  // @ts-ignore
  private tileSize: number
  private readonly name: string
  private cache: string[] = []

  constructor(name: string) {
    this.name = name
  }

  async reload(tileSize: number): Promise<void> {
    console.debug("Spriter", "reload", "size", tileSize)
    this.tileSize = tileSize
    for (const cached of this.cache) {
      Assets.cache.remove(cached)
    }
    this.cache = []
    const toLoad: any = []
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
          autoDensity: true,
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
    return `${this.name}_${spriteName}_${this.tileSize}_${getCurrentColorScheme()}`
  }
}
