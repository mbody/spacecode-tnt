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
const {
  SCREEN,
  TOURNAMENT_TIME_SECONDS,
  MAX_CODE_LENGTH
} = require('./classes/Constants')
const { BonusManager } = require('./classes/BonusManager')

class GameManager {
  displayers = {}
  isTournamentOver = false

  constructor() {
    NetworkManager.io.on('connection', this.onConnection)
    NetworkManager.registerPostEndpoint('/player', this.onNewBotPlayer)
    // backend ticker
    this.loopId = setInterval(this.loop, 1000 / 30)
    game.isTournament = process.env.MODE === 'TOURNAMENT'
    game.isDebug = process.env.MODE === 'DEBUG'
    game.endTournamentTS = Date.now() + TOURNAMENT_TIME_SECONDS * 1000
    PlayerManager.restoreBackup()
    
    if (!game.isTournament) {
      console.log('=========== TRAINING MODE ===========')
    } else {
      setTimeout(this.endTournament, TOURNAMENT_TIME_SECONDS * 1000)
      console.log('=========== TOURNAMENT MODE ===========')
    }
  }

  endTournament = () => {
    this.isTournamentOver = true
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
      if (data.code.length > MAX_CODE_LENGTH) {
        response.status(400).send('Votre code est malheureusement trop long !')
        return
      }
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
    PlayerManager.updateAllPlayers()
    if (this.isTournamentOver) {
      this.gameOver()
    }
  }

  initGameCallback(callback) {
    callback({
      ip: NetworkManager.getIpAddress(),
      isTournament: game.isTournament,
      endTournamentTS: game.endTournamentTS,
      isDebug: game.isDebug,
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
    if (!hasPlayerAlive || this.isTournamentOver) {
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
    clearInterval(this.loopId)
  }
}

module.exports = { GameManager }
