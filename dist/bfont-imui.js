!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("canvas")):"function"==typeof define&&define.amd?define(["canvas"],e):"object"==typeof exports?exports.imui=e(require("canvas")):t.imui=e(t.canvas)}(self,(t=>(()=>{"use strict";var e={517:e=>{e.exports=t}},s={};function i(t){var h=s[t];if(void 0!==h)return h.exports;var o=s[t]={exports:{}};return e[t](o,o.exports,i),o.exports}i.d=(t,e)=>{for(var s in e)i.o(e,s)&&!i.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var h={};return(()=>{i.r(h),i.d(h,{ImUI:()=>l});var t=i(517);const e=class{constructor(t){if(!t.id)throw new Error("Element must have unique id.");this.id=t.id,this.autosize=!t.autosize||t.autosize,t.rect&&(this.autosize=!1),this.rect=t.rect?t.rect:{x:0,y:0,w:0,h:0},this.color=t.color?t.color:"#ccccccff",this.bgcolor=t.bgcolor?t.bgcolor:void 0,this.text=t.text?t.text:"",this.prevText=this.text,this.rect.x=t.x?t.x:this.rect.x,this.rect.y=t.y?t.y:this.rect.y,this.state={clicked:!1,mouseOver:!1,mouseDown:!1,mouseUp:!1,change:!0},this.prevState=t.prevState?t.prevState:{clicked:!1,mouseOver:!1,mouseDown:!1,mouseUp:!1,change:!1},this.elements=[],this.buffer=null,t.drawBuffer&&this.InitializeBuffer()}InitializeBuffer(e){console.log("initializebuffer",e);let s=0,i=0;e?(s=e.x,i=e.y,this.margin=e):this.margin={x:0,y:0};try{this.buffer=document.createElement("canvas"),this.buffer.width=this.rect.w+s,this.buffer.height=this.rect.h+i,this.bufferCtx=this.buffer.getContext("2d")}catch{this.buffer=(0,t.createCanvas)(this.rect.w+s,this.rect.h+i),this.bufferCtx=this.buffer.getContext("2d")}}DidChangeState(){return this.prevState.clicked!==this.state.clicked||this.prevState.mouseOver!==this.state.mouseOver||this.prevState.mouseDown!==this.state.mouseDown||this.prevState.mouseUp!==this.state.mouseUp||this.prevState.change!==this.state.change}BuildPreviousState(){return{clicked:this.state.clicked,mouseOver:this.state.mouseOver,mouseDown:this.state.mouseDown,mouseUp:this.state.mouseUp,change:this.state.change}}Clicked(){return this.state.clicked}Hover(){return this.state.mouseOver}MouseDown(){return this.state.mouseDown}MouseUp(){return this.state.mouseUp}setState(t){this.prevState=this.BuildPreviousState();for(let e in t)this.state[e]=t[e]}Update(t){this.autosize&&(this.rect.w=this.text.length*t.font.cwidth,this.rect.h=t.font.cheight),t.mousePos.x>=this.rect.x&&t.mousePos.y>=this.rect.y&&t.mousePos.x<=this.rect.x+this.rect.w&&t.mousePos.y<=this.rect.y+this.rect.h?(this.state.mouseOver&&this.state.clicked?this.setState({mouseOver:!0,clicked:!1}):this.setState({mouseOver:!0}),t.mouseButton>0&&!this.state.mouseDown&&this.setState({mouseDown:!0}),0===t.mouseButton&&this.prevState.mouseDown?this.setState({mouseUp:!0,mouseDown:!1}):0===t.mouseButton&&this.state.mouseUp&&(this.setState({mouseUp:!1,clicked:!0}),t.active=this.id)):this.setState({mouseOver:!1,mouseDown:!1,mouseUp:!1,clicked:!1}),this.text!==this.prevText?(this.setState({change:!0}),this.prevText=this.text):this.setState({change:!1}),this.state.clicked&&this.id!==t.active&&(t.active=this.id,this.setState({changed:!0}));for(let e in this.elements)this.elements[e].Update(t)}_Draw(t,e){this.bgcolor&&t.DrawRect(e,this.bgcolor);let s=this.color;this.id===t.active&&(s=this.highlight?this.highlight:s),t.DrawText(e.x,e.y,this.text,s)}Draw(t){let e=this.rect;this.buffer?(t.ChangeContext(this.buffer),e={x:0,y:0,w:this.rect.w,h:this.rect.h},!this.DidChangeState()&&this.initialDrawComplete||(this.buffer&&this.bufferCtx.clearRect(0,0,e.w,e.h),this._Draw(t,e),this.initialDrawComplete=!0),t.ResetContext(),t.ctx.drawImage(this.buffer,this.rect.x,this.rect.y)):this._Draw(t,this.rect)}},s=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),t.drawBuffer&&this.InitializeBuffer({x:9,y:32})}_Draw(t,e){this.bgcolor&&t.DrawRect(e,this.bgcolor);let s=this.text.length>(e.w-2)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text,i={x:e.x+t.font.cwidth/2,y:e.y+t.font.cheight/2,w:e.w-t.font.cwidth,h:e.h-t.font.cheight};t.StrokeRect(i,this.color),t.DrawText(e.x+t.font.cwidth,e.y+t.font.cheight,s,this.color)}},o=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),t.drawBuffer&&this.InitializeBuffer({x:9,y:32})}_Draw(t,e){this.bgcolor&&t.DrawRect(e,this.bgcolor);let s=this.text.length>(e.w-2)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text,i={x:e.x+t.font.cwidth/2,y:e.y+t.font.cheight/2,w:e.w-t.font.cwidth,h:e.h-t.font.cheight},h=this.inverted?this.shadow:this.highlight,o=this.inverted?this.highlight:this.shadow;t.StrokeLine(i.x,i.y,i.x+i.w,i.y,h),t.StrokeLine(i.x+i.w,i.y,i.x+i.w,i.y+i.h,h),t.StrokeLine(i.x,i.y+i.h,i.x+i.w,i.y+i.h,o),t.StrokeLine(i.x,i.y,i.x,i.y+i.h,o),t.DrawText(e.x+t.font.cwidth,e.y+t.font.cheight,s,this.color)}},r=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),t.drawBuffer&&this.InitializeBuffer({x:9,y:32})}_Draw(t,e){this.bgcolor&&t.DrawRect(e,this.bgcolor);let s=this.text.length>(e.w-2)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text,i={x:e.x+t.font.cwidth/2,y:e.y+t.font.cheight/2,w:e.w-t.font.cwidth,h:e.h-t.font.cheight},h=!!this.inverted&&this.inverted;this.state.mouseDown&&(h=!0);let o=h?this.shadow:this.highlight,r=h?this.highlight:this.shadow;t.StrokeLine(i.x,i.y,i.x+i.w,i.y,o),t.StrokeLine(i.x+i.w,i.y,i.x+i.w,i.y+i.h,o),t.StrokeLine(i.x,i.y+i.h,i.x+i.w,i.y+i.h,r),t.StrokeLine(i.x,i.y,i.x,i.y+i.h,r);let n=0,a=0;this.state.mouseDown&&(n=parseInt(.3*t.font.cwidth),a=parseInt(.1*t.font.cheight)),t.DrawText(i.x+n+i.w/2-s.length*t.font.cwidth/2,i.y+a+i.h/2-t.font.cheight/2,s,this.color)}},n=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),t.drawBuffer&&this.InitializeBuffer({x:9,y:32})}_Draw(t,e){let s=this.text.length>(e.w-2)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text,i=this.color,h=this.bgcolor;this.state.mouseOver&&!this.state.mouseDown&&this.highlight&&(i=this.highlight),h&&(this.state.mouseDown&&(i=this.bgcolor,h=this.color),t.DrawRect(e,h)),this.id===t.active&&(i=this.highlight?this.highlight:i),t.DrawText(e.x+e.w/2-s.length*t.font.cwidth/2,e.y+e.h/2-t.font.cheight/2,s,i),t.DrawText(e.x,e.y+e.h/2-t.font.cheight/2,"<",i),t.DrawText(e.x+e.w-t.font.cwidth,e.y+e.h/2-t.font.cheight/2,">",i)}},a=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),this.text=t.defaultText?t.defaultText:"",this.editable=!t.editable||t.editable,t.drawBuffer&&this.InitializeBuffer({x:9,y:32})}Text(){return this.text}_Draw(t,e){let s=this.text.length>(e.w-2*t.font.cwidth)/t.font.cwidth?this.text.substr(0,parseInt((e.w-2)/t.font.cwidth)):this.text,i=this.color,h=this.bgcolor;this.state.mouseOver&&!this.state.mouseDown&&this.highlight&&(i=this.highlight),h&&(this.state.mouseDown&&(i=this.bgcolor,h=this.color),t.DrawRect(e,h)),this.id===t.active&&(i=this.highlight?this.highlight:i,Date.now()%1e3>500&&t.DrawText(e.x+t.font.cwidth+s.length*t.font.cwidth,e.y+e.h/2-t.font.cheight/2,"_",i)),t.DrawText(e.x+t.font.cwidth,e.y+e.h/2-t.font.cheight/2,s,i),t.DrawText(e.x,e.y+e.h/2-t.font.cheight/2,"[",i),t.DrawText(e.x+e.w-t.font.cwidth,e.y+e.h/2-t.font.cheight/2,"]",i)}},c=class extends e{constructor(t){super(t),this.rect.h=16*parseInt(this.rect.h/16),this.rect.w=9*parseInt(this.rect.w/9),this.list=t.list?t.list:[],this.horizontal=!!t.horizontal&&t.horizontal}_Draw(t,e){let s=this.color,i=this.bgcolor;this.state.mouseOver&&!this.state.mouseDown&&this.highlight&&(s=this.highlight),i&&t.DrawRect(e,i);let h=e.x+t.font.cwidth,o=e.y;for(let i in this.list){let r=this.list[i]>e.w-2*t.font.cwidth?this.list.substr(0,parseInt(e.w-t.font.cwidth)):this.list[i],n={x:h,y:o,w:h+r.length*t.font.cwidth,h:o+t.font.cheight},a=this.state.mouseOver&&!this.state.mouseDown&&t.mousePos.y>=n.y&&t.mousePos.x>=n.x&&t.mousePos.x<=n.x+n.w&&t.mousePos.y<=n.y+n.h,c=this.state.mouseDown&&t.mousePos.y>=n.y&&t.mousePos.x>=n.x&&t.mousePos.x<=n.x+n.w&&t.mousePos.y<=n.y+n.h;if(t.DrawText(h,o,r,a?s:this.color,a?{background:{colour:c?"#ccccccff":"#000000ff"}}:void 0),this.horizontal?h+=t.font.cwidth*(r.length+1):o+=t.font.cheight,h>e.x+e.w)break}}};class l{constructor(t,e){this.canvas=t,this.originalCanvas=t,this.ctx=t.getContext("2d"),this.originalCtx=this.ctx,bfontjs.LoadDefaultFonts(),this.font=e||bfontjs.Fonts("default"),this.mousePos={x:0,y:0},this.mouseButton=0,this.active=null,this.elements=[],this.postUpdateIds=[],this.onUpdate=()=>[],this.canvas.addEventListener("mousemove",(t=>{this.mousePos.x=parseInt(t.clientX*(this.canvas.width/parseInt(this.canvas.style.width))),this.mousePos.y=parseInt(t.clientY*(this.canvas.height/parseInt(this.canvas.style.height)))})),this.canvas.addEventListener("mousedown",(t=>{this.mouseButton=t.buttons})),this.canvas.addEventListener("mouseup",(t=>{this.mouseButton=0})),window.addEventListener("keydown",(t=>{"Tab"===t.key&&t.preventDefault()})),window.addEventListener("keyup",(t=>{if(this.active){let e=this.elements.filter((t=>t.id===this.active));if(e.length>0&&e[0].editable&&(1===t.key.length?(e[0].prevText=e[0].text,e[0].text+=t.key):"Backspace"===t.key?(e[0].prevText=e[0].text,e[0].text=e[0].text.substring(0,e[0].text.length-1)):"Enter"===t.key&&(this.active=null)),e.length>0&&"Tab"===t.key){let t=this.elements.findIndex((t=>t.id===this.active));t+1<this.elements.length?t++:t=0,this.active=this.elements[t].id}}else this.elements.length>0&&"Tab"===t.key&&(this.active=this.elements[0].id);return!1})),setInterval((()=>{let t=this.elements.map((t=>t.id));this.postUpdateIds=[],this.onUpdate(this);for(let e in t)0===this.postUpdateIds.filter((s=>s===t[e])).length&&(this.elements[this.elements.findIndex((s=>s.id===t[e]))]=void 0);this.elements=this.elements.filter((t=>void 0!==t)),this.Update()}),16)}ChangeContext(t){this.canvas=t,this.ctx=t.getContext("2d")}ResetContext(){this.canvas=this.originalCanvas,this.ctx=this.originalCtx}Element(t){t.type=t.type?t.type:"element";let i=this.elements.filter((e=>e.id===t.id));if(0===i.length){let i=new(function(t){switch(t.toLowerCase()){case"element":return e;case"frameflat":return s;case"frame3d":return o;case"button3d":return r;case"buttonflat":return n;case"textboxflat":return a;case"list":return c}}(t.type))(t);return i.Update(this),this.elements.push(i),this.postUpdateIds.push(t.id),i}this.postUpdateIds.push(t.id);for(let e in t)i[0][e]=t[e];return i[0]}DrawText(t,e,s,i,h){bfontjs.DrawText(this.ctx,parseInt(t),parseInt(e),s,i,this.font,h)}DrawRect(t,e){this.ctx.fillStyle=e,this.ctx.fillRect(t.x,t.y,t.w,t.h)}StrokeRect(t,e){this.ctx.lineWidth=1,this.ctx.strokeStyle=e,this.ctx.strokeRect(parseInt(t.x)+.5,parseInt(t.y)+.5,parseInt(t.w),parseInt(t.h))}StrokeLine(t,e,s,i,h){this.ctx.lineWidth=1,this.ctx.strokeStyle=h,this.ctx.beginPath(),this.ctx.moveTo(parseInt(t)+.5,parseInt(e)+.5),this.ctx.lineTo(parseInt(s)+.5,parseInt(i)+.5),this.ctx.stroke()}Update(){for(let t in this.elements)this.elements[t].Update(this)}Draw(){for(let t in this.elements)this.elements[t].Draw(this)}}})(),h})()));
//# sourceMappingURL=bfont-imui.js.map