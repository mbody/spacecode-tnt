const { Enemy } = require('./Enemy')
const { SCREEN } = require('../../frontend/js/classes/Utils')
const { backEndEnemies, backEndBonuses } = require('./SharedModel')
const NetworkManager = require('./NetworkManager')
const {
  ENEMY_RADIUS,
  LEVEL_PROGRESS_PER_KILL,
  BONUS_RADIUS,
  BONUS_SPEED
} = require('./Constants')
const { Bonus } = require('./Bonus')

class BonusManager {
  static bonusesId = 0

  static updateBonuses() {
    for (const bonusId in backEndBonuses) {
      const bonus = backEndBonuses[bonusId]
      // update position
      bonus.update()
      if (bonus.isOutside()) {
        bonus.bounce()
      }
    }
  }

  static createNewBonus({ x, y }) {
    const angle = Math.random() * 360

    const velocity = {
      x: Math.cos(angle) * BONUS_SPEED,
      y: Math.sin(angle) * BONUS_SPEED
    }

    backEndBonuses[this.bonusesId++] = new Bonus({
      x,
      y,
      radius: BONUS_RADIUS,
      velocity
    })
  }

  static resetAllBonuses() {
    this.bonusesId = 0
    for (const id in backEndBonuses) {
      delete backEndBonuses[id]
    }
  }
}

module.exports = { BonusManager }
