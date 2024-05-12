import {Editor} from '../../../editor'
import {Hole, html, render} from 'uhtml'
import SlInput from '@shoelace-style/shoelace/cdn/components/input/input.component'
import SlTree from '@shoelace-style/shoelace/cdn/components/tree/tree.component'
import SlDialog from '@shoelace-style/shoelace/cdn/components/dialog/dialog.component'
import {Room} from '../../behavior/room'
import SlButton from '@shoelace-style/shoelace/cdn/components/button/button.component'

export class TabMapRooms {
    private readonly editor: Editor
    private tree: SlTree
    private roomNameInput: SlInput
    private deleteDialog: SlDialog
    private selectedRoomIndex: number = null
    private buttonUp: SlButton
    private buttonDown: SlButton

    constructor(editor: Editor) {
        this.editor = editor
        editor.eventManager.registerRoomSelected(selectedRoomIndex => this.roomSelected(selectedRoomIndex))
    }

    private notifyRoomChange(selectedRoomIndex: number): void {
        this.editor.eventManager.notifyRoomSelected(selectedRoomIndex)
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
        <sl-tree id="tabMapRoomTree" selection="leaf" @sl-selection-change="${this.roomSelection}">
        </sl-tree>
        <div id="tabMapRoomAdd">
            <sl-button variant="primary" onclick="${this.addRoom}">
                <sl-icon name="plus-circle"></sl-icon>
            </sl-button>
        </div>
        <sl-dialog label="Delete room" id="tabMapRoomDeleteDialog">
            Are you sure you want to delete this room?
            <div slot="footer">
                <sl-button onclick="${this.deleteDialogCancel}" variant="neutral">No</sl-button>
                <sl-button onclick="${this.deleteDialogConfirm}" variant="danger">Yes</sl-button>
            </div>
        </sl-dialog>
        `
    }

    init(): void {
        console.debug('TabMapRooms', 'init')
        this.tree = <SlTree>document.getElementById('tabMapRoomTree')
        this.roomNameInput = <SlInput>document.getElementById('tabMapRoomName')
        this.deleteDialog = <SlDialog>document.getElementById('tabMapRoomDeleteDialog')
        this.buttonUp = <SlButton>document.getElementById('tabMapRoomButtonUp')
        this.buttonDown = <SlButton>document.getElementById('tabMapRoomButtonDown')
        if (this.editor.tower.rooms.length > 0) {
            this.editor.eventManager.notifyRoomSelected(0)
        }
    }

    render(): void {
        console.debug('TabMapRooms', 'render')
        if (this.editor.tower.rooms.length === 0) {
            this.notifyRoomChange(null)
        } else if (this.selectedRoomIndex === null) {
            this.notifyRoomChange(0)
        }
        console.debug('TabMapRooms', 'render with selected', this.selectedRoomIndex)
        const rooms: Hole[] = this.editor.tower.rooms.map((room, index) => {
            const id = `tabMapRoomRoom${index}`
            return html`
                <sl-tree-item id="${id}" ?selected="${index === this.selectedRoomIndex}" data-index="${index}">
                    ${room.name}
                </sl-tree-item>`
        })
        render(this.tree, html`Enemy ${rooms}`)
    }

    private roomSelection = (event: CustomEvent): void => {
        this.notifyRoomChange(parseInt(event.detail.selection[0].dataset.index))
    }

    private moveUp = (): void => {
        const rooms = this.editor.tower.rooms
        const currentRoom = rooms[this.selectedRoomIndex]
        const targetRoom = rooms[this.selectedRoomIndex - 1]
        rooms[this.selectedRoomIndex] = targetRoom
        rooms[this.selectedRoomIndex - 1] = currentRoom
        this.editor.tower.saveRooms()
        this.notifyRoomChange(this.selectedRoomIndex - 1)
        this.render()
    }

    private delete = (): void => {
        this.deleteDialog.show()
    }

    private moveDown = (): void => {
        const rooms = this.editor.tower.rooms
        const currentRoom = rooms[this.selectedRoomIndex]
        const targetRoom = rooms[this.selectedRoomIndex + 1]
        rooms[this.selectedRoomIndex] = targetRoom
        rooms[this.selectedRoomIndex + 1] = currentRoom
        this.editor.tower.saveRooms()
        this.notifyRoomChange(this.selectedRoomIndex + 1)
        this.render()
    }

    private addRoom = (): void => {
        console.debug('TabMapRooms', 'add room')
        const room: Room = new Room()
        room.name = 'New room'
        this.editor.tower.rooms.push(room)
        this.editor.tower.saveRooms()
        this.notifyRoomChange(this.editor.tower.rooms.length - 1)
        this.render()
    }

    private deleteDialogConfirm = (): void => {
        this.deleteDialog.hide()
        if (this.selectedRoomIndex != null) {
            console.debug('TabMapRooms', 'delete room', this.selectedRoomIndex)
            this.editor.tower.rooms.splice(this.selectedRoomIndex, 1)
            this.editor.tower.saveRooms()
            this.notifyRoomChange((this.editor.tower.rooms.length === 0) ? null : 0)
            this.render()
        }
    }

    private deleteDialogCancel = (): void => {
        this.deleteDialog.hide()
    }

    private nameChanged = (): void => {
        if (this.selectedRoomIndex != null) {
            this.editor.tower.rooms[this.selectedRoomIndex].name = this.roomNameInput.value
            this.editor.tower.saveRooms()
            this.render()
        }
    }

    private roomSelected(selectedRoomIndex: number): void {
        console.debug('TabMapRooms', 'roomSelected', selectedRoomIndex)
        this.selectedRoomIndex = selectedRoomIndex
        if (selectedRoomIndex != null) {
            this.roomNameInput.value = this.editor.tower.rooms[this.selectedRoomIndex].name
            this.buttonUp.disabled = (selectedRoomIndex === 0)
            this.buttonDown.disabled = (selectedRoomIndex === (this.editor.tower.rooms.length - 1))
        } else {
            this.roomNameInput.value = ''
            this.buttonUp.disabled = true
            this.buttonDown.disabled = true
        }
    }
}
