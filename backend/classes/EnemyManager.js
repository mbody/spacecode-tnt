const { Enemy } = require('./Enemy')
const { SCREEN } = require('./Constants')
const {
  backEndEnemies,
  backEndPlayers,
  backEndProjectiles
} = require('./SharedModel')
const NetworkManager = require('./NetworkManager')
const {
  ENEMY_RADIUS,
  LEVEL_PROGRESS_PER_KILL,
  BONUS_PER_NB_KILLS
} = require('./Constants')
const { BonusManager } = require('./BonusManager')

class EnemyManager {
  static currentLevel = 0
  static enemyId = 0

  static updateEnemies() {
    while (
      Object.keys(backEndEnemies).length < Math.min(this.currentLevel, 20)
    ) {
      this.createNewEnemy()
    }

    for (const enemyId in backEndEnemies) {
      const enemy = backEndEnemies[enemyId]

      // update position
      enemy.update()
      if (enemy.isOutside()) {
        delete backEndEnemies[enemyId]
      }

      // Collision detection with projectiles
      for (const projectileId in backEndProjectiles) {
        const projectile = backEndProjectiles[projectileId]
        if (enemy.isHitBy(projectile)) {
          // enemy die !
          EnemyManager.onEnemyDie(projectile, projectileId, enemyId)
          break
        }
      }
    }
  }

  static onEnemyDie(projectile, projectileId, enemyId) {
    const enemyKiller = backEndPlayers[projectile.playerId]
    const enemy = backEndEnemies[enemyId]

    if (enemyKiller) {
      enemyKiller.score++
    }

    NetworkManager.io.emit('enemyKilled', { enemy, killedBy: enemyKiller })

    this.currentLevel += LEVEL_PROGRESS_PER_KILL
    if (enemyKiller && enemyKiller.score % BONUS_PER_NB_KILLS == 0) {
      BonusManager.createNewBonus(enemy)
    }

    delete backEndProjectiles[projectileId]
    delete backEndEnemies[enemyId]
  }

  static createNewEnemy() {
    const radius = ENEMY_RADIUS

    let x
    let y

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : SCREEN.width + radius
      y = Math.random() * SCREEN.height
    } else {
      x = Math.random() * SCREEN.width
      y = Math.random() < 0.5 ? 0 - radius : SCREEN.height + radius
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`

    const angle = Math.atan2(SCREEN.height / 2 - y, SCREEN.width / 2 - x)

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }

    backEndEnemies[this.enemyId++] = new Enemy({
      x,
      y,
      radius,
      color,
      velocity
    })
  }

  static resetAllEnemies() {
    this.currentLevel = 1
    this.enemyId = 0
    for (const id in backEndEnemies) {
      delete backEndEnemies[id]
    }
  }
}

module.exports = { EnemyManager, backEndEnemies }
