const canvas = document.querySelector('#mapCanvas')
const context = canvas.getContext('2d')
const gridSize = 40
const columns = canvas.width / gridSize
const rows = canvas.height / gridSize
const backgroundPath = '../assets/backgrounds/'

const state = {
    tool: 'ground',
    showGrid: true,
    background: 'bg_stage1.png',
    objects: [],
    colliders: [],
    history: [],
    selected: null,
    backgroundImage: null
}

const toolLabels = {
    ground: 'Ground', tree: 'Tree', rock: 'Rock', ammo: 'Ammo', collision: 'Collision', eraser: 'Eraser'
}

function snapshot() {
    state.history.push(JSON.stringify({ objects: state.objects, colliders: state.colliders }))
    if (state.history.length > 30) state.history.shift()
}

function cellFromEvent(event) {
    const rect = canvas.getBoundingClientRect()
    return {
        x: Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width / gridSize),
        y: Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height / gridSize)
    }
}

function centerOf(cell) {
    return { x: cell.x * gridSize + gridSize / 2, y: cell.y * gridSize + gridSize / 2 }
}

function objectAt(cell) {
    return state.objects.find(object => object.x === cell.x && object.y === cell.y)
}

function colliderAt(cell) {
    return state.colliders.find(collider => collider.x === cell.x && collider.y === cell.y)
}

function editCell(cell) {
    if (cell.x < 0 || cell.x >= columns || cell.y < 0 || cell.y >= rows) return
    snapshot()
    const existingObject = objectAt(cell)
    const existingCollider = colliderAt(cell)

    if (state.tool === 'eraser') {
        state.objects = state.objects.filter(object => object !== existingObject)
        state.colliders = state.colliders.filter(collider => collider !== existingCollider)
        state.selected = null
    } else if (state.tool === 'collision') {
        if (existingCollider) state.colliders = state.colliders.filter(collider => collider !== existingCollider)
        else state.colliders.push({ x: cell.x, y: cell.y, w: 1, h: 1 })
        state.selected = { type: 'collision', ...cell }
    } else if (state.tool !== 'ground') {
        if (existingObject) existingObject.type = state.tool
        else state.objects.push({ type: state.tool, x: cell.x, y: cell.y })
        state.selected = { type: state.tool, ...cell }
    } else {
        state.selected = { type: 'ground', ...cell }
    }
    render()
}

function drawBackground() {
    context.fillStyle = '#b8c6ae'
    context.fillRect(0, 0, canvas.width, canvas.height)
    if (state.backgroundImage?.complete && state.backgroundImage.naturalWidth > 0) {
        context.globalAlpha = 0.52
        context.drawImage(state.backgroundImage, 0, 0, canvas.width, canvas.height)
        context.globalAlpha = 1
    }
}

function drawObject(object) {
    const point = centerOf(object)
    context.save()
    context.translate(point.x, point.y)
    if (object.type === 'tree') {
        context.fillStyle = '#765535'
        context.fillRect(-4, 2, 8, 18)
        context.fillStyle = '#386c5b'
        context.beginPath(); context.arc(-7, -5, 12, 0, Math.PI * 2); context.fill()
        context.fillStyle = '#4e8267'
        context.beginPath(); context.arc(7, -7, 11, 0, Math.PI * 2); context.fill()
        context.beginPath(); context.arc(0, -15, 11, 0, Math.PI * 2); context.fill()
    }
    if (object.type === 'rock') {
        context.fillStyle = '#5f7075'
        context.beginPath(); context.moveTo(-15, 10); context.lineTo(-9, -9); context.lineTo(4, -16); context.lineTo(16, -3); context.lineTo(12, 12); context.closePath(); context.fill()
        context.fillStyle = '#849295'
        context.beginPath(); context.moveTo(-8, -8); context.lineTo(4, -16); context.lineTo(8, -4); context.closePath(); context.fill()
    }
    if (object.type === 'ammo') {
        context.fillStyle = '#f7df58'
        context.fillRect(-12, -15, 24, 30)
        context.strokeStyle = '#574d08'; context.lineWidth = 2; context.strokeRect(-12, -15, 24, 30)
        context.fillStyle = '#574d08'; context.font = 'bold 18px DM Mono'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText('+', 0, 1)
    }
    context.restore()
}

