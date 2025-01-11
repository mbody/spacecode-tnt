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

let isTournament = true
let __DEV__ = true

const SORT_BY = {
  QUEUE: 'QUEUE',
  USERNAME: 'USERNAME',
  SCORE: 'SCORE'
}
let sortBy = SORT_BY.SCORE

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
    const countDown = document.querySelector('#countDown')
    isTournament = response.isTournament
    const countDownDate = response.endTournamentTS
    if (isTournament) {
      updateCountDown(countDown, countDownDate)
    } else {
      countDown.innerHTML = 'MODE ENTRAINEMENT'
    }
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
/*
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
  */

socket.on('updateBonuses', (backEndBonuses) => {
  if (!document.hasFocus()) return

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
  if (!document.hasFocus()) return
  const table = document.getElementById('playersTable')
  table.innerHTML = ''

  const activePlayers = []
  for (const id in backEndPlayers) {
    const backEndPlayer = backEndPlayers[id]

    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new Player(backEndPlayer)
    } else {
      frontEndPlayers[id].updateFromBackend(backEndPlayer)
    }

    activePlayers.push(backEndPlayer)
  }

  activePlayers.sort((a, b) => b.score - a.score)

  activePlayers.forEach((player, index) => {
    let lives = ''
    for (let index = 0; index < NB_MAX_LIVES; index++) {
      if (index < player.lives) {
        lives += `<span style="color: ${player.color}">	&#x2665;</span>`
      } else {
        lives += `<span style="color: black">	&#x2665;</span>`
      }
    }
    table.innerHTML += `<tr ${
      index == 0 ? 'class="mvp"' : ''
    }><th style="text-align: left" > ${
      player.username
    }</th><td style="padding:0 5px">${lives}</th><td>${player.score} </th></tr>`
  })

  // this is where we delete frontend players
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      if (id === socket.id) {
        document.querySelector('#usernameForm').style.display = 'block'
      }

      delete frontEndPlayers[id]
    }
  }
})

socket.on('updateAllPlayers', (allPlayers) => {
  const allPlayersTable = document.getElementById('allPlayersTable')
  if (allPlayers.length > 0 && !isTournament) {
    allPlayers[0].isBest = true
  }
  if (isTournament || sortBy == SORT_BY.QUEUE) {
    allPlayers.sort((a, b) =>
      !a.pendingRank ? 1 : !b.pendingRank ? -1 : a.pendingRank - b.pendingRank
    )
  } else if (sortBy == SORT_BY.USERNAME) {
    allPlayers.sort((a, b) => a.username - b.username)
  }
  allPlayersTable.innerHTML = ''
  let index = 1
  for (const player of allPlayers) {
    allPlayersTable.innerHTML += `<tr ${player.isBest ? 'id="mvp"' : ''} ><td>${
      isTournament ? '-' : index
    }</td><td>
      ${player.username}
      ${player.isBest ? '&#128081;' : ''} 
      </td><td>${player.pendingRank || '-'}</td><td>${
      player.bestScore
    }</td></tr>`
    index++
  }
})

/*
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
*/
socket.on('playerKilled', ({ player }) => {
  if (!document.hasFocus()) return
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
  ).innerHTML = `FELICITATIONS à <b>${winner.username}</b> !!! `
  gameoverBox.style.display = 'flex'
})

function updateCountDown(countDownDiv, countDownDate) {
  const intervalId = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime()

    // Find the distance between now and the count down date
    var distance = countDownDate - now
    // If the count down is finished, write some text
    if (distance < 0) {
      distance = 0
      clearInterval(intervalId)
    }

    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)
    seconds = String(seconds).padStart(2, '0')

    // Display the result in the element with id="demo"
    countDownDiv.innerHTML = minutes + ':' + seconds + ''
  }, 1000)
}

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
