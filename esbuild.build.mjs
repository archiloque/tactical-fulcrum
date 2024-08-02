#!/usr/bin/env node

import fs from "fs"
import * as esbuild from "esbuild"
import createConfig from "./esbuild.common.mjs"

console.info("Clearing dir")
fs.rmSync("out", { recursive: true, force: true })

console.info("Build game")
console.log(await esbuild.build(await createConfig("game", false)))
console.info("Build editor")
console.log(await esbuild.build(await createConfig("editor", false)))
