const { Utils } = require('../../frontend/js/classes/Utils')
const { BonusType } = require('./Bonus')
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
  PLAYER_MAX_SPEED,
  PLAYER_SCAN_DISTANCE,
  BONUS_RIFFLE_DELAY,
  BONUS_RIFFLE_SHOOT_INTERVAL,
  PLAYER_SCAN_ANGLE
} = require('./Constants')
const { GameObject } = require('./GameObject')
const { ProjectileManager } = require('./ProjectileManager')
const { backEndPlayers, backEndBonuses } = require('./SharedModel')

function mathRandomInt(a = 0, b = 100) {
  return Math.floor(Math.random() * (b - a) + a)
}

function extractFunction(code, delimiter) {
  var rx = new RegExp(String.raw`<${delimiter}>(.*?)</${delimiter}>`)
  var arr = rx.exec(code)
  return arr && arr.length > 0 && arr[1]
}

class Player extends GameObject {
  lastShootTimestamp = 0
  _score = 0

  constructor({
    id,
    username,
    score = 0,
    rotation = 0,
    radius = PLAYER_RADIUS,
    code,
    lives = PLAYER_LIVES,
    timestamp,
    bestScore = 0,
    ...data
  }) {
    super({ radius, ...data })
    code = code.replace(/(\r\n|\n|\r)/gm, '')
    const onUpdate = eval(extractFunction(code, 'LOOP'))
    const onInit = eval(extractFunction(code, 'INIT'))
    const onDetected = eval(extractFunction(code, 'DETECTED'))
    const onPlayerKilled = eval(extractFunction(code, 'PLAYER_KILLED'))
    const onBonusCollected = eval(extractFunction(code, 'BONUS_COLLECTED'))
    this.code = code
    this.id = id
    this.rotation = rotation
    this.username = username
    this.alive = true
    this.invicible = false
    this.bestScore = bestScore
    this.onInit = () => onInit && onInit()
    this.onDetected = () => onDetected && onDetected()
    this.onPlayerKilled = () => onPlayerKilled && onPlayerKilled()
    this.onBonusCollected = () => onBonusCollected && onBonusCollected()
    this.onUpdate = onUpdate
    this.lives = lives
    this.onInit()
    this.timestamp = timestamp

    Object.defineProperties(this, {
      _score: { writable: true, enumerable: false },
      score: {
        get: function () {
          return this._score
        },
        set: function (value) {
          this._score = value
          if (value > this.bestScore) this.bestScore = value
        },
        enumerable: true
      }
    })
  }

  moveForward(speed = PLAYER_SPEED) {
    speed = Utils.constrainMinMax(speed, -PLAYER_MAX_SPEED, PLAYER_MAX_SPEED)
    this.x += Math.sin(Utils.degToRad(this.rotation)) * speed
    this.y -= Math.cos(Utils.degToRad(this.rotation)) * speed
  }
  moveBackward(speed = PLAYER_SPEED) {
    speed = Utils.constrainMinMax(speed, -PLAYER_MAX_SPEED, PLAYER_MAX_SPEED)
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
    this.invicible = true
  }

  reset() {
    this.score = 0
    this.lives = PLAYER_LIVES
  }

  collectBonus(bonus) {
    switch (bonus.type) {
      case BonusType.CRYSTAL:
        this.score += BONUS_SCORE
        break
      case BonusType.SHIELD:
        this.invicible = true
        setTimeout(() => {
          this.invicible = false
        }, PLAYER_INVICIBLE_DELAY)
        break
      case BonusType.RIFFLE:
        this.riffle = true
        setTimeout(() => {
          this.riffle = false
        }, BONUS_RIFFLE_DELAY)
        break
      case BonusType.HEART:
        if (this.lives < PLAYER_LIVES) {
          this.lives++
        }
        break
      case BonusType.BOMB:
        ProjectileManager.createNewBomb(this)
        break
    }
    this.onBonusCollected()
  }

  respawn = () => {
    this.onInit()
    this.alive = true
    this.invicible = true
    setTimeout(() => {
      this.invicible = false
    }, PLAYER_INVICIBLE_DELAY)
  }

  canShoot() {
    const interval = this.riffle ? BONUS_RIFFLE_SHOOT_INTERVAL : SHOOT_INTERVAL
    return this.alive && Date.now() - this.lastShootTimestamp > interval //- this.score * 2
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
    let sprites = Object.values(backEndPlayers)
    switch (type) {
      case 'BONUS':
        sprites = Object.values(backEndBonuses)
        break
      case 'PLAYER':
      // nothing
    }
    for (const sprite of sprites) {
      if (sprite instanceof Player && !sprite.alive) continue
      const dx = sprite.x - this.x
      const dy = sprite.y - this.y
      if (dx == 0 && dy == 0) continue
      const angleTo = 90 + (180 * Math.atan2(dy, dx)) / Math.PI
      const da = Math.abs((this.rotation - angleTo) % 360)
      if (Math.abs(da) < PLAYER_SCAN_ANGLE) {
        const distance2 = dx * dx + dy * dy
        if (distance2 < PLAYER_SCAN_DISTANCE) {
          sprite instanceof Player && sprite.onDetected()
          return true
        }
      }
    }
    return false
  }
}

module.exports = { Player }
