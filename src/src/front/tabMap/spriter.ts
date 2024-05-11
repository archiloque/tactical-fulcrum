import {Assets, Sprite} from 'pixi.js'
import {SPRITES, Sprites} from './sprites'

export class Spriter {
    private tileSize: number

    async reload(tileSize: number): Promise<any> {
        console.debug('Spriter', 'reload', tileSize)
        this.tileSize = tileSize
        Assets.cache.reset()
        return Promise.all(SPRITES.map(sprite =>
            Assets.load({
                alias: sprite.valueOf(),
                src: `./assets/sprites/${sprite.valueOf()}.svg`,
                data: {
                    height: tileSize * window.devicePixelRatio,
                    width: tileSize * window.devicePixelRatio,
                    resolution: window.devicePixelRatio,
                },
            }),
        ))
    }

    getSprite(spriteName: Sprites): Sprite {
        const sprite: Sprite = Sprite.from(spriteName.valueOf())
        sprite.width = this.tileSize
        sprite.height = this.tileSize
        return sprite
    }
}
