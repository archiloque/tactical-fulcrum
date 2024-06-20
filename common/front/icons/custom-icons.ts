import { ColorCustomIcons, ColorCustomIconsName } from "./color-custom-icons"
import { Colors, INITIAL_COLOR_BLACK, INITIAL_COLOR_YELLOW } from "../colors"
import { getCssProperty, getTextColor } from "../color-scheme"
import { MonochromeCustomIcons, MonochromeCustomIconsName } from "./monochrome-custom-icons"
import { decodeSvg } from "./decode-svg"
import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js"

export function registerCustomIcons(): void {
  registerIconLibrary("tf", {
    resolver: (name) => {
      return ICONS.get(name).getValue()
    },
    mutator: (svg) => {
      svg.setAttribute("stroke", "currentColor")
    },
  })
}

abstract class CustomIcon {
  abstract getValue(): string
}

export class MonochromeCustomIcon extends CustomIcon {
  private readonly iconName: MonochromeCustomIconsName

  constructor(lightContent: MonochromeCustomIconsName) {
    super()
    this.iconName = lightContent
  }

  getValue(): string {
    return decodeSvg(MonochromeCustomIcons.get(this.iconName).replaceAll(INITIAL_COLOR_BLACK, getTextColor()))
  }
}

export class ColoredCustomIcon extends CustomIcon {
  private readonly iconName: ColorCustomIconsName
  private readonly color: Colors

  constructor(lightContent: ColorCustomIconsName, color: Colors) {
    super()
    this.iconName = lightContent
    this.color = color
  }

  getValue(): string {
    return decodeSvg(
      ColorCustomIcons.get(this.iconName)
        .replaceAll(INITIAL_COLOR_BLACK, getTextColor())
        .replaceAll(INITIAL_COLOR_YELLOW, getCssProperty(this.color.valueOf())),
    )
  }
}

const ICONS = new Map<string, CustomIcon>([
  [ColorCustomIconsName.HEART.valueOf(), new ColoredCustomIcon(ColorCustomIconsName.HEART, Colors.red)],
  [MonochromeCustomIconsName.SHIELD.valueOf(), new MonochromeCustomIcon(MonochromeCustomIconsName.SHIELD)],
  [MonochromeCustomIconsName.SWORD.valueOf(), new MonochromeCustomIcon(MonochromeCustomIconsName.SWORD)],
  [MonochromeCustomIconsName.EXPERIENCE.valueOf(), new MonochromeCustomIcon(MonochromeCustomIconsName.EXPERIENCE)],
])
