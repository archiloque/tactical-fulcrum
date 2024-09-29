import { DbModel } from "./utils"
import { PlayerInfo } from "../models/player-info"
import { RoomType } from "../../common/data/room-type"
import { Tile } from "../../common/models/tile"

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

export interface TowerModel extends DbModel {
  towerName: string
}

export interface PlayedTowerModel extends DbModel {
  towerName: string
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

export interface PlayerTowerRoomModel extends DbModel {
  towerName: string
  slot: number
  roomIndex: number
  roomType: RoomType
  content: PositionedTile[]
}
