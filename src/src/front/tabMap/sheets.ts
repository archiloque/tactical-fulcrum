import {Assets, Graphics, Sprite, Texture} from 'pixi.js'
import {CompositeTilemap} from '@pixi/tilemap'

export class Sheets {
    static readonly TILE_EMPTY = 'empty'
    static readonly TILE_WALL = 'wall'
    static readonly TILE_ENEMY_BURGEONER = 'enemy-Burgeoner'
    static readonly TILE_ENEMY_FIGHTER = 'enemy-Fighter'
    static readonly TILE_ENEMY_RANGER = 'enemy-Ranger'
    static readonly TILE_ENEMY_SHADOW = 'enemy-Shadow'
    static readonly TILE_ENEMY_SLASHER = 'enemy-Slasher'
    static readonly TILE_POTION = 'potion'
    static readonly TILE_KEY = 'key'
    key: Sprite

    async init(tileSize: number): Promise<any> {
        console.info('Sheets', 'init', tileSize)
        Assets.cache.reset()
        const keyAsset = await Assets.load({
            alias: Sheets.TILE_KEY,
            src: './assets/sprites/key.svg',
            data: {
                height: tileSize * window.devicePixelRatio,
                width: tileSize * window.devicePixelRatio,
                resolution: window.devicePixelRatio
            },
        })
        this.key = new Sprite(keyAsset)
        this.key.width = tileSize
        this.key.height = tileSize
    }
}
