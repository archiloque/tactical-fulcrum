import {Assets} from 'pixi.js'
import {CompositeTilemap} from '@pixi/tilemap'

export class Sheets {
    tilemap: CompositeTilemap
    static readonly TILE_EMPTY = 'empty'
    static readonly TILE_WALL = 'wall'
    static readonly TILE_ENEMY_BURGEONER = 'enemy-Burgeoner'
    static readonly TILE_ENEMY_FIGHTER = 'enemy-Fighter'
    static readonly TILE_ENEMY_RANGER = 'enemy-Ranger'
    static readonly TILE_ENEMY_SHADOW = 'enemy-Shadow'
    static readonly TILE_ENEMY_SLASHER = 'enemy-Slasher'
    static readonly TILE_POTION = 'potion'

    async init(): Promise<any> {
        const sprites = Assets.load('./assets/images/sprites.json')
        this.tilemap = new CompositeTilemap()
        return sprites
    }
}
