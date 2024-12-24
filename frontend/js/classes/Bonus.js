class Bonus extends GameObject {
  static collectedSound

  constructor({ type, ...data }) {
    super(data)
    this.type = type
  }

  draw() {
    if (!this.sprite) {
      switch (this.type) {
        case 'SHIELD':
          this.sprite = GameObject.getMediaById('shield')
          this.shadowColor = '#6AA710'
          break
        case 'HEART':
          this.sprite = GameObject.getMediaById('heart')
          this.shadowColor = 'red'
          break
        default:
          this.sprite = GameObject.getMediaById('crystal')
          this.shadowColor = 'turquoise'
          break
      }
    }
    /*    
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = 'turquoise'
    c.fill()
    */
    c.shadowColor = this.shadowColor
    c.shadowBlur = this.radius * 3
    c.drawImage(
      this.sprite,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    )
  }

  static bonusCollected() {
    if (!this.collectedSound) {
      this.collectedSound = GameObject.getMediaById('bonusCollected')
    }
    this.collectedSound.play()
  }
}
