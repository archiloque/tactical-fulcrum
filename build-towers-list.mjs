import fs from "fs"
import path from "path"

const candidates = fs
  .readdirSync("towers")
  .filter((fileName) => path.parse(fileName).ext === ".json")
  .filter((fileName) => fileName !== "tower-schema.json")

function sortTowers(t1, t2) {
  const t1Splited = t1.split("-").map((i) => parseInt(i))
  const t2Splited = t2.split("-").map((i) => parseInt(i))
  if (t1[0] > t2[0]) {
    return -1
  } else if (t1[0] < t2[0]) {
    return 1
  } else if (t1[1] > t2[1]) {
    return -1
  } else if (t1[1] < t2[1]) {
    return 1
  } else {
    return 0
  }
}

candidates.sort((t1, t2) => sortTowers(t1, t2))

console.info(candidates)
const fileContent = []
fileContent.push('import { TowerInfo } from "./tower-info"')
fileContent.push("")
fileContent.push("export const TOWERS : TowerInfo[] = [")
for (const level of candidates) {
  const levelData = JSON.parse(fs.readFileSync(`towers/${level}`))
  fileContent.push(`  new TowerInfo("${level}", "${levelData["name"]}"),`)
}
fileContent.push("]")
fs.writeFileSync("game/towers/towers.ts", fileContent.join("\n"))
