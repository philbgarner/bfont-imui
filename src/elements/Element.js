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

        this.elements = []

        this.buffer = null
        if (params.drawBuffer) {
            this.InitializeBuffer()
        }
    }

    InitializeBuffer(margin) {
        console.log('initializebuffer', margin)
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

    Update(imui) {
        if (this.autosize) {
            this.rect.w = this.text.length * imui.font.cwidth
            this.rect.h = imui.font.cheight
        }
        if (imui.mousePos.x >= this.rect.x && imui.mousePos.y >= this.rect.y && imui.mousePos.x <= this.rect.x + this.rect.w && imui.mousePos.y <= this.rect.y + this.rect.h) {
            if (this.state.mouseOver && this.state.clicked) {
                this.setState({ mouseOver: true, clicked: false})
            } else {
                this.setState({ mouseOver: true })
            }
            if (imui.mouseButton > 0 && !this.state.mouseDown) {
                this.setState({ mouseDown: true })
            }
            if (imui.mouseButton === 0 && this.prevState.mouseDown) {
                this.setState({ mouseUp: true, mouseDown: false })
            } else if (imui.mouseButton === 0 && this.state.mouseUp) {
                this.setState({ mouseUp: false, clicked: true })
                imui.active = this.id
            }
        } else {
            this.setState({ mouseOver: false, mouseDown: false, mouseUp: false, clicked: false })
        }
        if (this.text !== this.prevText) {
            this.setState({ change: true })
            this.prevText = this.text
        } else {
            this.setState({ change: false })
        }        
        if (this.state.clicked && this.id !== imui.active) {
            imui.active = this.id
            this.setState({ changed: true })
        }

        for (let e in this.elements) {
            this.elements[e].Update(imui)
        }
    }

    _Draw(imui, rect) {
        if (this.bgcolor) {
            imui.DrawRect(rect, this.bgcolor)
        }

        let textcolor = this.color
        if (this.id === imui.active) {
            textcolor = this.highlight ? this.highlight : textcolor
        }

        imui.DrawText(rect.x, rect.y, this.text, textcolor)
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
