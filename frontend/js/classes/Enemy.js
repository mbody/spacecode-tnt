class Enemy extends GameObject {
  static dieSound

  constructor(data) {
    super(data)
  }

  draw() {
    if (!this.sprite) {
      this.sprite = GameObject.getMediaById('enemy')
    }
    c.beginPath()
    //c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    //c.fillStyle = this.color
    c.drawImage(this.sprite, this.x - this.radius, this.y - this.radius)
    c.fill()
  }

  static enemyKilled() {
    if (!this.dieSound) {
      this.dieSound = GameObject.getMediaById('enemyDie')
    }
    this.dieSound.play()
  }
}
