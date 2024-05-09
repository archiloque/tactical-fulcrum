import {Application, Container, FederatedPointerEvent, Graphics, Point, Sprite} from 'pixi.js'
import {TILES_DEFAULT_SIZE, TILES_IN_ROW} from '../../data/map'
import {Sheets, TacticalFulcrumSprites} from './sheets'
import {Editor} from '../../../editor'
import {EVENT_ROOM_SELECT_NO_ROOM_SELECTED} from '../eventManager'
import {Tile, TileType} from '../../behavior/tile'

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
    private tiles: Container

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
        return Promise.all([this.app.init({background: '#FFFFEE'}), this.sheets.reload(this.tileSize)]).then(() => {
            this.app.stage.addChild(this.background)
            this.app.stage.addChild(this.cursor)
            this.repaint()
        })
    }

    resize(elementSize: number): void {
        console.debug('TabMapMap', 'resize')
        const newTileSize = Math.floor(elementSize / TILES_IN_ROW)
        if (newTileSize != this.tileSize) {
            this.tileSize = newTileSize
            const appSize = this.tileSize * TILES_IN_ROW
            this.app.renderer.resize(appSize, appSize)
            this.background.width = appSize
            this.background.height = appSize
            this.cursor.scale = this.tileSize / TILES_DEFAULT_SIZE
            this.sheets = new Sheets()
            this.sheets.reload(this.tileSize).then(() => {
                this.repaint()
            })
        }
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
        this.repaint()
    }

    private repaint(): void {
        if (this.tiles != null) {
            this.app.stage.removeChild(this.tiles)
        }
        this.tiles = new Container()
        if (this.selectedRoomIndex != EVENT_ROOM_SELECT_NO_ROOM_SELECTED) {
            const currentRoom = this.editor.tower.rooms[this.selectedRoomIndex]
            for (let lineIndex = 0; lineIndex < TILES_IN_ROW; lineIndex++) {
                for (let columnIndex = 0; columnIndex < TILES_IN_ROW; columnIndex++) {
                    const currentTile = currentRoom.tiles[lineIndex][columnIndex]
                    const sheetName = this.sheetNameFromTile(currentTile)
                    if (sheetName != null) {
                        const sprite = this.sheets.getSprite(sheetName)
                        sprite.x = this.tileSize * columnIndex
                        sprite.y = this.tileSize * lineIndex
                        this.tiles.addChild(sprite)
                    }
                }
            }
        }
        this.app.stage.addChild(this.tiles)
    }

    private sheetNameFromTile(tile: Tile): TacticalFulcrumSprites | null {
        switch (tile.getType()) {
            case TileType.key:
                return TacticalFulcrumSprites.key
            case TileType.staircase:
                return TacticalFulcrumSprites.stairs
        }
        return null/*
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
        return null */
    }
}
