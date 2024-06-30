import "@shoelace-style/shoelace/dist/components/icon/icon.js"

import { DefaultIcons } from "./default-icons"
import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js"

export function registerDefaultIcons(): void {
  registerIconLibrary("default", {
    resolver: (name) => {
      return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" ${DefaultIcons.get(name)}</svg>`)}`
    },
  })
}
