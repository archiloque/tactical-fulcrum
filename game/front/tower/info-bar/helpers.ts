import { Hole, html } from "uhtml"
import { SMALL_SPACE } from "../../../../common/front/functions"

export function renderField(id: string, description: string, value: number | string): Hole {
  return html` <div>${renderFieldSpan(id, description, value)}</div>`
}

export function renderFieldSpan(id: string, description: string, value: number | string): Hole {
  return html`<span id="${id}">${value}</span>${SMALL_SPACE}${description}`
}
