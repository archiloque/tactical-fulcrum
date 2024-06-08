import { html, render } from "uhtml"
import { ROOM_TYPES, SelectedRoom } from "./selected-room"
import { Editor } from "../../editor"
import { Elements } from "./elements"
import { Layer } from "./layer"
import { LOCAL_STORAGE_CURRENT_ROOM } from "../../io/local-storage"
import { Map } from "./map"
import { Rooms } from "./rooms"
import { RoomType } from "../../../common/data/room-type"
import { Scores } from "./scores"
import { settings } from "@pixi/settings"
import SlSplitPanel from "@shoelace-style/shoelace/cdn/components/split-panel/split-panel.component"
import SlTabPanel from "@shoelace-style/shoelace/cdn/components/tab-panel/tab-panel.component"
import { Tab } from "../tab"

export class TabMaps {
  static readonly TOOL_TIP_ID = "mapToolTip"
  static readonly TOOL_TIP_TIP_ID = "mapToolTipTip"
  private static readonly SPLIT_PANEL_1_ID = "tabMapSplitPanel1"
  private static readonly SPLIT_PANEL_2_ID = "tabMapSplitPanel2"
  private static readonly MAP_ID = "tabMapMap"

  private elements: Elements
  private layer: Layer
  private map: Map
  private readonly editor: Editor
  private readonly tabElement: SlTabPanel
  private rooms: Rooms
  private scores: Scores
  private selectedRoom: SelectedRoom | null
  private splitPanel1: SlSplitPanel
  private splitPanel2: SlSplitPanel

  constructor(editor: Editor) {
    settings.RESOLUTION = window.devicePixelRatio || 1
    this.editor = editor

    this.tabElement = document.getElementById(Tab.map) as SlTabPanel

    this.layer = new Layer(editor)
    this.elements = new Elements(editor)
    this.scores = new Scores(editor)

    this.map = new Map(editor)
    this.rooms = new Rooms(editor)
    window.addEventListener("resize", () => {
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
        html`<div id="${TabMaps.TOOL_TIP_ID}">
            <sl-tooltip id="${TabMaps.TOOL_TIP_TIP_ID}" trigger="manual" hoist content="">
              <div id="tabMapMapToolTipElement"></div>
            </sl-tooltip>
          </div>
          <sl-split-panel id="${TabMaps.SPLIT_PANEL_1_ID}" @sl-reposition="${this.reposition}" position="25">
            <div slot="start">${this.layer.hole()}${this.scores.hole()}${this.elements.hole()}</div>
            <div slot="end">
              <sl-split-panel id="${TabMaps.SPLIT_PANEL_2_ID}" position="75">
                <div id="${TabMaps.MAP_ID}" slot="start"></div>
                <div slot="end">${this.rooms.hole()}</div>
              </sl-split-panel>
            </div>
          </sl-split-panel>`,
      )
      this.splitPanel1 = <SlSplitPanel>document.getElementById(TabMaps.SPLIT_PANEL_1_ID)
      this.splitPanel2 = <SlSplitPanel>document.getElementById(TabMaps.SPLIT_PANEL_2_ID)
      document.getElementById(TabMaps.MAP_ID).appendChild(this.map.app.canvas)
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
    const height = window.innerHeight - this.splitPanel1.getBoundingClientRect().top - 10
    const splitPanel1Percent = 1 - this.splitPanel1.position / 100
    const splitPanel2Percent = this.splitPanel2.position / 100
    const width = window.innerWidth * splitPanel1Percent * splitPanel2Percent - 20
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
