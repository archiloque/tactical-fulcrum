import {EMPTY_TILE, Tile} from './tile'
import {TILES_IN_ROW} from '../data/map'

export class Room {
    name: string
    tiles: Tile[][]

    constructor() {
        this.tiles = new Array<Array<Tile>>(TILES_IN_ROW)
        for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
            this.tiles[lineIndex] = new Array(TILES_IN_ROW)
            for (let columnIndex = 0; columnIndex < TILES_IN_ROW; columnIndex++) {
                this.tiles[lineIndex][columnIndex] = EMPTY_TILE
            }
        }
    }
}
