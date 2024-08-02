import { html, render } from "uhtml"
import { ROOM_TYPES, SelectedRoom } from "./selected-room"
import { Editor } from "../../editor"
import { EditorMap } from "./editor-map"
import { Elements } from "./elements"
import { Layer } from "./layer"
import { LOCAL_STORAGE_CURRENT_ROOM } from "../../io/local-storage"
import { Rooms } from "./rooms"
import { RoomType } from "../../../common/data/room-type"
import { Scores } from "./scores"
import { settings } from "@pixi/settings"
import SlTabPanel from "@shoelace-style/shoelace/cdn/components/tab-panel/tab-panel.component"
import { Tab } from "../tab"

export class TabMaps {
  private static readonly MAP_ID = "tabMapMap"
  private static readonly MAP_GRID_ID = "tabMapMapGrid"

  private elements: Elements
  private layer: Layer
  private map: EditorMap
  private readonly editor: Editor
  private readonly tabElement: SlTabPanel
  private rooms: Rooms
  private scores: Scores
  // @ts-ignore
  private selectedRoom: SelectedRoom | null
  // @ts-ignore
  private mapDiv: HTMLElement

  constructor(editor: Editor) {
    settings.RESOLUTION = window.devicePixelRatio || 1
    this.editor = editor

    this.tabElement = document.getElementById(Tab.map) as SlTabPanel

    this.layer = new Layer(editor)
    this.elements = new Elements(editor)
    this.scores = new Scores(editor)

    this.map = new EditorMap(editor)
    this.rooms = new Rooms(editor)
    this.editor.eventManager.registerScreenChange(() => {
      if (editor.displayedTab === Tab.map) {
        return this.resize()
      }
    })
  }

  async init(): Promise<any> {
    console.debug("TabMap", "init")
    return this.map.init().then(() => {
      render(
        this.tabElement,
        html`${this.map.toolTipHole()}
          <div id="${TabMaps.MAP_GRID_ID}">
            <div>${this.layer.hole()}${this.scores.hole()}${this.elements.hole()}</div>
            <div id="${TabMaps.MAP_ID}"></div>
            <div>${this.rooms.hole()}</div>
          </div>`,
      )
      this.mapDiv = document.getElementById(TabMaps.MAP_ID)!
      this.mapDiv.appendChild(this.map.app.canvas)
      this.rooms.init()
      this.elements.init()
      this.layer.init()
      this.scores.init()
      this.map.postInit()
      this.loadInitRoom()
      this.editor.eventManager.registerRoomSelection((selectedRoom) => this.roomSelected(selectedRoom))
      console.debug("TabMap", "ended init")
    })
  }

  async render(): Promise<any> {
    console.debug("TabMap", "render")
    this.calculateRealSelectedRoom(this.selectedRoom)
    this.elements.render()
    this.rooms.render()
    return this.resize()
  }

  private reposition = async (): Promise<any> => {
    console.debug("TabMap", "reposition")
    return this.resize()
  }

  private async resize(): Promise<any> {
    console.debug("TabMap", "resize")
    const height = window.innerHeight - this.mapDiv.getBoundingClientRect().top - 10
    const width = this.mapDiv.getBoundingClientRect().width
    const number = Math.min(height, width)
    return this.map.resize(number).then(() => this.map.repaint())
  }

  private static readonly ATTRIBUTE_SELECTED_ROOM_TYPE = "type"
  private static readonly ATTRIBUTE_SELECTED_ROOM_INDEX = "index"

  private loadInitRoom(): void {
    console.debug("TabMap", "loadInitRoom")
    const selectedRoomString = localStorage.getItem(LOCAL_STORAGE_CURRENT_ROOM)

    if (selectedRoomString == null) {
      this.editor.eventManager.notifyRoomSelection(null)
      return
    }

    const selectedRoomParsed = JSON.parse(selectedRoomString)
    const roomType = selectedRoomParsed[TabMaps.ATTRIBUTE_SELECTED_ROOM_INDEX]
    if (!ROOM_TYPES.includes(roomType)) {
      this.editor.eventManager.notifyRoomSelection(null)
      return
    }

    const selectedRoom: SelectedRoom = new SelectedRoom(
      roomType,
      parseInt(selectedRoomParsed[TabMaps.ATTRIBUTE_SELECTED_ROOM_TYPE]),
    )
    this.calculateRealSelectedRoom(selectedRoom)
  }

  private calculateRealSelectedRoom(selectedRoom: SelectedRoom | null): void {
    if (selectedRoom == null) {
      if (this.editor.tower.standardRooms.length > 0) {
        this.editor.eventManager.notifyRoomSelection(new SelectedRoom(RoomType.standard, 0))
      } else if (this.editor.tower.nexusRooms.length > 0) {
        this.editor.eventManager.notifyRoomSelection(new SelectedRoom(RoomType.nexus, 0))
      } else {
        this.editor.eventManager.notifyRoomSelection(null)
      }
      return
    } else if (selectedRoom.index < this.editor.tower.getRooms(selectedRoom.type).length) {
      this.editor.eventManager.notifyRoomSelection(selectedRoom)
      return
    } else if (this.editor.tower.standardRooms.length >= 0) {
      this.editor.eventManager.notifyRoomSelection(new SelectedRoom(RoomType.standard, 0))
      return
    } else if (this.editor.tower.nexusRooms.length >= 0) {
      this.editor.eventManager.notifyRoomSelection(new SelectedRoom(RoomType.nexus, 0))
      return
    } else {
      this.editor.eventManager.notifyRoomSelection(null)
      return
    }
  }

  private roomSelected(selectedRoom: SelectedRoom | null): void {
    console.debug("TabMap", "roomSelected", selectedRoom)
    this.selectedRoom = selectedRoom
    if (selectedRoom == null) {
      localStorage.removeItem(LOCAL_STORAGE_CURRENT_ROOM)
      return
    }
    localStorage.setItem(
      LOCAL_STORAGE_CURRENT_ROOM,
      JSON.stringify({
        [TabMaps.ATTRIBUTE_SELECTED_ROOM_TYPE]: selectedRoom.type,
        [TabMaps.ATTRIBUTE_SELECTED_ROOM_INDEX]: selectedRoom.index,
      }),
    )
  }
}
