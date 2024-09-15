import { DbModel } from "./utils"
import { PlayerInfo } from "../models/player-info"
import { RoomType } from "../../common/data/room-type"
import { Tile } from "../../common/models/tile"

export interface ModelWithId extends DbModel {
  id?: number
}

export interface PlayerPosition {
  column: number
  line: number
  room: number
}

export interface Position {
  standard: PlayerPosition
  nexus: PlayerPosition
  roomType: RoomType
}

export interface TowerModel extends ModelWithId {
  towerName: string
}

export interface PlayedTowerModel extends ModelWithId {
  towerId: number
  slot: number
  saveName: string | null
  timestamp: Date
  position: Position
  playerInfo: PlayerInfo
}

export interface PositionedTile {
  line: number
  column: number
  tile: Tile
}

export interface PlayerTowerRoomModel extends ModelWithId {
  playerTowerId: number
  roomIndex: number
  roomType: RoomType
  content: PositionedTile[]
}
