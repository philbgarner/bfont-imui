import Element from './Element.js'

class Frame3d extends Element {
    constructor(params) {
        super(params)
        this.rect.h = parseInt(this.rect.h / 16) * 16
        this.rect.w = parseInt(this.rect.w / 9) * 9

        if (params.drawBuffer) {
            this.InitializeBuffer({x: 9, y: 32})
        }
    }

    _Draw(imui, rect) {
        if (this.bgcolor) {
            imui.DrawRect(rect, this.bgcolor)
        }
        let txt = this.text.length > (rect.w - 2) / imui.font.cwidth ? this.text.substr(0, parseInt((rect.w - 2) / imui.font.cwidth)) : this.text

        let borderRect = { x: rect.x + imui.font.cwidth / 2, y: rect.y + imui.font.cheight / 2, w: rect.w - imui.font.cwidth, h: rect.h - imui.font.cheight}

        let highlight = !this.inverted ? this.highlight : this.shadow
        let shadow = !this.inverted ? this.shadow : this.highlight

        imui.StrokeLine(borderRect.x, borderRect.y, borderRect.x + borderRect.w, borderRect.y, highlight)
        imui.StrokeLine(borderRect.x + borderRect.w, borderRect.y, borderRect.x + borderRect.w, borderRect.y + borderRect.h, highlight)
        imui.StrokeLine(borderRect.x, borderRect.y + borderRect.h, borderRect.x + borderRect.w, borderRect.y + borderRect.h, shadow)
        imui.StrokeLine(borderRect.x, borderRect.y, borderRect.x, borderRect.y + borderRect.h, shadow)

        imui.DrawText(rect.x + imui.font.cwidth, rect.y + imui.font.cheight, txt, this.color)
    }
}

export default Frame3d