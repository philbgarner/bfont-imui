import Element from './Element.js'

class ListImage extends Element {
    constructor(params) {
        super(params)
        this.list = params.list ? params.list : []
        this.currentItem = null
        this.scrollOffset = params.scrollOffset ? params.scrollOffset : 0
        this.topDown = params.topDown ? params.topDown : true
        this.horizontal = params.horizontal ? params.horizontal : false
        this.scrollbar = params.scrollbar ? params.scrollbar : true

        this.scrollbarWidth = params.scrollbarWidth ? params.scrollbarWidth : 8
        this.caratImage = params.caratImage ? params.caratImage : { image: null, hover: null, pressed: null, innerRect: null }
        this.upImage = params.upImage ? params.upImage : { image: null, hover: null, pressed: null, innerRect: null }
        this.downImage = params.downImage ? params.downImage : { image: null, hover: null, pressed: null, innerRect: null }
        this.scrollAreaImage = params.scrollAreaImage ? params.scrollAreaImage : { image: null, hover: null, pressed: null, innerRect: null }

        this.draggingCaret = false

        if (params.innerRect) {
            this.innerRect = params.innerRect
        } else if (params.borderWidth) {
            this.innerRect = {
                x: params.borderWidth,
                y: params.borderWidth + this.scrollbarWidth,
                w: this.Rect().w - this.scrollbarWidth,
                h: this.Rect().h - this.scrollbarWidth * 2
            }
        } else {
            this.innerRect = {
                x: 0, y: 0,
                w: this.Rect().w, h: this.Rect().h
            }
        }
    }

    drawImageSlice(imui, image, rect, innerRect) {
        if (image) {
            // Top Left Corner
            imui.ctx.drawImage(image, 0, 0, innerRect.x, innerRect.y, rect.x, rect.y, innerRect.x, innerRect.y)
            
            // Top Right Corner
            let x2 = image.width - (innerRect.x + innerRect.w)
            imui.ctx.drawImage(image, image.width - x2, 0, x2, innerRect.y, rect.x + rect.w - x2, rect.y, x2, innerRect.y)

            // Bottom Right Corner
            let y2 = image.height - (innerRect.y + innerRect.h)
            imui.ctx.drawImage(image, image.width - x2, image.height - y2, x2, y2, rect.x + rect.w - x2, rect.y + rect.h - y2, x2, y2)

            // Bottom Left Corner
            imui.ctx.drawImage(image, 0, image.height - y2, innerRect.x, y2, rect.x, rect.y + rect.h - y2, innerRect.x, y2)

            // Top Middle Section
            for (let dx = rect.x + innerRect.x; dx < rect.x + rect.w - x2; dx += innerRect.w) {
                let dw = image.width - x2
                if (dx + dw > rect.x + rect.w - x2) {
                    dw = rect.x + rect.w - x2 - dx
                }
                imui.ctx.drawImage(image, innerRect.x, 0, dw, innerRect.y, dx, rect.y, dw, innerRect.y)
            }
            // Bottom Middle Section
            for (let dx = rect.x + innerRect.x; dx < rect.x + rect.w - x2; dx += innerRect.w) {
                let dw = image.width - x2
                if (dx + dw > rect.x + rect.w - x2) {
                    dw = rect.x + rect.w - x2 - dx
                }
                imui.ctx.drawImage(image, innerRect.x, image.height - y2, dw, y2, dx, rect.y + rect.h - y2, dw, y2)
            }

            // Left Middle Section
            for (let dy = rect.y + innerRect.y; dy < rect.y + rect.h - y2; dy += innerRect.h) {
                let dh = image.height - y2
                if (dy + dh > rect.y + rect.h - y2) {
                    dh = rect.y + rect.h - y2 - dy
                }
                imui.ctx.drawImage(image, 0, innerRect.y, innerRect.x, dh, rect.x, dy, innerRect.x, dh)
            }
            // Right Middle Section
            for (let dy = rect.y + innerRect.y; dy < rect.y + rect.h - y2; dy += innerRect.h) {
                let dh = image.height - y2
                if (dy + dh > rect.y + rect.h - y2) {
                    dh = rect.y + rect.h - y2 - dy
                }
                imui.ctx.drawImage(image, image.width - x2, innerRect.y, x2, dh, rect.x + rect.w - x2, dy, x2, dh)
            }

            // Centre
            
            let sx = innerRect.x
            let sy = innerRect.y
            let sw = innerRect.w
            let sh = innerRect.h
            let dx = innerRect.x + rect.x
            let dy = innerRect.y + rect.y
            while (dy < rect.y + rect.h - y2) {
                let w = sw
                let h = sh
                if (dx + w > rect.x + rect.w - x2) {
                    w = rect.x + rect.w - x2 - dx
                }
                if (dy + h > rect.y + rect.h - y2) {
                    h = rect.y + rect.h - y2 - dy
                }
                imui.ctx.drawImage(image, sx, sy, w, h, dx, dy, w, h)
                dx += sw
                if (dx > rect.x + rect.w - x2) {
                    dx = innerRect.x + rect.x
                    dy += sh
                }
            }
        }
    }

