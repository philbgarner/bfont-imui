!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("canvas")):"function"==typeof define&&define.amd?define(["canvas"],e):"object"==typeof exports?exports.imui=e(require("canvas")):t.imui=e(t.canvas)}(self,(t=>(()=>{"use strict";var e={517:e=>{e.exports=t}},i={};function s(t){var h=i[t];if(void 0!==h)return h.exports;var r=i[t]={exports:{}};return e[t](r,r.exports,s),r.exports}s.d=(t,e)=>{for(var i in e)s.o(e,i)&&!s.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),s.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var h={};return(()=>{s.r(h),s.d(h,{ImUI:()=>g});var t=s(517);const e=class{constructor(t){if(!t.id)throw new Error("Element must have unique id.");this.id=t.id,this.autosize=!t.autosize||t.autosize,t.rect&&(this.autosize=!1),this.rect=t.rect?t.rect:{x:0,y:0,w:0,h:0},this.color=t.color?t.color:"#ccccccff",this.bgcolor=t.bgcolor?t.bgcolor:void 0,this.text=t.text?t.text:"",this.prevText=this.text,this.parentRect=t.parentRect?t.parentRect:null,this.wrap=t.wrap?t.wrap:"",this.font=t.font?t.font:imui.font,this.rect.x=t.x?t.x:this.rect.x,this.rect.y=t.y?t.y:this.rect.y,this.state={clicked:!1,mouseOver:!1,mouseDown:!1,mouseUp:!1,change:!0},this.prevState=t.prevState?t.prevState:{clicked:!1,mouseOver:!1,mouseDown:!1,mouseUp:!1,change:!1},this.buffer=null,t.drawBuffer&&this.InitializeBuffer()}InitializeBuffer(e){let i=0,s=0;e?(i=e.x,s=e.y,this.margin=e):this.margin={x:0,y:0};try{this.buffer=document.createElement("canvas"),this.buffer.width=this.rect.w+i,this.buffer.height=this.rect.h+s,this.bufferCtx=this.buffer.getContext("2d")}catch{this.buffer=(0,t.createCanvas)(this.rect.w+i,this.rect.h+s),this.bufferCtx=this.buffer.getContext("2d")}}DidChangeState(){return this.prevState.clicked!==this.state.clicked||this.prevState.mouseOver!==this.state.mouseOver||this.prevState.mouseDown!==this.state.mouseDown||this.prevState.mouseUp!==this.state.mouseUp||this.prevState.change!==this.state.change}BuildPreviousState(){return{clicked:this.state.clicked,mouseOver:this.state.mouseOver,mouseDown:this.state.mouseDown,mouseUp:this.state.mouseUp,change:this.state.change}}InsideRect(t,e,i){let s=i||this.rect;return t>=s.x&&t<s.x+s.w&&e>=s.y&&e<s.y+s.h}Clicked(){return this.state.clicked}Hover(){return this.state.mouseOver}MouseDown(){return this.state.mouseDown}MouseUp(){return this.state.mouseUp}setState(t){this.prevState=this.BuildPreviousState();for(let e in t)this.state[e]=t[e]}Update(t,e){let i=!1,s=this.font?this.font:t.font;return this.autosize&&(this.rect.w=this.text.length*s.cwidth,this.rect.h=s.cheight,this.text&&this.text.length>0&&(this.rect.h=s.cheight*this.text.split("\n").length)),this.state.clicked&&this.id!==t.active&&(t.active=this.id,this.setState({changed:!0}),i=!0),t.mousePos.x>=this.rect.x&&t.mousePos.y>=this.rect.y&&t.mousePos.x<=this.rect.x+this.rect.w&&t.mousePos.y<=this.rect.y+this.rect.h?(this.state.mouseOver&&this.state.clicked?(this.setState({mouseOver:!0,clicked:!1}),i=!0):e||(this.setState({mouseOver:!0}),i=!0),t.mouseButton>0&&!this.state.mouseDown?(this.setState({mouseDown:!0,mouseButton:t.mouseButton}),i=!0):0===t.mouseButton&&this.prevState.mouseDown&&(this.setState({mouseUp:!0,mouseDown:!1}),i=!0)):this.setState({mouseOver:!1,mouseDown:!1,mouseUp:!1,clicked:!1}),0===t.mouseButton&&this.state.mouseUp&&(this.setState({mouseUp:!1,clicked:!0}),t.active=this.id,i=!0),this.text!==this.prevText?(this.setState({change:!0}),this.prevText=this.text):this.setState({change:!1}),i}GetMaxTextWidth(t,e){let i=[];try{"number"==typeof e&&(e=t.codepage.filter((t=>t.codenumber===e))[0].symbol),i=e.split("\n")}catch(t){console.log("Error splitting txt parameters: ",t," typeof txt =",typeof e)}let s=0;for(let e in i){let h=i[e],r=0;for(let e in h){let i=t.codepage.filter((t=>t.symbol===h[e]));i.length>0&&i[0].rect&&(r+=i[0].rect.w)}r>s&&(s=r)}return s}GetWrappedText(t,e,i){let s=e.split("\n"),h=parseInt(i.w/t.cwidth),r=0;for(;this.GetMaxTextWidth(t,s.join("\n"))>=i.w&&r<=100;){let e=[];for(let r in s)s[r].length*t.cwidth>i.w?e.push(s[r].slice(0,h).trim(),s[r].slice(h,s[r].length).trim()):e.push(s[r]);s=e,r++}return s.join("\n")}GetWordWrappedText(t,e,i){let s=e.split("\n"),h=parseInt(i.w/t.cwidth),r=0;for(;this.GetMaxTextWidth(t,s.join("\n"))>=i.w&&r<=100;){let e=[];for(let r in s)if(s[r].length*t.cwidth>i.w){let t=s[r].substring(0,h).split("").reverse().join("").search(/\s/);e.push(s[r].slice(0,h-t).trim(),s[r].slice(h-t,s[r].length).trim())}else e.push(s[r]);s=e,r++}return s.join("\n")}DoTextWrap(t){let e=this.text?this.text:"";if(t=t||bfontjs.Fonts().default,this.GetMaxTextWidth(t,e)>this.rect.w)if("clip"===this.wrap){let i=Math.floor(this.rect.w/t.cwidth);e=e.substring(0,i)}else if("ellipses"===this.wrap){let i=Math.floor(this.rect.w/t.cwidth);e=e.substring(0,i-3),e+="..."}else"wrap"===this.wrap?e=this.GetWrappedText(t,e,this.rect):"word-wrap"===this.wrap&&(e=this.GetWordWrappedText(t,e,this.rect));e="string"==typeof e?e:"";let i=this.GetMaxTextWidth(t,e),s=e.split("\n").length*t.cheight,h={text:e,w:i>this.rect.w?i:this.rect.w,h:s>this.rect.h?s:this.rect.h};return this.autosize&&(this.rect=h),h}DrawText(t,e,i){let s=this.color;this.id===t.active&&(s=this.highlight?this.highlight:s);let h=this.DoTextWrap(e);t.DrawTextFont(e,i.x,i.y,h.text,s),i.h=h.h,i.w=h.w,this.rect=i}_Draw(t,e){this.bgcolor&&t.DrawRect(e,this.bgcolor);let i=this.font?this.font:t.font;this.DrawText(t,i,e)}Draw(t){let e=this.rect,i=t.ctx;i.save(),this.parentRect&&(e.x+=this.parentRect.x,e.y+=this.parentRect.y,i.beginPath(),i.rect(this.parentRect.x,this.parentRect.y,this.parentRect.w,this.parentRect.h),i.closePath(),i.clip()),this._Draw(t,e),i.restore()}},i=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),t.drawBuffer&&this.InitializeBuffer({x:9,y:32})}_Draw(t,e){this.bgcolor&&t.DrawRect(e,this.bgcolor);let i=this.text.length>(e.w-2)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text,s={x:e.x+t.font.cwidth/2,y:e.y+t.font.cheight/2,w:e.w-t.font.cwidth,h:e.h-t.font.cheight};t.StrokeRect(s,this.color),t.DrawText(e.x+t.font.cwidth,e.y+t.font.cheight,i,this.color)}},r=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),t.drawBuffer&&this.InitializeBuffer({x:9,y:32})}_Draw(t,e){this.bgcolor&&t.DrawRect(e,this.bgcolor);let i=this.text.length>(e.w-2)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text,s={x:e.x+t.font.cwidth/2,y:e.y+t.font.cheight/2,w:e.w-t.font.cwidth,h:e.h-t.font.cheight},h=this.inverted?this.shadow:this.highlight,r=this.inverted?this.highlight:this.shadow;t.StrokeLine(s.x,s.y,s.x+s.w,s.y,h),t.StrokeLine(s.x+s.w,s.y,s.x+s.w,s.y+s.h,h),t.StrokeLine(s.x,s.y+s.h,s.x+s.w,s.y+s.h,r),t.StrokeLine(s.x,s.y,s.x,s.y+s.h,r),t.DrawText(e.x+t.font.cwidth,e.y+t.font.cheight,i,this.color)}},n=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),t.drawBuffer&&this.InitializeBuffer({x:9,y:32})}_Draw(t,e){this.bgcolor&&t.DrawRect(e,this.bgcolor);let i=this.text.length>(e.w-2)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text,s={x:e.x+t.font.cwidth/2,y:e.y+t.font.cheight/2,w:e.w-t.font.cwidth,h:e.h-t.font.cheight},h=!!this.inverted&&this.inverted;this.state.mouseDown&&(h=!0);let r=h?this.shadow:this.highlight,n=h?this.highlight:this.shadow;t.StrokeLine(s.x,s.y,s.x+s.w,s.y,r),t.StrokeLine(s.x+s.w,s.y,s.x+s.w,s.y+s.h,r),t.StrokeLine(s.x,s.y+s.h,s.x+s.w,s.y+s.h,n),t.StrokeLine(s.x,s.y,s.x,s.y+s.h,n);let c=0,o=0;this.state.mouseDown&&(c=parseInt(.3*t.font.cwidth),o=parseInt(.1*t.font.cheight)),t.DrawText(s.x+c+s.w/2-i.length*t.font.cwidth/2,s.y+o+s.h/2-t.font.cheight/2,i,this.color)}},c=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),this.leftChar=t.leftChar?t.leftChar:"<",this.rightChar=t.rightChar?t.rightChar:">",t.drawBuffer&&this.InitializeBuffer({x:9,y:32})}_Draw(t,e){let i=this.text.length>(e.w-2)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text,s=this.color,h=this.bgcolor;this.state.mouseOver&&!this.state.mouseDown&&this.highlight&&(s=this.highlight),h&&(this.state.mouseDown&&(s=this.bgcolor,h=this.color),t.DrawRect(e,h)),this.id===t.active&&(s=this.highlight?this.highlight:s),t.DrawText(e.x+e.w/2-i.length*t.font.cwidth/2,e.y+e.h/2-t.font.cheight/2,i,s),t.DrawText(e.x,e.y+e.h/2-t.font.cheight/2,this.leftChar,s),t.DrawText(e.x+e.w-t.font.cwidth,e.y+e.h/2-t.font.cheight/2,this.rightChar,s)}},o=class extends e{constructor(t){super(t),this.text=t.defaultText?t.defaultText:"",this.font=t.font?t.font:null,this.font?(this.rect.h=parseInt(this.rect.h/this.font.cheight*this.font.cheight),this.rect.w=this.GetMaxTextWidth(this.font,this.text)):(this.rect.w=8,this.rect.h=8),this.editable=!t.editable||t.editable,t.drawBuffer&&this.InitializeBuffer({x:9,y:32})}Text(){return this.text}_Draw(t,e){this.font||(this.font=t.font);let i=this.text,s=this.color,h=this.bgcolor;this.state.mouseOver&&!this.state.mouseDown&&this.highlight&&(s=this.highlight),h&&(this.state.mouseDown&&(s=this.bgcolor,h=this.color),t.DrawRect(e,h)),this.id===t.active&&(s=this.highlight?this.highlight:s,Date.now()%1e3>500&&t.DrawTextFont(this.font,e.x+this.GetMaxTextWidth(this.font,`${i}`),e.y+e.h/2-this.font.cheight/2,"_",s)),t.DrawTextFont(this.font,e.x,e.y+e.h/2-this.font.cheight/2,i,s)}},a=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),this.bgScrollbar=t.bgScrollbar?t.bgScrollbar:"#645355ff",this.list=t.list?t.list:[],this.currentItem=null,this.scrollOffset=t.scrollOffset?t.scrollOffset:0,this.topDown=!t.topDown||t.topDown,this.horizontal=!!t.horizontal&&t.horizontal,this.scrollbar=!t.scrollbar||t.scrollbar,this.scrollbarCharacters={scrollUp:t.scrollUp?t.scrollUp:252,scrollDown:t.scrollDown?t.scrollDown:253,scrollCaret:t.scrollCaret?t.scrollCaret:254},this.draggingCaret=!1}_Draw(t,e){let i=this.color,s=this.bgcolor;this.state.mouseOver&&!this.state.mouseDown&&this.highlight&&(i=this.highlight),s&&t.DrawRect(e,s);let h=e.x+t.font.cwidth,r=e.y;for(let s=this.scrollOffset;s<this.list.length;s++){let n=this.list[s],c={x:h,y:r,w:n.length*t.font.cwidth,h:t.font.cheight},o=this.state.mouseOver&&t.mousePos.y>=c.y&&t.mousePos.x>=c.x&&t.mousePos.x<c.x+c.w&&t.mousePos.y<c.y+c.h,a=this.state.mouseDown&&t.mousePos.y>=c.y&&t.mousePos.x>=c.x&&t.mousePos.x<c.x+c.w&&t.mousePos.y<c.y+c.h;if(a&&(this.currentItem=s),t.DrawText(h,r,n,o?i:this.color,o||this.currentItem===s?{background:{colour:a?"#ccccccff":this.bgScrollbar}}:void 0),this.horizontal?h+=t.font.cwidth*(n.length+1):r+=t.font.cheight,h>e.x+e.w)break;if(r+t.font.cheight>e.y+e.h)break}if(this.rect.h<t.font.cheight*this.list.length&&!this.horizontal){let i={x:e.x+e.w-t.font.cwidth,y:e.y,w:t.font.cwidth,h:t.font.cheight},s={x:e.x+e.w-t.font.cwidth,y:e.y+e.h-t.font.cheight,w:t.font.cwidth,h:t.font.cheight},h={x:e.x+e.w-t.font.cwidth,y:e.y+t.font.cheight,w:t.font.cwidth,h:e.h-2*t.font.cheight};t.DrawRect(h,this.bgScrollbar),t.DrawText(i.x,i.y,this.scrollbarCharacters.scrollUp,this.InsideRect(t.mousePos.x,t.mousePos.y,i)&&this.state.mouseDown?this.highlight:this.color,this.InsideRect(t.mousePos.x,t.mousePos.y,i)&&this.state.mouseDown?{background:{colour:this.color}}:{background:{colour:this.bgScrollbar}}),t.DrawText(s.x,s.y,this.scrollbarCharacters.scrollDown,this.InsideRect(t.mousePos.x,t.mousePos.y,s)&&this.state.mouseDown?this.highlight:this.color,this.InsideRect(t.mousePos.x,t.mousePos.y,s)&&this.state.mouseDown?{background:{colour:this.color}}:{background:{colour:this.bgScrollbar}});let r=this.scrollOffset/(this.list.length-1)*h.h,n=this.color,c=this.bgScrollbar;this.draggingCaret?this.draggingCaret&&this.state.mouseDown?(this.scrollOffset=parseInt((t.mousePos.y-h.y)/h.h*(this.list.length-2)),this.scrollOffset<0?this.scrollOffset=0:this.scrollOffset>this.list.length-1&&(this.scrollOffset=this.list.length-1),c=this.color,n=this.bgScrollbar):this.draggingCaret&&(this.draggingCaret=!1):this.InsideRect(t.mousePos.x,t.mousePos.y,i)&&this.Clicked()?null!==this.scrollOffset&&(this.scrollOffset=this.scrollOffset-1<0?0:this.scrollOffset-1):this.InsideRect(t.mousePos.x,t.mousePos.y,s)&&this.Clicked()?null!==this.scrollOffset&&(this.scrollOffset=this.scrollOffset+1>this.list.length-1?this.list.length-1:this.scrollOffset+1):this.InsideRect(t.mousePos.x,t.mousePos.y,{x:h.x,y:h.y+r,w:h.w,h:t.font.cwidth})&&this.state.mouseDown?this.draggingCaret=!0:this.InsideRect(t.mousePos.x,t.mousePos.y,h)&&this.Clicked()&&null!==this.scrollOffset&&(t.mousePos.y<h.y+r?this.scrollOffset=this.scrollOffset-10>0?this.scrollOffset-10:0:t.mousePos.y>h.y+r+t.font.cheight&&(this.scrollOffset=this.scrollOffset+10<this.list.length-1?this.scrollOffset+10:this.list.length-1));let o=this.InsideRect(t.mousePos.x,t.mousePos.y,{x:h.x,y:h.y+r,w:h.w,h:t.font.cwidth});t.DrawText(h.x,h.y+r,this.scrollbarCharacters.scrollCaret,o?this.highlight:n,{background:{colour:c}})}}},l=class extends e{constructor(t){super(t),this.image=t.image?t.image:null}_Draw(t,e){this.image&&("IMG"===this.image.tagName?t.ctx.drawImage(this.image,this.rect.x,this.rect.y,this.rect.w,this.rect.h):this.image.draw&&this.image.draw())}},x=class extends e{constructor(t){super(t),this.image=t.image?t.image:null,t.innerRect?this.innerRect=t.innerRect:t.borderWidth?this.innerRect={x:t.borderWidth,y:t.borderWidth,w:this.rect.w-2*t.borderWidth,h:this.rect.h-2*t.borderWidth}:this.innerRect={x:0,y:0,w:this.rect.w,h:this.rect.h}}_Draw(t,e){if(this.bgcolor&&t.DrawRect(e,this.bgcolor),this.image){t.ctx.drawImage(this.image,0,0,this.innerRect.x,this.innerRect.y,this.rect.x,this.rect.y,this.innerRect.x,this.innerRect.y),t.ctx.drawImage(this.image,this.image.width-this.innerRect.x,0,this.innerRect.x,this.innerRect.y,this.rect.x+this.rect.w-this.innerRect.x,this.rect.y,this.innerRect.x,this.innerRect.y),t.ctx.drawImage(this.image,0,this.image.height-this.innerRect.y,this.innerRect.x,this.innerRect.y,this.rect.x,this.rect.y+this.rect.h-this.innerRect.y,this.innerRect.x,this.innerRect.y),t.ctx.drawImage(this.image,this.image.width-this.innerRect.x,this.image.height-this.innerRect.y,this.innerRect.x,this.innerRect.y,this.rect.x+this.rect.w-this.innerRect.x,this.rect.y+this.rect.h-this.innerRect.y,this.innerRect.x,this.innerRect.y);for(let e=this.rect.x+this.innerRect.x;e<this.rect.x+this.rect.w-this.innerRect.x;e+=this.image.width-2*this.innerRect.x){let i=this.image.width-2*this.innerRect.x;e+i>this.rect.x+this.rect.w-this.innerRect.x&&(i=this.rect.x+this.rect.w-this.innerRect.x-e),t.ctx.drawImage(this.image,this.innerRect.x,0,i,this.innerRect.y,e,this.rect.y,i,this.innerRect.y)}for(let e=this.rect.x+this.innerRect.x;e<this.rect.x+this.rect.w-this.innerRect.x;e+=this.image.width-2*this.innerRect.x){let i=this.image.width-2*this.innerRect.x;e+i>this.rect.x+this.rect.w-this.innerRect.x&&(i=this.rect.x+this.rect.w-this.innerRect.x-e),t.ctx.drawImage(this.image,this.innerRect.x,this.image.height-this.innerRect.y,i,this.innerRect.y,e,this.rect.y+this.rect.h-this.innerRect.y,i,this.innerRect.y)}for(let e=this.rect.y+this.innerRect.y;e<this.rect.y+this.rect.h-this.innerRect.y;e+=this.image.height-2*this.innerRect.y){let i=this.image.height-2*this.innerRect.y;e+i>this.rect.y+this.rect.h-this.innerRect.y&&(i=this.rect.y+this.rect.h-this.innerRect.y-e),t.ctx.drawImage(this.image,0,this.innerRect.y,this.innerRect.x,i,this.rect.x,e,this.innerRect.x,i)}for(let e=this.rect.y+this.innerRect.y;e<this.rect.y+this.rect.h-this.innerRect.y;e+=this.image.height-2*this.innerRect.y){let i=this.image.height-2*this.innerRect.y;e+i>this.rect.y+this.rect.h-this.innerRect.y&&(i=this.rect.y+this.rect.h-this.innerRect.y-e),t.ctx.drawImage(this.image,this.image.width-this.innerRect.x,this.innerRect.y,this.innerRect.x,i,this.rect.x+this.rect.w-this.innerRect.x,e,this.innerRect.x,i)}let e=this.innerRect.x,i=this.innerRect.y,s=this.image.width-2*this.innerRect.x,h=this.image.height-2*this.innerRect.y,r=this.innerRect.x+this.rect.x,n=this.innerRect.y+this.rect.y;for(;n<this.rect.y+this.rect.h-this.innerRect.y;){let c=s,o=h;r+c>this.rect.x+this.rect.w-this.innerRect.x&&(c=this.rect.x+this.rect.w-this.innerRect.x-r),n+o>this.rect.y+this.rect.h-this.innerRect.y&&(o=this.rect.y+this.rect.h-this.innerRect.y-n),t.ctx.drawImage(this.image,e,i,c,o,r,n,c,o),r+=s,r>this.rect.x+this.rect.w-this.innerRect.x&&(r=this.innerRect.x+this.rect.x,n+=h)}}let i=this.text.length>(e.w-2)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text;t.DrawText(e.x+this.innerRect.x,e.y+this.innerRect.y,i,this.color)}},w=class extends e{constructor(t){super(t),this.image=t.image?t.image:null,this.imageDown=t.imageDown?t.imageDown:null,this.imageHover=t.imageHover?t.imageHover:null,this.pressedOffsetY=t.pressedOffsetY?t.pressedOffsetY:2,t.innerRect?this.innerRect=t.innerRect:t.borderWidth?this.innerRect={x:t.borderWidth,y:t.borderWidth,w:this.rect.w-2*t.borderWidth,h:this.rect.h-2*t.borderWidth}:this.innerRect={x:0,y:0,w:this.rect.w,h:this.rect.h}}drawImageSlice(t,e){if(e){t.ctx.drawImage(e,0,0,this.innerRect.x,this.innerRect.y,this.rect.x,this.rect.y,this.innerRect.x,this.innerRect.y);let i=e.width-(this.innerRect.x+this.innerRect.w);t.ctx.drawImage(e,e.width-i,0,i,this.innerRect.y,this.rect.x+this.rect.w-i,this.rect.y,i,this.innerRect.y);let s=e.height-(this.innerRect.y+this.innerRect.h);t.ctx.drawImage(e,e.width-i,e.height-s,i,s,this.rect.x+this.rect.w-i,this.rect.y+this.rect.h-s,i,s),t.ctx.drawImage(e,0,e.height-s,this.innerRect.x,s,this.rect.x,this.rect.y+this.rect.h-s,this.innerRect.x,s);for(let s=this.rect.x+this.innerRect.x;s<this.rect.x+this.rect.w-i;s+=this.innerRect.w){let h=e.width-i;s+h>this.rect.x+this.rect.w-i&&(h=this.rect.x+this.rect.w-i-s),t.ctx.drawImage(e,this.innerRect.x,0,h,this.innerRect.y,s,this.rect.y,h,this.innerRect.y)}for(let h=this.rect.x+this.innerRect.x;h<this.rect.x+this.rect.w-i;h+=this.innerRect.w){let r=e.width-i;h+r>this.rect.x+this.rect.w-i&&(r=this.rect.x+this.rect.w-i-h),t.ctx.drawImage(e,this.innerRect.x,e.height-s,r,s,h,this.rect.y+this.rect.h-s,r,s)}for(let i=this.rect.y+this.innerRect.y;i<this.rect.y+this.rect.h-s;i+=this.innerRect.h){let h=e.height-s;i+h>this.rect.y+this.rect.h-s&&(h=this.rect.y+this.rect.h-s-i),t.ctx.drawImage(e,0,this.innerRect.y,this.innerRect.x,h,this.rect.x,i,this.innerRect.x,h)}for(let h=this.rect.y+this.innerRect.y;h<this.rect.y+this.rect.h-s;h+=this.innerRect.y){let r=e.height-s;h+r>this.rect.y+this.rect.h-s&&(r=this.rect.y+this.rect.h-s-h),t.ctx.drawImage(e,e.width-i,this.innerRect.y,i,r,this.rect.x+this.rect.w-i,h,i,r)}let h=this.innerRect.x,r=this.innerRect.y,n=e.width-this.innerRect.w,c=e.height-this.innerRect.h,o=this.innerRect.x+this.rect.x,a=this.innerRect.y+this.rect.y;for(;a<this.rect.y+this.rect.h-s;){let l=n,x=c;o+l>this.rect.x+this.rect.w-i&&(l=this.rect.x+this.rect.w-i-o),a+x>this.rect.y+this.rect.h-s&&(x=this.rect.y+this.rect.h-s-a),t.ctx.drawImage(e,h,r,l,x,o,a,l,x),o+=n,o>this.rect.x+this.rect.w-i&&(o=this.innerRect.x+this.rect.x,a+=c)}}}_Draw(t,e){let i=this.state.mouseDown?this.pressedOffsetY:0,s=this.Hover()?this.highlight:this.color;this.Hover()&&!this.state.mouseDown&&this.imageHover?this.drawImageSlice(t,this.imageHover):this.state.mouseDown&&this.imageDown?this.drawImageSlice(t,this.imageDown):this.drawImageSlice(t,this.image);let h=this.text.length>(e.w-2)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text;t.DrawText(e.x+e.w/2-h.length*t.font.cwidth/2,e.y+e.h/2-t.font.cheight/2+i,h,s)}};class g{constructor(t,e){this.canvas=t,this.originalCanvas=t,this.ctx=t.getContext("2d"),this.originalCtx=this.ctx,bfontjs.LoadDefaultFonts(),this.font=e||bfontjs.Fonts("default"),this.lastRect=null,this.mousePos={x:0,y:0},this.mouseButton=0,this.active=null,this.elements=[],this.postUpdateIds=[],this.onUpdate=()=>[],this.canvas.addEventListener("mousemove",(e=>{this.executing&&(this.mousePos.x=parseInt((e.clientX-t.offsetLeft)*(this.canvas.width/parseInt(this.canvas.style.width))),this.mousePos.y=parseInt((e.clientY-t.offsetTop)*(this.canvas.height/parseInt(this.canvas.style.height))))})),this.canvas.addEventListener("mousedown",(t=>{this.executing&&(this.mouseButton=t.buttons)})),this.canvas.addEventListener("mouseup",(t=>{this.executing&&(this.mouseButton=0)})),window.addEventListener("keydown",(t=>{this.executing&&"Tab"===t.key&&t.preventDefault()})),window.addEventListener("keyup",(t=>{if(this.executing)if(this.active){let e=this.elements.filter((t=>void 0!==t)).filter((t=>t.id===this.active));if(e.length>0&&e[0].editable&&(1===t.key.length?(e[0].prevText=e[0].text,e[0].text+=t.key):"Backspace"===t.key?(e[0].prevText=e[0].text,e[0].text=e[0].text.substring(0,e[0].text.length-1)):"Enter"===t.key&&(this.active=null)),e.length>0&&"Tab"===t.key){let t=this.elements.findIndex((t=>t.id===this.active));t+1<this.elements.length?t++:t=0,this.active=this.elements[t].id}}else this.elements.length>0&&"Tab"===t.key&&(this.active=this.elements[0].id);return!1})),this.Enable()}Disable(){this.executing=!1}Enable(){this.executing=!0,this.UpdateThread()}UpdateThread(){try{if(this.executing){let t=this.elements.map((t=>t.id));this.postUpdateIds=[],this.elements=this.elements.filter((t=>void 0!==t)),this.onUpdate(this);for(let e in t)0===this.postUpdateIds.filter((i=>i===t[e])).length&&(this.elements[this.elements.findIndex((i=>void 0!==i&&i.id===t[e]))]=void 0);this.elements=this.elements.filter((t=>void 0!==t)),this.Update(),setTimeout((()=>this.UpdateThread()),16)}}catch(t){console.error(t)}}ChangeContext(t){this.canvas=t,this.ctx=t.getContext("2d")}ResetContext(){this.canvas=this.originalCanvas,this.ctx=this.originalCtx}RemoveElement(t){if(this.elements.findIndex((e=>e.id===t))>=0){let e=[];for(let i in this.elements){let s=this.elements[i];s.id!==t&&e.push(s)}this.elements=e}}RemoveElements(){this.elements=[]}ElementToTop(t){let e=this.elements.findIndex((e=>e.id===t));if(e>=0){let t=[];e-1>=0&&(t=this.elements.slice(0,e)),e+1<=this.elements.length-1&&t.push(...this.elements.slice(e+1)),t.push(this.elements[e]),this.elements=t}}GetMaxTextWidth(t){let e=this.font,i=[];try{"number"==typeof t&&(t=e.codepage.filter((e=>e.codenumber===t))[0].symbol),i=t.split("\n")}catch(e){console.log("Error splitting txt parameters: ",e," typeof txt =",typeof t)}let s=0;for(let t in i){let h=i[t];h.length*e.cwidth>s&&(s=h.length*e.cwidth)}return s}Element(t){t.type=t.type?t.type:"element";let s=this.elements.filter((e=>e.id===t.id));if(0===s.length){let s=new(function(t){switch(t.toLowerCase()){case"element":return e;case"frameflat":return i;case"frame3d":return r;case"button3d":return n;case"buttonflat":return c;case"textboxflat":return o;case"list":return a;case"image":return l;case"frameimage":return x;case"buttonimage":return w}}(t.type))(t);return s.Update(this,!1),this.elements.push(s),this.postUpdateIds.push(t.id),this.lastRect=s.rect,s}this.postUpdateIds.push(t.id);for(let e in t)s[0][e]=t[e];return this.lastRect=s[0].rect,s[0]}Layout(t){return t.layout=t.layout?t.layout:"row",this.lastRect&&(t.layout.includes("row")?t.rect?(t.rect.x+=this.lastRect.x,t.rect.y+=this.lastRect.y+this.lastRect.h):(t.x+=this.lastRect.x,t.y+=this.lastRect.y+this.lastRect.h):t.layout.includes("column")&&(t.rect?(t.rect.x+=this.lastRect.x+this.lastRect.w,t.rect.y+=this.lastRect.y):(t.x+=this.lastRect.x+this.lastRect.w,t.y+=this.lastRect.y))),this.Element(t)}DrawTextFont(t,e,i,s,h,r){if(void 0!==s&&""!==s)return bfontjs.DrawText(this.ctx,parseInt(e),parseInt(i),s,h,t,r)}DrawText(t,e,i,s,h){return this.DrawTextFont(this.font,t,e,i,s,h)}DrawRect(t,e){this.ctx.fillStyle=e,this.ctx.fillRect(t.x,t.y,t.w,t.h)}StrokeRect(t,e){this.ctx.lineWidth=1,this.ctx.strokeStyle=e,this.ctx.strokeRect(parseInt(t.x)+.5,parseInt(t.y)+.5,parseInt(t.w),parseInt(t.h))}StrokeLine(t,e,i,s,h){this.ctx.lineWidth=1,this.ctx.strokeStyle=h,this.ctx.beginPath(),this.ctx.moveTo(parseInt(t)+.5,parseInt(e)+.5),this.ctx.lineTo(parseInt(i)+.5,parseInt(s)+.5),this.ctx.stroke()}Update(){let t=!1;for(let e=this.elements.length-1;e>=0;e--)!t&&this.elements[e]&&(t=this.elements[e].Update(this,t))}Draw(){for(let t in this.elements)this.elements[t]&&this.elements[t].Draw(this)}}})(),h})()));
//# sourceMappingURL=bfont-imui.js.map