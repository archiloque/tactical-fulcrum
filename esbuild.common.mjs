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

export default function createConfig(entity) {
  let entryPoints = createEntryPoints("node_modules/@shoelace-style/shoelace/dist/themes", "themes", ".css").concat(
    createEntryPoints("assets/fonts", "fonts"),
  )
  if (entity === "game") {
    entryPoints = entryPoints
      .concat([
        { out: "game", in: "game/game.ts" },
        { out: "index", in: "game/index.html" },
      ])
      .concat(createEntryPoints("towers", "towers", ".json"))
  } else {
    entryPoints = entryPoints.concat([
      { out: "editor", in: "editor/editor.ts" },
      { out: "index", in: "editor/index.html" },
    ])
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
