import { DropContentItem, DropContentKey, DROPS_CONTENTS, DropType } from "../../../common/data/drop"
import { EMPTY_TILE, ItemTile, KeyTile, Tile } from "../../../common/models/tile"
import { Enemy } from "../../../common/models/enemy"
import { PlayerInfo } from "../player-info"

export function getDropTile(enemy: Enemy): Tile {
  const dropName = enemy.drop
  if (dropName === null) {
    return EMPTY_TILE
  }
  const dropContent = DROPS_CONTENTS.get(dropName)
  if (dropContent === undefined) {
    throw new Error(`Unknown drop [${dropName}]`)
  }
  switch (dropContent.getType()) {
    case DropType.KEY:
      return new KeyTile((dropContent as DropContentKey).color)
    case DropType.ITEM:
      return new ItemTile((dropContent as DropContentItem).itemName)
  }
}

export function fight(enemy: Enemy, playerInfo: PlayerInfo): number | null {
  const damagesToEnemy = Math.max(playerInfo.atk - enemy.def!, 0)
  const damagesToPlayer = Math.max(enemy.atk! - playerInfo.def, 0)
  if (damagesToPlayer == 0 && damagesToEnemy > 0) {
    // Enemy can't hurt player but player can hurt enemy
    return 0
  } else if (damagesToEnemy == 0) {
    // Can't hurt enemy
    return null
  } else {
    const turnsToKillEnemy = Math.ceil(enemy.hp! / damagesToEnemy)
    const turnsToKillPlayer = Math.ceil(playerInfo.hp / damagesToPlayer)
    if (turnsToKillEnemy <= turnsToKillPlayer) {
      return (turnsToKillEnemy - 1) * damagesToPlayer
    } else {
      return null
    }
  }
}
