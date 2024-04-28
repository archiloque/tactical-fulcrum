// @ts-ignore
import {Application, FederatedPointerEvent, Graphics, Point, Sprite} from 'pixi.js'

export class TowerMap {
    private static readonly TILES = 15
    readonly app: Application
    private readonly background: Sprite
    private readonly cursor: Graphics
    private tileSize: number
    private readonly lastMousePosition: Point
    private readonly lastMouseTile: Point = new Point(-1, -1)

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
    }

    resize(elementSize: number) {
        this.tileSize = Math.floor(elementSize / TowerMap.TILES)
        const appSize = this.tileSize * TowerMap.TILES
        this.app.renderer.resize(appSize, appSize)
        this.background.width = appSize
        this.background.height = appSize

        this.cursor.width = this.tileSize
        this.cursor.height = this.tileSize
        this.repositionCursor()
    }

    private pointerMove(e: FederatedPointerEvent) {
        e.getLocalPosition(this.app.stage, this.lastMousePosition)
        const x = this.lastMousePosition.x
        const y = this.lastMousePosition.y
        const tileX = Math.floor(x / this.tileSize)
        const tileY = Math.floor(y / this.tileSize)
        if ((tileY != this.lastMouseTile.y) || (tileX != this.lastMouseTile.x)) {
            console.debug('pointermove', 'tileY', tileY, 'tileX', tileX)
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
