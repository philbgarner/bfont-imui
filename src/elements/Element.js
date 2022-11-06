import { createCanvas } from 'canvas'

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
        
        this.wrap = params.wrap ? params.wrap : ''

        this.font = params.font ? params.font : null

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

        this.buffer = null
        if (params.drawBuffer) {
            this.InitializeBuffer()
        }
    }

    InitializeBuffer(margin) {
        let mx = 0, my = 0
        if (margin) {
            mx = margin.x
            my = margin.y
            this.margin = margin
        } else {
            this.margin = { x: 0, y: 0 }
        }
        try {
            this.buffer = document.createElement('canvas')
            this.buffer.width = this.rect.w + mx
            this.buffer.height = this.rect.h + my
            this.bufferCtx = this.buffer.getContext('2d')
        } catch {
            this.buffer = createCanvas(this.rect.w + mx, this.rect.h + my)
            this.bufferCtx = this.buffer.getContext('2d')
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
        let r = rect ? rect : this.rect
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

    Update(imui, eventHandled) {
        let evt = false
        if (this.autosize) {
            this.rect.w = this.text.length * imui.font.cwidth
            this.rect.h = imui.font.cheight
        }
        if (this.state.clicked && this.id !== imui.active) {
            imui.active = this.id
            this.setState({ changed: true })
            evt = true
        }
        if (imui.mousePos.x >= this.rect.x && imui.mousePos.y >= this.rect.y && imui.mousePos.x <= this.rect.x + this.rect.w && imui.mousePos.y <= this.rect.y + this.rect.h) {
            if (this.state.mouseOver && this.state.clicked) {
                this.setState({ mouseOver: true, clicked: false})
                evt = true
            } else if (!eventHandled) {
                this.setState({ mouseOver: true })
                evt = true
            }
            if (imui.mouseButton > 0 && !this.state.mouseDown) {
                this.setState({ mouseDown: true })
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
            if (line.length * font.cwidth > w) {
                w = line.length * font.cwidth
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

    DrawText(imui, font, rect) {
        let textcolor = this.color
        if (this.id === imui.active) {
            textcolor = this.highlight ? this.highlight : textcolor
        }
        let txt = this.text

        font = font ? font : bfontjs.Fonts().default
        if (this.GetMaxTextWidth(font, txt) > this.rect.w) {
            if (this.wrap === 'clip') {
                let rectCharWidth = Math.floor(this.rect.w / font.cwidth)
                txt = txt.substring(0, rectCharWidth)
            } else if (this.wrap === 'ellipses') {
                let rectCharWidth = Math.floor(this.rect.w / font.cwidth)
                txt = txt.substring(0, rectCharWidth - 3)
                txt += '...'
            } else if (this.wrap === 'wrap') {
                txt = this.GetWrappedText(font, txt, this.rect)
            } else if (this.wrap === 'word-wrap') {
                txt = this.GetWordWrappedText(font, txt, this.rect)
            }
    }
        imui.DrawTextFont(font, rect.x, rect.y, txt, textcolor)
    }

    _Draw(imui, rect) {
        if (this.bgcolor) {
            imui.DrawRect(rect, this.bgcolor)
        }

        this.DrawText(imui, imui.font, rect)
    }

    Draw(imui) {
        let rect = this.rect
        if (this.buffer) {
            imui.ChangeContext(this.buffer)
            rect = { x: 0, y: 0, w: this.rect.w, h: this.rect.h }

            if (this.DidChangeState() || (!this.initialDrawComplete)) {
                if (this.buffer) {
                    this.bufferCtx.clearRect(0, 0, rect.w, rect.h)
                }
                
                this._Draw(imui, rect)
                this.initialDrawComplete = true
            }

            imui.ResetContext()
            imui.ctx.drawImage(this.buffer, this.rect.x, this.rect.y)
        } else {
            this._Draw(imui, this.rect)
        }
    }
}

export default Element
