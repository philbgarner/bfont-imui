import Element from './Element.js'

class ButtonImage extends Element {
    constructor(params) {
        super(params)

        this.image = params.image ? params.image : null
        this.imageDown = params.imageDown ? params.imageDown : null
        this.imageHover = params.imageHover ? params.imageHover : null
        
        this.pressedOffsetY = params.pressedOffsetY ? params.pressedOffsetY : 2

        if (params.innerRect) {
            this.innerRect = params.innerRect
        } else if (params.borderWidth) {
            this.innerRect = {
                x: params.borderWidth,
                y: params.borderWidth,
                w: this.Rect().w - params.borderWidth * 2,
                h: this.Rect().h - params.borderWidth * 2
            }
        } else {
            this.innerRect = {
                x: 0, y: 0,
                w: this.Rect().w, h: this.Rect().h
            }
        }
    }

    drawImageSlice(imui, image) {
        if (image) {
            // Top Left Corner
            imui.ctx.drawImage(image, 0, 0, this.innerRect.x, this.innerRect.y, this.Rect().x, this.Rect().y, this.innerRect.x, this.innerRect.y)
            
            // Top Right Corner
            let x2 = image.width - (this.innerRect.x + this.innerRect.w)
            imui.ctx.drawImage(image, image.width - x2, 0, x2, this.innerRect.y, this.Rect().x + this.Rect().w - x2, this.Rect().y, x2, this.innerRect.y)

            // Bottom Right Corner
            let y2 = image.height - (this.innerRect.y + this.innerRect.h)
            imui.ctx.drawImage(image, image.width - x2, image.height - y2, x2, y2, this.Rect().x + this.Rect().w - x2, this.Rect().y + this.Rect().h - y2, x2, y2)

            // Bottom Left Corner
            imui.ctx.drawImage(image, 0, image.height - y2, this.innerRect.x, y2, this.Rect().x, this.Rect().y + this.Rect().h - y2, this.innerRect.x, y2)

            // Top Middle Section
            for (let dx = this.Rect().x + this.innerRect.x; dx < this.Rect().x + this.Rect().w - x2; dx += this.innerRect.w) {
                let dw = image.width - x2
                if (dx + dw > this.Rect().x + this.Rect().w - x2) {
                    dw = this.Rect().x + this.Rect().w - x2 - dx
                }
                imui.ctx.drawImage(image, this.innerRect.x, 0, dw, this.innerRect.y, dx, this.Rect().y, dw, this.innerRect.y)
            }
            // Bottom Middle Section
            for (let dx = this.Rect().x + this.innerRect.x; dx < this.Rect().x + this.Rect().w - x2; dx += this.innerRect.w) {
                let dw = image.width - x2
                if (dx + dw > this.Rect().x + this.Rect().w - x2) {
                    dw = this.Rect().x + this.Rect().w - x2 - dx
                }
                imui.ctx.drawImage(image, this.innerRect.x, image.height - y2, dw, y2, dx, this.Rect().y + this.Rect().h - y2, dw, y2)
            }

            // Left Middle Section
            for (let dy = this.Rect().y + this.innerRect.y; dy < this.Rect().y + this.Rect().h - y2; dy += this.innerRect.h) {
                let dh = image.height - y2
                if (dy + dh > this.Rect().y + this.Rect().h - y2) {
                    dh = this.Rect().y + this.Rect().h - y2 - dy
                }
                imui.ctx.drawImage(image, 0, this.innerRect.y, this.innerRect.x, dh, this.Rect().x, dy, this.innerRect.x, dh)
            }
            // Right Middle Section
            for (let dy = this.Rect().y + this.innerRect.y; dy < this.Rect().y + this.Rect().h - y2; dy += this.innerRect.h) {
                let dh = image.height - y2
                if (dy + dh > this.Rect().y + this.Rect().h - y2) {
                    dh = this.Rect().y + this.Rect().h - y2 - dy
                }
                imui.ctx.drawImage(image, image.width - x2, this.innerRect.y, x2, dh, this.Rect().x + this.Rect().w - x2, dy, x2, dh)
            }

            // Centre
            
            let sx = this.innerRect.x
            let sy = this.innerRect.y
            let sw = this.innerRect.w
            let sh = this.innerRect.h
            let dx = this.innerRect.x + this.Rect().x
            let dy = this.innerRect.y + this.Rect().y
            while (dy < this.Rect().y + this.Rect().h - y2) {
                let w = sw
                let h = sh
                if (dx + w > this.Rect().x + this.Rect().w - x2) {
                    w = this.Rect().x + this.Rect().w - x2 - dx
                }
                if (dy + h > this.Rect().y + this.Rect().h - y2) {
                    h = this.Rect().y + this.Rect().h - y2 - dy
                }
                imui.ctx.drawImage(image, sx, sy, w, h, dx, dy, w, h)
                dx += sw
                if (dx > this.Rect().x + this.Rect().w - x2) {
                    dx = this.innerRect.x + this.Rect().x
                    dy += sh
                }
            }
        }
    }

    _Draw(imui, rect) {
        let offy = this.state.mouseDown ? this.pressedOffsetY : 0
        let colr = this.Hover() ? this.highlight : this.color

        if (this.Hover() && !this.state.mouseDown && this.imageHover) {
            this.drawImageSlice(imui, this.imageHover)
        } else if (this.state.mouseDown && this.imageDown) {
            this.drawImageSlice(imui, this.imageDown)
        } else {
            this.drawImageSlice(imui, this.image)
        }
        
        let txt = this.text.length > (rect.w - 2) / imui.font.cwidth ? this.text.substr(0, parseInt((rect.w - 2) / imui.font.cwidth)) : this.text
    

        imui.DrawText(rect.x + (rect.w / 2) - (txt.length * imui.font.cwidth) / 2, rect.y + (rect.h / 2) - (imui.font.cheight / 2) + offy, txt, colr)
    }
}

export default ButtonImage