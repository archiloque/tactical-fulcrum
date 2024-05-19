import {Hole, html} from 'uhtml'
import {SCORE_TYPES, ScoreType} from '../../data/scoreType'
import {findEnum, findTreeItemFromValue} from '../../behavior/functions'
import {Editor} from '../../editor'
import {RoomLayer} from '../roomLayer'
import SlTree from '@shoelace-style/shoelace/cdn/components/tree/tree.component'
import SlTreeItem from '@shoelace-style/shoelace/cdn/components/tree-item/tree-item.component'
import {TileType} from '../../behavior/tile'

export class TabMapScores {
  private static readonly divId = 'tabMapScores'
  private static readonly treeId = 'tabMapScoresTree'

  private readonly editor: Editor
  private scoresTree: SlTree
  private selectedScore: ScoreType = null
  private div: HTMLElement

  constructor(editor: Editor) {
    this.editor = editor
    this.editor.eventManager.registerScoreSelection((scoreType, updateScoreTree) =>
      this.scoreSelected(scoreType, updateScoreTree),
    )
    this.editor.eventManager.registerLayerSelection(layer => this.layerSelected(layer))
  }

  hole(): Hole {
    console.debug('TabMapScores', 'hole')
    return html` <div id="${TabMapScores.divId}" class="hidden">
      <h2>Score</h2>
      <sl-tree id="${TabMapScores.treeId}" selection="leaf" @sl-selection-change="${this.selectionChanged}">
        <sl-tree-item data-type="${TileType.empty}">Empty</sl-tree-item>
        <sl-tree-item data-type="${ScoreType.check}">Check</sl-tree-item>
        <sl-tree-item data-type="${ScoreType.star}">Star</sl-tree-item>
        <sl-tree-item data-type="${ScoreType.crown}">Crown</sl-tree-item>
      </sl-tree>
    </div>`
  }

  init(): void {
    console.debug('TabMapScores', 'init')
    this.div = document.getElementById(TabMapScores.divId)
    this.scoresTree = document.getElementById(TabMapScores.treeId) as SlTree
  }

  private selectionChanged = (event: CustomEvent): void => {
    const slTreeItem: SlTreeItem = event.detail.selection[0] as SlTreeItem
    const type = slTreeItem.dataset.type
    if (type === TileType.empty.valueOf()) {
      this.editor.eventManager.notifyScoreSelection(null, false)
    }
 else {
      const scoreType: ScoreType = findEnum(SCORE_TYPES, type)
      if (scoreType != null) {
        this.editor.eventManager.notifyScoreSelection(scoreType, false)
      }
    }
  }

  private findTreeItem(scoreType: ScoreType | null): SlTreeItem {
    if (scoreType == null) {
      return findTreeItemFromValue(this.scoresTree, {type: TileType.empty.valueOf()})
    }
 else {
      return findTreeItemFromValue(this.scoresTree, {type: scoreType.valueOf()})
    }
  }

  private scoreSelected(scoreType: ScoreType | null, updateScoreTree: boolean): void {
    if (updateScoreTree) {
      if (this.selectedScore != null) {
        this.findTreeItem(this.selectedScore).selected = false
      }
      this.selectedScore = scoreType
      this.findTreeItem(this.selectedScore).selected = true
    }
 else {
      this.selectedScore = scoreType
    }
  }

  private layerSelected(layer: RoomLayer): void {
    switch (layer) {
      case RoomLayer.standard:
        this.div.classList.add('hidden')
        break
      case RoomLayer.score:
        this.div.classList.remove('hidden')
        break
    }
  }
}
