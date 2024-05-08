import {Assets} from 'pixi.js'
import {CompositeTilemap} from '@pixi/tilemap'

export class Sheets {
    tilemap: CompositeTilemap
    EMPTY_TILE = 'empty'

    async load(): Promise<any> {
        const sprites = Assets.load('./assets/images/sprites.json')
        this.tilemap = new CompositeTilemap()
        return sprites
    }
}
