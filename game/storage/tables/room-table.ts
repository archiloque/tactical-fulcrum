import { EMPTY_TILE, Tile, TileType } from "../../../common/models/tile"
import { IndexName, TableName } from "../database"
import { PlayerTowerRoomModel, PositionedTile } from "../models"
import { DatabaseAccessStore } from "../utils"
import { PlayedTower } from "../../models/played-tower"
import { Room } from "../../../common/models/room"
import { RoomType } from "../../../common/data/room-type"
import { Table } from "./table"

export class RoomTable extends Table<PlayerTowerRoomModel> {
  static readonly TILES_TYPES_INTERESTING: TileType[] = [TileType.door, TileType.enemy, TileType.item, TileType.key]

  static readonly TILES_TYPES_TO_REMOVE: TileType[] = RoomTable.TILES_TYPES_INTERESTING.concat([
    TileType.startingPosition,
  ])

  constructor(db: IDBDatabase) {
    super(db, TableName.playedTowerRoom)
  }

  async saveRooms(playedTower: PlayedTower, playedTowerModelId: number): Promise<void> {
    console.debug("RoomTable", "saveRooms", playedTower.tower.name, playedTowerModelId)
    const promises: Promise<any>[] = []
    for (const [roomIndex, room] of playedTower.tower.standardRooms.entries()) {
      promises.push(this.saveRoom(playedTower.towerModelId, playedTowerModelId, room, roomIndex, RoomType.standard))
    }

    for (const [roomIndex, room] of playedTower.tower.nexusRooms.entries()) {
      promises.push(this.saveRoom(playedTower.towerModelId, playedTowerModelId, room, roomIndex, RoomType.nexus))
    }
    await Promise.all(promises)
  }

  private async saveRoom(
    towerModelId: number,
    playedTowerModelId: number,
    room: Room,
    roomIndex: number,
    roomType: RoomType,
  ): Promise<void> {
    const playerTowerRoomModelStore: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction("readwrite")

    const tiles: PositionedTile[] = this.roomToPositionedTiles(room.tiles)
    console.debug("RoomTable", "saveRoom", towerModelId, playedTowerModelId, roomIndex, roomType)

    const roomModelId = await playerTowerRoomModelStore
      .index(IndexName.playedTowerRoomByPlayedTowerAndRoomAndNexusIndex)
      .getKey([playedTowerModelId, roomIndex, roomType])

    const model: PlayerTowerRoomModel = {
      playerTowerId: playedTowerModelId,
      roomIndex: roomIndex,
      roomType: roomType,
      content: tiles,
    }
    if (roomModelId !== undefined) {
      model.id = roomModelId
    }
    return playerTowerRoomModelStore.put(model)
  }

  private roomToPositionedTiles(room: Tile[][]): PositionedTile[] {
    const tiles: PositionedTile[] = []
    for (const [lineIndex, line] of room.entries()) {
      for (const [columnIndex, tile] of line.entries()) {
        if (RoomTable.TILES_TYPES_INTERESTING.includes(tile.type)) {
          tiles.push({ line: lineIndex, column: columnIndex, tile: tile })
        }
      }
    }
    return tiles
  }

  async saveCurrentRoom(playedTower: PlayedTower): Promise<void> {
    console.debug("RoomTable", "saveCurrentRoom", playedTower.playedTowerModelCurentSaveId)
    const playedTowerRoomStore: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction("readwrite")
    const roomModel = (await playedTowerRoomStore
      .index(IndexName.playedTowerRoomByPlayedTowerAndRoomAndNexusIndex)
      .get([
        playedTower.playedTowerModelCurentSaveId!!,
        playedTower.position!!.position.room,
        playedTower.position!!.roomType,
      ]))!!
    roomModel.content = this.roomToPositionedTiles(playedTower.currentRoom!!)
    await playedTowerRoomStore.put(roomModel)
  }

  async load(playedTower: PlayedTower, nexus: RoomType, roomIndex: number): Promise<Tile[][]> {
    const playedTowerRoomStore: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction("readonly")

    const roomModel = (await playedTowerRoomStore
      .index(IndexName.playedTowerRoomByPlayedTowerAndRoomAndNexusIndex)
      .get([playedTower.playedTowerModelCurentSaveId!!, roomIndex, nexus]))!!

    const room = playedTower.tower.getRooms(nexus)[roomModel.roomIndex].clone()

    for (const [lineIndex, line] of room.entries()) {
      for (const [columnIndex, tile] of line.entries()) {
        if (RoomTable.TILES_TYPES_TO_REMOVE.includes(tile.type)) {
          room[lineIndex][columnIndex] = EMPTY_TILE
        }
      }
    }
    for (const positionedTile of roomModel.content) {
      room[positionedTile.line][positionedTile.column] = positionedTile.tile
    }

    return room
  }

  async deleteRooms(playedTowerModelId: number): Promise<void> {
    const playerTowerRoomModelStore: DatabaseAccessStore<PlayerTowerRoomModel> = this.createTransaction("readwrite")
    const roomModelsIds = await playerTowerRoomModelStore
      .index(IndexName.playedTowerRoomByPlayedTowerIndex)
      .getAllKeys(playedTowerModelId)
    await Promise.all(
      roomModelsIds.map((roomModelId) => {
        playerTowerRoomModelStore.delete(roomModelId)
      }),
    )
  }
}
