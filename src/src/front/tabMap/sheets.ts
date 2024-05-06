import {Assets, Loader, Sprite, Spritesheet, Texture} from 'pixi.js'
import {CompositeTilemap, Tilemap} from '@pixi/tilemap';

export class Sheets {
    tilemap: CompositeTilemap;
    EMPTY_TILE = "empty"

    async load() {
        const sprites = Assets.load('./assets/images/sprites.json');
        this.tilemap = new CompositeTilemap()
        return sprites
    }
}
