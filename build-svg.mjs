import fs from "fs"
import path from "path"
import { optimize } from "svgo"

const BLACK_FULL = "#000000"
const BLACK_SHORT = "#000"

const YELLOW_FULL = "#ffff00"
const OTHER_YELLOWS = ["#ffff0", "#ffff0", "#ff0"]

const SPRITES_MONOCHROMES = [
  "enemy-arrow",
  "enemy-hammer",
  "enemy-hidden",
  "enemy-knife",
  "enemy-sword",

  "item-feather",
  "item-book-shield",
  "item-book-sword",

  "score-check",
  "score-crown",
  "score-star",

  "staircase-down",
  "staircase-up",

  "starting-position",

  "wall",
]

const SPRITES_COLORS = [
  "door",
  "key",
  "item-card",
  "item-cards",
  "item-gem",
  "item-jug",
  "item-piece",
  "item-potion",
  "item-drop",
  "item-crown",
]

const IN_DIR = "assets/sprites/in"
const OUT_DIR = "assets/sprites/out"

function optimizeSvg(content) {
  const result = optimize(content, {
    multipass: true, // all other config fields are available here
  })
  return result.data
}

function commonProcess(spriteName) {
  const sourcePath = path.join(IN_DIR, `${spriteName}.svg`)
  console.info(sourcePath)
  let content = fs.readFileSync(sourcePath, { encoding: "utf8" })
  content = content.replaceAll(`${BLACK_SHORT};`, `${BLACK_FULL};`)
  if (!content.includes(`${BLACK_FULL};`)) {
    throw new Error(`No black found in [${sourcePath}]`)
  }
  return content
}

function spriteConstant(spriteName, content) {
  const constantName = spriteName.toLocaleUpperCase().replaceAll("-", "_")
  return `  ${constantName} = '${optimizeSvg(content).replaceAll('xml:space="preserve" ', "")}',`
}

const monochromeFileContent = []
monochromeFileContent.push("export const enum MonochromeSpriteContent {")
for (const spriteName of SPRITES_MONOCHROMES) {
  monochromeFileContent.push(spriteConstant(spriteName, commonProcess(spriteName)))
}
monochromeFileContent.push("}")
fs.writeFileSync("editor/front/maps/monochrome-sprite-content.ts", monochromeFileContent.join("\n"))

const colorFileContent = []
colorFileContent.push("export const enum ColorSpriteContent {")
for (const spriteName of SPRITES_COLORS) {
  let content = commonProcess(spriteName)
  for (const yellow of OTHER_YELLOWS) {
    content = content.replaceAll(`${yellow};`, `${YELLOW_FULL};`)
  }
  if (!content.includes(`${YELLOW_FULL};`)) {
    throw new Error(`No yellow found in [${spriteName}]`)
  }
  colorFileContent.push(spriteConstant(spriteName, content))
}
colorFileContent.push("}")
fs.writeFileSync("editor/front/maps/color-sprite-content.ts", colorFileContent.join("\n"))
