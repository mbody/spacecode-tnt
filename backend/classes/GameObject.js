const { Utils } = require('../../frontend/js/classes/Utils')
const { SCREEN } = require('./Constants')

class GameObject {
  constructor({
    x,
    y = SCREEN.height * Math.random(),
    radius,
    color = Utils.getRandomColor(),
    velocity
  }) {
    const diam = 2 * radius
    this.x = x || (SCREEN.width - 2 * diam) * Math.random() + diam
    this.y = y || (SCREEN.height - 2 * diam) * Math.random() + diam
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

  isHitBy(o) {
    const distance = Math.hypot(o.x - this.x, o.y - this.y)
    return distance < this.radius + o.radius
  }
}

module.exports = { GameObject }
