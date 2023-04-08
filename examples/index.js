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

    let listItems = []
    for (let i = 0; i < 100; i++) {
        listItems.push('Test ' + i)
    }

    imu.onUpdate = (ui) => {
        ui.Element({ id: 'bg', type: 'FrameFlat', text: '', rect: { x: 0, y: 0, w: 720, h: 400 }, bgcolor: '#5a5a5aff', color: '#000000ff', highlight: '#f1f1f1ff'})

        ui.Element({ id: 'listImage', type: 'ListImage', list: listItems, rect: { x: 25, y: 25, w: 400, h: 250 }, scrollbarWidth: 16 })

        ui.Element({ id: 'layoutcolTest1', text: 'Test Animation', x: 200, y: 320, bgcolor: '#ccccccff', color: '#ffffffff', highlight: '#f1f1f1ff',
            anim: {
                curve: 'bezier',
                duration: 300,
                params: {
                    x: 100
                },
                onComplete: (el) => { console.log('anim complete', el)}
            }
        })

    }

    window.requestAnimationFrame(drawFrame)
}
