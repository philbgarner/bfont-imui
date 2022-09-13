import Element from './Element.js'

class List extends Element {
    constructor(params) {
        super(params)
        this.rect.h = parseInt(this.rect.h / 16) * 16
        this.rect.w = parseInt(this.rect.w / 9) * 9

        this.list = params.list ? params.list : []
        this.currentItem = null
        this.scrollOffset = 30
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
        for (let l = this.scrollOffset; l < this.list.length; l++) {
            
            let txt = this.list[l] > rect.w - imui.font.cwidth * 2 ? this.list.substr(0, parseInt(rect.w - imui.font.cwidth)) : this.list[l]

            let txtRect = { x: dx, y: dy, w: txt.length * imui.font.cwidth, h: imui.font.cheight }
            let isHoverItem = this.state.mouseOver && !this.state.mouseDown &&
                imui.mousePos.y >= txtRect.y && imui.mousePos.x >= txtRect.x &&
                imui.mousePos.x < txtRect.x + txtRect.w && imui.mousePos.y < txtRect.y + txtRect.h
            let isMouseDownItem = this.state.mouseDown && imui.mousePos.y >= txtRect.y && imui.mousePos.x >= txtRect.x &&
                    imui.mousePos.x < txtRect.x + txtRect.w && imui.mousePos.y < txtRect.y + txtRect.h
            if (isMouseDownItem) {
                this.currentItem = l
            }

            imui.DrawText(dx, dy, txt, isHoverItem ? textcolor : this.color, isHoverItem || this.currentItem === l ? { background: { colour: isMouseDownItem ? '#ccccccff' : '#645355ff' }} : undefined)
            if (!this.horizontal) {
                dy += imui.font.cheight
            } else {
                dx += imui.font.cwidth * (txt.length + 1)
            }
            if (dx > rect.x + rect.w) {
                break
            }
            if (dy + imui.font.cheight > rect.y + rect.h) {
                break
            }
        }
        
        if (this.rect.h < imui.font.cheight * this.list.length) {
            let upRect = { x: rect.x + rect.w - imui.font.cwidth, y: rect.y, w: imui.font.cwidth, h: imui.font.cheight}
            let downRect = { x: rect.x + rect.w - imui.font.cwidth, y: rect.y + rect.h - imui.font.cheight, w: imui.font.cwidth, h: imui.font.cheight}
            let scrollBarRect = { x: rect.x + rect.w - imui.font.cwidth, y: rect.y, w: imui.font.cwidth, h: rect.h }
            imui.DrawRect(scrollBarRect, '#645355ff')
            imui.DrawText(upRect.x, upRect.y, 24, this.color)
            imui.DrawText(downRect.x, downRect.y, 25, this.color)
    
            let caretPos = scrollBarRect.y + imui.font.cheight + (this.scrollOffset / this.list.length) * scrollBarRect.h - (imui.font.cheight * 2)
            imui.DrawText(scrollBarRect.x, caretPos, 254, this.color)        
        }
    }
}

export default List