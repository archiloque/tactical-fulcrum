import { Action } from "../models/play/action"
import { DbModel } from "./utils"
import { PlayerInfo } from "../models/player-info"
import { RoomType } from "../../common/data/room-type"
import { Tile } from "../../common/models/tile"

export const enum TableName {
  action = "action",
  playedTower = "playedTower",
  playedTowerRoom = "playedTowerRoom",
  tower = "tower",
}

export type Indexes = {
  towerNameIndex: TowerModel
  playedTowerByTowerName: PlayedTowerModel
  playedTowerByTowerNameAndSlot: PlayedTowerModel

  playedTowerRoomByPlayedTowerNameAndSlot: PlayerTowerRoomModel
  playedTowerRoomByPlayedTowerNameAndSlotAndRoomAndNexusIndex: PlayerTowerRoomModel

  actionByPlayedTowerNameAndSlot: ActionModel
  actionByPlayedTowerNameAndSlotAndIndex: ActionModel
}

export interface PlayerPositionModel {
  column: number
  line: number
  room: number
}

export interface PositionModel {
  standard: PlayerPositionModel
  nexus: PlayerPositionModel
  currentRoomType: RoomType
}

export interface TowerModel extends DbModel {
  towerName: string
}

export interface PlayedTowerModel extends DbModel {
  towerName: string
  slot: number
  saveName: string | null
  timestamp: Date
  position: PositionModel
  playerInfo: PlayerInfo
  currentActionIndex: number
  maxActionIndex: number
}

export interface PositionedTileModel {
  line: number
  column: number
  tile: Tile
}

export interface PlayerTowerRoomModel extends DbModel {
  towerName: string
  slot: number
  roomIndex: number
  roomType: RoomType
  content: PositionedTileModel[]
}

export interface ActionModel extends DbModel {
  towerName: string
  slot: number
  actionIndex: number
  action: Action
}
