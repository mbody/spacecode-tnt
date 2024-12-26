const { SCREEN } = require('../../frontend/js/classes/Constantes')
const NetworkManager = require('./NetworkManager')
const { Player } = require('./Player')
const {
  backEndEnemies,
  backEndPlayers,
  backEndProjectiles,
  backEndBonuses
} = require('./SharedModel')
const fs = require('fs')
const bcrypt = require('bcrypt')

const SALT = '$2b$10$08PYpUzJf9VA4.YYlo65be.5lpuW665YyotJbk4AAAB!'
const PLAYERS_BACKUP_FILE = '.players.json'
const PLAYERS_BACKUP = {}

class PlayerManager {
  static updatePlayers() {
    for (const id in backEndPlayers) {
      const player = backEndPlayers[id]

      if (player.isOutside()) {
      }

      // Collision detection with enemies
      if (!player.invicible) {
        for (const enemyId in backEndEnemies) {
          const enemy = backEndEnemies[enemyId]
          if (player.isHitBy(enemy)) {
            // Player hit
            PlayerManager.onPlayerDie({ player })

            if (PlayerManager.hasNoMorePlayer()) {
              //return false
              return true
            }
            break
          }
        }
      }

      // Collision detection with projectiles
      if (!player.invicible && player.alive) {
        for (const projectileId in backEndProjectiles) {
          const projectile = backEndProjectiles[projectileId]
          if (player.isHitBy(projectile) && projectile.playerId != player.id) {
            // Player hit
            PlayerManager.onPlayerDie({ player })
            const shooter = backEndPlayers[projectile.playerId]

            if (shooter) {
              shooter.score++
              shooter.onPlayerKilled()
            }

            break
          }
        }
      }

      // Collision detection between 2 players
      if (!player.invicible) {
        for (const enemyId in backEndPlayers) {
          const enemy = backEndPlayers[enemyId]
          if (id != enemyId && enemy.alive) {
            if (player.isHitBy(enemy)) {
              // Player hit
              PlayerManager.onPlayerDie({ player })
              if (enemy.invicible) {
                enemy.score++
                enemy.onPlayerKilled()
              } else {
                PlayerManager.onPlayerDie({ player: enemy })
              }
            }
            break
          }
        }
      }

      // Collision avec bonus
      if (player.alive) {
        for (const bonusId in backEndBonuses) {
          const bonus = backEndBonuses[bonusId]
          if (player.isHitBy(bonus)) {
            // Player hit
            PlayerManager.onPlayerBonus({ player, bonus })
            delete backEndBonuses[bonusId]
            break
          }
        }
      }

      player.update()
    }
    return true
  }

  static hasNoMorePlayer() {
    return Object.values(backEndPlayers).find((p) => p.alive) === undefined
  }

  static async createNewPlayer(data, isRestore = false) {
    const phone = data.id
    data.id = await bcrypt.hash(phone, SALT)

    backEndPlayers[data.id] = new Player(data)

    PLAYERS_BACKUP[phone] = data
    PlayerManager.saveBackup()
  }

  static updateProperty({ playerId, property, value }) {
    const backEndPlayer = backEndPlayers[playerId]
    if (backEndPlayer) {
      backEndPlayer[property] = value
    }
  }

  static onPlayerDie({ player }) {
    NetworkManager.io.emit('playerKilled', { player })
    player.die()
  }

  static onPlayerBonus({ player, bonus }) {
    NetworkManager.io.emit('playerBonus', { player, bonus })
    player.collectBonus(bonus)
  }

  static getWinner() {
    let winner = undefined
    Object.values(backEndPlayers).forEach((p) => {
      if (winner === undefined || winner.score < p.score) {
        winner = p
      }
    })
    return winner
  }

  static resetAllPlayers() {
    Object.values(backEndPlayers).forEach((player) => {
      player.reset()
    })
    PlayerManager.lastSurvivor = undefined
  }

  static saveBackup() {
    fs.writeFile(
      PLAYERS_BACKUP_FILE,
      JSON.stringify(PLAYERS_BACKUP),
      'utf8',
      () => {
        console.log('.players.json updated !')
      }
    )
  }

  static restoreBackup() {
    fs.readFile(PLAYERS_BACKUP_FILE, 'utf8', (err, data) => {
      if (err) {
        console.log('No saved players found !')
      } else {
        const backup = JSON.parse(data)
        for (const [phone, playerData] of Object.entries(backup)) {
          try {
            backEndPlayers[playerData.id] = new Player(playerData)
            PLAYERS_BACKUP[phone] = playerData
          } catch (e) {
            console.log('Error while restoring player ' + phone)
          }
        }
      }
    })
  }
}

PlayerManager.restoreBackup()

module.exports = { PlayerManager }
