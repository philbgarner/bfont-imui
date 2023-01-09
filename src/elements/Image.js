import Element from './Element.js'

class Image extends Element {
    constructor(params) {
        super(params)
        // this.rect.h = parseInt(this.rect.h / 16) * 16
        // this.rect.w = parseInt(this.rect.w / 9) * 9

        this.image = params.image ? params.image : null
    }

    _Draw(imui, rect) {
        if (this.image) {
            if (this.image.tagName === 'IMG') {
                imui.ctx.drawImage(this.image, this.rect.x, this.rect.y, this.rect.w, this.rect.h)
            } else if (this.image.draw) {
                this.image.draw()
            }
        }
    }
}

export default Image