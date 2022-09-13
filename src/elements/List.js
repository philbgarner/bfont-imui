import Element from './Element.js'

class List extends Element {
    constructor(params) {
        super(params)
        this.rect.h = parseInt(this.rect.h / 16) * 16
        this.rect.w = parseInt(this.rect.w / 9) * 9

        this.list = params.list ? params.list : []
        this.horizontal = params.horizontal ? params.horizontal : false
    }

    _Draw(imui, rect) {
        let textcolor = this.color
        let bgcolor = this.bgcolor

        if (this.state.mouseOver && !this.state.mouseDown && this.highlight) {
            textcolor = this.highlight
        }

        if (bgcolor) {
            imui.DrawRect(rect, bgcolor)
        }

        let dx = rect.x + imui.font.cwidth
        let dy = rect.y
        for (let l in this.list) {
            
            let txt = this.list[l] > rect.w - imui.font.cwidth * 2 ? this.list.substr(0, parseInt(rect.w - imui.font.cwidth)) : this.list[l]

            let txtRect = { x: dx, y: dy, w: dx + txt.length * imui.font.cwidth, h: dy + imui.font.cheight }
            let isHoverItem = this.state.mouseOver && !this.state.mouseDown &&
                imui.mousePos.y >= txtRect.y && imui.mousePos.x >= txtRect.x &&
                imui.mousePos.x <= txtRect.x + txtRect.w && imui.mousePos.y <= txtRect.y + txtRect.h
            let isMouseDownItem = this.state.mouseDown && imui.mousePos.y >= txtRect.y && imui.mousePos.x >= txtRect.x &&
                    imui.mousePos.x <= txtRect.x + txtRect.w && imui.mousePos.y <= txtRect.y + txtRect.h
            imui.DrawText(dx, dy, txt, isHoverItem ? textcolor : this.color, isHoverItem ? { background: { colour: isMouseDownItem ? '#ccccccff' : '#000000ff' }} : undefined)
            if (!this.horizontal) {
                dy += imui.font.cheight
            } else {
                dx += imui.font.cwidth * (txt.length + 1)
            }
            if (dx > rect.x + rect.w) {
                break
            }
        }
    }
}

export default List