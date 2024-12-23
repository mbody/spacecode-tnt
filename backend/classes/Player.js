const { Utils } = require('../../frontend/js/classes/Utils')
const {
  SCREEN,
  PLAYER_SPEED,
  PLAYER_ROTATION_SPEED,
  PLAYER_RADIUS,
  PLAYER_RESPAWN_DELAY,
  PLAYER_INVICIBLE_DELAY,
  SHOOT_INTERVAL,
  BONUS_RADIUS,
  BONUS_SCORE,
  PLAYER_LIVES,
  PLAYER_MAX_ROTATION,
  PLAYER_MAX_SPEED
} = require('./Constants')
const { GameObject } = require('./GameObject')
const { ProjectileManager } = require('./ProjectileManager')
const { backEndPlayers } = require('./SharedModel')

function mathRandomInt(a = 0, b = 100) {
  return Math.floor(Math.random() * (b - a) + a)
}

function extractFunction(code, delimiter) {
  var rx = new RegExp(String.raw`<${delimiter}>(.*)</${delimiter}>`, 'g')
  var arr = rx.exec(code)
  return arr && arr.length > 0 && arr[1]
}

class Player extends GameObject {
  lastShootTimestamp = 0

  constructor({
    id,
    username,
    score = 0,
    rotation = 0,
    radius = PLAYER_RADIUS,
    code,
    lives = PLAYER_LIVES,
    ...data
  }) {
    super({ radius, ...data })
    code = code.replace(/(\r\n|\n|\r)/gm, '')
    const onUpdate = eval(extractFunction(code, 'LOOP'))
    const onInit = eval(extractFunction(code, 'INIT'))
    const onDetected = eval(extractFunction(code, 'DETECTED'))
    const onPlayerKilled = eval(extractFunction(code, 'PLAYER_KILLED'))
    this.id = id
    this.rotation = rotation
    this.username = username
    this.score = score
    this.alive = true
    this.invicible = false
    this.onInit = () => onInit && onInit()
    this.onDetected = () => onDetected && onDetected()
    this.onPlayerKilled = () => onPlayerKilled && onPlayerKilled()
    this.onUpdate = onUpdate
    this.lives = lives
    this.onInit()
  }

  moveForward(speed = PLAYER_SPEED) {
    this.x += Math.sin(Utils.degToRad(this.rotation)) * speed
    this.y -= Math.cos(Utils.degToRad(this.rotation)) * speed
  }
  moveBackward(speed = PLAYER_SPEED) {
    speed = Utils.constrainMinMax(rotation, -PLAYER_MAX_SPEED, PLAYER_MAX_SPEED)
    this.x -= Math.sin(Utils.degToRad(this.rotation)) * speed
    this.y += Math.cos(Utils.degToRad(this.rotation)) * speed
  }
  turnLeft(rotation = PLAYER_ROTATION_SPEED) {
    rotation = Utils.constrainMinMax(
      rotation,
      -PLAYER_MAX_ROTATION,
      PLAYER_MAX_ROTATION
    )
    this.rotation -= rotation
  }
  turnRight(rotation = PLAYER_ROTATION_SPEED) {
    rotation = Utils.constrainMinMax(
      rotation,
      -PLAYER_MAX_ROTATION,
      PLAYER_MAX_ROTATION
    )
    this.rotation += rotation
  }
  turnToward({ x = -1, y = -1 }) {
    if (x != -1) {
      this.rotation = 90 + radToDeg(Math.atan2(y - this.y, x - this.x))
    }
  }

  checkConstraints() {
    const playerSides = {
      left: this.x - this.radius,
      right: this.x + this.radius,
      top: this.y - this.radius,
      bottom: this.y + this.radius
    }

    if (playerSides.left < 0) this.x = this.radius

    if (playerSides.right > SCREEN.width) this.x = SCREEN.width - this.radius

    if (playerSides.top < 0) this.y = this.radius

    if (playerSides.bottom > SCREEN.height) this.y = SCREEN.height - this.radius
    /*
    if (backEndPlayer.x > SCREEN.width) {
      backEndPlayer.x -= SCREEN.width
    } else if (backEndPlayer.x < 0) {
      backEndPlayer.x += SCREEN.width
    }
    if (backEndPlayer.y > SCREEN.height) {
      backEndPlayer.y -= SCREEN.height
    } else if (backEndPlayer.y < 0) {
      backEndPlayer.y += SCREEN.height
    }

    */
  }

  die() {
    this.alive = false
    this.x = SCREEN.width * Math.random()
    this.y = SCREEN.height * Math.random()
    setTimeout(this.respawn, PLAYER_RESPAWN_DELAY)
    this.lives--
    if (this.lives == 0) {
      this.score = 0
      this.lives = PLAYER_LIVES
    }
    this.invicible = true
  }

  collectBonus() {
    this.score += BONUS_SCORE
    this.respawn()
  }

  respawn = () => {
    this.onInit()
    this.alive = true
    this.invicible = true
    setTimeout(() => {
      this.invicible = false
    }, PLAYER_INVICIBLE_DELAY)
  }

  reset() {}

  canShoot() {
    return (
      this.alive && Date.now() - this.lastShootTimestamp > SHOOT_INTERVAL //- this.score * 2
    )
  }

  shoot() {
    if (!this.canShoot()) return
    ProjectileManager.createNewProjectile(this)
    // retropus from firing
    // this.moveBackward()
    this.lastShootTimestamp = Date.now()
  }

  update() {
    this.onUpdate && this.onUpdate()
    this.checkConstraints()
  }

  scan = (type = 'PLAYER') => {
    const sprites = Object.values(backEndPlayers)
    for (const player of sprites) {
      if (!player.alive) continue
      const dx = player.x - this.x
      const dy = player.y - this.y
      if (dx == 0 && dy == 0) continue
      const angleTo = 90 + (180 * Math.atan2(dy, dx)) / Math.PI
      const da = Math.abs((this.rotation - angleTo) % 360)
      if (Math.abs(da) < 10) {
        const distance2 = dx * dx + dy * dy
        if (distance2 < 300000) {
          player.onDetected()
          return true
        }
      }
    }
    return false
  }
}

module.exports = { Player }
