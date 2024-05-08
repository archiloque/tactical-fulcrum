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
    private static readonly NO_LEVEL_SELECTED = -1
    selectedRoomIndex: number = TabMapRooms.NO_LEVEL_SELECTED
    private buttonUp: SlButton
    private buttonDown: SlButton

    constructor(editor: Editor) {
        this.editor = editor
    }

    init(): Hole {
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

    postInit() {
        this.tree = <SlTree>document.getElementById('tabMapRoomTree')
        this.roomNameInput = <SlInput>document.getElementById('tabMapRoomName')
        this.deleteDialog = <SlDialog>document.getElementById('tabMapRoomDeleteDialog')
        this.buttonUp = <SlButton>document.getElementById('tabMapRoomButtonUp')
        this.buttonDown = <SlButton>document.getElementById('tabMapRoomButtonDown')
        if (this.editor.tower.rooms.length > 0) {
            this.roomSelected(0)
        }
    }

    render() {
        if (this.editor.tower.rooms.length === 0) {
            this.roomSelected(TabMapRooms.NO_LEVEL_SELECTED)
        } else if (this.selectedRoomIndex === TabMapRooms.NO_LEVEL_SELECTED) {
            this.roomSelected(0)
        }
        console.log('TabMapRooms', 'render with selected', this.selectedRoomIndex)
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
        this.roomSelected(parseInt(event.detail.selection[0].dataset.index))
    }

    private moveUp = (): void => {
        const rooms = this.editor.tower.rooms
        const currentRoom = rooms[this.selectedRoomIndex]
        const targetRoom = rooms[this.selectedRoomIndex - 1]
        rooms[this.selectedRoomIndex] = targetRoom
        rooms[this.selectedRoomIndex - 1] = currentRoom
        this.editor.tower.saveRooms()
        this.roomSelected(this.selectedRoomIndex - 1)
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
        this.roomSelected(this.selectedRoomIndex + 1)
        this.render()
    }

    private addRoom = (): void => {
        console.log('TabMapRooms', 'add room')
        const room: Room = new Room()
        room.name = 'New room'
        this.editor.tower.rooms.push(room)
        this.editor.tower.saveRooms()
        this.roomSelected(this.editor.tower.rooms.length - 1)
        this.render()
    }

    private deleteDialogConfirm = (): void => {
        this.deleteDialog.hide()
        if (this.selectedRoomIndex != TabMapRooms.NO_LEVEL_SELECTED) {
            console.log('TabMapRooms', 'delete room', this.selectedRoomIndex)
            this.editor.tower.rooms.splice(this.selectedRoomIndex, 1)
            this.editor.tower.saveRooms()
            this.roomSelected((this.editor.tower.rooms.length === 0) ? TabMapRooms.NO_LEVEL_SELECTED : 0)
            this.render()
        }
    }

    private deleteDialogCancel = (): void => {
        this.deleteDialog.hide()
    }

    private nameChanged = (): void => {
        if (this.selectedRoomIndex != TabMapRooms.NO_LEVEL_SELECTED) {
            this.editor.tower.rooms[this.selectedRoomIndex].name = this.roomNameInput.value
            this.editor.tower.saveRooms()
            this.render()
        }
    }

    private roomSelected(selectedRoomIndex: number) {
        console.log('TabMapRooms', 'select room', selectedRoomIndex)
        this.selectedRoomIndex = selectedRoomIndex
        if (selectedRoomIndex != TabMapRooms.NO_LEVEL_SELECTED) {
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
