import { PlayedTowerModel, PlayerTowerRoomModel, PositionedTileModel, PositionModel } from "./database-constants"
import { DatabaseAccess } from "./database"
import { Game } from "../game"
import { Import } from "../../common/io/import"
import { PlayerInfo } from "../models/player-info"
import { RoomType } from "../../common/data/room-type"
import { Tower } from "../../common/models/tower"
import { TOWERS } from "../towers/towers"

interface TowerDump {
  saves: PlayedTowerFullDump[]
}

interface PlayedTowerFullDump {
  towerInfo: PlayedTowerDump
  rooms: DumpRoom[]
}

interface PlayedTowerDump {
  slot: number
  saveName: string | null
  timestamp: Date
  position: PositionModel
  playerInfo: PlayerInfo
}

interface DumpRoom {
  roomIndex: number
  roomType: RoomType
  content: PositionedTileModel[]
}

function toDumpRoom(room: PlayerTowerRoomModel): DumpRoom {
  return {
    content: room.content,
    roomIndex: room.roomIndex,
    roomType: room.roomType,
  }
}

function toPlayedTowerDump(playedTower: PlayedTowerModel): PlayedTowerDump {
  return {
    slot: playedTower.slot,
    saveName: playedTower.saveName,
    timestamp: playedTower.timestamp,
    position: playedTower.position,
    playerInfo: playedTower.playerInfo,
  }
}

async function dumpTower(tower: Tower, databaseAccess: DatabaseAccess): Promise<TowerDump> {
  const towerSaves: PlayedTowerFullDump[] = []
  for (const playedTowerModel of await databaseAccess.getPlayedTowerTable().listByTowerName(tower.name, false)) {
    const slot = playedTowerModel.slot
    const rooms: DumpRoom[] = (await dumpRooms(tower, slot, RoomType.standard, databaseAccess)).concat(
      await dumpRooms(tower, slot, RoomType.nexus, databaseAccess),
    )
    const towerSave: PlayedTowerFullDump = {
      towerInfo: toPlayedTowerDump(playedTowerModel),
      rooms: rooms,
    }
    towerSaves.push(towerSave)
  }
  return { saves: towerSaves }
}

async function dumpRooms(
  tower: Tower,
  slot: number,
  roomType: RoomType,
  databaseAccess: DatabaseAccess,
): Promise<DumpRoom[]> {
  const roomNumber = tower.getRooms(roomType).length
  const rooms: DumpRoom[] = []
  for (let roomIndex = 0; roomIndex < roomNumber; roomIndex++) {
    const room = toDumpRoom(await databaseAccess.getRoomTable().get(tower.name, slot, roomIndex, roomType))
    if (room === undefined) {
      console.error("dump", "dumpDb", "undefined room", tower.name, slot, roomIndex, roomType)
    } else {
      rooms.push(room)
    }
  }
  return rooms
}

export async function dumpDb(databaseAccess: DatabaseAccess): Promise<void> {
  const result: Record<string, TowerDump> = {}
  for (const tower of TOWERS) {
    const towerName = tower.name
    await Game.fetchTowerFile(tower).then(async (response) => {
      if (!response.ok) {
        console.error("dump", "dumpDb", response)
      } else {
        const importResult = new Import().import(await response.text())
        if (importResult.errors.length != 0) {
          console.error("dump", "dumpDb", importResult.errors)
        } else {
          result[towerName] = await dumpTower(importResult.tower, databaseAccess)
        }
      }
    })
  }
  console.debug("Dump ready!")
  console.debug(result)
}
