import { Coordinates, Delta } from "../coordinates"
import { Tile, TileType } from "../../../common/models/tile"
import { TILES_IN_ROW } from "../../../common/data/constants"

const enum ReachableType {
  blocking,
  reachable,
  traversable,
}

class Destination {
  readonly coordinates: Coordinates
  readonly path: Delta[]
  constructor(coordinates: Coordinates, path: Delta[]) {
    this.coordinates = coordinates
    this.path = path
  }
}

export function calculateReachableTiles(playerPosition: Coordinates, room: Tile[][]): Delta[] | null[][] {
  const reachableTiles: Delta[] | null[][] = new Array(TILES_IN_ROW)
  for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
    reachableTiles[lineIndex] = new Array(TILES_IN_ROW).fill(null, 0, TILES_IN_ROW)
  }
  let currentlyReachableDestinations: Destination[] = [new Destination(playerPosition, [])]
  reachableTiles[playerPosition.line][playerPosition.column] = []
  const reachedTiles: Set<number> = new Set()
  reachedTiles.add(playerPosition.value())
  while (currentlyReachableDestinations.length > 0) {
    const newlyReachableDestinations: Destination[] = []
    currentlyReachableDestinations.forEach((currentlyReachableDestination) => {
      currentlyReachableDestination.coordinates.around().forEach((aroundDelta) => {
        const aroundDestination = currentlyReachableDestination.coordinates.add(aroundDelta)
        if (!reachedTiles.has(aroundDestination.value())) {
          reachedTiles.add(aroundDestination.value())
          const aroundDestinationReachability = reachable(aroundDestination, room)
          const path = currentlyReachableDestination.path.concat([aroundDelta])
          switch (aroundDestinationReachability) {
            case ReachableType.blocking:
              break
            case ReachableType.reachable:
              reachableTiles[aroundDestination.line][aroundDestination.column] = path
              break
            case ReachableType.traversable:
              reachableTiles[aroundDestination.line][aroundDestination.column] = path
              newlyReachableDestinations.push(new Destination(aroundDestination, path))
              break
          }
        }
      })
    })
    currentlyReachableDestinations = newlyReachableDestinations
  }
  return reachableTiles
}

function reachable(position: Coordinates, room: Tile[][]): ReachableType {
  const tile = room[position.line][position.column]
  switch (tile.getType()) {
    case TileType.door:
      return ReachableType.reachable
    case TileType.empty:
      return ReachableType.traversable
    case TileType.enemy:
      return ReachableType.reachable
    case TileType.item:
      return ReachableType.reachable
    case TileType.key:
      return ReachableType.reachable
    case TileType.staircase:
      return ReachableType.reachable
    case TileType.startingPosition:
      throw new Error("Should not happen")
    case TileType.wall:
      return ReachableType.blocking
  }
}
