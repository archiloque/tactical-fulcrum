import { ROOM_TYPES, SelectedRoom } from "./selectedRoom"
import { html, render } from "uhtml"
import { Editor } from "../../editor"
import { Elements } from "./elements"
import { LOCAL_STORAGE_CURRENT_ROOM } from "../../behavior/io/localStorage"
import { Layer } from "./layer"
import { Map } from "./map"
import { RoomType } from "../../data/roomType"
import { Rooms } from "./rooms"
import { Scores } from "./scores"
import SlSplitPanel from "@shoelace-style/shoelace/cdn/components/split-panel/split-panel.component"
import SlTabPanel from "@shoelace-style/shoelace/cdn/components/tab-panel/tab-panel.component"
import { Tab } from "../tab"
import { settings } from "@pixi/settings"

export class TabMaps {
  static readonly tooltipId = "mapToolTip"
  static readonly tooltipTipId = "mapToolTipTip"

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
        html`<div id="${TabMaps.tooltipId}">
            <sl-tooltip id="${TabMaps.tooltipTipId}" trigger="manual" hoist content="">
              <div id="tabMapMapToolTipElement"></div>
            </sl-tooltip>
          </div>
          <sl-split-panel id="tabMapSplitPanel1" @sl-reposition="${this.reposition}" position="25">
            <div slot="start">${this.layer.hole()}${this.scores.hole()}${this.elements.hole()}</div>
            <div slot="end">
              <sl-split-panel id="tabMapSplitPanel2" position="75">
                <div id="tabMapMap" slot="start"></div>
                <div slot="end">${this.rooms.hole()}</div>
              </sl-split-panel>
            </div>
          </sl-split-panel>`,
      )
      this.splitPanel1 = <SlSplitPanel>document.getElementById("tabMapSplitPanel1")
      this.splitPanel2 = <SlSplitPanel>document.getElementById("tabMapSplitPanel2")
      document.getElementById("tabMapMap").appendChild(this.map.app.canvas)
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
