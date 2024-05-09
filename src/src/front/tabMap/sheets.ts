import {Assets, Sprite} from 'pixi.js'

export const enum TacticalFulcrumSprites {
    key = 'key',
    stairs = 'stairs',
}

const SPRITES: TacticalFulcrumSprites[] = [
    TacticalFulcrumSprites.key,
    TacticalFulcrumSprites.stairs,
]

export class Sheets {
    private tileSize: number

    async reload(tileSize: number): Promise<any> {
        console.info('Sheets', 'reload', tileSize)
        this.tileSize = tileSize
        Assets.cache.reset()
        await Promise.all(SPRITES.map(sprite =>
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

    getSprite(spriteName: TacticalFulcrumSprites): Sprite {
        const sprite: Sprite = Sprite.from(spriteName.valueOf())
        sprite.width = this.tileSize
        sprite.height = this.tileSize
        return sprite
    }
}
