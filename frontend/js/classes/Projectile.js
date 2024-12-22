RADIUS = 5

class Projectile {
  constructor({ x, y, color = 'white', velocity }) {
    this.x = x
    this.y = y
    this.color = color
    this.velocity = velocity
  }

  draw() {
    c.save()
    c.shadowColor = this.color
    c.shadowBlur = 20
    c.beginPath()
    c.arc(this.x, this.y, RADIUS, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}
