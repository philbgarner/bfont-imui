var imu = null
var ctx = null
var canvas = null

function drawFrame(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (imu) {
        imu.Draw()
    }

    window.requestAnimationFrame(drawFrame)
}

var toggleClick = false

function Start() {
    canvas = document.getElementById('maincanvas')
    ctx = canvas.getContext('2d')

    let ratio = this.canvas.width / this.canvas.height
    this.canvas.style.height = window.innerHeight + 'px'
    this.canvas.style.width = window.innerHeight * ratio + 'px'
    window.addEventListener('resize', () => {
        this.canvas.style.height = window.innerHeight + 'px'
        this.canvas.style.width = window.innerHeight * ratio + 'px'
      })

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
            ui.active = 'edtTest'
        }
    }

    window.requestAnimationFrame(drawFrame)
}
