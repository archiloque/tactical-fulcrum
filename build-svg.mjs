import fs from "fs"
import path from "path"

const MONOCHROMES = [
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

const COLORIZE = ["key", "door"]

const BLACKS = ["#000000", "#000"]

const COLOR_WHITE = "#cccccc"

const YELLOWS = ["#ffff00", "#ffff0", "#ffff0", "#ff0"]

const COLOR_DARK_YELLOW = "#9c9c00"

const COLORS_TO = {
  blue: { light: "#2563eb", dark: "#1E40AF" },
  crimson: { light: "#ff0000", dark: "#660000" },
  greenBlue: { light: "#14b8a6", dark: "#084a42" },
  platinum: { light: "#a1a1aa", dark: "#3f3f46" },
  violet: { light: "#a855f7", dark: "#44067f" },
}

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

for (const monochromes of MONOCHROMES) {
  const source = path.join(IN_DIR, `${monochromes}.svg`)
  const destLight = path.join(OUT_DIR, `${monochromes}${LIGHT_SUFFIX}.svg`)
  const destDark = path.join(OUT_DIR, `${monochromes}${DARK_SUFFIX}.svg`)
  console.info("From", source, "to", destLight)
  fs.copyFileSync(source, destLight)
  console.info("From", source, "to", destDark)
  let whitened = fs.readFileSync(source, { encoding: "utf8" })
  whiten(fs.readFileSync(source, { encoding: "utf8" }), destDark)
}

for (const colorize of COLORIZE) {
  const source = path.join(IN_DIR, `${colorize}.svg`)
  const destYellowLight = path.join(OUT_DIR, `${colorize}-yellow${LIGHT_SUFFIX}.svg`)
  const destYellowDark = path.join(OUT_DIR, `${colorize}-yellow${DARK_SUFFIX}.svg`)
  console.info("From", source, "to", destYellowLight)
  fs.copyFileSync(source, destYellowLight)
  const sourceContent = fs.readFileSync(source, { encoding: "utf8" })
  let darkContent = sourceContent
  for (const yellow of YELLOWS) {
    darkContent = darkContent.replaceAll(`${yellow};`, `${COLOR_DARK_YELLOW};`)
  }
  whiten(darkContent, destYellowDark)

  for (const [colorName, colorTo] of Object.entries(COLORS_TO)) {
    const destLight = path.join(OUT_DIR, `${colorize}-${colorName}${LIGHT_SUFFIX}.svg`)
    const destDark = path.join(OUT_DIR, `${colorize}-${colorName}${DARK_SUFFIX}.svg`)
    let colorizedLight = sourceContent
    let colorizedDark = sourceContent
    for (const yellow of YELLOWS) {
      colorizedLight = colorizedLight.replaceAll(`${yellow};`, `${colorTo.light};`)
      colorizedDark = colorizedDark.replaceAll(`${yellow};`, `${colorTo.dark};`)
    }
    console.info("From", source, "to", destLight)
    fs.writeFileSync(destLight, colorizedLight)
    console.info("From", source, "to", destDark)
    whiten(colorizedDark, destDark)
  }
}
