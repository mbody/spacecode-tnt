let socket

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function radToDeg(rad) {
  return (rad * 180) / Math.PI
}

function distanceBetween(a, b) {
  return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
}

class SpacecodeManager {
  id
  x
  y
  rotation
  keycodes = {}
  enemies

  constructor() {
    window.addEventListener('keydown', (event) => {
      console.log('key: ' + event.key)
      this.keycodes[event.key] = true
    })

    window.addEventListener('keyup', (event) => {
      this.keycodes[event.key] = false
    })

    window.addEventListener('gamepadconnected', GamepadAPI.connect)
    window.addEventListener('gamepaddisconnected', GamepadAPI.disconnect)
  }

  connect(username, color) {
    if (socket != null) {
      this.disconnect()
    }
    socket = io.connect()
    socket.on('connect', () => {
      this.id = socket.id
    })
    socket.emit('newPlayer', { username, color }, this.onInitGame)
    socket.on('updateEnemies', this.onUpdateEnemies)
    socket.on('updatePlayers', this.onUpdatePlayers)
  }
  disconnect() {
    socket.disconnect()
  }
  onInitGame = ({ width, height }) => {
    this.screenWidth = width
    this.screenHeihgt = height
  }
  moveForward() {
    this._emitKeydown('ArrowUp')
  }
  moveBackward() {
    this._emitKeydown('ArrowDown')
  }
  turnRight() {
    this._emitKeydown('ArrowRight')
  }
  turnLeft() {
    this._emitKeydown('ArrowLeft')
  }

  setRotation(angle) {
    this.updatePlayerProperty('rotation', angle)
  }
  setX(x) {
    this.updatePlayerProperty('x', x)
    this.x = x
  }
  setY(y) {
    this.updatePlayerProperty('y', y)
    this.y = y
  }
  updatePlayerProperty(key, value) {
    socket && socket.emit('updatePlayerProperty', { key, value })
  }

  isKeyPressed(code) {
    return this.keycodes[code]
  }

  isGamepadJoystick(direction) {
    return GamepadAPI.joystickPointing(direction)
  }

  isGamepadButtonPressed(button) {
    return GamepadAPI.buttonPressed(button, true)
  }

  update = async () => {
    await sleep(FRAME_RATE)
    GamepadAPI.update()
  }

  shoot() {
    socket.emit('shoot')
  }

  onUpdateEnemies = (enemies) => {
    this.enemies = Object.values(enemies)
  }

  onUpdatePlayers = (players) => {
    const me = players[this.id]
    if (me) {
      this.x = me.x
      this.y = me.y
      this.rotation = me.rotation
    }
    this.players = Object.values(players)
  }

  getNearestEnemy() {
    let target = {}
    if (this.enemies != null && this.enemies.length > 0) {
      target = this.enemies[0]
      let distance = distanceBetween(this, target)

      for (let i = 1; i < this.enemies.length; i++) {
        const e = this.enemies[i]
        const d = distanceBetween(this, e)
        if (d < distance) {
          distance = d
          target = e
        }
      }
    }
    return target
  }

  orientTo({ x = -1, y = -1 }) {
    if (x != -1) {
      this.setRotation(90 + radToDeg(Math.atan2(y - this.y, x - this.x)))
    }
  }
  //// privates methods

  _emitKeydown(keycode) {
    socket.emit('keydown', { keycode }, this._onPlayerPositionUpdated)
  }

  _onPlayerPositionUpdated = ({ x, y, rotation }) => {
    //console.log(`New player position : ${x}, ${y}, ${rotation}`)
    this.x = x
    this.y = y
    this.rotation = rotation
  }
}

const Spacecode = new SpacecodeManager()
