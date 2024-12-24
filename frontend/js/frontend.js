const canvas = document.querySelector('#gameboard')
const c = canvas.getContext('2d')

const socket = io()

const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = SCREEN.width * devicePixelRatio
canvas.height = SCREEN.height * devicePixelRatio

c.scale(devicePixelRatio, devicePixelRatio)

const x = canvas.width / 2
const y = canvas.height / 2

const frontEndPlayers = {}
const frontEndProjectiles = {}
const frontEndEnemies = {}
const frontEndBonuses = {}
const particles = []

const background = new Background(SCREEN)

// handle window resize
window.addEventListener(
  'load',
  function () {
    var canvas = document.getElementsByTagName('canvas')[0]

    fullscreenify(canvas)
  },
  false
)

function fullscreenify(canvas) {
  var style = canvas.getAttribute('style') || ''

  window.addEventListener(
    'resize',
    function () {
      resize(canvas)
    },
    false
  )

  resize(canvas)

  function resize(canvas) {
    s = Math.min(
      window.innerWidth / devicePixelRatio / SCREEN.width,
      window.innerHeight / devicePixelRatio / SCREEN.height
    )

    var scale = s + ',' + s

    canvas.setAttribute(
      'style',
      style +
        ' ' +
        //        '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' +
        scale +
        '); -webkit-transform: scale3d(' +
        scale +
        ', 1); -moz-transform: scale(' +
        scale +
        '); -o-transform: scale(' +
        scale +
        '); transform: scale(' +
        scale +
        ');'
    )
  }
}

socket.emit(
  'initDisplay',
  {
    width: canvas.width,
    height: canvas.height,
    devicePixelRatio
  },
  (response) => {
    const serverUrl = document.querySelector('#serverUrl')
    serverUrl.innerHTML = response.ip
  }
)

socket.on('updateProjectiles', (backEndProjectiles) => {
  for (const id in backEndProjectiles) {
    const backEndProjectile = backEndProjectiles[id]

    if (!frontEndProjectiles[id]) {
      frontEndProjectiles[id] = new Projectile({
        x: backEndProjectile.x,
        y: backEndProjectile.y,
        radius: 5,
        color: frontEndPlayers[backEndProjectile.playerId]?.color,
        velocity: backEndProjectile.velocity
      })
    } else {
      frontEndProjectiles[id].x += backEndProjectiles[id].velocity.x
      frontEndProjectiles[id].y += backEndProjectiles[id].velocity.y
    }
  }

  for (const frontEndProjectileId in frontEndProjectiles) {
    if (!backEndProjectiles[frontEndProjectileId]) {
      delete frontEndProjectiles[frontEndProjectileId]
    }
  }
})

socket.on('updateEnemies', (backEndEnemies) => {
  //console.log('updating enemies')
  for (const id in backEndEnemies) {
    const enemy = backEndEnemies[id]

    if (!frontEndEnemies[id]) {
      frontEndEnemies[id] = new Enemy(enemy)
    } else {
      frontEndEnemies[id].x = enemy.x
      frontEndEnemies[id].y = enemy.y
    }
  }

  for (const id in frontEndEnemies) {
    if (!backEndEnemies[id]) {
      delete frontEndEnemies[id]
    }
  }
})

socket.on('updateBonuses', (backEndBonuses) => {
  for (const id in backEndBonuses) {
    const bonus = backEndBonuses[id]

    if (!frontEndBonuses[id]) {
      frontEndBonuses[id] = new Bonus(bonus)
    } else {
      frontEndBonuses[id].x = bonus.x
      frontEndBonuses[id].y = bonus.y
    }
  }

  for (const id in frontEndBonuses) {
    if (!backEndBonuses[id]) {
      delete frontEndBonuses[id]
    }
  }
})

socket.on('updatePlayers', (backEndPlayers) => {
  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id]
    const div = document.querySelector(`tr[data-id="${id}"]`)

    if (!frontEndPlayers[id] || !div) {
      frontEndPlayers[id] = new Player(backEndPlayer)

      document.querySelector(
        '#playerLabels'
      ).innerHTML += `<tr onclick="copyToClipboard('${id}')" data-id="${id}" data-score="${backEndPlayer.score}"><td></th><td>${backEndPlayer.username}</th><td> ${backEndPlayer.score}</th></tr>`
    } else {
      frontEndPlayers[id].updateFromBackend(backEndPlayer)

      let lives = ''
      for (let index = 0; index < NB_MAX_LIVES; index++) {
        if (index < backEndPlayer.lives) {
          lives += `<span style="color: ${backEndPlayer.color}">	&#x2665;</span>`
        } else {
          lives += `<span style="color: black">	&#x2665;</span>`
        }
      }
      div.innerHTML = `<th style="text-align: left"> ${backEndPlayer.username}</th><td style="padding:0 5px">${lives}</th><td>${backEndPlayer.score} </th>`

      div.setAttribute('data-score', backEndPlayer.score)

      // sorts the players divs
      const parentDiv = document.querySelector('#playerLabels')
      const childDivs = Array.from(parentDiv.querySelectorAll('tr'))

      childDivs.sort((a, b) => {
        const scoreA = Number(a.getAttribute('data-score'))
        const scoreB = Number(b.getAttribute('data-score'))

        return scoreB - scoreA
      })

      // removes old elements
      childDivs.forEach((div) => {
        parentDiv.removeChild(div)
      })

      // adds sorted elements
      childDivs.forEach((div) => {
        parentDiv.appendChild(div)
      })

      frontEndPlayers[id].target = {
        x: backEndPlayer.x,
        y: backEndPlayer.y,
        rotation: backEndPlayer.rotation
      }

      if (!backEndPlayer.alive) {
        frontEndPlayers[id].x = backEndPlayer.x
        frontEndPlayers[id].y = backEndPlayer.y
        frontEndPlayers[id].rotation = backEndPlayer.rotation
      }

      if (id === socket.id && backEndPlayer.alive) {
        const lastBackendInputIndex = playerInputs.findIndex((input) => {
          return backEndPlayer.sequenceNumber === input.sequenceNumber
        })

        if (lastBackendInputIndex > -1)
          playerInputs.splice(0, lastBackendInputIndex + 1)

        playerInputs.forEach((input) => {
          frontEndPlayers[id].target.x += input.dx
          frontEndPlayers[id].target.y += input.dy
        })
      }
    }
  }

  // this is where we delete frontend players
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      const divToDelete = document.querySelector(`div[data-id="${id}"]`)
      divToDelete.parentNode.removeChild(divToDelete)

      if (id === socket.id) {
        document.querySelector('#usernameForm').style.display = 'block'
      }

      delete frontEndPlayers[id]
    }
  }
})

