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

export default function createConfig(entity, console) {
  let entryPoints = createEntryPoints("node_modules/@shoelace-style/shoelace/dist/themes", "themes", ".css").concat(
    createEntryPoints("assets/fonts", "fonts"),
  )
  entryPoints = entryPoints.concat([
    { out: entity, in: `${entity}/${entity}.ts` },
    { out: "index", in: `${entity}/index.html` },
  ])

  const dropLabels = []
  if (console !== true) {
    dropLabels.push("CONSOLE")
  }

  if (entity === "game") {
    entryPoints = entryPoints.concat(createEntryPoints("towers", "towers", ".json"))
  }

  return {
    entryPoints: entryPoints,
    external: ["fonts/JetBrainsMonoNL-Regular.ttf", "fonts/JetBrainsMono-Medium.woff2"],
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: `out/${entity}`,
    logLevel: "debug",
    dropLabels: dropLabels,
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
