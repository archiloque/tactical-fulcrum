import { Action, KillEnemy, Move, OpenDoor, PickItem, PickKey, RoomChange } from "./play/action"
import { APPLIED_ITEM_ATTRIBUTES, AppliedItem, ItemToolTipAttributes } from "./attribute"
import { createPlayerInfo, PlayerInfo } from "./player-info"
import { Delta2D, Position3D } from "./tuples"
import {
  DoorTile,
  EMPTY_TILE,
  EnemyTile,
  ItemTile,
  KeyTile,
  StaircaseTile,
  Tile,
  TileType,
} from "../../common/models/tile"
import { DropContentItem, DropContentKey, DROPS_CONTENTS, DropType } from "../../common/data/drop"
import { findStaircasePosition, findStartingPosition } from "./play/locations"
import { STAIRCASE_OPPOSITE_DIRECTION, StaircaseDirection } from "../../common/data/staircase-direction"
import { calculateReachableTiles } from "./play/a-star"
import { Enemy } from "../../common/models/enemy"
import { ItemName } from "../../common/data/item-name"
import { Room } from "../../common/models/room"
import { TILES_IN_ROW } from "../../common/data/constants"
import { Tower } from "../../common/models/tower"

export class PlayedTower {
  readonly tower: Tower
  playerPosition: Position3D
  readonly standardRooms: Tile[][][]
  readonly nexusRooms: Tile[][][]
  readonly playerInfo: PlayerInfo
  reachableTiles: Delta2D[] | null[][]

  constructor(tower: Tower) {
    this.tower = tower
    this.standardRooms = this.cloneRoom(tower.standardRooms)
    this.nexusRooms = this.cloneRoom(tower.nexusRooms)
    this.playerPosition = findStartingPosition(this.standardRooms)
    this.playerInfo = createPlayerInfo(tower.info.hp, tower.info.atk, tower.info.def)
    this.calculateReachableTiles()
  }

  private calculateReachableTiles(): void {
    this.reachableTiles = calculateReachableTiles(
      this.playerPosition,
      this.standardRooms[this.playerPosition.room],
      this.playerInfo,
    )
  }

  private cloneRoom(rooms: Room[]): Tile[][][] {
    return rooms.map((room) => {
      return room.tiles.map((tilesLine) => {
        return [...tilesLine]
      })
    })
  }

  public itemToolTipAttributes(itemName: ItemName): ItemToolTipAttributes {
    const item = this.tower!.items[itemName]
    return {
      atk: item.atk === 0 ? undefined : item.atk,
      def: item.def === 0 ? undefined : item.def,
      expMulAdd: item.expMulAdd === 0 ? undefined : item.expMulAdd,
      expMulMul: item.expMulMul === 1 ? undefined : item.expMulMul,
      hp: item.hp === 0 ? undefined : (item.hp * this.playerInfo.hpMul) / 100,
      hpMulAdd: item.hpMulAdd === 0 ? undefined : item.hpMulAdd,
      hpMulMul: item.hpMulMul === 1 ? undefined : item.hpMulMul,
    }
  }

  public appliedItem(itemName: ItemName): AppliedItem {
    const item = this.tower!.items[itemName]
    let hpMul: number | undefined
    if (item.hpMulAdd === 0 && item.hpMulMul === 1) {
      hpMul = undefined
    } else if (item.hpMulAdd === 0 && item.hpMulMul !== 1) {
      hpMul = item.hpMulAdd
    } else if (item.hpMulAdd !== 0 && item.hpMulMul === 1) {
      hpMul = this.playerInfo.hpMul * (item.hpMulMul - 1)
    } else {
      throw new Error(`Not implemented for ${itemName}`)
    }
    let expMul: number | undefined
    if (item.expMulAdd === 0 && item.expMulMul === 1) {
      expMul = undefined
    } else if (item.expMulAdd === 0 && item.expMulMul !== 1) {
      expMul = item.expMulAdd
    } else if (item.expMulAdd !== 0 && item.expMulMul === 1) {
      expMul = this.playerInfo.expMul * (item.expMulMul - 1)
    } else {
      throw new Error(`Not implemented for ${itemName}`)
    }
    const hp = item.hp === 0 ? undefined : (item.hp * this.playerInfo.hpMul) / 100
    return {
      expMul: expMul,
      hpMul: hpMul,
      atk: item.atk === 0 ? undefined : item.atk,
      def: item.def === 0 ? undefined : item.def,
      hp: hp,
    }
  }

  movePlayer(delta: Delta2D): Action | null {
    const targetPosition = this.playerPosition.add(delta)
    if (
      targetPosition.line < 0 ||
      targetPosition.line >= TILES_IN_ROW ||
      targetPosition.column < 0 ||
      targetPosition.column >= TILES_IN_ROW
    ) {
      return null
    }
    if (this.reachableTiles[targetPosition.line][targetPosition.column] === null) {
      return null
    }
    const oldPlayerPosition = this.playerPosition
    const targetTile: Tile = this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column]
    switch (targetTile.getType()) {
      case TileType.door:
        this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column] = EMPTY_TILE
        const doorColor = (targetTile as DoorTile).color
        this.playerInfo.keys[doorColor] -= 1
        this.calculateReachableTiles()
        return new OpenDoor(oldPlayerPosition, targetPosition, doorColor)
      case TileType.empty:
        this.playerPosition = targetPosition
        return new Move(oldPlayerPosition, targetPosition)
      case TileType.enemy:
        const enemy = (targetTile as EnemyTile).enemy
        const dropTile = this.getDropTile(enemy)
        this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column] = dropTile
        this.calculateReachableTiles()
        return new KillEnemy(oldPlayerPosition, targetPosition, enemy, dropTile)
      case TileType.item:
        this.playerPosition = targetPosition
        this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column] = EMPTY_TILE
        const itemName = (targetTile as ItemTile).item
        const appliedItem: AppliedItem = this.appliedItem(itemName)
        this.applyItem(appliedItem)
        this.calculateReachableTiles()
        return new PickItem(oldPlayerPosition, targetPosition, appliedItem)
      case TileType.key:
        this.playerPosition = targetPosition
        this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column] = EMPTY_TILE
        const keyColor = (targetTile as KeyTile).color
        this.playerInfo.keys[keyColor] += 1
        this.calculateReachableTiles()
        return new PickKey(oldPlayerPosition, targetPosition, keyColor)
      case TileType.staircase:
        const staircaseDirection = (targetTile as StaircaseTile).direction
        const roomIndex = this.playerPosition.room + (staircaseDirection == StaircaseDirection.up ? 1 : -1)
        const newPosition = findStaircasePosition(
          this.standardRooms,
          roomIndex,
          STAIRCASE_OPPOSITE_DIRECTION[staircaseDirection],
        )
        this.playerPosition = newPosition
        this.calculateReachableTiles()
        return new RoomChange(oldPlayerPosition, newPosition)
      case TileType.startingPosition:
        throw new Error("Should not happen")
      case TileType.wall:
        throw new Error("Should not happen")
    }
  }

  private getDropTile(enemy: Enemy): Tile {
    const dropName = enemy.drop
    if (dropName == null) {
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

  private applyItem(appliedItem: AppliedItem): void {
    for (const attribute of APPLIED_ITEM_ATTRIBUTES) {
      const attributeValue: undefined | number = appliedItem[attribute]
      if (attributeValue !== undefined) {
        this.playerInfo[attribute] += attributeValue
      }
      if (this.playerInfo.hp > this.playerInfo.maxHp) {
        this.playerInfo.maxHp = this.playerInfo.hp
      }
    }
  }
}
