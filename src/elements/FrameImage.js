import Element from './Element.js'

class FrameImage extends Element {
    constructor(params) {
        super(params)

        this.image = params.image ? params.image : null
        if (params.innerRect) {

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

    _Draw(imui, rect) {
        if (this.image) {
            // Top Left Corner
            imui.ctx.drawImage(this.image, 0, 0, this.innerRect.x, this.innerRect.y, this.rect.x, this.rect.y, this.innerRect.x, this.innerRect.y)
            // Top Right Corner
            imui.ctx.drawImage(this.image, this.image.width - this.innerRect.x, 0, this.innerRect.x, this.innerRect.y, this.rect.x + this.rect.w - this.innerRect.x, this.rect.y, this.innerRect.x, this.innerRect.y)
            // Bottom Left Corner
            imui.ctx.drawImage(this.image, 0, this.image.height - this.innerRect.y, this.innerRect.x, this.innerRect.y, this.rect.x, this.rect.y + this.rect.h - this.innerRect.y, this.innerRect.x, this.innerRect.y)
            // Bottom Right Corner
            imui.ctx.drawImage(this.image, this.image.width - this.innerRect.x, this.image.height - this.innerRect.y, this.innerRect.x, this.innerRect.y, this.rect.x + this.rect.w - this.innerRect.x, this.rect.y + this.rect.h - this.innerRect.y, this.innerRect.x, this.innerRect.y)

            // Top Middle Section
            for (let dx = this.rect.x + this.innerRect.x; dx < this.rect.x + this.rect.w - this.innerRect.x; dx += this.image.width - this.innerRect.x * 2) {
                let dw = this.image.width - this.innerRect.x * 2
                if (dx + dw > this.rect.x + this.rect.w - this.innerRect.x) {
                    dw = this.rect.x + this.rect.w - this.innerRect.x - dx
                }
                imui.ctx.drawImage(this.image, this.innerRect.x, 0, dw, this.innerRect.y, dx, this.rect.y, dw, this.innerRect.y)
            }
            // Bottom Middle Section
            for (let dx = this.rect.x + this.innerRect.x; dx < this.rect.x + this.rect.w - this.innerRect.x; dx += this.image.width - this.innerRect.x * 2) {
                let dw = this.image.width - this.innerRect.x * 2
                if (dx + dw > this.rect.x + this.rect.w - this.innerRect.x) {
                    dw = this.rect.x + this.rect.w - this.innerRect.x - dx
                }
                imui.ctx.drawImage(this.image, this.innerRect.x, this.image.height - this.innerRect.y, dw, this.innerRect.y, dx, this.rect.y + this.rect.h - this.innerRect.y, dw, this.innerRect.y)
            }

            // Left Middle Section
            for (let dy = this.rect.y + this.innerRect.y; dy < this.rect.y + this.rect.h - this.innerRect.y; dy += this.image.height - this.innerRect.y * 2) {
                let dh = this.image.height - this.innerRect.y * 2
                if (dy + dh > this.rect.y + this.rect.h - this.innerRect.y) {
                    dh = this.rect.y + this.rect.h - this.innerRect.y - dy
                }
                imui.ctx.drawImage(this.image, 0, this.innerRect.y, this.innerRect.x, dh, this.rect.x, dy, this.innerRect.x, dh)
            }
            // Right Middle Section
            for (let dy = this.rect.y + this.innerRect.y; dy < this.rect.y + this.rect.h - this.innerRect.y; dy += this.image.height - this.innerRect.y * 2) {
                let dh = this.image.height - this.innerRect.y * 2
                if (dy + dh > this.rect.y + this.rect.h - this.innerRect.y) {
                    dh = this.rect.y + this.rect.h - this.innerRect.y - dy
                }
                imui.ctx.drawImage(this.image, 0, this.innerRect.y, this.innerRect.x, dh, this.rect.x + this.rect.w - this.innerRect.x, dy, this.innerRect.x, dh)
            }

            // Centre
            let sx = this.innerRect.x
            let sy = this.innerRect.y
            let sw = this.image.width - this.innerRect.x * 2
            let sh = this.image.height - this.innerRect.y * 2
            let dx = this.innerRect.x + this.rect.x
            let dy = this.innerRect.y + this.rect.y
            while (dy < this.rect.h - this.innerRect.y) {
                let w = sw
                let h = sh
                if (dx + w > this.rect.x + this.rect.w - this.innerRect.x) {
                    w = this.rect.x + this.rect.w - this.innerRect.x - dx
                }
                if (dy + h > this.rect.y + this.rect.h - this.innerRect.y) {
                    h = this.rect.y + this.rect.h - this.innerRect.y - dy
                }
                imui.ctx.drawImage(this.image, sx, sy, w, h, dx, dy, w, h)
                dx += sw
                if (dx > this.rect.x + this.rect.w - this.innerRect.x) {
                    dx = this.innerRect.x + this.rect.x
                    dy += sh
                }
            }
        }
        let txt = this.text.length > (rect.w - 2) / imui.font.cwidth ? this.text.substr(0, parseInt((rect.w - 2) / imui.font.cwidth)) : this.text

        imui.DrawText(rect.x + this.innerRect.x, rect.y + this.innerRect.y, txt, this.color)
    }
}

export default FrameImage