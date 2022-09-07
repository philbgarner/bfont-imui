import { createCanvas, Image as canvasImage } from 'canvas'
import fs from 'fs'
import fontCodepage437 from './fonts/default.json' assert {type: 'json'}
import codelist from './codepage.js'

let fonts = {}

function LoadDefaultFonts() {
    fonts.default = LoadFromJSON(fontCodepage437)
}

function Fonts(name) {
    if (Object.keys(fonts).length === 0) {
        LoadDefaultFonts()
    }
    if (!name) {
        return fonts
    } else {
        return fonts[name]
    }
}

let canvasEl = null

function base64(file) {
    return Buffer.from(fs.readFileSync(file)).toString('base64')
}

function ColourLerpRgb(colour1, colour2, t) {
    return {
        r: parseInt(colour1.r + (colour2.r - colour1.r) * t),
        g: parseInt(colour1.g + (colour2.g - colour1.g) * t),
        b: parseInt(colour1.b + (colour2.b - colour1.b) * t),
        a: colour1.a
    }
}

function HexToRgba(hex) {
    if (hex.length === 7) {
        hex += 'ff'
    } else if (hex.length === 8) {
        hex += '0'
    }
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: parseInt(result[4], 16)
    } : null;
  }

function RgbaToHex(rgb) {
    let r = parseInt(rgb.r).toString(16)
    let g = parseInt(rgb.g).toString(16)
    let b = parseInt(rgb.b).toString(16)
    let a = parseInt(rgb.a).toString(16)
    
    r = r.length === 1 ? '0' + r : r
    g = g.length === 1 ? '0' + g : g
    b = b.length === 1 ? '0' + b : b
    a = a.length === 1 ? '0' + a : a
    return `#${r}${g}${b}${a}`
}

function Generate437(fileOut) {
    Codepage437toJSON('./fonts/Codepage-437.png').then((data) => {
        fs.writeFileSync(fileOut, JSON.stringify(data))
    })
}

function GenerateBlankCodepage(fileIn, max_y) {
    Codepage437toJSON('./src/fonts/' + fileIn, max_y).then((data) => {
        let file = fileIn.split('.')
        fs.writeFileSync(file[0] + '.json', JSON.stringify(data))
    })
}

function Codepage437toJSON(bitmapFilename, max_y) {
    max_y = max_y ? max_y : 128
    return new Promise((resolve, reject) => {
        try {
            let sx = 0      // Source X
            let sy = 0      // Source Y
            let cw = 9      // Character Width
            let ch = 16     // Character Height

            let codepage = []
            let imagedata = base64(bitmapFilename)
        
            for (let code = 0; code < 256; code++) {
                let codeitem = codelist.filter(f => f.codenumber === code)
                if (codeitem.length > 0) {
                    codeitem[0].rect = { x: sx, y: sy, w: cw, h: ch }
                    codepage.push(codeitem[0])
                }
                sx += cw
                if (sx >= 288) {
                    sx = 0
                    if (max_y && sy + ch < max_y) {
                        sy += ch
                    }
                }
                
                if (sy >= 127) {
                    sy = 0
                }
            }
            resolve({cwidth: cw, cheight: ch, codepage: codepage, imagedata: imagedata})
        }
        catch (e) {
            reject(e)
        }
    })
}

/**
 * Draws the specified text on the canvas.
 * 
 * @param {object} ctx 2d context from canvas element.
 * @param {number} x Left location for text.
 * @param {number} y Top location for text
 * @param {string} text Text to be drawn on canvas.
 * @param {string} colour Colour to use (white if undefined).
 * @param {object} font Font to use (default DOS codepage 437 font if undefined).
 * @param {object} effects Any effects and parameters to apply when rendering this text.
 */
