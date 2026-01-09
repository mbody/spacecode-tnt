const express = require('express')
var cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())

const { networkInterfaces } = require('os')

class NetworkManager {
  static io
  static socketId

  static startApp() {
    // App setup
    app.use(express.static('frontend'))
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html')
    })
    // Docs
    app.use('/docs', express.static('docs'))
    app.get('/docs/', (req, res) => {
      res.sendFile(__dirname + '/docs/index.html')
    })

    // Codelab
    app.use('/codelab', express.static('codelab'))
    app.get('/codelab/', (req, res) => {
      res.sendFile(__dirname + '/codelab/index.html')
    })

    // Play
    app.use('/play', express.static('play'))
    app.get('/play/', (req, res) => {
      res.sendFile(__dirname + '/play/index.html')
    })

    // j'importe ici pour éviter les imports circulaires, c'est pas beau, mais j'ai pas envie de réfléchir sur une autre solution
    const { adminController, adminBackupController, adminClearController } = require('./Admin')

    app.get('/admin/', adminController)
    app.post('/admin/backup/', adminBackupController)
    app.post('/admin/clear/', adminClearController)

    // socket.io setup
    const http = require('http')
    const server = http.createServer(app)
    const { Server } = require('socket.io')
    const port = process.env.MODE === 'DEBUG' ? 3000 : 80

    NetworkManager.io = new Server(server, {
      pingInterval: 2000,
      pingTimeout: 5000
    })

    server.listen(port, '0.0.0.0', () => {
      console.log(
        `Spacecode server listening on port ${port}... \nOpen http://localhost:${port} to display the game`
      )
    })
  }

  static getIpAddress() {
    const nets = networkInterfaces()
    const results = {}
    let firstIp = undefined
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
          if (!results[name]) {
            results[name] = []
          }
          results[name].push(net.address)
          if (!firstIp) {
            firstIp = net.address
          }
        }
      }
    }

    return firstIp
  }

  static on(message, callback) {
    this.io.on(message, callback)
  }
  static emit(message, data) {
    this.io.emit(message, data)
  }

  static registerPostEndpoint(path, handler) {
    app.post(path, handler)
  }
}

module.exports = NetworkManager
