import fs from 'fs'
import path from 'path'

const icons = [
    'arrow-up',
    'arrow-down',
    'check2-circle',
    'exclamation-triangle',
    'plus-circle',
    'trash',
]

const themes = [
    'light',
    'dark'
]

const sprites = fs
    .readdirSync('src/assets/sprites')
    .filter((s) => path.extname(s) === '.svg')

const entryPoints = [
    {out: 'editor', in: 'src/editor.ts'},
    {out: 'index', in: 'src/index.html'},
].concat(icons.map((icon) => {
            return {
                out: `assets/icons/${icon}`,
                in: `node_modules/@shoelace-style/shoelace/cdn/assets/icons/${icon}.svg`,
            }
        }
    )
).concat(themes.map((theme) => {
            return {
                out: `assets/theme/${theme}`,
                in: `node_modules/@shoelace-style/shoelace/dist/themes/${theme}.css`,
            }
        }
    )
).concat(sprites.map((asset) => {
            return {
                out: `assets/sprites/${path.parse(asset).name}`,
                in: `src/assets/sprites/${asset}`,
            }
        }
    )
)

export default {
    entryPoints: entryPoints,
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: 'out',
    logLevel: 'debug',
    loader: {
        '.html': 'copy',
        '.svg': 'copy',
        '.ttf': 'copy',
        '.woff2': 'copy',
        '.png': 'copy',
        '.json': 'copy',
    },
    target: [
        'es2015'
    ]
};
