import fs from 'fs'
import { createCanvas } from 'canvas'
import { DrawText, Fonts } from './src/bfontjs.js'

const width = 712;
const height = 128;

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

context.fillStyle = '#00c';
context.fillRect(0, 0, width, height);

const args = process.argv.slice(2)
let testText = 'ABCDEFGHIJKLabcdefghijkl'
if (args[0]) {
    testText = args[0]
}

let fonts = Fonts()
if (args[1]) {
    var font = fonts[args[1]]
    if (!font) {
        let keylist = Object.keys(Fonts())
        if (keylist.length > 0) {
            var suggestion = `\nOr specify a prebuilt font from this list: ${keylist.reduce((prev, curr) => prev + ',' + curr)}`
        }
        throw new Error(`Error: Specified font "` + args[1] + `" does not exist in the list of preloaded fonts.  Did you mean to load your font using LoadFromJSON()?.${suggestion}`)
    }
}

DrawText(context, 10, 8, testText, '#ffffffff', font)

DrawText(context, 10, 28, `Background ${testText}`, '#ffffffff', font, {
    background: {
        colour: '#0000009a'
    }
})

DrawText(context, 10, 48, `Gradient ${testText}`, '#ff0000ff', font, {
    gradient: {
        colour: '#ffff00ff'
    }
})

DrawText(context, 10, 68, `Gradient (Horizontal) ${testText}`, '#ff0000ff', font, {
    gradient: {
        colour: '#ffff00ff',
        horizontal: true
    }
})

DrawText(context, 10, 88, `Background + Gradient (Horizontal) ${testText}`, '#ff0000ff', font, {
    gradient: {
        colour: '#ffff00ff',
        horizontal: true
    },
    background: {
        colour: '#0000009a'
    }
})

const buffer = canvas.toBuffer('image/png')
fs.writeFileSync('./testImage.png', buffer)
