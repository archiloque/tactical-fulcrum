import {DEFAULT_ITEMS, Item} from '../data/item'
import {ITEM_NAMES, ItemName} from '../data/item-name'
import {Enemy} from './enemy'
import {Info} from './info'
import {Level} from './level'
import {Room} from './room'
import {RoomType} from '../data/room-type'

export class Tower {
  name: string
  info: Info
  enemies: Enemy[]
  items: Record<ItemName, Item>
  standardRooms: Room[]
  nexusRooms: Room[]
  levels: Level[]

  constructor() {
    this.name = 'Unnamed tower'
    this.enemies = []
    // @ts-ignore
    this.items = {}
    for (const itemName of ITEM_NAMES) {
      this.items[itemName] = DEFAULT_ITEMS[itemName].clone()
    }
    this.info = new Info()
    const standardRoom = new Room()
    standardRoom.name = 'Standard room'
    const nexusRoom = new Room()
    nexusRoom.name = 'Nexus room'
    this.standardRooms = [standardRoom]
    this.nexusRooms = [nexusRoom]
    this.levels = []
  }

  public getRooms(roomType: RoomType): Room[] {
    switch (roomType) {
      case RoomType.standard:
        return this.standardRooms
      case RoomType.nexus:
        return this.nexusRooms
    }
  }
}
