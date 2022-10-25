import Element from './Element.js'

class ButtonImage extends Element {
    constructor(params) {
        super(params)

        this.image = params.image ? params.image : null
        this.imageDown = params.imageDown ? params.imageDown : null
        this.imageHover = params.imageHover ? params.imageHover : null
        
        if (params.innerRect) {
            this.innerRect = params.innerRect
        } else if (params.borderWidth) {
            this.innerRect = {
                x: params.borderWidth,
                y: params.borderWidth,
                w: this.rect.w - params.borderWidth * 2,
                h: this.rect.h - params.borderWidth * 2
            }
        } else {
            this.innerRect = {
                x: 0, y: 0,
                w: this.rect.w, h: this.rect.h
            }
        }
    }

    drawImageSlice(imui, image) {
        if (image) {
            // Top Left Corner
            imui.ctx.drawImage(image, 0, 0, this.innerRect.x, this.innerRect.y, this.rect.x, this.rect.y, this.innerRect.x, this.innerRect.y)
            // Top Right Corner
            imui.ctx.drawImage(image, image.width - this.innerRect.x, 0, this.innerRect.x, this.innerRect.y, this.rect.x + this.rect.w - this.innerRect.x, this.rect.y, this.innerRect.x, this.innerRect.y)
            // Bottom Left Corner
            imui.ctx.drawImage(image, 0, image.height - this.innerRect.y, this.innerRect.x, this.innerRect.y, this.rect.x, this.rect.y + this.rect.h - this.innerRect.y, this.innerRect.x, this.innerRect.y)
            // Bottom Right Corner
            imui.ctx.drawImage(image, image.width - this.innerRect.x, image.height - this.innerRect.y, this.innerRect.x, this.innerRect.y, this.rect.x + this.rect.w - this.innerRect.x, this.rect.y + this.rect.h - this.innerRect.y, this.innerRect.x, this.innerRect.y)

            // Top Middle Section
            for (let dx = this.rect.x + this.innerRect.x; dx < this.rect.x + this.rect.w - this.innerRect.x; dx += image.width - this.innerRect.x * 2) {
                let dw = image.width - this.innerRect.x * 2
                if (dx + dw > this.rect.x + this.rect.w - this.innerRect.x) {
                    dw = this.rect.x + this.rect.w - this.innerRect.x - dx
                }
                imui.ctx.drawImage(image, this.innerRect.x, 0, dw, this.innerRect.y, dx, this.rect.y, dw, this.innerRect.y)
            }
            // Bottom Middle Section
            for (let dx = this.rect.x + this.innerRect.x; dx < this.rect.x + this.rect.w - this.innerRect.x; dx += image.width - this.innerRect.x * 2) {
                let dw = image.width - this.innerRect.x * 2
                if (dx + dw > this.rect.x + this.rect.w - this.innerRect.x) {
                    dw = this.rect.x + this.rect.w - this.innerRect.x - dx
                }
                imui.ctx.drawImage(image, this.innerRect.x, image.height - this.innerRect.y, dw, this.innerRect.y, dx, this.rect.y + this.rect.h - this.innerRect.y, dw, this.innerRect.y)
            }

            // Left Middle Section
            for (let dy = this.rect.y + this.innerRect.y; dy < this.rect.y + this.rect.h - this.innerRect.y; dy += image.height - this.innerRect.y * 2) {
                let dh = image.height - this.innerRect.y * 2
                if (dy + dh > this.rect.y + this.rect.h - this.innerRect.y) {
                    dh = this.rect.y + this.rect.h - this.innerRect.y - dy
                }
                imui.ctx.drawImage(image, 0, this.innerRect.y, this.innerRect.x, dh, this.rect.x, dy, this.innerRect.x, dh)
            }
            // Right Middle Section
            for (let dy = this.rect.y + this.innerRect.y; dy < this.rect.y + this.rect.h - this.innerRect.y; dy += image.height - this.innerRect.y * 2) {
                let dh = image.height - this.innerRect.y * 2
                if (dy + dh > this.rect.y + this.rect.h - this.innerRect.y) {
                    dh = this.rect.y + this.rect.h - this.innerRect.y - dy
                }
                imui.ctx.drawImage(image, image.width - this.innerRect.x, this.innerRect.y, this.innerRect.x, dh, this.rect.x + this.rect.w - this.innerRect.x, dy, this.innerRect.x, dh)
            }

            // Centre
            
            let sx = this.innerRect.x
            let sy = this.innerRect.y
            let sw = image.width - this.innerRect.x * 2
            let sh = image.height - this.innerRect.y * 2
            let dx = this.innerRect.x + this.rect.x
            let dy = this.innerRect.y + this.rect.y
            while (dy < this.rect.y + this.rect.h - this.innerRect.y) {
                let w = sw
                let h = sh
                if (dx + w > this.rect.x + this.rect.w - this.innerRect.x) {
                    w = this.rect.x + this.rect.w - this.innerRect.x - dx
                }
                if (dy + h > this.rect.y + this.rect.h - this.innerRect.y) {
                    h = this.rect.y + this.rect.h - this.innerRect.y - dy
                }
                imui.ctx.drawImage(image, sx, sy, w, h, dx, dy, w, h)
                dx += sw
                if (dx > this.rect.x + this.rect.w - this.innerRect.x) {
                    dx = this.innerRect.x + this.rect.x
                    dy += sh
                }
            }
        }
    }

    _Draw(imui, rect) {
        let offy = this.state.mouseDown ? 2 : 0
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