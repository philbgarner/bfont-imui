import Element from './Element.js'

class TextBoxFlat extends Element {
    constructor(params) {
        super(params)
        this.text = params.defaultText ? params.defaultText : ''
        this.font = params.font ? params.font : null

        if (this.font) {
            this.rect.h = parseInt((this.rect.h / this.font.cheight) * this.font.cheight)
            this.rect.w = this.GetMaxTextWidth(this.font, this.text)
        } else {
            this.rect.w = 8
            this.rect.h = 8
        }
            
        this.editable = params.editable ? params.editable : true

        if (params.drawBuffer) {
            this.InitializeBuffer({x: 9, y: 32})
        }
    }

    Text() { return this.text }

    _Draw(imui, rect) {
        if (!this.font) {
            this.font = imui.font
        }
        let txt = this.text

        let textcolor = this.color
        let bgcolor = this.bgcolor

        if (this.state.mouseOver && !this.state.mouseDown && this.highlight) {
            textcolor = this.highlight
        }

        if (bgcolor) {
            if (this.state.mouseDown) {
                textcolor = this.bgcolor
                bgcolor = this.color
            }

            imui.DrawRect(rect, bgcolor)
        }

        if (this.id === imui.active) {
            textcolor = this.highlight ? this.highlight : textcolor
            if (Date.now() % 1000 > 500) {
                imui.DrawTextFont(this.font, rect.x + this.GetMaxTextWidth(this.font, `${txt}`), rect.y + rect.h / 2 - this.font.cheight / 2, '_', textcolor)
            }
        }
        imui.DrawTextFont(this.font, rect.x, rect.y + rect.h / 2 - this.font.cheight / 2, txt, textcolor)
    }
}

export default TextBoxFlat