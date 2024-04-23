export default {
    entryPoints: [
        {out: 'editor', in: 'src/editor.ts'},
        {out: 'index', in: 'src/index.html'},
        {out: 'assets/icons/check2-circle', in: 'node_modules/@shoelace-style/shoelace/cdn/assets/icons/check2-circle.svg'},
        {out: 'assets/icons/exclamation-triangle', in: 'node_modules/@shoelace-style/shoelace/cdn/assets/icons/exclamation-triangle.svg'},
        {out: 'assets/icons/plus-circle', in: 'node_modules/@shoelace-style/shoelace/cdn/assets/icons/plus-circle.svg'},
        {out: 'assets/icons/trash', in: 'node_modules/@shoelace-style/shoelace/cdn/assets/icons/trash.svg'},
    ],
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
    },
    target: [
        'es2015'
    ]
};
