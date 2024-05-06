// src/assets/punyworld-overworld-tileset.png

const icons = [
    'arrow-up',
    'arrow-down',
    'check2-circle',
    'exclamation-triangle',
    'plus-circle',
    'trash',
]

const assets = [
    'sprites.png',
    'sprites.json',
]

const themes = [
    'light',
    'dark'
]

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
).concat(assets.map((asset) => {
            return {
                out: `assets/images/${asset.split('.')[0]}`,
                in: `src/assets/${asset}`,
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
