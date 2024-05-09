import {Application, Container, FederatedPointerEvent, Graphics, Point, Sprite} from 'pixi.js'
import {TILES_DEFAULT_SIZE, TILES_IN_ROW} from '../../data/map'
import {Sheets} from './sheets'
import {Editor} from '../../../editor'
import {EVENT_ROOM_SELECT_NO_ROOM_SELECTED} from '../eventManager'
import {EnemyTile, Tile, TileType} from '../../behavior/tile'
import {EnemyType} from '../../data/enemyType'

export class TabMapMap {
    readonly app: Application
    private readonly background: Sprite
    private readonly cursor: Graphics
    private tileSize: number = TILES_DEFAULT_SIZE
    private readonly lastMousePosition: Point
    private lastMouseTile: Point = new Point(-1, -1)
    private sheets: Sheets
    private readonly editor: Editor
    private selectedRoomIndex: number = EVENT_ROOM_SELECT_NO_ROOM_SELECTED
    private tiles: Container;

    constructor(editor: Editor) {
        this.app = new Application()
        this.background = new Sprite()
        this.background.eventMode = 'dynamic'
        this.cursor = new Graphics().rect(0, 0, TILES_DEFAULT_SIZE, TILES_DEFAULT_SIZE).fill(0xff0000)
        this.cursor.eventMode = 'none'
        this.lastMousePosition = new Point()
        this.sheets = new Sheets()
        this.editor = editor
        this.editor.eventManager.registerRoomChange(selectedRoomIndex => this.roomSelected(selectedRoomIndex))
    }

    async init(): Promise<any> {
        console.debug('TabMapMap', 'init')
        this.background.on('pointerenter', () => this.pointerEnter())
        this.background.on('pointerleave', () => this.pointerLeave())
        this.background.on('pointermove', (e: FederatedPointerEvent) => this.pointerMove(e))
        return Promise.all([this.app.init({background: '#FFFFEE'}), this.sheets.init(this.tileSize)]).then(() => {
            this.app.stage.addChild(this.background)
            //this.app.stage.addChild(this.sheets.tilemap)
            this.app.stage.addChild(this.cursor)
            this.repaint()
        })
    }

    resize(elementSize: number): void {
        console.debug('TabMapMap', 'resize')
        this.tileSize = Math.floor(elementSize / TILES_IN_ROW)
        const appSize = this.tileSize * TILES_IN_ROW
        this.app.renderer.resize(appSize, appSize)
        this.background.width = appSize
        this.background.height = appSize
        this.cursor.scale = this.tileSize / TILES_DEFAULT_SIZE
        this.sheets = new Sheets()
        this.sheets.init(this.tileSize).then(() => {this.repaint()})
        //this.sheets.tilemap.scale = this.tileSize / TILES_DEFAULT_SIZE
    }

    private pointerMove(e: FederatedPointerEvent): void {
        e.getLocalPosition(this.app.stage, this.lastMousePosition)
        const x: number = this.lastMousePosition.x
        const y: number = this.lastMousePosition.y
        const tileX: number = Math.floor(x / this.tileSize)
        const tileY: number = Math.floor(y / this.tileSize)
        const newMouseTile: Point = new Point(tileX, tileY)
        if (!this.lastMouseTile.equals(newMouseTile)) {
            console.debug('moved', 'tileY', tileY, 'tileX', tileX)
            this.lastMouseTile = newMouseTile
            this.repositionCursor()
        }
    }

    private pointerEnter(): void {
        this.cursor.visible = true
    }

    private pointerLeave(): void {
        this.cursor.visible = false
    }

    private repositionCursor(): void {
        this.cursor.x = this.lastMouseTile.x * this.tileSize
        this.cursor.y = this.lastMouseTile.y * this.tileSize
    }

    private roomSelected(selectedRoomIndex: number): void {
        console.debug('TabMapMap', 'roomSelected', selectedRoomIndex)
        this.selectedRoomIndex = selectedRoomIndex
        //this.sheets.tilemap.clear()
        this.repaint();
    }

    private repaint() {
        if (this.tiles != null) {
            this.app.stage.removeChild(this.tiles)
        }
        this.tiles = new Container()
        this.tiles.addChild(this.sheets.key)
        this.app.stage.addChild(this.tiles)
        /*
        const currentRoom = this.editor.tower.rooms[this.selectedRoomIndex]
        for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
            for (let columnIndex = 0; columnIndex < TILES_IN_ROW; columnIndex++) {
                const currentTile = currentRoom.tiles[lineIndex][columnIndex]
                const sheetName = this.sheetNameFromTile(currentTile)
                if (sheetName != null) {
                    //this.sheets.tilemap.tile(sheetName, columnIndex * TILES_DEFAULT_SIZE, lineIndex * TILES_DEFAULT_SIZE)
                }
            }
        }*/
    }

    private sheetNameFromTile(tile: Tile): string | null {
        switch (tile.getType()) {
            case TileType.empty:
                return Sheets.TILE_EMPTY
            case TileType.wall:
                return Sheets.TILE_WALL
            case TileType.item:
                return Sheets.TILE_POTION
            case TileType.enemy:
                const enemyTile = tile as EnemyTile
                switch (enemyTile.enemy.type) {
                    case EnemyType.burgeoner:
                        return Sheets.TILE_ENEMY_BURGEONER
                    case EnemyType.fighter:
                        return Sheets.TILE_ENEMY_FIGHTER
                    case EnemyType.ranger:
                        return Sheets.TILE_ENEMY_RANGER
                    case EnemyType.shadow:
                        return Sheets.TILE_ENEMY_SHADOW
                    case EnemyType.slasher:
                        return Sheets.TILE_ENEMY_SLASHER
                }
        }
        console.error('TabMapMap', 'sheetNameFromTile', 'Unknown tile', tile.getType())
        return null
    }
}
