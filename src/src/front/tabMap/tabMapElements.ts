import { Editor } from "../../../editor"
import { Hole, html, render } from "uhtml"
import { Color, COLORS } from "../../data/color"
import { capitalize } from "../../behavior/utils"
import { Item, ITEMS } from "../../data/item"
import SlTreeItem from "@shoelace-style/shoelace/cdn/components/tree-item/tree-item.component"
import {
  DOOR_TILES,
  DoorTile,
  EMPTY_TILE,
  EnemyTile,
  ITEM_TILES,
  ItemTile,
  KEY_TILES,
  KeyTile,
  SCORE_TILES,
  ScoreTile,
  STAIRCASE_TILES,
  StaircaseTile,
  Tile,
  TileType,
  WALL_TILE,
} from "../../behavior/tile"
import { STAIRCASE_DIRECTIONS, StaircaseDirection } from "../../data/staircaseDirection"
import { SCORE_TYPES, ScoreType } from "../../data/scoreType"
import { findEnum } from "../../behavior/functions"
import SlTree from "@shoelace-style/shoelace/cdn/components/tree/tree.component"
import { Enemy } from "../../behavior/enemy"
import { ENEMY_TYPES, EnemyType } from "../../data/enemyType"

export class TabMapElements {
  private readonly editor: Editor
  private tabMapEnemies: SlTreeItem
  private tabMapTree: SlTree
  private selectedTile: Tile = null
  private static readonly treeId = "tabMapElementsTree"
  private static readonly enemiesSubTreeId = "tabMapElementsTreeEnemies"

  constructor(editor: Editor) {
    this.editor = editor
    this.editor.eventManager.registerTileSelection((selectedTile, updateElementTree) =>
      this.tileSelected(selectedTile, updateElementTree),
    )
  }

  hole(): Hole {
    console.debug("TabMapElements", "hole")
    const keys: Hole[] = COLORS.map(
      (c) => html` <sl-tree-item data-type="${TileType.key}" data-color="${c}">${capitalize(c)} key</sl-tree-item>`,
    )

    const doors: Hole[] = COLORS.map(
      (c) => html` <sl-tree-item data-type="${TileType.door}" data-color="${c}">${capitalize(c)} door</sl-tree-item>`,
    )

    const items: Hole[] = ITEMS.map(
      (i) => html` <sl-tree-item data-type="${TileType.item}" data-name="${i.valueOf()}">${i}</sl-tree-item>`,
    )

    const staircases: Hole[] = STAIRCASE_DIRECTIONS.map(
      (s) =>
        html` <sl-tree-item data-type="${TileType.staircase}" data-direction="${s.valueOf()}"
          >Staircase ${s}
        </sl-tree-item>`,
    )

    const scores: Hole[] = SCORE_TYPES.map(
      (s) => html` <sl-tree-item data-type="${TileType.score}" data-score="${s.valueOf()}">Score ${s}</sl-tree-item>`,
    )

    return html`<h2>Element</h2>
      <sl-tree id="${TabMapElements.treeId}" selection="leaf" @sl-selection-change="${this.selectionChanged}">
        <sl-tree-item data-type="${TileType.empty}" selected>Empty</sl-tree-item>
        <sl-tree-item data-type="${TileType.wall}">Wall</sl-tree-item>
        <sl-tree-item id="${TabMapElements.enemiesSubTreeId}">Enemy </sl-tree-item>
        <sl-tree-item>Key ${keys} </sl-tree-item>
        <sl-tree-item>Door ${doors} </sl-tree-item>
        <sl-tree-item>Item ${items} </sl-tree-item>
        <sl-tree-item>Staircase ${staircases} </sl-tree-item>
        <sl-tree-item>Score ${scores} </sl-tree-item>
        <sl-tree-item data-type="${TileType.startingPosition}">Starting position</sl-tree-item>
      </sl-tree>`
  }

  init(): void {
    console.debug("TabMapElements", "init")
    this.tabMapTree = document.getElementById(TabMapElements.treeId) as SlTree
    this.tabMapEnemies = document.getElementById(TabMapElements.enemiesSubTreeId) as SlTreeItem
  }

