const { GameManager } = require('./backend/GameManager')
const NetworkManager = require('./backend/classes/NetworkManager')

NetworkManager.startApp()

// create and start a new game manager
const gameManager = new GameManager()
