class GameObject {
  constructor({ x, y, radius, color, velocity }) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  static getMediaById(id) {
    return document.querySelector('#' + id)
  }
}
