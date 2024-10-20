import { findEnum, findTreeItemFromValue } from "../../../common/models/functions"
import { Hole, html } from "uhtml"
import { SCORE_TYPES, ScoreType } from "../../../common/data/score-type"
import { Editor } from "../../editor"
import { RoomLayer } from "../room-layer"
import SlTree from "@shoelace-style/shoelace/cdn/components/tree/tree.component"
import SlTreeItem from "@shoelace-style/shoelace/cdn/components/tree-item/tree-item.component"
import { TileType } from "../../../common/models/tile"

export class Scores {
  private static readonly DIV_ID = "tabMapScores"
  private static readonly TREE_ID = "tabMapScoresTree"

  // @ts-ignore
  private div: HTMLElement
  private readonly editor: Editor
  private scoresTree?: SlTree
  private selectedScore?: ScoreType

  constructor(editor: Editor) {
    this.editor = editor
    this.editor.eventManager.registerScoreSelection((scoreType, updateScoreTree) =>
      this.scoreSelected(scoreType, updateScoreTree),
    )
    this.editor.eventManager.registerLayerSelection((layer) => this.layerSelected(layer))
  }

  hole(): Hole {
    console.debug("Scores", "hole")
    return html` <div id="${Scores.DIV_ID}" class="hidden">
      <h2>Score</h2>
      <sl-tree id="${Scores.TREE_ID}" selection="leaf" @sl-selection-change="${this.selectionChanged}">
        <sl-tree-item data-type="${TileType.empty}">Empty</sl-tree-item>
        <sl-tree-item data-type="${ScoreType.check}">Check</sl-tree-item>
        <sl-tree-item data-type="${ScoreType.star}">Star</sl-tree-item>
        <sl-tree-item data-type="${ScoreType.crown}">Crown</sl-tree-item>
      </sl-tree>
    </div>`
  }

  init(): void {
    console.debug("Scores", "init")
    this.div = document.getElementById(Scores.DIV_ID)!
    this.scoresTree = document.getElementById(Scores.TREE_ID) as SlTree
  }

  private selectionChanged = (event: CustomEvent): void => {
    const slTreeItem: SlTreeItem = event.detail.selection[0] as SlTreeItem
    const type = slTreeItem.dataset.type!
    if (type === TileType.empty.valueOf()) {
      this.editor.eventManager.notifyScoreSelection(undefined, false)
    } else {
      const scoreType: ScoreType | undefined = findEnum(SCORE_TYPES, type)
      if (scoreType !== undefined) {
        this.editor.eventManager.notifyScoreSelection(scoreType, false)
      }
    }
  }

  private findTreeItem(scoreType: ScoreType | undefined): SlTreeItem {
    if (scoreType === undefined) {
      return findTreeItemFromValue(this.scoresTree!!, { type: TileType.empty.valueOf() })
    } else {
      return findTreeItemFromValue(this.scoresTree!!, { type: scoreType.valueOf() })
    }
  }

  private scoreSelected(scoreType: ScoreType | undefined, updateScoreTree: boolean): void {
    if (updateScoreTree) {
      if (this.selectedScore !== undefined) {
        this.findTreeItem(this.selectedScore).selected = false
      }
      this.selectedScore = scoreType
      this.findTreeItem(this.selectedScore!!).selected = true
    } else {
      this.selectedScore = scoreType
    }
  }

  private layerSelected(layer: RoomLayer): void {
    switch (layer) {
      case RoomLayer.standard:
        this.div.classList.add("hidden")
        break
      case RoomLayer.score:
        this.div.classList.remove("hidden")
        break
    }
  }
}