    _Draw(imui) {

        let rect = this.Rect()
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
        
        if (rect.h < imui.font.cheight * this.list.length && !this.horizontal) {
            let upRect = { x: rect.x + rect.w - this.scrollbarWidth, y: rect.y, w: this.scrollbarWidth, h: this.scrollbarWidth}
            let downRect = { x: rect.x + rect.w - this.scrollbarWidth, y: rect.y + rect.h - this.scrollbarWidth, w: this.scrollbarWidth, h: this.scrollbarWidth}
            let scrollBarRect = { x: rect.x + rect.w - this.scrollbarWidth, y: rect.y + this.scrollbarWidth, w: this.scrollbarWidth, h: rect.h - (this.scrollbarWidth * 2) }

            let caretPos = parseInt((this.scrollOffset / (this.list.length - 1)) * (scrollBarRect.h - this.scrollbarWidth ))
            let caretRect = { x: scrollBarRect.x, y: scrollBarRect.y + caretPos, w: scrollBarRect.w, h: this.scrollbarWidth }

            if (this.scrollAreaImage.image) {
                this.drawImageSlice(imui, this.scrollAreaImage.image, { x: upRect.x, y: upRect.y, w: scrollBarRect.w, h: upRect.h + downRect.h + scrollBarRect.h }, this.scrollAreaImage.innerRect)
            } else {
                imui.DrawRect(scrollBarRect, '#c0c0c0ff')
            }

            let downHovered = this.InsideRect(imui.mousePos.x, imui.mousePos.y, downRect)
            if (this.downImage.image) {
                imui.ctx.drawImage(this.downImage.hover && downHovered ? this.state.mouseDown ? this.downImage.pressed : this.downImage.hover
                    : this.downImage.image, downRect.x, downRect.y)
            } else {
                imui.DrawRect(downRect, '#f1f1f1ff')
            }

            let upHovered = this.InsideRect(imui.mousePos.x, imui.mousePos.y, upRect)
            if (this.upImage.image) {
                imui.ctx.drawImage(this.upImage.hover && upHovered ? this.state.mouseDown ? this.upImage.pressed : this.upImage.hover
                    : this.upImage.image, upRect.x, upRect.y)
            } else {
                imui.DrawRect(upRect, '#f1f1f1ff')
            }

            let caretHovered = this.InsideRect(imui.mousePos.x, imui.mousePos.y, caretRect)
            if (this.caratImage.image) {
                imui.ctx.drawImage(this.caratImage.hover && caretHovered ? this.state.mouseDown ? this.caratImage.pressed : this.caratImage.hover
                    : this.caratImage.image, caretRect.x, caretRect.y)
            } else {
                imui.DrawRect(caretRect, caretHovered ? '#f1f1c1ff' : '#e1e1e1ff')
            }

            // imui.DrawText(upRect.x, upRect.y, this.scrollbarCharacters.scrollUp, this.InsideRect(imui.mousePos.x, imui.mousePos.y, upRect) && this.state.mouseDown ? this.highlight : this.color, 
            //     this.InsideRect(imui.mousePos.x, imui.mousePos.y, upRect) && this.state.mouseDown ? { background: { colour: this.color } } : { background: { colour: this.bgScrollbar } })
            // imui.DrawText(downRect.x, downRect.y, this.scrollbarCharacters.scrollDown, this.InsideRect(imui.mousePos.x, imui.mousePos.y, downRect) && this.state.mouseDown ? this.highlight : this.color, 
            //     this.InsideRect(imui.mousePos.x, imui.mousePos.y, downRect) && this.state.mouseDown ? { background: { colour: this.color } } : { background: { colour: this.bgScrollbar } })

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
                } else if (this.InsideRect(imui.mousePos.x, imui.mousePos.y, caretRect) && this.state.mouseDown) {
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
                this.scrollOffset = parseInt(((imui.mousePos.y - scrollBarRect.y) / (scrollBarRect.h - upRect.h)) * (this.list.length - 1))
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

            //imui.DrawText(scrollBarRect.x, scrollBarRect.y + caretPos, this.scrollbarCharacters.scrollCaret, caretHovered ? this.highlight : caretColr, { background: { colour: caretBg } })
        }
    }
}

export default ListImage