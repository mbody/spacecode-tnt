const { EnemyManager } = require('./classes/EnemyManager')
const {
  backEndPlayers,
  backEndEnemies,
  backEndProjectiles,
  backEndBonuses,
  game,
  pendingPlayers
} = require('./classes/SharedModel')
const { ProjectileManager } = require('./classes/ProjectileManager')
const { PlayerManager } = require('./classes/PlayerManager')
const { Player } = require('./classes/Player')
const NetworkManager = require('./classes/NetworkManager')
const { SCREEN } = require('./classes/Constants')
const { BonusManager } = require('./classes/BonusManager')

class GameManager {
  displayers = {}

  constructor() {
    NetworkManager.io.on('connection', this.onConnection)
    NetworkManager.registerPostEndpoint('/player', this.onNewBotPlayer)
    // backend ticker
    setInterval(this.loop, 1000 / 30)
    game.isTournament = process.env.MODE === 'TOURNAMENT'
    if (!game.isTournament) {
      PlayerManager.restoreBackup()
      console.log('=========== TRAINING MODE ===========')
    } else {
      console.log('=========== TOURNAMENT MODE ===========')
    }
  }

  onConnection = (socket) => {
    NetworkManager.socketId = socket.id
    console.log(`New client connected ${socket.id}!`)
    socket.on('initDisplay', (data, callback) => {
      this.onInitDisplay(socket.id, data)
      callback && this.initGameCallback(callback)
    })
    socket.on('disconnect', (data) => this.onDisconnect(socket.id, data))
    NetworkManager.emit('updatePlayers', backEndPlayers)
  }

  onNewBotPlayer = (request, response) => {
    if (!game.isTournament) {
      const data = request.body
      const id = data.phoneNumber
      PlayerManager.createNewPlayer({
        id,
        ...data
      })
      response.send('ok !')
    } else {
      response.status(403).send('Désolé, opération impossible en tournoi !')
    }
  }
  onDisconnect(clientId, reason) {
    console.log(reason)
    delete backEndPlayers[clientId]
    delete this.displayers[clientId]
    NetworkManager.emit('updatePlayers', backEndPlayers)
  }

  onInitDisplay = (clientId, { width = 0, height = 0 }) => {
    this.displayers[clientId] = {
      canvas: {
        width,
        height
      }
    }
    NetworkManager.emit('updatePendingPlayers', pendingPlayers)
  }

  initGameCallback(callback) {
    callback({
      ip: NetworkManager.getIpAddress(),
      ...SCREEN
    })
  }

  ////

  loop = () => {
    // update projectile positions
    ProjectileManager.updateProjectiles()

    // update enemies with projectiles
    EnemyManager.updateEnemies()

    // update bonuses
    BonusManager.updateBonuses()

    // update players
    const hasPlayerAlive = PlayerManager.updatePlayers()
    if (!hasPlayerAlive) {
      this.gameOver()
    }

    NetworkManager.io.emit('updateProjectiles', backEndProjectiles)
    NetworkManager.io.emit('updatePlayers', backEndPlayers)
    //console.log('updating ' + JSON.stringify(backEndEnemies))
    NetworkManager.io.emit('updateEnemies', backEndEnemies)
    NetworkManager.io.emit('updateBonuses', backEndBonuses)
  }

  gameOver() {
    const winner = PlayerManager.getWinner()
    NetworkManager.io.emit('gameOver', winner)
    EnemyManager.resetAllEnemies()
    PlayerManager.resetAllPlayers()
    BonusManager.resetAllBonuses()
  }
}

module.exports = { GameManager }
