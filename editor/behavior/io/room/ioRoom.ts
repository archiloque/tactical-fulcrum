import { IO } from "../io"
import { Room } from "../../room"
import { RoomType } from "../../../front/tabMap/selectedRoom"
import { TILES_IN_ROW } from "../../../data/constants"
import { TILE_TYPES } from "../../tile"

export class IoRoom {
  static readonly ATTRIBUTE_COLOR = "color"
  static readonly ATTRIBUTE_COLUMN = "column"
  static readonly ATTRIBUTE_DIRECTION = "direction"
  static readonly ATTRIBUTE_ENEMY_LEVEL = "level"
  static readonly ATTRIBUTE_ENEMY_TYPE = "enemyType"
  static readonly ATTRIBUTE_LINE = "line"
  static readonly ATTRIBUTE_NAME = "name"
  static readonly ATTRIBUTE_SCORES = "scores"
  static readonly ATTRIBUTE_TILES = "tiles"
  static readonly ATTRIBUTE_TYPE = "type"
  static readonly ATTRIBUTES: string[] = [IoRoom.ATTRIBUTE_NAME, IoRoom.ATTRIBUTE_TILES, IoRoom.ATTRIBUTE_SCORES]

  static validateRoomExport(room: Room, index: number, errors: string[]): void {
    IO.checkNotEmpty(room.name, `Room ${index} name [${room.name}] is invalid`, errors)
  }

  static validateRoomImport(attributes: Record<string, string | any>, index: number, errors: string[]): void {
    for (const attributeName in attributes) {
      if (IoRoom.ATTRIBUTES.indexOf(attributeName) === -1) {
        errors.push(`Room ${index + 1} has an unknown [${attributeName}] attribute`)
      }
    }
    const tilesArrayArray = attributes[IoRoom.ATTRIBUTE_TILES]
    if (Array.isArray(tilesArrayArray)) {
      if (tilesArrayArray.length !== TILES_IN_ROW) {
        errors.push(
          `Room ${index + 1} ${IoRoom.ATTRIBUTE_TILES} length ${tilesArrayArray.length}] should be ${TILES_IN_ROW}`,
        )
      }
      tilesArrayArray.forEach((tilesArray, tilesArrayIndex) => {
        if (!Array.isArray(tilesArray)) {
          errors.push(
            `Room ${index + 1} ${IoRoom.ATTRIBUTE_TILES} line ${tilesArrayIndex + 1} attribute [${tilesArray}] is not an array`,
          )
        } else {
          if (tilesArray.length !== TILES_IN_ROW) {
            errors.push(
              `Room ${index + 1} ${IoRoom.ATTRIBUTE_TILES} length ${tilesArray.length}] should be ${TILES_IN_ROW}`,
            )
          }
          tilesArray.forEach((tile) => {
            const type = tile[IoRoom.ATTRIBUTE_TYPE]
            if (TILE_TYPES.map((it) => it.valueOf()).indexOf(type) === -1) {
              errors.push(`Room ${index + 1} has an invalid tile type [${type}]`)
            }
          })
        }
      })
    } else {
      errors.push(`Room ${index + 1} tiles ${IoRoom.ATTRIBUTE_TILES} attribute [${tilesArrayArray}] is not an array`)
    }
  }

  static validateRoomsImport(rooms: Record<string, string | any>[], errors: string[]): void {
    const knownRooms: string[] = []
    rooms.forEach((room, index) => {
      const roomName = room[IoRoom.ATTRIBUTE_NAME]
      if (roomName != null) {
        if (knownRooms.indexOf(roomName) !== -1) {
          errors.push(`Room ${index} is duplicated (same name)`)
        } else {
          knownRooms.push(roomName)
        }
      }
    })
  }

  static validateRoomsExport(rooms: Room[], roomType: RoomType, errors: string[]): void {
    const knownRooms: string[] = []
    rooms.forEach((room, index) => {
      if (knownRooms.indexOf(room.name) !== -1) {
        errors.push(`Room ${index} ${roomType} is duplicated (same name)`)
      } else {
        knownRooms.push(room.name)
      }
    })
  }
}
