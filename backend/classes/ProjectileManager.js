const { SCREEN } = require('../../frontend/js/classes/Utils')
const { PROJECTILE_RADIUS, PROJECTILE_SPEED } = require('./Constants')
const { Projectile } = require('./Projectile')
const {
  backEndEnemies,
  backEndPlayers,
  backEndProjectiles
} = require('./SharedModel')

class ProjectileManager {
  static projectileId = 0

  static updateProjectiles() {
    for (const id in backEndProjectiles) {
      const projectile = backEndProjectiles[id]
      projectile.update()

      if (projectile.isOutside()) {
        delete backEndProjectiles[id]
        continue
      }
    }
  }

  static createNewProjectile(player) {
    const { x, y, rotation } = player
    const angle = (rotation * Math.PI) / 180

    const velocity = {
      x: Math.sin(angle) * PROJECTILE_SPEED,
      y: -Math.cos(angle) * PROJECTILE_SPEED
    }

    backEndProjectiles[this.projectileId++] = new Projectile({
      x,
      y,
      velocity,
      radius: PROJECTILE_RADIUS,
      playerId: player.id,
      color: player.color
    })
  }
}

module.exports = { ProjectileManager }
