import {Hole, html, render} from 'uhtml'
import {RoomType, SelectedRoom} from './selectedRoom'
import {Editor} from '../../editor'
import {Room} from '../../behavior/room'
import SlButton from '@shoelace-style/shoelace/cdn/components/button/button.component'
import SlDialog from '@shoelace-style/shoelace/cdn/components/dialog/dialog.component'
import SlInput from '@shoelace-style/shoelace/cdn/components/input/input.component'
import SlTree from '@shoelace-style/shoelace/cdn/components/tree/tree.component'

export class TabMapRooms {
  private readonly editor: Editor
  private standardRooms: SlTree
  private nexusRooms: SlTree
  private roomNameInput: SlInput
  private deleteDialog: SlDialog
  private selectedRoom: SelectedRoom | null = null
  private buttonUp: SlButton
  private buttonDown: SlButton
  private addDialog: SlDialog

  constructor(editor: Editor) {
    this.editor = editor
    editor.eventManager.registerRoomSelection(selectedRoom => this.roomSelected(selectedRoom))
  }

  private notifyRoomSelected(selectedRoom: SelectedRoom | null): void {
    this.editor.eventManager.notifyRoomSelection(selectedRoom)
  }

  hole(): Hole {
    console.debug('TabMapRooms', 'hole')
    return html`<h2>Room</h2>
      <sl-input id="tabMapRoomName" @sl-input="${this.nameChanged}" placeholder="Name"></sl-input>
      <div id="tabMapRoomButtons">
        <sl-button id="tabMapRoomButtonUp" variant="neutral" onclick="${this.moveUp}">
          <sl-icon name="arrow-up"></sl-icon>
        </sl-button>
        <sl-button id="tabMapRoomButtonDown" variant="neutral" onclick="${this.moveDown}">
          <sl-icon name="arrow-down"></sl-icon>
        </sl-button>
        <sl-button variant="danger" onclick="${this.delete}">
          <sl-icon name="trash"></sl-icon>
        </sl-button>
      </div>
      <sl-tree selection="leaf" @sl-selection-change="${this.roomSelection}">
        <sl-tree-item id="tabMapRoomStandardRooms"></sl-tree-item>
        <sl-tree-item id="tabMapRoomNexusRooms"></sl-tree-item>
      </sl-tree>
      <div id="tabMapRoomAdd">
        <sl-button variant="primary" onclick="${this.addRoomButton}">
          <sl-icon name="plus-circle"></sl-icon>
        </sl-button>
      </div>
      <sl-dialog label="Delete room" id="tabMapRoomDeleteDialog">
        Are you sure you want to delete this room?
        <div slot="footer">
          <sl-button onclick="${this.deleteDialogCancel}" variant="neutral">No </sl-button>
          <sl-button onclick="${this.deleteDialogConfirm}" variant="danger">Yes </sl-button>
        </div>
      </sl-dialog>
      <sl-dialog label="Add room" id="tabMapRoomAddDialog">
        What kind of room do you want to add?
        <div slot="footer">
          <sl-button onclick="${this.addRoomStandard}" variant="neutral">Standard</sl-button>
          <sl-button onclick="${this.addRoomNexus}" variant="neutral">Nexus</sl-button>
        </div>
      </sl-dialog>`
  }

  init(): void {
    console.debug('TabMapRooms', 'init')
    this.standardRooms = document.getElementById('tabMapRoomStandardRooms') as SlTree
    this.nexusRooms = document.getElementById('tabMapRoomNexusRooms') as SlTree
    this.roomNameInput = document.getElementById('tabMapRoomName') as SlInput
    this.deleteDialog = document.getElementById('tabMapRoomDeleteDialog') as SlDialog
    this.addDialog = document.getElementById('tabMapRoomAddDialog') as SlDialog
    this.buttonUp = document.getElementById('tabMapRoomButtonUp') as SlButton
    this.buttonDown = document.getElementById('tabMapRoomButtonDown') as SlButton
  }

  render(): void {
    console.debug('TabMapRooms', 'render with selected room index', this.selectedRoom)
    const standardRooms = this.renderRooms(this.editor.tower.standardRooms, RoomType.standard)
    render(this.standardRooms, html`Standard ${standardRooms}`)
    const nexusRooms = this.renderRooms(this.editor.tower.nexusRooms, RoomType.nexus)
    render(this.nexusRooms, html`Nexus ${nexusRooms}`)
  }

