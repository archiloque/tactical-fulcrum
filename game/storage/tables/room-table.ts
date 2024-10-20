import { EMPTY_TILE, Tile, TileType } from "../../../common/models/tile"
import { IndexName, TableName } from "../database"
import { PlayerTowerRoomModel, PositionedTileModel } from "../models"
import { DbAccess } from "../utils"
import { PlayedTower } from "../../models/played-tower"
import { PlayedTowerTable } from "./played-tower-table"
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

  async saveRooms(playedTower: PlayedTower, slot: number): Promise<void> {
    console.debug("RoomTable", "saveRooms", playedTower.tower.name, slot)
    const promises: Promise<void>[] = []
    for (const [roomIndex, room] of playedTower.tower.standardRooms.entries()) {
      promises.push(this.saveRoom(playedTower.tower.name, slot, room, roomIndex, RoomType.standard))
    }

    for (const [roomIndex, room] of playedTower.tower.nexusRooms.entries()) {
      promises.push(this.saveRoom(playedTower.tower.name, slot, room, roomIndex, RoomType.nexus))
    }
    await Promise.all(promises)
  }

  private async saveRoom(
    towerName: string,
    slot: number,
    room: Room,
    roomIndex: number,
    roomType: RoomType,
  ): Promise<void> {
    const store: DbAccess<PlayerTowerRoomModel> = this.transaction("readwrite")

    const tiles: PositionedTileModel[] = this.roomToPositionedTiles(room.tiles)
    console.debug("RoomTable", "saveRoom", towerName, slot, roomIndex, roomType)

    const model: PlayerTowerRoomModel = {
      towerName: towerName,
      slot: slot,
      roomIndex: roomIndex,
      roomType: roomType,
      content: tiles,
    }
    return await store.put(model)
  }

  private roomToPositionedTiles(room: Tile[][]): PositionedTileModel[] {
    const tiles: PositionedTileModel[] = []
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
    console.debug("RoomTable", "saveCurrentRoom", playedTower.tower.name)
    const store: DbAccess<PlayerTowerRoomModel> = this.transaction("readwrite")
    const roomModel = (await store
      .index(IndexName.playedTowerRoomByPlayedTowerNameAndSlotAndRoomAndNexusIndex)
      .get([
        playedTower.tower.name!!,
        PlayedTowerTable.CURRENT_PLAYED_TOWER_SLOT,
        playedTower.position!!.position.room,
        playedTower.position!!.currentRoomType,
      ]))!!
    roomModel.content = this.roomToPositionedTiles(playedTower.currentRoom!!)
    await store.put(roomModel)
  }

  async load(playedTower: PlayedTower, slot: number, nexus: RoomType, roomIndex: number): Promise<Tile[][]> {
    const roomModel = await this.get(playedTower.tower.name, slot, roomIndex, nexus)

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

  async get(towerName: string, slot: number, roomIndex: number, nexus: RoomType): Promise<PlayerTowerRoomModel> {
    const store: DbAccess<PlayerTowerRoomModel> = this.transaction("readonly")

    const roomModel = (await store
      .index(IndexName.playedTowerRoomByPlayedTowerNameAndSlotAndRoomAndNexusIndex)
      .get([towerName, slot, roomIndex, nexus]))!!
    return roomModel
  }

  async deleteRooms(towerName: string, playedTowerSlot: number): Promise<void> {
    const store: DbAccess<PlayerTowerRoomModel> = this.transaction("readwrite")
    await store.index(IndexName.playedTowerRoomByPlayedTowerNameAndSlot).deleteAll([towerName, playedTowerSlot])
  }
}
