#!/usr/bin/env node

import * as esbuild from 'esbuild'
import {copy} from 'esbuild-plugin-copy'

const config = {
    entryPoints: ['src/editor.ts', 'src/index.html'],
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: 'out',
    logLevel: 'debug',
    loader: {'.ttf': 'copy', '.woff2': 'copy', '.html': 'copy'},
    plugins: [
        copy({
            assets: {
                from: './node_modules/@shoelace-style/shoelace/dist/assets/icons/*',
                to: './out/assets/icons',
            },
            watch: true,
        })
    ],
};

const context = await esbuild.context(config);
await context.watch();
