const { SCREEN, BONUS_RADIUS } = require('./Constants')
const { GameObject } = require('./GameObject')

const BonusType = {
  CRYSTAL: 'CRYSTAL',
  HEART: 'HEART',
  SHIELD: 'SHIELD'
}

class Bonus extends GameObject {
  constructor(type) {
    super({ radius: BONUS_RADIUS })
    this.type = type
  }
}

module.exports = { Bonus, BonusType }
