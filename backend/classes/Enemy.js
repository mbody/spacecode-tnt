const { SCREEN } = require('./Constants')
const { GameObject } = require('./GameObject')

class Enemy extends GameObject {
  constructor(data) {
    super(data)
  }
}

module.exports = { Enemy }