function DrawText(ctx, x, y, text, colour, font, effects) {
    effects = effects ? effects : {}

    if (!font && Object.keys(fonts).length > 0) {
        font = fonts.default
    } else if (!font) {
        throw new Error('Font parameter empty and default fonts are not loaded.')
    }
    if (!colour) {
        colour = '#ffffffff'
    }

    if (!font || !font.codepage || !font.imagedata || !font.image || !font.cwidth || !font.cheight) {
        throw new Error('Invalid font or font not loaded.')
    }

    let textwidth = font.cwidth * text.length
    let textheight = font.cheight

    if (!canvasEl) {
        try {
            canvasEl = document.createElement('canvas')
        } catch {
            canvasEl = createCanvas(textwidth, textheight)
        }
    }
    canvasEl.width = textwidth
    canvasEl.height = textheight
    let fontctx = canvasEl.getContext('2d')
    fontctx.clearRect(0, 0, textwidth, textheight)
    
    let dx = 0
    for (let t in text) {
        let glyph = font.codepage.filter(f => f.symbol === text[t])
        var rect = glyph.length > 0 ? glyph[0].rect : null
        if (rect) {
            fontctx.drawImage(font.image, rect.x, rect.y, rect.w, rect.h, dx, 0, rect.w, rect.h)
            dx += rect.w
        } else {
            console.log('Error finding value in codepage for', text[t], `(${text[t].charCodeAt(0)})`)
            return
        }
    }
    textwidth = dx
    var imageData = fontctx.getImageData(0, 0, textwidth, rect.h)
    var pixels = imageData.data

    let colr = HexToRgba(colour)
    for (let py = 0; py < textheight; py++) {
        for (let px = 0; px < textwidth; px++) {
            let pixel = GetPixelAtRgba(pixels, px, py, textwidth, textheight)
            if (Object.keys(effects).length > 0) {
                let setDefaultPixel = true
                if (effects.gradient && pixel && pixel.a > 0) {
                    let vertical = effects.gradient.horizontal ? false : true
                    let t = vertical ? py / textheight : px / textwidth
                    let gradientColour = HexToRgba(effects.gradient.colour ? effects.gradient.colour : '#ffffffff')
                    let lerpColr = ColourLerpRgb(colr, gradientColour, t)
                    SetPixelAtRgba(pixels, RgbaToHex(lerpColr), px, py, textwidth, textheight)
                    setDefaultPixel = false
                }
                if (pixel && pixel.a > 0 && setDefaultPixel) {
                    SetPixelAtRgba(pixels, colour, px, py, textwidth, textheight)
                }
            } else {
                if (pixel && pixel.a > 0) {
                    SetPixelAtRgba(pixels, colour, px, py, textwidth, textheight)
                }
            }
        }
    }

    fontctx.clearRect(0, 0, textwidth, textheight)
    if (effects.background) {
        ctx.fillStyle = effects.background.colour
        ctx.fillRect(x, y, textwidth, textheight)
    }
    fontctx.putImageData(imageData, 0, 0)
    ctx.drawImage(canvasEl, 0, 0, textwidth, rect.h, x, y, textwidth, textheight)
    return { x: x, y: y, w: textwidth, h: textheight }
}

function SetPixelAtRgba(pixels, colour, x, y, pixelswidth, pixelsheight) {
    colour = HexToRgba(colour ? colour : '#00000000')
    let offset = (x + pixelswidth * y) * 4
    if (offset < 0 || offset >= pixels.length) {
        return false
    }
    pixels[offset] = colour.r
    pixels[offset + 1] = colour.g
    pixels[offset + 2] = colour.b
    pixels[offset + 3] = colour.a
    
    return true
}

function GetPixelAtRgba(pixels, x, y, pixelswidth, pixelsheight) {
    let offset = (x + pixelswidth * y) * 4
    if (offset < 0 || offset >= pixels.length) {
        return false
    }
    return { r: pixels[offset], g: pixels[offset + 1], b: pixels[offset + 2], a: pixels[offset + 3] }
}

function LoadFromJSON(font) {
    try {
        if (typeof font === 'string') {
            font = JSON.parse(font)
        }
        
        try {
            font.image = new canvasImage()
        } catch {
            font.image = new Image()
        }
        font.image.src = 'data:image/png;base64,' + font.imagedata
        return font
    } catch (e) {
        throw new Error(e)
    }
}

function LoadFromFile(filename) {
    try {
        let data = fs.readFileSync(filename).toString()
        return LoadFromJSON(data)
    } catch (e) {
        reject(e)
    }
}

export { DrawText, LoadFromJSON, LoadFromFile, Generate437, LoadDefaultFonts, Fonts, GenerateBlankCodepage }