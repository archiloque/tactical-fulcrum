import { add2D, around, Delta2D, Position2D, value2D } from "../tuples"
import { DoorTile, EnemyTile, Tile, TileType } from "../../../common/models/tile"
import { Enemy, findEnemy } from "../../../common/models/enemy"
import { fight } from "./enemy"
import { PlayerInfo } from "../player-info"
import { TILES_IN_ROW } from "../../../common/data/constants"

const enum ReachableType {
  blocking,
  reachable,
  traversable,
}

class Destination {
  readonly coordinates: Position2D
  readonly path: Delta2D[]
  constructor(coordinates: Position2D, path: Delta2D[]) {
    this.coordinates = coordinates
    this.path = path
  }
}

export function calculateReachableTiles(
  playerPosition: Position2D,
  room: Tile[][],
  playerInfo: PlayerInfo,
  enemies: Enemy[],
): Delta2D[][][] | null[][] {
  const reachableTiles: Delta2D[][][] | null[][] = new Array(TILES_IN_ROW)
  for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
    reachableTiles[lineIndex] = new Array(TILES_IN_ROW).fill(null, 0, TILES_IN_ROW)
  }
  let currentlyReachableDestinations: Destination[] = [new Destination(playerPosition, [])]
  reachableTiles[playerPosition.line][playerPosition.column] = null
  const reachedTiles: Set<number> = new Set()
  reachedTiles.add(value2D(playerPosition))
  while (currentlyReachableDestinations.length > 0) {
    const newlyReachableDestinations: Destination[] = []
    currentlyReachableDestinations.forEach((currentlyReachableDestination) => {
      around(currentlyReachableDestination.coordinates).forEach((aroundDelta) => {
        const aroundDestination = add2D(currentlyReachableDestination.coordinates, aroundDelta)
        if (!reachedTiles.has(value2D(aroundDestination))) {
          reachedTiles.add(value2D(aroundDestination))
          const aroundDestinationReachability = reachable(aroundDestination, room, playerInfo, enemies)
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

function reachable(position: Position2D, room: Tile[][], playerInfo: PlayerInfo, enemies: Enemy[]): ReachableType {
  const tile = room[position.line][position.column]
  switch (tile.type) {
    case TileType.door:
      const doorColor = (tile as DoorTile).color
      return playerInfo.keys[doorColor] >= 1 ? ReachableType.reachable : ReachableType.blocking
    case TileType.empty:
      return ReachableType.traversable
    case TileType.enemy:
      const enemyTile = tile as EnemyTile
      return fight(findEnemy(enemyTile.enemyType, enemyTile.level, enemies)!!, playerInfo) === null
        ? ReachableType.blocking
        : ReachableType.reachable
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
