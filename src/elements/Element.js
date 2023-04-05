import { createCanvas } from 'canvas'
import { BezierBlend, updateDelay } from '../imui.js'

class Element {
    constructor(params) {
        if (!params.id) {
            throw new Error('Element must have unique id.')
        }
        this.id = params.id

        this.autosize = params.autosize ? params.autosize : true
        if (params.rect) {
            this.autosize = false
        }
        this.rect = params.rect ? params.rect : { x: 0, y: 0, w: 0, h: 0 }
        this.color = params.color ? params.color : '#ccccccff'
        this.bgcolor = params.bgcolor ? params.bgcolor : undefined
        this.text = params.text ? params.text : ''
        this.prevText = this.text

        this.anim = params.anim ? params.anim : null
        
        this.wrap = params.wrap ? params.wrap : ''

        this.font = params.font ? params.font : imui.font

        this.rect.x = params.x ? params.x : this.rect.x
        this.rect.y = params.y ? params.y : this.rect.y

        this.state = {
            clicked: false,
            mouseOver: false,
            mouseDown: false,
            mouseUp: false,
            change: true
        }
        this.prevState = params.prevState ? params.prevState :
            {
                clicked: false,
                mouseOver: false,
                mouseDown: false,
                mouseUp: false,
                change: false
            }

    }

    DidChangeState() {
        return this.prevState.clicked !== this.state.clicked ||
            this.prevState.mouseOver !== this.state.mouseOver ||
            this.prevState.mouseDown !== this.state.mouseDown ||
            this.prevState.mouseUp !== this.state.mouseUp ||
            this.prevState.change !== this.state.change
    }

    BuildPreviousState() {
        return {
            clicked: this.state.clicked,
            mouseOver: this.state.mouseOver,
            mouseDown: this.state.mouseDown,
            mouseUp: this.state.mouseUp,
            change: this.state.change
        }
    }

    InsideRect(x, y, rect) {
        let r = rect ? rect : this.Rect()
        return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h
    }

    Clicked() { return this.state.clicked }
    Hover() { return this.state.mouseOver }
    MouseDown() { return this.state.mouseDown }
    MouseUp() { return this.state.mouseUp }

    setState(params) {
        this.prevState = this.BuildPreviousState()
        for (let p in params) {
            this.state[p] = params[p]
        }
    }

    Rect() {
        let rect = {
            x: this.rect.x,
            y: this.rect.y,
            w: this.rect.w,
            h: this.rect.h
        }
        if (this.parent) {
            rect.x += this.parent.Rect().x
            rect.y += this.parent.Rect().y
        }
        return rect
    }

    Update(imui, eventHandled) {
        let evt = false
        //let cfont = this.font ? this.font : imui.font
        // if (this.autosize) {
        //     this.Rect().w = this.text.length * cfont.cwidth
        //     this.Rect().h = cfont.cheight
        //     if (this.text && this.text.length > 0) {
        //         this.Rect().h = cfont.cheight * this.text.split('\n').length
        //     }
        // }
        if (this.state.clicked && this.id !== imui.active) {
            imui.active = this.id
            this.setState({ changed: true })
            evt = true
        }
        if (imui.mousePos.x >= this.Rect().x && imui.mousePos.y >= this.Rect().y && imui.mousePos.x <= this.Rect().x + this.Rect().w && imui.mousePos.y <= this.Rect().y + this.Rect().h) {
            if (this.state.mouseOver && this.state.clicked) {
                this.setState({ mouseOver: true, clicked: false})
                evt = true
            } else if (!eventHandled) {
                this.setState({ mouseOver: true })
                evt = true
            }
            if (imui.mouseButton > 0 && !this.state.mouseDown) {
                this.setState({ mouseDown: true, mouseButton: imui.mouseButton })
                evt = true
            } else if (imui.mouseButton === 0 && this.prevState.mouseDown) {
                this.setState({ mouseUp: true, mouseDown: false })
                evt = true
            }
        } else {
            this.setState({ mouseOver: false, mouseDown: false, mouseUp: false, clicked: false })
        }
        if (imui.mouseButton === 0 && this.state.mouseUp) {
            this.setState({ mouseUp: false, clicked: true })
            imui.active = this.id
            evt = true
        }
        if (this.text !== this.prevText) {
            this.setState({ change: true })
            this.prevText = this.text
        } else {
            this.setState({ change: false })
        }        
        
        // anim: {
        //     curve: 'bezier',
        //     duration: 1000,
        //     params: {
        //         x: 0, y: 400
        //     }
        if (this.anim) {
            if (this.anim.curve === 'bezier') {
                this.anim.elapsed = this.anim.elapsed === undefined ? 0 : this.anim.elapsed
                for (let param in this.anim.params) {
                    let startVal = this.anim.params[param]
                    this.anim.destination = this.anim.destination ? this.anim.destination : {}
                    if (param === 'x' || param === 'y' || param === 'w' || param === 'h') {
                        this.anim.destination[param] = this.anim.destination[param] !== undefined ? this.anim.destination[param] : this.rect[param]
                        if (this.anim.destination[param] > startVal) {
                            this.rect[param] = parseInt(startVal + (this.anim.destination[param] - startVal) * BezierBlend(this.anim.elapsed / this.anim.duration))
                        } else {
                            this.rect[param] = parseInt(startVal - (startVal - this.anim.destination[param]) * BezierBlend(this.anim.elapsed / this.anim.duration))
                        }
                        
                    }
                    
                }
                this.anim.elapsed += updateDelay
                if (this.anim.elapsed >= this.anim.duration) {

                    for (let param in this.anim.params) {
                        if (param === 'x' || param === 'y' || param === 'w' || param === 'h') {
                            this.rect[param] = this.anim.destination[param]
                        }                        
                    }

                    if (this.anim.onComplete) {
                        this.anim.onComplete(this)
                    }
                    this.anim = null
                }
            }
        }
        return evt
    }

