import Element from './Element.js'

class ButtonFlat extends Element {
    constructor(params) {
        super(params)
        this.rect.h = parseInt(this.rect.h / 16) * 16
        this.rect.w = parseInt(this.rect.w / 9) * 9

        if (params.drawBuffer) {
            this.InitializeBuffer({x: 9, y: 32})
        }
    }

    _Draw(imui, rect) {
        let txt = this.text.length > (rect.w - 2) / imui.font.cwidth ? this.text.substr(0, parseInt((rect.w - 2) / imui.font.cwidth)) : this.text

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
        }

        imui.DrawText(rect.x + rect.w / 2 - (txt.length * imui.font.cwidth) / 2, rect.y + rect.h / 2 - imui.font.cheight / 2, txt, textcolor)

        let leftChar = '<', rightChar = '>'

        imui.DrawText(rect.x, rect.y + rect.h / 2 - imui.font.cheight / 2, leftChar, textcolor)
        imui.DrawText(rect.x + rect.w - imui.font.cwidth, rect.y + rect.h / 2 - imui.font.cheight / 2, rightChar, textcolor)
    }
}

export default ButtonFlat