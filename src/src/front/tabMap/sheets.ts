import {Assets, Loader, Sprite, Spritesheet, Texture} from 'pixi.js'

export class Sheets {
    empty: Sprite;
    wall: Sprite;
    async load() {
        const spritesAsset = await Assets.load('./assets/images/sprites.json');
        this.wall = new Sprite(spritesAsset.textures['wall'])
        this.empty = new Sprite(spritesAsset.textures['empty'])
        console.debug(this)
    }
}
