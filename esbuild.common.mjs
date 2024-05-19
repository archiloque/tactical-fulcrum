import fs from "fs"
import path from "path"

function createEntryPoints(fromPath, toPath, type) {
  let candidates = fs.readdirSync(fromPath)
  if (type != null) {
    candidates = candidates.filter((fileName) => path.parse(fileName).ext === type)
  }
  return candidates.map((fileName) => {
    return {
      in: `${fromPath}/${fileName}`,
      out: `${toPath}/${path.parse(fileName).name}`,
    }
  })
}

const editorIcons = [
  "arrow-up",
  "arrow-down",
  "check2-circle",
  "exclamation-triangle",
  "exclamation-octagon",
  "plus-circle",
  "trash",
]

export default function createConfig(entity) {
  let entryPoints = createEntryPoints("node_modules/@shoelace-style/shoelace/dist/themes", "themes", ".css")
    .concat(createEntryPoints("assets/sprites/out", "sprites", ".svg"))
    .concat(createEntryPoints("assets/fonts", "fonts"))
  if (entity === "game") {
    entryPoints = entryPoints.concat([
      { out: "game", in: "game/game.ts" },
      { out: "index", in: "game/index.html" },
    ])
  } else {
    entryPoints = entryPoints
      .concat([
        { out: "editor", in: "editor/editor.ts" },
        { out: "index", in: "editor/index.html" },
      ])
      .concat(
        editorIcons.map((icon) => {
          return {
            out: `assets/icons/${icon}`,
            in: `node_modules/@shoelace-style/shoelace/cdn/assets/icons/${icon}.svg`,
          }
        }),
      )
  }

  return {
    entryPoints: entryPoints,
    external: ["fonts/JetBrainsMonoNL-Regular.ttf", "fonts/JetBrainsMono-Medium.woff2"],
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: `out/${entity}`,
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
    format: "esm",
  }
}
