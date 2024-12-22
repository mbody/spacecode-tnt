class Star {
  constructor({ x, y, width, height }) {
    this.x = Utils.getRandomInt(width)
    this.y = Utils.getRandomInt(height)
    this.size = Utils.getRandomInt(2) + 1
    this.vertices = Utils.getRandomInt(6) + 5
    this.color = `hsl(228, 33%, ${10 * Math.random() + 50}%)`
  }

  draw() {
    const innerR = this.size
    const outerR = this.size * 2
    const theta = Math.PI / this.vertices
    let rotation = (Math.PI / 2) * 3
    let x = this.x
    let y = this.y

    c.strokeStyle = '#000'
    c.beginPath()
    c.moveTo(this.x, this.y - outerR)
    ;[...Array(this.vertices)].map(() => {
      x = this.x + Math.cos(rotation) * outerR
      y = this.y + Math.sin(rotation) * outerR
      c.lineTo(x, y)
      rotation += theta

      x = this.x + Math.cos(rotation) * innerR
      y = this.y + Math.sin(rotation) * innerR
      c.lineTo(x, y)
      rotation += theta
    })

    c.lineTo(this.x, this.y - outerR)
    c.closePath()
    c.lineWidth = 2
    c.strokeStyle = '#033977'
    c.stroke()
    c.fillStyle = this.color
    c.fill()
  }
}
