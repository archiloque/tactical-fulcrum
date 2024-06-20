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

const EDITOR_ICONS = [
  "arrow-up",
  "arrow-down",
  "check2-circle",
  "exclamation-triangle",
  "exclamation-octagon",
  "plus-circle",
  "trash",
]

const CUSTOM_ICONS_COLORS = ["heart"]

const CUSTOM_ICONS_MONOCHROMES = [
  "shield",
  "sword",
]

const IN_DIR = "assets/sprites"

function optimizeSvg(content) {
  const result = optimize(content, {
    multipass: true, // all other config fields are available here
  })
  return result.data
}

const SVG_STARTING_CONTENT = '<svg xmlns="http://www.w3.org/2000/svg" '
const SVG_ENDING_CONTENT = "</svg>"

function canonizeBlack(content) {
  content = content.replaceAll(`${BLACK_SHORT};`, `${BLACK_FULL};`)
  if (!content.includes(`${BLACK_FULL};`)) {
    throw new Error(`No black found`)
  }
  return content
}

function canonizeYellow(content) {
  for (const yellow of OTHER_YELLOWS) {
    content = content.replaceAll(`${yellow};`, `${YELLOW_FULL};`)
  }
  if (!content.includes(`${YELLOW_FULL};`)) {
    throw new Error(`No yellow found`)
  }
  return content
}

function commonProcess(spriteName) {
  const sourcePath = path.join(IN_DIR, `${spriteName}.svg`)
  console.info(sourcePath)
  return canonizeBlack(fs.readFileSync(sourcePath, { encoding: "utf8" }))
}

function constantName(spriteName) {
  return spriteName.toLocaleUpperCase().replaceAll("-", "_")
}

function simplifySvG(content, spriteName) {
  let svgContent = optimizeSvg(content).replaceAll('xml:space="preserve" ', "")
  if (!svgContent.startsWith(SVG_STARTING_CONTENT)) {
    throw new Error(`SVG beginning unexpected [${spriteName}] [${svgContent}]`)
  }
  if (!svgContent.endsWith(SVG_ENDING_CONTENT)) {
    throw new Error(`SVG ending unexpected [${spriteName}] [${svgContent}]`)
  }
  svgContent = svgContent.substring(SVG_STARTING_CONTENT.length)
  return svgContent.substring(0, svgContent.length - SVG_ENDING_CONTENT.length)
}

function spriteConstant(nameEnum, spriteName, content) {
  let svgContent = simplifySvG(content, spriteName)
  return `  [${nameEnum}.${constantName(spriteName)}, '${svgContent}'],`
}

const monochromeFileContent = []
monochromeFileContent.push("export const enum MonochromeSpriteName {")
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
fs.writeFileSync("common/front/sprites/monochrome-sprite-content.ts", monochromeFileContent.join("\n"))

const colorFileContent = []
colorFileContent.push("export const enum ColorSpriteName {")
for (const spriteName of SPRITES_COLORS) {
  colorFileContent.push(`  ${constantName(spriteName)},`)
}
colorFileContent.push("}")
colorFileContent.push("")
colorFileContent.push("export const ColorSpriteContent = new Map<ColorSpriteName, string>([")
for (const spriteName of SPRITES_COLORS) {
  let content = canonizeYellow(commonProcess(spriteName))
  colorFileContent.push(spriteConstant("ColorSpriteName", spriteName, content))
}
colorFileContent.push("])")
fs.writeFileSync("common/front/sprites/color-sprite-content.ts", colorFileContent.join("\n"))

const ICONS_STARTING_CONTENT = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" '

const editorIconsContent = []
editorIconsContent.push("export const enum DefaultIconsName {")
for (const iconName of EDITOR_ICONS) {
  editorIconsContent.push(`  ${constantName(iconName)} = '${iconName}',`)
}
editorIconsContent.push("}")
editorIconsContent.push("")

editorIconsContent.push("export const DefaultIcons = new Map<string, string>([")
for (const iconName of EDITOR_ICONS) {
  const sourcePath = `node_modules/@shoelace-style/shoelace/cdn/assets/icons/${iconName}.svg`
  console.info(sourcePath)
  let svgContent = fs.readFileSync(sourcePath, { encoding: "utf8" }).replaceAll("\n", "")
  if (!svgContent.startsWith(ICONS_STARTING_CONTENT)) {
    throw new Error(`SVG beginning unexpected [${iconName}] [${svgContent}]`)
  }
  if (!svgContent.endsWith(SVG_ENDING_CONTENT)) {
    throw new Error(`SVG ending unexpected [${iconName}] [${svgContent}]`)
  }
  svgContent = svgContent.substring(ICONS_STARTING_CONTENT.length)
  svgContent = svgContent.substring(0, svgContent.length - SVG_ENDING_CONTENT.length)

  editorIconsContent.push(`  [DefaultIconsName.${constantName(iconName)}, '${svgContent}'],`)
}
editorIconsContent.push("])")
fs.writeFileSync("common/front/icons/default-icons.ts", editorIconsContent.join("\n"))

const customMonochromeIconsContent = []
customMonochromeIconsContent.push("export const enum MonochromeCustomIconsName {")
for (const iconName of CUSTOM_ICONS_MONOCHROMES) {
  customMonochromeIconsContent.push(`  ${constantName(iconName)} = '${iconName}',`)
}
customMonochromeIconsContent.push("}")
customMonochromeIconsContent.push("")
customMonochromeIconsContent.push("export const MonochromeCustomIcons = new Map<string, string>([")
for (const iconName of CUSTOM_ICONS_MONOCHROMES) {
  const sourcePath = `assets/icons/${iconName}.svg`
  let svgContent = canonizeBlack(fs.readFileSync(sourcePath, { encoding: "utf8" }).replaceAll("\n", ""))
  svgContent = simplifySvG(svgContent, iconName)
  customMonochromeIconsContent.push(`  [MonochromeCustomIconsName.${constantName(iconName)}, '${svgContent}'],`)
}
customMonochromeIconsContent.push("])")
fs.writeFileSync("common/front/icons/monochrome-custom-icons.ts", customMonochromeIconsContent.join("\n"))


const customColorIconsContent = []
customColorIconsContent.push("export const enum ColorCustomIconsName {")
for (const iconName of CUSTOM_ICONS_COLORS) {
  customColorIconsContent.push(`  ${constantName(iconName)} = '${iconName}',`)
}
customColorIconsContent.push("}")
customColorIconsContent.push("")
customColorIconsContent.push("export const ColorCustomIcons = new Map<string, string>([")
for (const iconName of CUSTOM_ICONS_COLORS) {
  const sourcePath = `assets/icons/${iconName}.svg`
  let svgContent = canonizeYellow(canonizeBlack(fs.readFileSync(sourcePath, { encoding: "utf8" }).replaceAll("\n", "")))
  svgContent = simplifySvG(svgContent, iconName)
  customColorIconsContent.push(`  [ColorCustomIconsName.${constantName(iconName)}, '${svgContent}'],`)
}
customColorIconsContent.push("])")
fs.writeFileSync("common/front/icons/color-custom-icons.ts", customColorIconsContent.join("\n"))
