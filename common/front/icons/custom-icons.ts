import { ColorCustomIcons, ColorCustomIconsName } from "./color-custom-icons"
import { Colors, INITIAL_COLOR_BLACK, INITIAL_COLOR_YELLOW } from "../colors"
import { getCssProperty, getTextColor } from "../color-scheme"
import { MonochromeCustomIcons, MonochromeCustomIconsName } from "./monochrome-custom-icons"
import { Color } from "../../data/color"
import { decodeSvg } from "./decode-svg"
import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js"

enum CustomIconsNames {
  KEY_BLUE = `key${Color.blue}`,
  KEY_CRIMSON = `key${Color.crimson}`,
  KEY_GREEN_BLUE = `key${Color.greenBlue}`,
  KEY_PLATINUM = `key${Color.platinum}`,
  KEY_VIOLET = `key${Color.violet}`,
  KEY_YELLOW = `key${Color.yellow}`,
}

export function registerCustomIcons(): void {
  registerIconLibrary("tf", {
    resolver: (name) => {
      return ICONS.get(name)!.getValue()
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
    return decodeSvg(
      MonochromeCustomIcons.get(this.iconName.toString())!.replaceAll(INITIAL_COLOR_BLACK, getTextColor()),
    )
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
      ColorCustomIcons.get(this.iconName.toString())!
        .replaceAll(INITIAL_COLOR_BLACK, getTextColor())
        .replaceAll(INITIAL_COLOR_YELLOW, getCssProperty(this.color.valueOf())),
    )
  }
}

const ICONS = new Map<string, CustomIcon>([
  [CustomIconsNames.KEY_BLUE.valueOf(), new ColoredCustomIcon(ColorCustomIconsName.KEY, Colors.blue)],
  [CustomIconsNames.KEY_CRIMSON.valueOf(), new ColoredCustomIcon(ColorCustomIconsName.KEY, Colors.red)],
  [CustomIconsNames.KEY_GREEN_BLUE.valueOf(), new ColoredCustomIcon(ColorCustomIconsName.KEY, Colors.teal)],
  [CustomIconsNames.KEY_PLATINUM.valueOf(), new ColoredCustomIcon(ColorCustomIconsName.KEY, Colors.platinum)],
  [CustomIconsNames.KEY_VIOLET.valueOf(), new ColoredCustomIcon(ColorCustomIconsName.KEY, Colors.violet)],
  [CustomIconsNames.KEY_YELLOW.valueOf(), new ColoredCustomIcon(ColorCustomIconsName.KEY, Colors.yellow)],
])
