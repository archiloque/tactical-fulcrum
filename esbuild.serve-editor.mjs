#!/usr/bin/env node

import * as esbuild from "esbuild"
import createConfig from "./esbuild.common.mjs"

const context = await esbuild.context(await createConfig("editor"))
await context.serve()