    GetMaxTextWidth(font, txt) {
        let lines = []
        try {
            if (typeof txt === 'number') {
                txt = font.codepage.filter(f => f.codenumber === txt)[0].symbol
            }
            lines = txt.split('\n')
        } catch (e) {
            console.log('Error splitting txt parameters: ', e, ' typeof txt =', typeof txt)
        }
        let w = 0
        for (let l in lines) {
            let line = lines[l]
            let lineLen = 0
            for (let c in line) {
                let char = font.codepage.filter(f => f.symbol === line[c])
                if (char.length > 0) {
                    if (char[0].rect) {
                        lineLen += char[0].rect.w
                    }
                }
            }
            if (lineLen > w) {
                w = lineLen
            }
        }
        return w
    }

    GetWrappedText(font, txt, rect) {
        let lines = txt.split('\n')
        let wrapPos = parseInt(rect.w / font.cwidth)
        let c = 0
        while (this.GetMaxTextWidth(font, lines.join('\n')) >= rect.w && c <= 100) {
            let newLines = []
            for (let l in lines) {
                let lineWidth = lines[l].length * font.cwidth
                if (lineWidth > rect.w) {
                    newLines.push(lines[l].slice(0, wrapPos).trim(),
                                    lines[l].slice(wrapPos, lines[l].length).trim())
                } else {
                    newLines.push(lines[l])
                }
            }
            lines = newLines
            c++
        }
        return lines.join('\n')
    }

    GetWordWrappedText(font, txt, rect) {
        let lines = txt.split('\n')
        let wrapPos = parseInt(rect.w / font.cwidth)
        let c = 0
        while (this.GetMaxTextWidth(font, lines.join('\n')) >= rect.w && c <= 100) {
            let newLines = []
            for (let l in lines) {
                let lineWidth = lines[l].length * font.cwidth
                if (lineWidth > rect.w) {
                    // newLines.push(lines[l].slice(0, wrapPos).trim(),
                    //                 lines[l].slice(wrapPos, lines[l].length).trim())
                    let line = lines[l].substring(0, wrapPos).split('').reverse().join('')
                    let index = line.search(/\s/)
                    newLines.push(lines[l].slice(0, wrapPos - index).trim(),
                                        lines[l].slice(wrapPos - index, lines[l].length).trim())
                } else {
                    newLines.push(lines[l])
                }
            }
            lines = newLines
            c++
        }
        return lines.join('\n')
    }

    DoTextWrap(font) {
        let txt = this.text ? this.text : ''

        font = font ? font : bfontjs.Fonts().default
        if (this.GetMaxTextWidth(font, txt) > this.Rect().w) {
            if (this.wrap === 'clip') {
                let rectCharWidth = Math.floor(this.Rect().w / font.cwidth)
                txt = txt.substring(0, rectCharWidth)
            } else if (this.wrap === 'ellipses') {
                let rectCharWidth = Math.floor(this.Rect().w / font.cwidth)
                txt = txt.substring(0, rectCharWidth - 3)
                txt += '...'
            } else if (this.wrap === 'wrap') {
                txt = this.GetWrappedText(font, txt, this.Rect())
            } else if (this.wrap === 'word-wrap') {
                txt = this.GetWordWrappedText(font, txt, this.Rect())
            }
        }
        txt = typeof txt === 'string' ? txt : ''
        let wid = this.GetMaxTextWidth(font, txt)
        let hgt = txt.split('\n').length * font.cheight
        let ret = { text: txt, w: wid > this.Rect().w ? wid : this.Rect().w, h: hgt > this.Rect().h ? hgt : this.Rect().h }
        // if (this.autosize) {
        //     this.rect = ret
        // }
        return ret
    }

    DrawText(imui, font, rect) {
        let textcolor = this.color
        if (this.id === imui.active) {
            textcolor = this.highlight ? this.highlight : textcolor
        }
        let wrap = this.DoTextWrap(font)
        imui.DrawTextFont(font, rect.x, rect.y, wrap.text, textcolor)
        rect.h = wrap.h
        rect.w = wrap.w
    }

    _Draw(imui, rect) {
        if (this.bgcolor) {
            imui.DrawRect(rect, this.bgcolor)
        }
        let cfont = this.font ? this.font : imui.font
        this.DrawText(imui, cfont, rect)
    }

    Draw(imui) {
        let ctx = imui.ctx
        ctx.save()
        if (this.parent) {
            ctx.beginPath()
            ctx.rect(this.parent.Rect().x, this.parent.Rect().y, this.parent.Rect().w, this.parent.Rect().h)
            ctx.closePath()
            ctx.clip()
        }
        this._Draw(imui, this.Rect())
        ctx.restore()
    }

    Animate(duration, fromRect, toRect, onComplete) {
        this.anim = {
            curve: 'bezier',
            duration: duration,
            params: fromRect,
            onComplete: onComplete
        }
        this.rect = toRect
    }
}

export default Element