  private renderRooms(rooms: Room[], roomType: RoomType): Hole[] {
    return rooms.map((room, index) => {
      const id = `tabMapRoomRoom${index}`
      const selected
        = this.selectedRoom != null && index === this.selectedRoom.index && this.selectedRoom.type == roomType
      return html` <sl-tree-item
        id="${id}"
        ?selected="${selected}"
        data-room-index="${index}"
        data-room-type="${roomType.valueOf()}"
      >
        ${room.name}
      </sl-tree-item>`
    })
  }

  private roomSelection = (event: CustomEvent): void => {
    this.notifyRoomSelected(
      new SelectedRoom(
        event.detail.selection[0].dataset.roomType,
        parseInt(event.detail.selection[0].dataset.roomIndex),
      ),
    )
  }

  private moveUp = (): void => {
    const rooms = this.editor.tower.getRooms(this.selectedRoom.type)
    const currentRoom = rooms[this.selectedRoom.index]
    const targetRoom = rooms[this.selectedRoom.index - 1]
    rooms[this.selectedRoom.index] = targetRoom
    rooms[this.selectedRoom.index - 1] = currentRoom
    this.editor.tower.saveRooms()
    this.notifyRoomSelected(new SelectedRoom(this.selectedRoom.type, this.selectedRoom.index - 1))
    this.render()
  }

  private delete = async (): Promise<any> => {
    await this.deleteDialog.show()
  }

  private moveDown = (): void => {
    const rooms = this.editor.tower.getRooms(this.selectedRoom.type)
    const currentRoom = rooms[this.selectedRoom.index]
    const targetRoom = rooms[this.selectedRoom.index + 1]
    rooms[this.selectedRoom.index] = targetRoom
    rooms[this.selectedRoom.index + 1] = currentRoom
    this.editor.tower.saveRooms()
    this.notifyRoomSelected(new SelectedRoom(this.selectedRoom.type, this.selectedRoom.index + 1))
    this.render()
  }

  private addRoomButton = async (): Promise<any> => {
    await this.addDialog.show()
  }

  private addRoomStandard = async (): Promise<any> => {
    await this.addRoom(RoomType.standard)
  }

  private addRoomNexus = async (): Promise<any> => {
    await this.addRoom(RoomType.nexus)
  }

  private async addRoom(roomType: RoomType): Promise<any> {
    console.debug('TabMapRooms', 'add room')
    await this.addDialog.hide()
    const room: Room = new Room()
    room.name = 'New room'
    this.editor.tower.getRooms(roomType).push(room)
    this.editor.tower.saveRooms()
    this.notifyRoomSelected(new SelectedRoom(this.selectedRoom.type, this.editor.tower.getRooms(roomType).length - 1))
    this.render()
  }

  private deleteDialogConfirm = async (): Promise<any> => {
    await this.deleteDialog.hide()
    if (this.selectedRoom != null) {
      console.debug('TabMapRooms', 'delete room', this.selectedRoom)
      this.editor.tower.getRooms(this.selectedRoom.type).splice(this.selectedRoom.index, 1)
      this.editor.tower.saveRooms()
      if (this.editor.tower.getRooms(this.selectedRoom.type).length === 0) {
        this.notifyRoomSelected(null)
      }
 else {
        this.notifyRoomSelected(new SelectedRoom(this.selectedRoom.type, 0))
      }
      this.render()
    }
  }

  private deleteDialogCancel = (): void => {
    this.deleteDialog.hide()
  }

  private nameChanged = (): void => {
    if (this.selectedRoom != null) {
      this.editor.tower.getRooms(this.selectedRoom.type)[this.selectedRoom.index].name = this.roomNameInput.value
      this.editor.tower.saveRooms()
      this.render()
    }
  }

  private roomSelected(selectedRoom: SelectedRoom): void {
    console.debug('TabMapRooms', 'roomSelected', selectedRoom)
    this.selectedRoom = selectedRoom
    if (selectedRoom != null) {
      this.roomNameInput.value = this.editor.tower.getRooms(selectedRoom.type)[this.selectedRoom.index].name
      this.buttonUp.disabled = selectedRoom.index === 0
      this.buttonDown.disabled = selectedRoom.index === this.editor.tower.standardRooms.length - 1
    }
 else {
      this.roomNameInput.value = ''
      this.buttonUp.disabled = true
      this.buttonDown.disabled = true
    }
  }
}
