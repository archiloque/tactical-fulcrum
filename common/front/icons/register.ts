import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js"
import { IconSpriteContent } from "./icons"

export function registerIcons() {
  registerIconLibrary("default", {
    resolver: (name) => {
      return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" ${IconSpriteContent.get(name)}</svg>`)}`
    },
  })
}
