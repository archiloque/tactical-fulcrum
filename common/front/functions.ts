import { Hole, html } from "uhtml"

export function htmlUnsafe(str: string): Hole {
  // @ts-ignore
  return html([str])
}