socket.on('enemyKilled', ({ enemy, killedBy }) => {
  Enemy.enemyKilled()
  // create explosion
  for (let i = 0; i < enemy.radius * 2; i++) {
    particles.push(
      new Particle(enemy.x, enemy.y, Math.random() * 2, killedBy.color, {
        x: (Math.random() - 0.5) * (Math.random() * 6),
        y: (Math.random() - 0.5) * (Math.random() * 6)
      })
    )
  }
})

socket.on('playerKilled', ({ player }) => {
  Player.playerKilled()
  // create explosion
  for (let i = 0; i < player.radius * 2; i++) {
    particles.push(
      new Particle(player.x, player.y, Math.random() * 2, player.color, {
        x: (Math.random() - 0.5) * (Math.random() * 6),
        y: (Math.random() - 0.5) * (Math.random() * 6)
      })
    )
  }
})

socket.on('playerBonus', ({ player }) => {
  Bonus.bonusCollected()
})

socket.on('gameOver', (winner) => {
  const gameoverBox = document.querySelector('#gameover')
  document.querySelector(
    '#gameoverMessage'
  ).innerHTML = `GAME OVER !<br><br> <b>${winner.username}</b> wins with ${winner.score} points`
  gameoverBox.style.display = 'flex'

  setTimeout(() => {
    gameoverBox.style.display = 'none'
  }, 10000)
})

let animationId
function animate() {
  animationId = requestAnimationFrame(animate)

  // c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.clearRect(0, 0, canvas.width, canvas.height)

  background.draw()

  for (const id in frontEndPlayers) {
    const frontEndPlayer = frontEndPlayers[id]

    // linear interpolation
    if (frontEndPlayer.target) {
      frontEndPlayers[id].x +=
        (frontEndPlayers[id].target.x - frontEndPlayers[id].x) * 0.5
      frontEndPlayers[id].y +=
        (frontEndPlayers[id].target.y - frontEndPlayers[id].y) * 0.5
      frontEndPlayers[id].rotation +=
        (frontEndPlayers[id].target.rotation - frontEndPlayers[id].rotation) *
        0.5
    }

    frontEndPlayer.draw()
  }

  Object.values(frontEndProjectiles).forEach((e) => e.draw())
  Object.values(frontEndEnemies).forEach((e) => e.draw())
  Object.values(frontEndBonuses).forEach((e) => e.draw())

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  })
}

animate()

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  }
}

const SPEED = 5
const playerInputs = []
let sequenceNumber = 0
setInterval(() => {
  if (keys.w.pressed) {
    sequenceNumber++
    //playerInputs.push({ sequenceNumber, dx: 0, dy: -SPEED })
    // frontEndPlayers[socket.id].y -= SPEED
    socket.emit('keydown', { keycode: 'ArrowUp', sequenceNumber })
  }

  if (keys.a.pressed) {
    sequenceNumber++
    //playerInputs.push({ sequenceNumber, dx: -SPEED, dy: 0 })
    // frontEndPlayers[socket.id].x -= SPEED
    socket.emit('keydown', { keycode: 'ArrowLeft', sequenceNumber })
  }

  if (keys.s.pressed) {
    sequenceNumber++
    //playerInputs.push({ sequenceNumber, dx: 0, dy: SPEED })
    // frontEndPlayers[socket.id].y += SPEED
    socket.emit('keydown', { keycode: 'ArrowDown', sequenceNumber })
  }

  if (keys.d.pressed) {
    sequenceNumber++
    //playerInputs.push({ sequenceNumber, dx: SPEED, dy: 0 })
    // frontEndPlayers[socket.id].x += SPEED
    socket.emit('keydown', { keycode: 'ArrowRight', sequenceNumber })
  }

  if (keys.space.pressed) {
    socket.emit('shoot')
  }
}, 15)

window.addEventListener('keydown', (event) => {
  if (!frontEndPlayers[socket.id]) return

  console.log(event.code)

  switch (event.code) {
    case 'ArrowUp':
      keys.w.pressed = true
      break

    case 'ArrowLeft':
      keys.a.pressed = true
      break

    case 'ArrowDown':
      keys.s.pressed = true
      break

    case 'ArrowRight':
      keys.d.pressed = true
      break
    case 'Space':
      keys.space.pressed = true
      break
  }
})

window.addEventListener('keyup', (event) => {
  if (!frontEndPlayers[socket.id]) return

  switch (event.code) {
    case 'ArrowUp':
      keys.w.pressed = false
      break

    case 'ArrowLeft':
      keys.a.pressed = false
      break

    case 'ArrowDown':
      keys.s.pressed = false
      break

    case 'ArrowRight':
      keys.d.pressed = false
      break
    case 'Space':
      keys.space.pressed = false
      break
  }
})
