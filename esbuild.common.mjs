export default {
    entryPoints: ['src/editor.ts', 'src/index.html', 'src/editor.css', 'src/assets/JetBrainsMono-Regular.ttf'],
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: 'out',
    logLevel: 'debug',
    loader: {'.ttf': 'copy', '.html': 'copy'},
};
