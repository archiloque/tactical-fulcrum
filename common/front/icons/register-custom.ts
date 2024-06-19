import { CustomIcons } from "./custom-icons"
import { decodeSvg } from "./decode-svg"
import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js"

export function registerCustomIcons(): void {
  registerIconLibrary("tf", {
    resolver: (name) => {
      return decodeSvg(CustomIcons.get(name))
    },
  })
}
