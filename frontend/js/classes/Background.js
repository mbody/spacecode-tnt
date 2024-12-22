class Background {
  STARCOUNT = 200
  stars = []

  constructor({ width, height }) {
    for (let i = 0; i < this.STARCOUNT; i++) {
      this.stars.push(new Star({ width, height }))
    }
  }

  draw() {
    //this.stars.forEach((star) => star.draw())
  }
}
