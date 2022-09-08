# bfont-imui

bfont-imui is a JavaScript library that allows you to rapidly create user interfaces on a canvas programmatically with a bitmap font.

bfont-imui uses the [bfont](https://github.com/philbgarner/bfontjs) library to render precompiled bitmap fonts that include a base64 copy of the font bitmap and a lookup table containing each glyph's location in the bitmap.

## Example

Include the bfont and bfont-imui libraries in your html page:

```
<body onload="Start()">
    <canvas id="maincanvas" width="720" height="400"></canvas>
    <script src="./bfontjs.js"></script>
    <script src="../dist/bfont-imui.js"></script>
    <script src="./index.js"></script>
</body>
```

Then in `index.js` initialize the ImUI object and define the `onUpdate` method.  Elements can be added to the render queue here.

```
imu = new imui.ImUI(canvas)

imu.onUpdate = (ui) => {
    ui.Element({ id: 'bg', text: 'bg', rect: { x: 0, y: 0, w: 720, h: 400 }, bgcolor: '#5a5a5aff', color: '#000000ff', highlight: '#f1f1f1ff'})
    if (ui.Element({ id: 'lblhover', text: 'Immediate Mode Test (Hover Me)', x: 35, y: 100, bgcolor: '#0000ddff', color: '#000000ff', highlight: '#f1f1f1ff'}).Hover()) {
            ui.Element({ id: 'lblhovered', text: 'Hovered!', x: 65, y: 116 })
    }
    if (ui.Element({ id: 'lblclick', text: 'Immediate Mode Test (Click Me)', x: 35, y: 132, bgcolor: '#0000ddff', color: '#000000ff', highlight: '#f1f1f1ff'}).Clicked()) {
        toggleClick = !toggleClick
    }
    if (toggleClick) {
        ui.Element({ id: 'edtTest', type: 'TextBoxFlat', defaultText: 'Test', rect: { x: 5, y: 32, w: 115, h: 16 }, color: '#ccccccff', highlight: '#f1f1f1ff', bgcolor: '#0000ddff' })
        ui.Element({ id: 'edtTest2', type: 'TextBoxFlat', defaultText: 'Test 2', rect: { x: 5, y: 48, w: 115, h: 16 }, color: '#ccccccff', highlight: '#f1f1f1ff', bgcolor: '#0000ddff' })
        ui.Element({ id: 'btnTest', type: 'ButtonFlat', text: 'Test', rect: { x: 125, y: 32, w: 64, h: 16 }, color: '#000000ff', highlight: '#f1f1f1ff', bgcolor: '#ccccccff' })
    }
}
```

![Example controls.](https://github.com/philbgarner/bfont-imui/blob/master/examples/example.png)

See the examples folder for details.