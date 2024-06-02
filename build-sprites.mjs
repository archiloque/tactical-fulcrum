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

function optimizeSvg(content) {
  const result = optimize(content, {
    multipass: true, // all other config fields are available here
  })
  return result.data
}

const SVG_STARTING_CONTENT = '<svg xmlns="http://www.w3.org/2000/svg" '
const SVG_ENDING_CONTENT = "</svg>"

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

function constantName(spriteName) {
  return spriteName.toLocaleUpperCase().replaceAll("-", "_")
}

function spriteConstant(nameEnum, spriteName, content) {
  let svgContent = optimizeSvg(content).replaceAll('xml:space="preserve" ', "")
  if (!svgContent.startsWith(SVG_STARTING_CONTENT)) {
    throw new Error(`SVG beginning unexpected [${spriteName}] [${svgContent}]`)
  }
  if (!svgContent.endsWith(SVG_ENDING_CONTENT)) {
    throw new Error(`SVG ending unexpected [${spriteName}] [${svgContent}]`)
  }
  svgContent = svgContent.substring(SVG_STARTING_CONTENT.length)
  svgContent = svgContent.substring(0, svgContent.length - SVG_ENDING_CONTENT.length)
  return `  [${nameEnum}.${constantName(spriteName)}, '${svgContent}'],`
}

const monochromeFileContent = []
monochromeFileContent.push("export enum MonochromeSpriteName {")
for (const spriteName of SPRITES_MONOCHROMES) {
  monochromeFileContent.push(`  ${constantName(spriteName)},`)
}
monochromeFileContent.push("}")
monochromeFileContent.push("")
monochromeFileContent.push("export const MonochromeSpriteContent = new Map<MonochromeSpriteName, string>([")
for (const spriteName of SPRITES_MONOCHROMES) {
  monochromeFileContent.push(spriteConstant("MonochromeSpriteName", spriteName, commonProcess(spriteName)))
}
monochromeFileContent.push("])")
fs.writeFileSync("editor/front/maps/monochrome-sprite-content.ts", monochromeFileContent.join("\n"))

const colorFileContent = []
colorFileContent.push("export enum ColorSpriteName {")
for (const spriteName of SPRITES_COLORS) {
  colorFileContent.push(`  ${constantName(spriteName)},`)
}
colorFileContent.push("}")
colorFileContent.push("")
colorFileContent.push("export const ColorSpriteContent = new Map<ColorSpriteName, string>([")
for (const spriteName of SPRITES_COLORS) {
  let content = commonProcess(spriteName)
  for (const yellow of OTHER_YELLOWS) {
    content = content.replaceAll(`${yellow};`, `${YELLOW_FULL};`)
  }
  if (!content.includes(`${YELLOW_FULL};`)) {
    throw new Error(`No yellow found in [${spriteName}]`)
  }
  colorFileContent.push(spriteConstant("ColorSpriteName", spriteName, content))
}
colorFileContent.push("])")
fs.writeFileSync("editor/front/maps/color-sprite-content.ts", colorFileContent.join("\n"))

const EDITOR_ICONS = [
  "arrow-up",
  "arrow-down",
  "check2-circle",
  "exclamation-triangle",
  "exclamation-octagon",
  "plus-circle",
  "trash",
]

const editorIconsContent = []

editorIconsContent.push("export const IconSpriteContent = new Map<string, string>([")
for (const iconName of EDITOR_ICONS) {
  const sourcePath = `node_modules/@shoelace-style/shoelace/cdn/assets/icons/${iconName}.svg`
  console.info(sourcePath)
  let content = fs.readFileSync(sourcePath, { encoding: "utf8" })
  let svgContent = optimizeSvg(content)
  if (!svgContent.startsWith(SVG_STARTING_CONTENT)) {
    throw new Error(`SVG beginning unexpected [${spriteName}] [${svgContent}]`)
  }
  if (!svgContent.endsWith(SVG_ENDING_CONTENT)) {
    throw new Error(`SVG ending unexpected [${spriteName}] [${svgContent}]`)
  }
  svgContent = svgContent.substring(SVG_STARTING_CONTENT.length)
  svgContent = svgContent.substring(0, svgContent.length - SVG_ENDING_CONTENT.length)

  editorIconsContent.push(`  ['${iconName}', '${svgContent}'],`)
}
editorIconsContent.push("])")
fs.writeFileSync("editor/front/icons.ts", editorIconsContent.join("\n"))
