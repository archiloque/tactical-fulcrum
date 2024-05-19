#!/usr/bin/env node

import * as esbuild from "esbuild"
import createConfig from "./esbuild.common.mjs"

console.log(await esbuild.build(await createConfig("game")))
console.log(await esbuild.build(await createConfig("editor")))
