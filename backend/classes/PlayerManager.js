const { SCREEN } = require('../../frontend/js/classes/Constantes')
const NetworkManager = require('./NetworkManager')
const { Player } = require('./Player')
const {
  backEndEnemies,
  backEndPlayers,
  backEndProjectiles,
  backEndBonuses,
  pendingPlayers
} = require('./SharedModel')
const fs = require('fs')
const bcrypt = require('bcrypt')
const { MAX_PLAYERS } = require('./Constants')

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

    // if player was in pendingPlayers, remove it
    PlayerManager.removePlayerFromPendingPlayer(data.id)

    PlayerManager.addPlayerToBattleground(data)

    PLAYERS_BACKUP[phone] = data
    PlayerManager.saveBackup()
  }

  static addPlayerToBattleground(data) {
    data.timestamp = Date.now()
    let newPlayer = null

    try {
      newPlayer = data instanceof Player ? data : new Player(data)
    } catch (e) {
      console.error(
        `Joueur avec id '${data.id}' ne peut pas être chargé à cause de son code ! `
      )
      console.error(e)
      return
    }

    if (
      Object.values(backEndPlayers).length >= MAX_PLAYERS &&
      !backEndPlayers[data.id]
    ) {
      // remove oldest players
      let oldestPlayerTS = Date.now()
      let oldestPlayerId = Object.keys(backEndPlayers)[0]

      for (const playerId in backEndPlayers) {
        const player = backEndPlayers[playerId]
        if (player.timestamp < oldestPlayerTS) {
          oldestPlayerId = playerId
          oldestPlayerTS = player.timestamp
        }
      }
      const oldPlayer = backEndPlayers[oldestPlayerId]
      pendingPlayers.push(oldPlayer)
      NetworkManager.emit('updatePendingPlayers', pendingPlayers)
      delete backEndPlayers[oldestPlayerId]
    }
    backEndPlayers[newPlayer.id] = newPlayer
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
    if (player.lives == 0) {
      player.reset()
      if (pendingPlayers.length > 0) {
        // remove this player
        delete backEndPlayers[player.id]
        // restore a pending player
        const nextPlayer = pendingPlayers.splice(0, 1)[0]
        PlayerManager.addPlayerToBattleground(nextPlayer)
        pendingPlayers.push(player)
        NetworkManager.emit('updatePendingPlayers', pendingPlayers)
      }
    }
    if (PlayerManager.hasNoMorePlayer()) {
      //return false
      return true
    }
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
            PlayerManager.addPlayerToBattleground(playerData)
            PLAYERS_BACKUP[phone] = playerData
          } catch (e) {
            console.log('Error while restoring player ' + phone)
            console.error(e)
          }
        }
      }
    })
  }

  static removePlayerFromPendingPlayer(playerId) {
    for (let index = 0; index < pendingPlayers.length; index++) {
      const element = pendingPlayers[index]
      if (element.id == playerId) {
        pendingPlayers.splice(index, 1)
        NetworkManager.emit('updatePendingPlayers', pendingPlayers)
        return
      }
    }
  }
}

module.exports = { PlayerManager }
