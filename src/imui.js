import { GetElementType } from './elements.js'

class ImUI {
    constructor(canvas, font) {
        this.canvas = canvas
        this.originalCanvas = canvas
        this.ctx = canvas.getContext('2d')
        this.originalCtx = this.ctx
        bfontjs.LoadDefaultFonts()
        this.font = font ? font : bfontjs.Fonts('default')

        this.mousePos = { x: 0, y: 0 }
        this.mouseButton = 0
        
        this.active = null
        this.elements = []
        this.postUpdateIds = []
          
        this.onUpdate = () => {
            return []
        }

        this.canvas.addEventListener('mousemove', (e) => {
            this.mousePos.x = parseInt(e.clientX * (this.canvas.width / parseInt(this.canvas.style.width)))
            this.mousePos.y = parseInt(e.clientY * (this.canvas.height / parseInt(this.canvas.style.height)))
        })

        this.canvas.addEventListener('mousedown', (e) => {
            this.mouseButton = e.buttons
        })
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouseButton = 0
        })

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault()                
            }
        })

        window.addEventListener('keyup', (e) => {
            if (this.active) {
                let element = this.elements.filter(f => f !== undefined).filter(f => f.id === this.active)
                if (element.length > 0 && element[0].editable) {
                    if (e.key.length === 1) {
                        element[0].prevText = element[0].text
                        element[0].text += e.key
                    } else if (e.key === 'Backspace') {
                        element[0].prevText = element[0].text
                        element[0].text = element[0].text.substring(0, element[0].text.length - 1)
                    } else if (e.key === 'Enter') {
                        this.active = null
                    }
                }
                if (element.length > 0) {
                    if (e.key === 'Tab') {
                        let index = this.elements.findIndex(f => f.id === this.active)
                        if (index + 1 < this.elements.length) {
                            index++
                        } else {
                            index = 0
                        }
                        this.active = this.elements[index].id
                    }
                }
            } else if (this.elements.length > 0) {
                if (e.key === 'Tab') {
                    this.active = this.elements[0].id
                }
            }
            return false
        })
        
        // Update async thread.
        setInterval(() => {
            try {
                let preUpdateIds = this.elements.map(el => el.id)
    
                this.postUpdateIds = []

                this.elements = this.elements.filter(f => f !== undefined)
                this.onUpdate(this)
    
                for (let id in preUpdateIds) {
                    if (this.postUpdateIds.filter(f => f === preUpdateIds[id]).length === 0) {
                        this.elements[this.elements.findIndex(f => f !== undefined && f.id === preUpdateIds[id])] = undefined
                    }
                }
                this.elements = this.elements.filter(f => f !== undefined)
        
                this.Update()
            } catch (e) { console.error(e) }
        }, 16) // 16 is around 60fps
    }

    ChangeContext(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
    }
    
    ResetContext() {
        this.canvas = this.originalCanvas
        this.ctx = this.originalCtx
    }

    Element(params) {
        params.type = params.type ? params.type : 'element'
        let elem = this.elements.filter(f => f.id === params.id)
        if (elem.length === 0) {
            let ElementClass = GetElementType(params.type)
            let el = new ElementClass(params)
            el.Update(this, false)
            this.elements.push(el)
            this.postUpdateIds.push(params.id)
            return el
        } else {
            this.postUpdateIds.push(params.id)
            for (let p in params) {
                elem[0][p] = params[p]
            }
            return elem[0]
        }
    }
    
    DrawText(x, y, text, color, effects) {
        bfontjs.DrawText(this.ctx, parseInt(x), parseInt(y), text, color, this.font, effects)
    }
    
    DrawRect(rect, color) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
    }
    
    StrokeRect(rect, color) {
        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = color
        this.ctx.strokeRect(parseInt(rect.x) + 0.5, parseInt(rect.y) + 0.5, parseInt(rect.w), parseInt(rect.h))
    }
    StrokeLine(x, y, x2, y2, color) {
        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = color

        this.ctx.beginPath()
        this.ctx.moveTo(parseInt(x) + 0.5, parseInt(y) + 0.5)
        this.ctx.lineTo(parseInt(x2) + 0.5, parseInt(y2) + 0.5)
        this.ctx.stroke()
    }

    Update() {
        let eventHandled = false
        for (let e = this.elements.length - 1; e >= 0; e--) {
            if (!eventHandled && this.elements[e]) {
                eventHandled = this.elements[e].Update(this, eventHandled)
            }
        }
    }

    Draw() {
        for (let e in this.elements) {
            if (this.elements[e]) {
                this.elements[e].Draw(this)
            }
        }
    }
}

export { ImUI }