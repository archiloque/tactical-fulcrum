import fs from 'fs'
import path from 'path'

const AS_IS = [
    'enemy',
    'item',
    'staircase-down',
    'staircase-up',
    'starting-position',
    'wall'
]

const COLORIZE = [
    'key',
    'door'
]

const COLOR_FROM = '#ffff00'
const COLORS_TO = {
    'blue': '#2563eb',
    'crimson': '#ff0000',
    'greenBlue': '#14b8a6',
    'platinum': '#a1a1aa',
    'violet': '#a855f7',
}

const IN_DIR = 'src/assets/sprites/in'
const OUT_DIR = 'src/assets/sprites/out'

console.info('Clear', OUT_DIR)
fs.rmSync(OUT_DIR, {recursive: true, force: true});
fs.mkdirSync(OUT_DIR)

for (const asIs of AS_IS) {
    const source = path.join(IN_DIR, `${asIs}.svg`);
    const dest = path.join(OUT_DIR, `${asIs}.svg`);
    console.info('Copy', source, 'to', dest)
    fs.copyFileSync(source, dest)
}

for (const colorize of COLORIZE) {
    const source = path.join(IN_DIR, `${colorize}.svg`);
    const dest = path.join(OUT_DIR, `${colorize}-yellow.svg`);
    console.info('Copy', source, 'to', dest)
    fs.copyFileSync(source, dest)
    const sourceContent = fs.readFileSync(source, {encoding: 'utf8'})
    for(const [colorName, colorTo] of Object.entries(COLORS_TO)) {
        const targetContent = sourceContent.replace(COLOR_FROM, colorTo)
        const dest = path.join(OUT_DIR, `${colorize}-${colorName}.svg`);
        console.info('Generate', source, 'to', dest)
        fs.writeFileSync(dest, targetContent)
    }
}