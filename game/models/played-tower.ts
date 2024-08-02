import { Action, KillEnemy, Move, OpenDoor, PickItem, PickKey, RoomChange } from "./play/action"
import { APPLIED_ITEM_ATTRIBUTES, AppliedItem, ItemToolTipAttributes } from "./attribute"
import {
  AtkLevelUpContent,
  DefLevelUpContent,
  getLevelUpContent,
  KeyLevelUpContent,
  LevelUpContent,
  LevelUpContentType,
} from "./play/level-up-content"
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
import { fight, getDropTile } from "./play/enemy"
import { findStaircasePosition, findStartingPosition } from "./play/locations"
import { STAIRCASE_OPPOSITE_DIRECTION, StaircaseDirection } from "../../common/data/staircase-direction"
import { calculateReachableTiles } from "./play/a-star"
import { Enemy } from "../../common/models/enemy"
import { getLevelIndex } from "./play/levels"
import { ItemName } from "../../common/data/item-name"
import { Room } from "../../common/models/room"
import { TILES_IN_ROW } from "../../common/data/constants"
import { Tower } from "../../common/models/tower"

export type EnemyToolTipAttributes = {
  enemy: Enemy
  hpLost: number | null
  expWin: number
}

export type ExpInfo = {
  levelsUpAvailable: number
  nextLevelDelta: number
  percentage: number
}

export class PlayedTower {
  readonly tower: Tower
  playerPosition: Position3D
  readonly standardRooms: Tile[][][]
  readonly nexusRooms: Tile[][][]
  readonly playerInfo: PlayerInfo
  // @ts-ignore
  reachableTiles: Delta2D[][][] | null[][]

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
      hp: item.hp === 0 ? undefined : Math.ceil((item.hp * this.playerInfo.hpMul) / 100),
      hpMulAdd: item.hpMulAdd === 0 ? undefined : item.hpMulAdd,
      hpMulMul: item.hpMulMul === 1 ? undefined : item.hpMulMul,
    }
  }

  public enemyToolTipAttributes(enemy: Enemy): EnemyToolTipAttributes {
    return {
      enemy: enemy,
      expWin: enemy.exp! * this.playerInfo.expMul,
      hpLost: fight(enemy, this.playerInfo),
    }
  }

  public getExpInfo(): ExpInfo {
    const currentLevel = getLevelIndex(this.playerInfo.level)
    const nextLevel = getLevelIndex(this.playerInfo.level + 1)
    const currentExp = this.playerInfo.exp

    let levelsUpAvailable = 0
    let currentNextLevel = nextLevel
    let remainingExp = currentExp - currentLevel.startingExp

    while (currentExp > currentNextLevel.startingExp) {
      levelsUpAvailable++
      remainingExp -= currentNextLevel.deltaExpToNextLevel
      currentNextLevel = getLevelIndex(currentNextLevel.levelIndex + 1)
    }
    return {
      nextLevelDelta: currentNextLevel.deltaExpToNextLevel,
      levelsUpAvailable: levelsUpAvailable,
      percentage: (remainingExp / currentNextLevel.deltaExpToNextLevel) * 100,
    }
  }

  public levelUp(levelUpIndex: number): LevelUpContent {
    const expInfo = this.getExpInfo()
    if (expInfo.levelsUpAvailable === 0) {
      throw new Error("No level up possible")
    }
    const levelUpContents = this.levelsUpContents()
    if (levelUpContents.length < levelUpIndex) {
      throw new Error("No level up found")
    }
    const levelUpContent = levelUpContents[levelUpIndex]
    this.applyLevelUp(levelUpContent)
    this.playerInfo.level++
    this.playerInfo.exp -= expInfo.nextLevelDelta
    return levelUpContent
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
    const hp = item.hp === 0 ? undefined : Math.ceil((item.hp * this.playerInfo.hpMul) / 100)
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
        this.calculateReachableTiles()
        return new Move(oldPlayerPosition, targetPosition)
      case TileType.enemy:
        const enemy = (targetTile as EnemyTile).enemy
        const hpLost = fight(enemy, this.playerInfo)!
        const expWin = Math.ceil((enemy.exp! * this.playerInfo.expMul) / 100)
        this.playerInfo.hp -= hpLost
        this.playerInfo.exp += expWin
        const dropTile = getDropTile(enemy)
        this.standardRooms[targetPosition.room][targetPosition.line][targetPosition.column] = dropTile
        this.calculateReachableTiles()
        return new KillEnemy(oldPlayerPosition, targetPosition, enemy, dropTile, hpLost, expWin)
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

  levelsUpContents(): LevelUpContent[] {
    return this.tower.levels.map((level) => {
      return getLevelUpContent(this.playerInfo, level)
    })
  }

  private applyItem(appliedItem: AppliedItem): void {
    for (const attribute of APPLIED_ITEM_ATTRIBUTES) {
      // @ts-ignore
      const attributeValue: undefined | number = appliedItem[attribute]
      if (attributeValue !== undefined) {
        this.playerInfo[attribute] += attributeValue
      }
      if (this.playerInfo.hp > this.playerInfo.maxHp) {
        this.playerInfo.maxHp = this.playerInfo.hp
      }
    }
  }

  private applyLevelUp(levelUpContent: LevelUpContent): void {
    switch (levelUpContent.getType()) {
      case LevelUpContentType.KEY:
        const keyLevelUpContent = levelUpContent as KeyLevelUpContent
        this.playerInfo.keys[keyLevelUpContent.color] += keyLevelUpContent.number
        break
      case LevelUpContentType.ATK:
        this.playerInfo.atk += (levelUpContent as AtkLevelUpContent).number
        break
      case LevelUpContentType.DEF:
        this.playerInfo.def += (levelUpContent as DefLevelUpContent).number
        break
      case LevelUpContentType.HP:
        this.playerInfo.def += Math.ceil(((levelUpContent as DefLevelUpContent).number * this.playerInfo.hpMul) / 100)
        break
    }
  }
}
