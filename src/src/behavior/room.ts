import { EMPTY_TILE, Tile } from "./tile"
import { Score } from "./score"
import { TILES_IN_ROW } from "../data/constants"

export class Room {
  name: string
  tiles: Tile[][]
  scores: Score[]

  constructor() {
    this.tiles = new Array<Array<Tile>>(TILES_IN_ROW)
    for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
      this.tiles[lineIndex] = new Array(TILES_IN_ROW).fill(EMPTY_TILE)
    }
    this.scores = []
  }
}
