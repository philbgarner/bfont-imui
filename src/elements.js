import Element from './elements/Element.js'
import FrameFlat from './elements/FrameFlat.js'
import Frame3d from './elements/Frame3d.js'
import Button3d from './elements/Button3d.js'
import ButtonFlat from './elements/ButtonFlat.js'
import TextBoxFlat from './elements/TextBoxFlat.js'
import List from './elements/List.js'
import Image from './elements/Image.js'

function GetElementType(type) {
    switch(type.toLowerCase()) {
        case 'element':
            return Element
        case 'frameflat':
            return FrameFlat
        case 'frame3d':
            return Frame3d
        case 'button3d':
            return Button3d
        case 'buttonflat':
            return ButtonFlat
        case 'textboxflat':
            return TextBoxFlat
        case 'list':
            return List
        case 'image':
            return Image
    }
}

export { Element, FrameFlat, Frame3d, Button3d, ButtonFlat, TextBoxFlat, List, Image, GetElementType }