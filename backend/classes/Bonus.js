const { SCREEN } = require('./Constants')
const { GameObject } = require('./GameObject')

class Bonus extends GameObject {
  constructor(data) {
    super(data)
  }
}

module.exports = { Bonus }
