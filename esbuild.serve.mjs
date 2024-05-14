#!/usr/bin/env node

import * as esbuild from "esbuild"
import defaultConfig from "./esbuild.common.mjs"

const context = await esbuild.context(defaultConfig)
await context.serve()