  render(): void {
    console.debug("TabMapElements", "render")
    const enemies: Hole[] = this.editor.tower.enemies.map((enemy: Enemy) => {
      const enemyName = `${enemy.type == null || enemy.type.length === 0 ? "??" : enemy.type} ${enemy.level == null ? "??" : enemy.level} (${enemy.name})`
      return html` <sl-tree-item
        data-type="${TileType.enemy.valueOf()}"
        data-enemy-type="${enemy.type ? enemy.type.valueOf() : ""}"
        data-enemy-level="${enemy.level ? enemy.level : ""}"
        >${enemyName}
      </sl-tree-item>`
    })
    render(this.tabMapEnemies, html`Enemy ${enemies}`)
  }

  private selectionChanged = (event: CustomEvent): void => {
    const slTreeItem: SlTreeItem = event.detail.selection[0] as SlTreeItem
    switch (slTreeItem.dataset.type) {
      case TileType.empty.valueOf(): {
        this.editor.eventManager.notifyTileSelection(EMPTY_TILE, false)
        return
      }
      case TileType.door.valueOf(): {
        const color: Color = findEnum(COLORS, slTreeItem.dataset.color)
        if (color != null) {
          this.editor.eventManager.notifyTileSelection(DOOR_TILES[color], false)
          return
        }
        break
      }
      case TileType.enemy.valueOf(): {
        const enemyType: EnemyType | null = findEnum(ENEMY_TYPES, slTreeItem.dataset.enemyType)
        const enemyLevel: number = parseInt(slTreeItem.dataset.enemyLevel)
        const enemy = this.editor.tower.enemies.find((enemy) => {
          return enemy.type === enemyType && enemy.level === enemyLevel
        })
        if (enemy != null) {
          this.editor.eventManager.notifyTileSelection(new EnemyTile(enemy), false)
        }
        break
      }
      case TileType.item.valueOf(): {
        const item: Item = findEnum(ITEMS, slTreeItem.dataset.name)
        if (item != null) {
          this.editor.eventManager.notifyTileSelection(ITEM_TILES[item], false)
          return
        }
        break
      }
      case TileType.key.valueOf(): {
        const color: Color = findEnum(COLORS, slTreeItem.dataset.color)
        if (color != null) {
          this.editor.eventManager.notifyTileSelection(KEY_TILES[color], false)
          return
        }
        break
      }
      case TileType.score.valueOf(): {
        const scoreType: ScoreType = findEnum(SCORE_TYPES, slTreeItem.dataset.score)
        if (scoreType != null) {
          this.editor.eventManager.notifyTileSelection(SCORE_TILES[scoreType], false)
          return
        }
        break
      }
      case TileType.staircase.valueOf(): {
        const staircaseDirection: StaircaseDirection = findEnum(STAIRCASE_DIRECTIONS, slTreeItem.dataset.direction)
        if (staircaseDirection != null) {
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
    const filters = []
    Object.entries(attributes).forEach(([key, value]) => {
      filters.push(`[data-${key}="${value}"]`)
    })
    const selectors = `sl-tree-item${filters.join("")}`
    return this.tabMapTree.querySelector(selectors) as SlTreeItem
  }

  private findTreeItem(tile: Tile): SlTreeItem {
    switch (tile.getType()) {
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
        return this.findTreeItemFromValue({
          type: TileType.enemy.valueOf(),
          "enemy-type": enemyTile.enemy.type.valueOf(),
          "enemy-level": enemyTile.enemy.level,
        })
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
      case TileType.score:
        const scoreTile = tile as ScoreTile
        return this.findTreeItemFromValue({
          type: TileType.item.valueOf(),
          score: scoreTile.score.valueOf(),
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

  private tileSelected(selectedTile: Tile, updateElementTree: boolean): void {
    if (updateElementTree) {
      if (this.selectedTile != null) {
        this.findTreeItem(this.selectedTile).selected = false
      }
      this.selectedTile = selectedTile
      const selectedTreeItem = this.findTreeItem(this.selectedTile)
      selectedTreeItem.selected = true
      const parent = selectedTreeItem.parentElement
      if (parent.id != TabMapElements.treeId) {
        ;(parent as SlTreeItem).expanded = true
      }
    } else {
      this.selectedTile = selectedTile
    }
  }
}
