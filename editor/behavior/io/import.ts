import {IOOperation, IOResult} from './importExport'
import {IoEnemy} from './enemy/ioEnemy'
import {IoEnemyFromAttributes} from './enemy/ioEnemyFromAttributes'
import {IoRoom} from './room/ioRoom'
import {IoRoomFromAttributes} from './room/ioRoomFromAttributes'
import {Tower} from '../tower'

export class ImportResult extends IOResult {
  readonly tower: Tower

  constructor(content: Tower, errors: string[]) {
    super(errors)
    this.tower = content
  }
}

export class Import extends IOOperation {
  constructor() {
    super()
  }

  private parsedValueInvalid(value: any): boolean {
    return value == null || !Array.isArray(value)
  }

  import(stringData: string): ImportResult {
    console.groupCollapsed('Import', 'load')
    const tower: Tower = new Tower()
    try {
      const parsedData: any = JSON.parse(stringData)
      const towerName = parsedData[IOOperation.ATTRIBUTE_NAME]
      if (towerName != null) {
        tower.name = towerName
      }
 else {
        this.errors.push('Tower name is missing')
      }
      const enemies = parsedData[IOOperation.ATTRIBUTE_ENEMIES]
      if (this.parsedValueInvalid(enemies)) {
        this.errors.push('Enemies value is invalid')
      }
 else {
        tower.enemies = enemies.map((value: Record<string, string | number | null>, index: number) => {
          IoEnemy.validateEnemyImport(value, index + 1, this.errors)
          return IoEnemyFromAttributes.fromAttributes(value)
        })
        IoEnemy.validateEnemiesImport(enemies, this.errors)
      }
      const rooms = parsedData[IOOperation.ATTRIBUTE_ROOMS]
      const standardRooms = rooms[IOOperation.ATTRIBUTE_STANDARD]
      if (standardRooms != null) {
        if (this.parsedValueInvalid(standardRooms)) {
          this.errors.push('Standard rooms value is invalid')
        }
 else {
          tower.standardRooms = standardRooms.map((value: Record<string, string | any>, index: number) => {
            IoRoom.validateRoomImport(value, index + 1, this.errors)
            return IoRoomFromAttributes.fromAttributes(value, enemies)
          })
          IoRoom.validateRoomsImport(standardRooms, this.errors)
        }
      }
      const nexusRooms = rooms[IOOperation.ATTRIBUTE_NEXUS]
      if (nexusRooms != null) {
        if (this.parsedValueInvalid(nexusRooms)) {
          this.errors.push('Nexus rooms value is invalid')
        }
 else {
          tower.nexusRooms = nexusRooms.map((value: Record<string, string | any>, index: number) => {
            IoRoom.validateRoomImport(value, index + 1, this.errors)
            return IoRoomFromAttributes.fromAttributes(value, enemies)
          })
          IoRoom.validateRoomsImport(nexusRooms, this.errors)
        }
      }
    }
 catch (e) {
      this.errors.push(e.message)
    }
    console.groupEnd()
    return new ImportResult(tower, this.errors)
  }
}
