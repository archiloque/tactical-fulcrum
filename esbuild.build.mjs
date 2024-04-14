#!/usr/bin/env node

import * as esbuild from 'esbuild'
import defaultConfig from './esbuild.common.mjs'

const result = await esbuild.build(defaultConfig);
console.log(result);
