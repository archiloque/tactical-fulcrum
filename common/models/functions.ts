import SlTree from "@shoelace-style/shoelace/cdn/components/tree/tree.component"
import SlTreeItem from "@shoelace-style/shoelace/cdn/components/tree-item/tree-item.component"

export function findEnum<T extends string>(enumList: T[], value: string): T | undefined {
  return enumList.find((s) => s === value)
}

export function findTreeItemFromValue(tree: SlTree, attributes: Record<string, string | number>): SlTreeItem {
  const filters: string[] = []
  Object.entries(attributes).forEach(([key, value]) => {
    filters.push(`[data-${key}="${value}"]`)
  })
  const selectors = `sl-tree-item${filters.join("")}`
  return tree.querySelector(selectors) as SlTreeItem
}
