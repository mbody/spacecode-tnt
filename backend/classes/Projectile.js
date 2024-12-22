const { SCREEN } = require('./Constants')
const { GameObject } = require('./GameObject')

class Projectile extends GameObject {
  constructor({ playerId, ...data }) {
    super(data)
    this.playerId = playerId
  }
}

module.exports = { Projectile }
