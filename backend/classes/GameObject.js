const { Utils } = require('../../frontend/js/classes/Utils')
const { SCREEN } = require('./Constants')

class GameObject {
  constructor({
    x = SCREEN.width * Math.random(),
    y = SCREEN.height * Math.random(),
    radius,
    color = Utils.getRandomColor(),
    velocity
  }) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  update() {
    this.x += this.velocity.x
    this.y += this.velocity.y
  }

  isOutside() {
    const margin = this.radius * 2
    const isOut =
      this.x < -margin ||
      this.y < -margin ||
      this.x > SCREEN.width + margin ||
      this.y > SCREEN.height + margin
    return isOut
  }

  bounce() {
    const margin = this.radius * 2
    if (this.x < -margin || this.x > SCREEN.width + margin) {
      this.velocity.x = -this.velocity.x
    }
    if (this.y < -margin || this.y > SCREEN.height + margin) {
      this.velocity.y = -this.velocity.y
    }
  }

  isHitBy(projectile) {
    const distance = Math.hypot(projectile.x - this.x, projectile.y - this.y)
    return distance < this.radius
  }
}

module.exports = { GameObject }
