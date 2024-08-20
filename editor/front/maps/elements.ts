import { Color, COLORS } from "../../../common/data/color"
import {
  DOOR_TILES,
  DoorTile,
  EMPTY_TILE,
  EnemyTile,
  ITEM_TILES,
  ItemTile,
  KEY_TILES,
  KeyTile,
  STAIRCASE_TILES,
  StaircaseTile,
  Tile,
  TileType,
  WALL_TILE,
} from "../../../common/models/tile"
import { ENEMY_TYPES, EnemyType } from "../../../common/data/enemy-type"
import { findEnum, findTreeItemFromValue } from "../../../common/models/functions"
import { Hole, html, render } from "uhtml"
import { ITEM_NAMES, ItemName } from "../../../common/data/item-name"
import { STAIRCASE_DIRECTIONS, StaircaseDirection } from "../../../common/data/staircase-direction"
import { capitalize } from "../../../common/models/utils"
import { Editor } from "../../editor"
import { Enemy } from "../../../common/models/enemy"
import { RoomLayer } from "../room-layer"
import SlTree from "@shoelace-style/shoelace/cdn/components/tree/tree.component"
import SlTreeItem from "@shoelace-style/shoelace/cdn/components/tree-item/tree-item.component"

export class Elements {
  private static readonly DIV_ID = "tabMapElements"
  private static readonly TREE_ID = "tabMapElementsTree"

  private readonly editor: Editor
  // @ts-ignore
  private tree: SlTree
  // @ts-ignore
  private div: HTMLElement
  private selectedTile: Tile | null = null

  constructor(editor: Editor) {
    this.editor = editor
    this.editor.eventManager.registerTileSelection((selectedTile, updateElementTree) =>
      this.tileSelected(selectedTile, updateElementTree),
    )
    this.editor.eventManager.registerLayerSelection((layer) => this.layerSelected(layer))
  }

  hole(): Hole {
    console.debug("Elements", "hole")
    return html` <div id="${Elements.DIV_ID}">
      <h2>Element</h2>
      <sl-tree id="${Elements.TREE_ID}" selection="leaf" @sl-selection-change="${this.selectionChanged}"> </sl-tree>
    </div>`
  }

  init(): void {
    console.debug("Elements", "init")
    this.div = document.getElementById(Elements.DIV_ID)!
    this.tree = document.getElementById(Elements.TREE_ID) as SlTree
  }

  render(): void {
    console.debug("Elements", "render")
    const keys: Hole[] = COLORS.map(
      (c) => html` <sl-tree-item data-type="${TileType.key}" data-color="${c}">${capitalize(c)} key</sl-tree-item>`,
    )

    const doors: Hole[] = COLORS.map(
      (c) => html` <sl-tree-item data-type="${TileType.door}" data-color="${c}">${capitalize(c)} door</sl-tree-item>`,
    )

    const items: Hole[] = ITEM_NAMES.map(
      (i) => html` <sl-tree-item data-type="${TileType.item}" data-name="${i.valueOf()}">${i}</sl-tree-item>`,
    )

    const staircases: Hole[] = STAIRCASE_DIRECTIONS.map(
      (s) =>
        html` <sl-tree-item data-type="${TileType.staircase}" data-direction="${s.valueOf()}"
          >Staircase ${s}
        </sl-tree-item>`,
    )

    let enemies: Hole
    if (this.editor.tower.enemies.length == 0) {
      enemies = html` <sl-tree-item disabled>Enemy</sl-tree-item>`
    } else {
      const enemiesList = this.editor.tower.enemies.map((enemy: Enemy) => {
        const enemyName = `${enemy.type == null || enemy.type.length === 0 ? "??" : enemy.type} ${enemy.level == null ? "??" : enemy.level} (${enemy.name})`
        return html` <sl-tree-item
          data-type="${TileType.enemy.valueOf()}"
          data-enemy-type="${enemy.type ? enemy.type.valueOf() : ""}"
          data-enemy-level="${enemy.level ? enemy.level : ""}"
          >${enemyName}
        </sl-tree-item>`
      })
      enemies = html` <sl-tree-item>Enemy ${enemiesList}</sl-tree-item>`
    }

    render(
      this.tree,
      html`
        <sl-tree-item data-type="${TileType.empty}" selected>Empty</sl-tree-item>
        <sl-tree-item data-type="${TileType.wall}">Wall</sl-tree-item>
        ${enemies}
        <sl-tree-item>Key ${keys}</sl-tree-item>
        <sl-tree-item>Door ${doors}</sl-tree-item>
        <sl-tree-item>Item ${items}</sl-tree-item>
        <sl-tree-item>Staircase ${staircases}</sl-tree-item>
        <sl-tree-item data-type="${TileType.startingPosition}">Starting position</sl-tree-item>
      `,
    )
  }

