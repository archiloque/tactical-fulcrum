import {Assets, Sprite} from 'pixi.js'

export const enum TacticalFulcrumSprites {
    key = 'key',
    door = 'door',
    enemy = 'enemy',
    item = 'item',
    staircaseUp = 'staircase-up',
    staircaseDown = 'staircase-down',
    startingPosition = 'starting-position',
    wall = 'wall',
}

const SPRITES: TacticalFulcrumSprites[] = [
    TacticalFulcrumSprites.key,
    TacticalFulcrumSprites.door,
    TacticalFulcrumSprites.enemy,
    TacticalFulcrumSprites.item,
    TacticalFulcrumSprites.staircaseUp,
    TacticalFulcrumSprites.staircaseDown,
    TacticalFulcrumSprites.startingPosition,
    TacticalFulcrumSprites.wall,
]

export class Sprites {
    private tileSize: number

    async reload(tileSize: number): Promise<any> {
        console.info('Sheets', 'reload', tileSize)
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

    getSprite(spriteName: TacticalFulcrumSprites): Sprite {
        const sprite: Sprite = Sprite.from(spriteName.valueOf())
        sprite.width = this.tileSize
        sprite.height = this.tileSize
        return sprite
    }
}
