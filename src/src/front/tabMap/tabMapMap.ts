import {Application, FederatedPointerEvent, Graphics, Point, Sprite} from 'pixi.js'
import {TILES_IN_ROW} from '../../data/map'
import {Sheets} from "./sheets";

export class TabMapMap {
    readonly app: Application
    private readonly background: Sprite
    private readonly cursor: Graphics
    private tileSize: number
    private readonly lastMousePosition: Point
    private readonly lastMouseTile: Point = new Point(-1, -1)
    private sheets: Sheets;

    constructor() {
        this.app = new Application()
        this.background = new Sprite()
        this.background.eventMode = 'dynamic'

        this.cursor = new Graphics().rect(0, 0, 10, 10).fill(0xff0000)
        this.cursor.eventMode = 'none'
        this.lastMousePosition = new Point()
    }

    async init() {
        await this.app.init({background: '#FFFFEE'})
        this.background.on('pointerenter', () => this.pointerEnter())
        this.background.on('pointerleave', () => this.pointerLeave())
        this.background.on('pointermove', (e: FederatedPointerEvent) => this.pointerMove(e))
        this.app.stage.addChild(this.background)
        this.app.stage.addChild(this.cursor)
        this.sheets = new Sheets()
        await this.sheets.load()
        this.app.stage.addChild(this.cursor)
    }

    resize(elementSize: number) {
        this.tileSize = Math.floor(elementSize / TILES_IN_ROW)
        const appSize = this.tileSize * TILES_IN_ROW
        this.app.renderer.resize(appSize, appSize)
        this.background.width = appSize
        this.background.height = appSize

        this.cursor.width = this.tileSize
        this.cursor.height = this.tileSize
        this.repositionCursor()
        this.app.stage.addChild(this.sheets.tilemap)
        this.sheets.tilemap.tile(this.sheets.EMPTY_TILE, 0, 0)
    }

    private pointerMove(e: FederatedPointerEvent) {
        e.getLocalPosition(this.app.stage, this.lastMousePosition)
        const x: number = this.lastMousePosition.x
        const y: number = this.lastMousePosition.y
        const tileX: number = Math.floor(x / this.tileSize)
        const tileY: number = Math.floor(y / this.tileSize)
        if ((tileY != this.lastMouseTile.y) || (tileX != this.lastMouseTile.x)) {
            console.debug('moved', 'tileY', tileY, 'tileX', tileX)
            this.lastMouseTile.y = tileY
            this.lastMouseTile.x = tileX
            this.repositionCursor()
        }
    }

    private pointerEnter() {
        this.cursor.visible = true
    }

    private pointerLeave() {
        this.cursor.visible = false
    }

    private repositionCursor() {
        this.cursor.x = this.lastMouseTile.x * this.tileSize
        this.cursor.y = this.lastMouseTile.y * this.tileSize
    }
}
