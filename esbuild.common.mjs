import fs from "fs"
import path from "path"

const editorIcons = [
  "arrow-up",
  "arrow-down",
  "check2-circle",
  "exclamation-triangle",
  "exclamation-octagon",
  "plus-circle",
  "trash",
]

const fonts = [
  "JetBrainsMono-Medium.woff2",
  "JetBrainsMonoNL-Regular.ttf",
]

const themes = ["light", "dark"]

const sprites = fs.readdirSync("assets/sprites/out").filter((s) => path.extname(s) === ".svg")

const entryPoints = [
  { out: "game/game", in: "game/game.ts" },
  { out: "game/index", in: "game/index.html" },
  { out: "editor/editor", in: "editor/editor.ts" },
  { out: "editor/index", in: "editor/index.html" },
]
  .concat(
    editorIcons.map((icon) => {
      return {
        out: `editor/assets/icons/${icon}`,
        in: `node_modules/@shoelace-style/shoelace/cdn/assets/icons/${icon}.svg`,
      }
    }),
  )
  .concat(
    themes.map((theme) => {
      return {
        out: `editor/themes/${theme}`,
        in: `node_modules/@shoelace-style/shoelace/dist/themes/${theme}.css`,
      }
    }),
  )
  .concat(
    themes.map((theme) => {
      return {
        out: `game/themes/${theme}`,
        in: `node_modules/@shoelace-style/shoelace/dist/themes/${theme}.css`,
      }
    }),
  )
  .concat(
    sprites.map((asset) => {
      return {
        out: `editor/sprites/${path.parse(asset).name}`,
        in: `assets/sprites/out/${asset}`,
      }
    }),
  )
  .concat(
    sprites.map((asset) => {
      return {
        out: `game/sprites/${path.parse(asset).name}`,
        in: `assets/sprites/out/${asset}`,
      }
    }),
  )
  .concat(
    fonts.map((asset) => {
      return {
        out: `editor/fonts/${path.parse(asset).name}`,
        in: `assets/fonts/${asset}`,
      }
    }))
  .concat(
    fonts.map((asset) => {
      return {
        out: `game/fonts/${path.parse(asset).name}`,
        in: `assets/fonts/${asset}`,
      }
    }),
  )

export default {
  entryPoints: entryPoints,
  external: [
    "fonts/JetBrainsMonoNL-Regular.ttf",
    "fonts/JetBrainsMono-Medium.woff2",
  ],
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: "out",
  logLevel: "debug",
  loader: {
    ".html": "copy",
    ".svg": "copy",
    ".ttf": "copy",
    ".woff2": "copy",
    ".png": "copy",
    ".json": "copy",
  },
  target: ["es2015"],
}
