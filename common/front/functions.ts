import { Hole, html } from "uhtml"
import { Color } from "../data/color"

export const NBSP = "\xa0"

export function htmlUnsafe(str: string): Hole {
  // @ts-ignore
  return html([str])
}

export const SMALL_SPACE = htmlUnsafe(`<span class='small'> </span>`)
export const SMALL_SPACES_STRING = `<span class='small'> </span>`

export function keyIcon(color: Color): Hole {
  const iconName = `key${color}`
  return html`<sl-icon library="tf" name="${iconName}"></sl-icon>
  </div>`
}
