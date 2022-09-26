import Element from './Element.js'

class TextBoxFlat extends Element {
    constructor(params) {
        super(params)
        this.rect.h = parseInt(this.rect.h / 16) * 16
        this.rect.w = parseInt(this.rect.w / 9) * 9

        this.text = params.defaultText ? params.defaultText : ''
            
        this.editable = params.editable ? params.editable : true

        if (params.drawBuffer) {
            this.InitializeBuffer({x: 9, y: 32})
        }
    }

    Text() { return this.text }

    _Draw(imui, rect) {
        let txt = this.text.length > (rect.w - imui.font.cwidth * 2) / imui.font.cwidth ? this.text.substr(0, parseInt((rect.w - 2) / imui.font.cwidth)) : this.text

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
                imui.DrawText(rect.x + imui.font.cwidth + txt.length * imui.font.cwidth, rect.y + rect.h / 2 - imui.font.cheight / 2, '_', textcolor)
            }
        }
        imui.DrawText(rect.x + imui.font.cwidth, rect.y + rect.h / 2 - imui.font.cheight / 2, txt, textcolor)


        let leftChar = '[', rightChar = ']'

        imui.DrawText(rect.x, rect.y + rect.h / 2 - imui.font.cheight / 2, leftChar, textcolor)
        imui.DrawText(rect.x + rect.w - imui.font.cwidth, rect.y + rect.h / 2 - imui.font.cheight / 2, rightChar, textcolor)
    }
}

export default TextBoxFlat