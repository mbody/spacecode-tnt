const backEndPlayers = {}
const pendingPlayers = []
const backEndProjectiles = {}
const backEndEnemies = {}
const backEndBonuses = {}
const game = {
  isTournament: false,
  endTournamentTS: undefined
}

module.exports = {
  backEndPlayers,
  pendingPlayers,
  backEndProjectiles,
  backEndEnemies,
  backEndBonuses,
  game
}
