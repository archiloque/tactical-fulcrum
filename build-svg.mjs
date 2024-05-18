import fs from "fs"
import path from "path"

const BLACKS = ["#000000", "#000"]

const COLOR_WHITE = "#cccccc"

const YELLOWS = [
  "#ffff00",
  "#ffff0",
  "#ffff0",
  "#ff0",
]

const CRIMSONS = [
  "#ff0000",
  "#f00",
]

class ColorPair {
  constructor(name, light, dark) {
    this.name = name
    this.dark = dark
    this.light = light
  }
}

const COLOR_GREEN = new ColorPair("green", "#65ff00", "#65ff00")

const COLORS_CRIMSON_BLUE = [
  new ColorPair("blue", "#2563eb", "#1E40AF"),
  new ColorPair("crimson", "#ff0000", "#660000"),
]

const COLORS_ALL = COLORS_CRIMSON_BLUE.concat([
    new ColorPair("greenBlue", "#14b8a6", "#084a42"),
    new ColorPair("platinum", "#8E8E8E", "#8E8E8E"),
    new ColorPair("violet", "#a855f7", "#44067f"),
    new ColorPair("yellow", "#ffff00", "#9c9c00"),
  ])

const SPRITES_MONOCHROMES = [
  "enemy",
  "item",
  "score-check",
  "score-crown",
  "score-star",
  "staircase-down",
  "staircase-up",
  "starting-position",
  "wall",
]

class Sprite {
  constructor(name, targetColors) {
    this.name = name
    this.targetColors = targetColors
  }
}

const SPRITES_ALL_COLORS = [
  new Sprite("door", COLORS_ALL),
  new Sprite("key", COLORS_ALL),
  new Sprite("potion", COLORS_CRIMSON_BLUE.concat([COLOR_GREEN])),
]

const IN_DIR = "src/assets/sprites/in"
const OUT_DIR = "src/assets/sprites/out"

const DARK_SUFFIX = "-dark"
const LIGHT_SUFFIX = "-light"

fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUT_DIR)

function whiten(content, dest) {
  for (const black of BLACKS) {
    content = content.replaceAll(`${black};`, `${COLOR_WHITE};`)
  }
  fs.writeFileSync(dest, content)
}

for (const monochromes of SPRITES_MONOCHROMES) {
  const source = path.join(IN_DIR, `${monochromes}.svg`)
  const destLight = path.join(OUT_DIR, `${monochromes}${LIGHT_SUFFIX}.svg`)
  const destDark = path.join(OUT_DIR, `${monochromes}${DARK_SUFFIX}.svg`)
  console.info("From", source, "to", destLight)
  fs.copyFileSync(source, destLight)
  console.info("From", source, "to", destDark)
  let whitened = fs.readFileSync(source, { encoding: "utf8" })
  whiten(fs.readFileSync(source, { encoding: "utf8" }), destDark)
}

function colorizeSprites(sprites) {
  for (const sprite of sprites) {
    const spriteName = sprite.name
    const source = path.join(IN_DIR, `${spriteName}.svg`)
    const sourceContent = fs.readFileSync(source, { encoding: "utf8" })

    for (const colorPair of sprite.targetColors) {
      const destLight = path.join(OUT_DIR, `${spriteName}-${colorPair.name}${LIGHT_SUFFIX}.svg`)
      const destDark = path.join(OUT_DIR, `${spriteName}-${colorPair.name}${DARK_SUFFIX}.svg`)
      let colorizedLight = sourceContent
      let colorizedDark = sourceContent
      for (const initialColor of YELLOWS) {
        colorizedLight = colorizedLight.replaceAll(`${initialColor};`, `${colorPair.light};`)
        colorizedDark = colorizedDark.replaceAll(`${initialColor};`, `${colorPair.dark};`)
      }
      console.info("From", source, "to", destLight)
      fs.writeFileSync(destLight, colorizedLight)
      console.info("From", source, "to", destDark)
      whiten(colorizedDark, destDark)
    }
  }
}

colorizeSprites(SPRITES_ALL_COLORS)
