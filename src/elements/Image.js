import Element from './Element.js'

class Image extends Element {
    constructor(params) {
        super(params)

        this.image = params.image ? params.image : null
        if (!this.rect.w || !this.rect.h) {
            this.rect.h = this.image.height
            this.rect.w = this.image.width
        }
    }

    _Draw(imui, rect) {
        if (this.image) {
            if (this.image.tagName === 'IMG') {
                imui.ctx.drawImage(this.image, this.Rect().x, this.Rect().y, this.Rect().w, this.Rect().h)
            } else if (this.image.draw) {
                this.image.draw()
            }
        }
    }
}

export default Image