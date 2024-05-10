import {Assets, Sprite} from 'pixi.js'

export const enum TacticalFulcrumSprites {
    doorBlue = 'door-blue',
    doorCrimson = 'door-crimson',
    doorGreenBlue = 'door-greenBlue',
    doorPlatinum = 'door-platinum',
    doorViolet = 'door-violet',
    doorYellow = 'door-yellow',
    enemy = 'enemy',
    item = 'item',
    keyBlue = 'key-blue',
    keyCrimson = 'key-crimson',
    keyGreenBlue = 'key-greenBlue',
    keyPlatinum = 'key-platinum',
    keyViolet = 'key-violet',
    keyYellow = 'key-yellow',
    staircaseUp = 'staircase-up',
    staircaseDown = 'staircase-down',
    startingPosition = 'starting-position',
    wall = 'wall',
}

const SPRITES: TacticalFulcrumSprites[] = [
    TacticalFulcrumSprites.doorBlue,
    TacticalFulcrumSprites.doorCrimson,
    TacticalFulcrumSprites.doorGreenBlue,
    TacticalFulcrumSprites.doorPlatinum,
    TacticalFulcrumSprites.doorViolet,
    TacticalFulcrumSprites.doorYellow,
    TacticalFulcrumSprites.enemy,
    TacticalFulcrumSprites.item,
    TacticalFulcrumSprites.keyBlue,
    TacticalFulcrumSprites.keyCrimson,
    TacticalFulcrumSprites.keyGreenBlue,
    TacticalFulcrumSprites.keyPlatinum,
    TacticalFulcrumSprites.keyViolet,
    TacticalFulcrumSprites.keyYellow,
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