function render() {
    drawBackground()
    state.objects.forEach(drawObject)
    context.fillStyle = '#e04a36'
    state.colliders.forEach(collider => {
        context.fillRect(collider.x * gridSize + 3, collider.y * gridSize + 3, gridSize - 6, gridSize - 6)
        context.strokeStyle = '#fff'; context.lineWidth = 1; context.setLineDash([4, 3]); context.strokeRect(collider.x * gridSize + 4, collider.y * gridSize + 4, gridSize - 8, gridSize - 8); context.setLineDash([])
    })
    if (state.showGrid) {
        context.strokeStyle = '#ffffff58'; context.lineWidth = 1
        for (let index = 1; index < columns; index++) { context.beginPath(); context.moveTo(index * gridSize + .5, 0); context.lineTo(index * gridSize + .5, canvas.height); context.stroke() }
        for (let index = 1; index < rows; index++) { context.beginPath(); context.moveTo(0, index * gridSize + .5); context.lineTo(canvas.width, index * gridSize + .5); context.stroke() }
    }
    if (state.selected) {
        context.strokeStyle = '#ef6b3d'; context.lineWidth = 3
        context.strokeRect(state.selected.x * gridSize + 2, state.selected.y * gridSize + 2, gridSize - 4, gridSize - 4)
    }
    updateStats()
}

function updateStats() {
    document.querySelector('#activeToolLabel').textContent = toolLabels[state.tool]
    document.querySelector('#objectCount').textContent = state.objects.length
    document.querySelector('#colliderCount').textContent = state.colliders.length
    document.querySelector('#ammoCount').textContent = state.objects.filter(object => object.type === 'ammo').length
    document.querySelector('#selectionInfo').textContent = state.selected ? `${state.selected.type} at ${state.selected.x}, ${state.selected.y}` : 'Nothing selected'
}

function setBackground(filename) {
    state.background = filename
    state.backgroundImage = new Image()
    state.backgroundImage.onload = render
    state.backgroundImage.src = `${backgroundPath}${filename}`
    render()
}

function exportMap() {
    const output = {
        id: Date.now(), name: document.querySelector('#stageName').value || 'Untitled stage', background: state.background,
        width: canvas.width, height: canvas.height, tileSize: gridSize,
        objects: state.objects.map(object => ({ type: object.type, x: object.x * gridSize + gridSize / 2, y: object.y * gridSize + gridSize / 2 })),
        colliders: state.colliders.map(collider => ({ x: collider.x * gridSize, y: collider.y * gridSize, w: collider.w * gridSize, h: collider.h * gridSize }))
    }
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${output.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`; link.click(); URL.revokeObjectURL(link.href)
}

function importMap(file) {
    const reader = new FileReader()
    reader.onload = () => {
        const data = JSON.parse(reader.result)
        document.querySelector('#stageName').value = data.name || 'Imported stage'
        state.background = data.background || 'bg_stage1.png'
        state.objects = (data.objects || []).map(object => ({ type: object.type, x: Math.floor(object.x / gridSize), y: Math.floor(object.y / gridSize) }))
        state.colliders = (data.colliders || []).map(collider => ({ x: Math.floor(collider.x / gridSize), y: Math.floor(collider.y / gridSize), w: Math.max(1, Math.round(collider.w / gridSize)), h: Math.max(1, Math.round(collider.h / gridSize)) }))
        setBackground(state.background)
    }
    reader.readAsText(file)
}

document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => {
    state.tool = button.dataset.tool
    document.querySelectorAll('[data-tool]').forEach(item => item.classList.toggle('is-active', item === button))
    render()
}))
canvas.addEventListener('pointerdown', event => { canvas.setPointerCapture(event.pointerId); editCell(cellFromEvent(event)) })
canvas.addEventListener('pointermove', event => { if (event.buttons) editCell(cellFromEvent(event)) })
document.querySelector('#toggleGrid').addEventListener('click', event => { state.showGrid = !state.showGrid; event.currentTarget.classList.toggle('is-active', state.showGrid); render() })
document.querySelector('#zoom').addEventListener('input', event => { const value = event.target.value; canvas.style.width = `${value}%`; document.querySelector('#zoomValue').textContent = `${value}%` })
document.querySelector('#backgroundSelect').addEventListener('change', event => setBackground(event.target.value))
document.querySelector('#clearMap').addEventListener('click', () => { snapshot(); state.objects = []; state.colliders = []; state.selected = null; render() })
document.querySelector('#exportMap').addEventListener('click', exportMap)
document.querySelector('#importMap').addEventListener('change', event => { if (event.target.files[0]) importMap(event.target.files[0]) })
document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        const previous = state.history.pop(); if (previous) { const data = JSON.parse(previous); state.objects = data.objects; state.colliders = data.colliders; render() }
    }
    if (event.key.toLowerCase() === 'g') { state.showGrid = !state.showGrid; document.querySelector('#toggleGrid').classList.toggle('is-active', state.showGrid); render() }
    const tools = ['ground', 'tree', 'rock', 'ammo', 'collision', 'eraser']; const index = Number(event.key) - 1; if (tools[index]) { state.tool = tools[index]; document.querySelector(`[data-tool="${tools[index]}"]`).click() }
})

setBackground(state.background)
