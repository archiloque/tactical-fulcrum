import { ROOM_TYPES, RoomType, SelectedRoom } from "./selectedRoom"
import { html, render } from "uhtml"
import { Editor } from "../../../editor"
import { LOCAL_STORAGE_CURRENT_ROOM } from "../../behavior/io/localStorage"
import SlSplitPanel from "@shoelace-style/shoelace/cdn/components/split-panel/split-panel.component"
import { Tab } from "../tab"
import { TabMapElements } from "./tabMapElements"
import { TabMapLayer } from "./tabMapLayer"
import { TabMapMap } from "./tabMapMap"
import { TabMapRooms } from "./tabMapRooms"
import { TabMapScores } from "./tabMapScores"
import { settings } from "@pixi/settings"

export class TabMap {
  private readonly editor: Editor
  private readonly tabElement: HTMLElement
  private splitPanel1: SlSplitPanel
  private splitPanel2: SlSplitPanel
  private tabMapMap: TabMapMap
  private tabMapLayer: TabMapLayer
  private tabMapElements: TabMapElements
  private tabMapScores: TabMapScores
  private tabMapRooms: TabMapRooms
  private selectedRoom: SelectedRoom | null

  constructor(editor: Editor) {
    settings.RESOLUTION = window.devicePixelRatio || 1
    this.editor = editor

    this.tabElement = document.getElementById(Tab.map)

    this.tabMapLayer = new TabMapLayer(editor)
    this.tabMapElements = new TabMapElements(editor)
    this.tabMapScores = new TabMapScores(editor)

    this.tabMapMap = new TabMapMap(editor)
    this.tabMapRooms = new TabMapRooms(editor)
    window.addEventListener("resize", () => {
      this.resize()
    })
  }

  async init(): Promise<any> {
    console.debug("TabMap", "init")
    await this.tabMapMap.init()
    render(
      this.tabElement,
      html` <div id="tabMapMapToolTip">
          <sl-tooltip id="tabMapMapToolTipTip" trigger="manual" hoist content="This is a tooltip">
            <div id="tabMapMapToolTipElement"></div>
          </sl-tooltip>
        </div>
        <sl-split-panel id="tabMapSplitPanel1" @sl-reposition="${this.reposition}" position="25">
          <div slot="start">${this.tabMapLayer.hole()}${this.tabMapScores.hole()}${this.tabMapElements.hole()}</div>
          <div slot="end">
            <sl-split-panel id="tabMapSplitPanel2" position="75">
              <div id="tabMapMap" slot="start"></div>
              <div slot="end">${this.tabMapRooms.hole()}</div>
            </sl-split-panel>
          </div>
        </sl-split-panel>`,
    )
    this.splitPanel1 = <SlSplitPanel>document.getElementById("tabMapSplitPanel1")
    this.splitPanel2 = <SlSplitPanel>document.getElementById("tabMapSplitPanel2")
    document.getElementById("tabMapMap").appendChild(this.tabMapMap.app.canvas)
    this.tabMapRooms.init()
    this.tabMapElements.init()
    this.tabMapLayer.init()
    this.tabMapScores.init()
    this.tabMapMap.postInit()
    this.loadInitRoom()
    this.editor.eventManager.registerRoomSelection((selectedRoom) => this.roomSelected(selectedRoom))
  }

  render(): void {
    console.debug("TabMap", "render")
    this.calculateRealSelectedRoom(this.selectedRoom)
    this.tabMapElements.render()
    this.tabMapRooms.render()
    this.resize()
  }

  private reposition = (): void => {
    this.resize()
  }

  private resize(): void {
    const height = window.innerHeight - this.splitPanel1.getBoundingClientRect().top - 10
    const splitPanel1Percent = 1 - this.splitPanel1.position / 100
    const splitPanel2Percent = this.splitPanel2.position / 100
    const width = window.innerWidth * splitPanel1Percent * splitPanel2Percent - 20
    const number = Math.min(height, width)
    this.tabMapMap.resize(number)
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
    const roomType = selectedRoomParsed[TabMap.ATTRIBUTE_SELECTED_ROOM_INDEX]
    if (!ROOM_TYPES.includes(roomType)) {
      this.editor.eventManager.notifyRoomSelection(null)
      return
    }

    const selectedRoom: SelectedRoom = new SelectedRoom(
      roomType,
      parseInt(selectedRoomParsed[TabMap.ATTRIBUTE_SELECTED_ROOM_TYPE]),
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
        [TabMap.ATTRIBUTE_SELECTED_ROOM_TYPE]: selectedRoom.type,
        [TabMap.ATTRIBUTE_SELECTED_ROOM_INDEX]: selectedRoom.index,
      }),
    )
  }
}