  private selectionChanged = (event: CustomEvent): void => {
    const slTreeItem: SlTreeItem = event.detail.selection[0] as SlTreeItem
    switch (slTreeItem.dataset.type) {
      case TileType.empty.valueOf(): {
        this.editor.eventManager.notifyTileSelection(EMPTY_TILE, false)
        return
      }
      case TileType.door.valueOf(): {
        const color: Color | undefined = findEnum(COLORS, slTreeItem.dataset.color!)
        if (color !== undefined) {
          this.editor.eventManager.notifyTileSelection(DOOR_TILES[color], false)
          return
        }
        break
      }
      case TileType.enemy.valueOf(): {
        const enemyType: EnemyType | undefined = findEnum(ENEMY_TYPES, slTreeItem.dataset.enemyType!)
        const enemyLevel: number = parseInt(slTreeItem.dataset.enemyLevel!)
        const enemy: Enemy | undefined = this.editor.tower.enemies.find((enemy) => {
          return enemy.type === enemyType && enemy.level === enemyLevel
        })
        if (enemy !== undefined) {
          this.editor.eventManager.notifyTileSelection({ type: TileType.enemy, enemy: enemy }, false)
        }
        break
      }
      case TileType.item.valueOf(): {
        const item: ItemName | undefined = findEnum(ITEM_NAMES, slTreeItem.dataset.name!)
        if (item !== undefined) {
          this.editor.eventManager.notifyTileSelection(ITEM_TILES[item], false)
          return
        }
        break
      }
      case TileType.key.valueOf(): {
        const color: Color | undefined = findEnum(COLORS, slTreeItem.dataset.color!)
        if (color !== undefined) {
          this.editor.eventManager.notifyTileSelection(KEY_TILES[color], false)
          return
        }
        break
      }
      case TileType.staircase.valueOf(): {
        const staircaseDirection: StaircaseDirection | undefined = findEnum(
          STAIRCASE_DIRECTIONS,
          slTreeItem.dataset.direction!,
        )
        if (staircaseDirection !== undefined) {
          this.editor.eventManager.notifyTileSelection(STAIRCASE_TILES[staircaseDirection], false)
          return
        }
        break
      }
      case TileType.wall.valueOf(): {
        this.editor.eventManager.notifyTileSelection(WALL_TILE, false)
        return
      }
      default: {
        console.error("TabMapElements", "selectionChanged", "Unknown tile", slTreeItem)
      }
    }
  }

  private findTreeItemFromValue(attributes: Record<string, string | number>): SlTreeItem {
    return findTreeItemFromValue(this.tree, attributes)
  }

  private findTreeItem(tile: Tile): SlTreeItem {
    switch (tile.type) {
      case TileType.door:
        const doorTile = tile as DoorTile
        return this.findTreeItemFromValue({
          type: TileType.door.valueOf(),
          color: doorTile.color.valueOf(),
        })
      case TileType.empty:
        return this.findTreeItemFromValue({ type: TileType.empty.valueOf() })
      case TileType.enemy:
        const enemyTile = tile as EnemyTile
        const filter: Record<string, string | number> = {}
        filter["type"] = TileType.enemy.valueOf()
        if (enemyTile.enemy.type !== null) {
          filter["enemy-type"] = enemyTile.enemy.type.valueOf()
        }
        if (enemyTile.enemy.level !== null) {
          filter["enemy-level"] = enemyTile.enemy.level
        }
        return this.findTreeItemFromValue(filter)
      case TileType.item:
        const itemTile = tile as ItemTile
        return this.findTreeItemFromValue({
          type: TileType.item.valueOf(),
          name: itemTile.item.valueOf(),
        })
      case TileType.key:
        const keyTile = tile as KeyTile
        return this.findTreeItemFromValue({
          type: TileType.key.valueOf(),
          color: keyTile.color.valueOf(),
        })
      case TileType.staircase:
        const staircaseTile = tile as StaircaseTile
        return this.findTreeItemFromValue({
          type: TileType.item.valueOf(),
          direction: staircaseTile.direction.valueOf(),
        })
      case TileType.startingPosition:
        return this.findTreeItemFromValue({
          type: TileType.startingPosition.valueOf(),
        })
      case TileType.wall:
        return this.findTreeItemFromValue({ type: TileType.wall.valueOf() })
    }
  }

  private layerSelected(layer: RoomLayer): void {
    switch (layer) {
      case RoomLayer.standard:
        this.div.classList.remove("hidden")
        break
      case RoomLayer.score:
        this.div.classList.add("hidden")
        break
    }
  }

  private tileSelected(selectedTile: Tile, updateElementTree: boolean): void {
    if (updateElementTree) {
      if (this.selectedTile != null) {
        this.findTreeItem(this.selectedTile).selected = false
      }
      this.selectedTile = selectedTile
      const selectedTreeItem = this.findTreeItem(this.selectedTile)
      selectedTreeItem.selected = true
      const parent = selectedTreeItem.parentElement!
      if (parent.id != Elements.TREE_ID) {
        ;(parent as SlTreeItem).expanded = true
      }
    } else {
      this.selectedTile = selectedTile
    }
  }
}
