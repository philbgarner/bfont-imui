import Element from './Element.js'

class List extends Element {
    constructor(params) {
        super(params)
        this.rect.h = parseInt(this.rect.h / 16) * 16
        this.rect.w = parseInt(this.rect.w / 9) * 9

        this.bgScrollbar = params.bgScrollbar ? params.bgScrollbar : '#645355ff'
        this.list = params.list ? params.list : []
        this.currentItem = null
        this.scrollOffset = params.scrollOffset ? params.scrollOffset : 0
        this.topDown = params.topDown ? params.topDown : true
        this.horizontal = params.horizontal ? params.horizontal : false
        this.scrollbar = params.scrollbar ? params.scrollbar : true

        this.scrollbarCharacters = {
            scrollUp: params.scrollUp ? params.scrollUp : 252,
            scrollDown: params.scrollDown ? params.scrollDown : 253,
            scrollCaret: params.scrollCaret ? params.scrollCaret : 254
        }

        this.draggingCaret = false
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
            let txt = this.list[l]

            let txtRect = { x: dx, y: dy, w: txt.length * imui.font.cwidth, h: imui.font.cheight }
            let isHoverItem = this.state.mouseOver &&
                imui.mousePos.y >= txtRect.y && imui.mousePos.x >= txtRect.x &&
                imui.mousePos.x < txtRect.x + txtRect.w && imui.mousePos.y < txtRect.y + txtRect.h
            let isMouseDownItem = this.state.mouseDown && imui.mousePos.y >= txtRect.y && imui.mousePos.x >= txtRect.x &&
                    imui.mousePos.x < txtRect.x + txtRect.w && imui.mousePos.y < txtRect.y + txtRect.h
            if (isMouseDownItem) {
                this.currentItem = l
            }

            imui.DrawText(dx, dy, txt, isHoverItem ? textcolor : this.color, isHoverItem || this.currentItem === l ? { background: { colour: isMouseDownItem ? '#ccccccff' : this.bgScrollbar }} : undefined)
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
        
        if (this.rect.h < imui.font.cheight * this.list.length && !this.horizontal) {
            let upRect = { x: rect.x + rect.w - imui.font.cwidth, y: rect.y, w: imui.font.cwidth, h: imui.font.cheight}
            let downRect = { x: rect.x + rect.w - imui.font.cwidth, y: rect.y + rect.h - imui.font.cheight, w: imui.font.cwidth, h: imui.font.cheight}
            let scrollBarRect = { x: rect.x + rect.w - imui.font.cwidth, y: rect.y + imui.font.cheight, w: imui.font.cwidth, h: rect.h - (imui.font.cheight * 2) }
            imui.DrawRect(scrollBarRect, this.bgScrollbar)
            imui.DrawText(upRect.x, upRect.y, this.scrollbarCharacters.scrollUp, this.InsideRect(imui.mousePos.x, imui.mousePos.y, upRect) && this.state.mouseDown ? this.highlight : this.color, 
                this.InsideRect(imui.mousePos.x, imui.mousePos.y, upRect) && this.state.mouseDown ? { background: { colour: this.color } } : { background: { colour: this.bgScrollbar } })
            imui.DrawText(downRect.x, downRect.y, this.scrollbarCharacters.scrollDown, this.InsideRect(imui.mousePos.x, imui.mousePos.y, downRect) && this.state.mouseDown ? this.highlight : this.color, 
                this.InsideRect(imui.mousePos.x, imui.mousePos.y, downRect) && this.state.mouseDown ? { background: { colour: this.color } } : { background: { colour: this.bgScrollbar } })

            let caretPos = (this.scrollOffset / (this.list.length - 1)) * scrollBarRect.h
            let caretColr = this.color
            let caretBg = this.bgScrollbar

            if (!this.draggingCaret) {
                if (this.InsideRect(imui.mousePos.x, imui.mousePos.y, upRect) && this.Clicked()) {
                    if (this.scrollOffset !== null) {
                        this.scrollOffset = this.scrollOffset - 1 < 0 ? 0: this.scrollOffset - 1
                    }
                } else if (this.InsideRect(imui.mousePos.x, imui.mousePos.y, downRect) && this.Clicked()) {
                    if (this.scrollOffset !== null) {
                        this.scrollOffset = this.scrollOffset + 1 > this.list.length - 1 ? this.list.length - 1: this.scrollOffset + 1
                    }
                } else if (this.InsideRect(imui.mousePos.x, imui.mousePos.y, { x: scrollBarRect.x, y: scrollBarRect.y + caretPos, w: scrollBarRect.w, h: imui.font.cwidth}) && this.state.mouseDown) {
                    this.draggingCaret = true
                } else if (this.InsideRect(imui.mousePos.x, imui.mousePos.y, scrollBarRect) && this.Clicked()) {
                    if (this.scrollOffset !== null) {
                        if (imui.mousePos.y < scrollBarRect.y + caretPos) {
                            this.scrollOffset = this.scrollOffset - 10 > 0 ? this.scrollOffset - 10 : 0
                        } else if (imui.mousePos.y > scrollBarRect.y + caretPos + imui.font.cheight) {
                            this.scrollOffset = this.scrollOffset + 10 < this.list.length - 1 ? this.scrollOffset + 10 : this.list.length - 1
                        }
                    }
                }
            } else if (this.draggingCaret && this.state.mouseDown) {
                this.scrollOffset = parseInt(((imui.mousePos.y - scrollBarRect.y) / scrollBarRect.h) * (this.list.length - 2))
                if (this.scrollOffset < 0) {
                    this.scrollOffset = 0
                } else if (this.scrollOffset > this.list.length - 1) {
                    this.scrollOffset = this.list.length - 1
                }
                caretBg = this.color
                caretColr = this.bgScrollbar
            } else if (this.draggingCaret) {
                this.draggingCaret = false
            }
            let caretHovered = this.InsideRect(imui.mousePos.x, imui.mousePos.y, { x: scrollBarRect.x, y: scrollBarRect.y + caretPos, w: scrollBarRect.w, h: imui.font.cwidth})
            imui.DrawText(scrollBarRect.x, scrollBarRect.y + caretPos, this.scrollbarCharacters.scrollCaret, caretHovered ? this.highlight : caretColr, { background: { colour: caretBg } })
        }
    }
}

export default List