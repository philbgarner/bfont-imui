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
        ui.Element({ id: 'bg', type: 'FrameFlat', text: '', rect: { x: 0, y: 0, w: 720, h: 400 }, bgcolor: '#5a5a5aff', color: '#000000ff', highlight: '#f1f1f1ff'})
        ui.Element({ id: 'edtTest', type: 'TextBoxFlat', defaultText: 'Textbox', rect: { x: 25, y: 32, w: 215, h: 16 }, color: '#ccccccff', highlight: '#f1f1f1ff', bgcolor: '#0000ddff' })
        ui.Element({ id: 'edtTest2', type: 'TextBoxFlat', defaultText: 'Textbox', rect: { x: 25, y: 48, w: 215, h: 16 }, color: '#ccccccff', highlight: '#f1f1f1ff', bgcolor: '#0000ddff' })
        ui.Element({ id: 'btnTest', type: 'ButtonFlat', text: 'Button', rect: { x: 245, y: 32, w: 96, h: 16 }, color: '#000000ff', highlight: '#f1f1f1ff', bgcolor: '#ccccccff' })
        ui.Element({ id: 'btnTest2', type: 'Button3d', text: 'Big Button', rect: { x: 25, y: 68, w: 215, h: 48 }, color: '#000000ff', highlight: '#f1f1f1ff', shadow: '#5a5a5aff', bgcolor: '#ccccccff' })
    }

    window.requestAnimationFrame(drawFrame)
}
