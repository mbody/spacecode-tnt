class Bonus extends GameObject {
  static collectedSound

  constructor(data) {
    super(data)
  }

  draw() {
    if (!this.sprite) {
      this.sprite = GameObject.getMediaById('crystal')
    }
    c.beginPath()
    //c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    //c.fillStyle = this.color
    c.drawImage(this.sprite, this.x - this.radius, this.y - this.radius)
    c.fill()
  }

  static bonusCollected() {
    if (!this.collectedSound) {
      this.collectedSound = GameObject.getMediaById('bonusCollected')
    }
    this.collectedSound.play()
  }
}
