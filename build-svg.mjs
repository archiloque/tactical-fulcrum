import fs from "fs"
import path from "path"
import { optimize } from "svgo"

class ColorPair {
  constructor(name, light, dark) {
    this.name = name
    this.dark = dark
    this.light = light
  }
}

class Sprite {
  constructor(name, targetColors) {
    this.name = name
    this.targetColors = targetColors
  }
}

const BLACKS = ["#000000", "#000"]

const COLOR_WHITE = "#cccccc"

const YELLOWS = ["#ffff00", "#ffff0", "#ffff0", "#ff0"]

const COLOR_GREEN = new ColorPair("green", "#65ff00", "#3d9900")

const COLORS_CRIMSON_BLUE = [
  new ColorPair("blue", "#2563eb", "#1E40AF"),
  new ColorPair("crimson", "#ff0000", "#660000"),
]

const COLORS_ALL = [
  new ColorPair("blue", "#2563eb", "#1E40AF"),
  new ColorPair("crimson", "#ff0000", "#660000"),
  new ColorPair("greenblue", "#14b8a6", "#084a42"),
  new ColorPair("platinum", "#8E8E8E", "#8E8E8E"),
  new ColorPair("violet", "#a855f7", "#44067f"),
  new ColorPair("yellow", "#ffff00", "#AAAA00"),
]

const SPRITES_MONOCHROMES = [
  "enemy-arrow",
  "enemy-hammer",
  "enemy-hidden",
  "enemy-knife",
  "enemy-sword",

  "item",
  "item-golden-feather",

  "score-check",
  "score-crown",
  "score-star",

  "staircase-down",
  "staircase-up",

  "starting-position",

  "wall",
]

const SPRITES_ALL_COLORS = [
  new Sprite("door", COLORS_ALL),
  new Sprite("key", COLORS_ALL),
  new Sprite("item-card", COLORS_CRIMSON_BLUE),
  new Sprite("item-cards", COLORS_CRIMSON_BLUE),
  new Sprite("item-jug", COLORS_CRIMSON_BLUE),
  new Sprite("item-potion", COLORS_CRIMSON_BLUE.concat([COLOR_GREEN])),
]

const IN_DIR = "assets/sprites/in"
const OUT_DIR = "assets/sprites/out"

const DARK_SUFFIX = "-dark"
const LIGHT_SUFFIX = "-light"

fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUT_DIR)

function optimizeSvg(content) {
  const result = optimize(content, {
    multipass: true, // all other config fields are available here
  })
  return result.data
}

function whiten(content, dest) {
  for (const black of BLACKS) {
    content = content.replaceAll(`${black};`, `${COLOR_WHITE};`)
  }
  fs.writeFileSync(dest, optimizeSvg(content))
}

for (const monochromes of SPRITES_MONOCHROMES) {
  const source = path.join(IN_DIR, `${monochromes}.svg`)
  console.group(monochromes, source)
  const destLight = path.join(OUT_DIR, `${monochromes}${LIGHT_SUFFIX}.svg`)
  const destDark = path.join(OUT_DIR, `${monochromes}${DARK_SUFFIX}.svg`)
  console.info(destLight)
  fs.copyFileSync(source, destLight)
  console.info(destDark)
  whiten(fs.readFileSync(source, { encoding: "utf8" }), destDark)
  console.groupEnd()
}

console.info()

function colorizeSprites(sprites) {
  for (const sprite of sprites) {
    const spriteName = sprite.name
    const source = path.join(IN_DIR, `${spriteName}.svg`)
    console.group(sprite.name, source)
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
      console.info(destLight)
      fs.writeFileSync(destLight, optimizeSvg(colorizedLight))
      console.info(destDark)
      whiten(colorizedDark, destDark)
    }
    console.groupEnd()
  }
}

colorizeSprites(SPRITES_ALL_COLORS)
