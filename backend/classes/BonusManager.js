const { Enemy } = require('./Enemy')
const { SCREEN, BONUS_PLAYER_RATIO } = require('./Constants')
const {
  backEndEnemies,
  backEndBonuses,
  backEndPlayers
} = require('./SharedModel')
const NetworkManager = require('./NetworkManager')
const {
  ENEMY_RADIUS,
  LEVEL_PROGRESS_PER_KILL,
  BONUS_RADIUS,
  BONUS_SPEED
} = require('./Constants')
const { Bonus, BonusType } = require('./Bonus')

class BonusManager {
  static bonusesId = 0

  static updateBonuses() {
    // always at least 1 bonus for n players
    let nbBonuses = Object.keys(backEndBonuses).length
    const nbPlayers = Object.keys(backEndPlayers).length
    while (nbBonuses < Math.ceil(nbPlayers / BONUS_PLAYER_RATIO)) {
      BonusManager.createNewBonus()
      nbBonuses++
    }
  }

  static createNewBonus() {
    const types = Object.values(BonusType)
    const type = types[Math.floor(Math.random() * types.length)]
    backEndBonuses[this.bonusesId++] = new Bonus(type)
  }

  static resetAllBonuses() {
    this.bonusesId = 0
    for (const id in backEndBonuses) {
      delete backEndBonuses[id]
    }
  }
}

module.exports = { BonusManager }
