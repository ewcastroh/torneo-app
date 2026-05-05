export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function createGroups(players) {
  const shuffled = shuffle(players)
  const groups = []
  for (let i = 0; i < 8; i++) {
    groups.push({
      id: i,
      name: `Grupo ${String.fromCharCode(65 + i)}`,
      players: shuffled.slice(i * 4, i * 4 + 4).map((name, idx) => ({
        id: `g${i}p${idx}`,
        name,
        wins: 0,
        losses: 0,
        points: 0,
      })),
      matches: generateGroupMatches(shuffled.slice(i * 4, i * 4 + 4), i),
      finished: false,
    })
  }
  return groups
}

function generateGroupMatches(players, groupId) {
  // 1° vs 3°, luego 2° vs 4°
  return [
    { id: `g${groupId}m0`, playerA: players[0], playerB: players[2], winner: null },
    { id: `g${groupId}m1`, playerA: players[1], playerB: players[3], winner: null },
  ]
}

export function computeGroupStandings(group) {
  const stats = {}
  group.players.forEach(p => {
    stats[p.name] = { name: p.name, wins: 0, losses: 0, points: 0 }
  })
  group.matches.forEach(m => {
    if (m.winner) {
      stats[m.winner].wins += 1
      stats[m.winner].points += 3
      const loser = m.winner === m.playerA ? m.playerB : m.playerA
      stats[loser].losses += 1
    }
  })
  return Object.values(stats).sort((a, b) => b.points - a.points || b.wins - a.wins)
}

export function createBracket(players, prefix = 'k') {
  const shuffled = shuffle(players)
  const matches = []
  for (let i = 0; i < shuffled.length; i += 2) {
    matches.push({
      id: `${prefix}r1m${i / 2}`,
      playerA: shuffled[i],
      playerB: shuffled[i + 1],
      winner: null,
      round: 1,
    })
  }
  return matches
}

export function advanceBracket(currentMatches, prefix, nextRound) {
  const winners = currentMatches.map(m => m.winner).filter(Boolean)
  if (winners.length !== currentMatches.length) return null
  const shuffled = shuffle(winners)
  const matches = []
  for (let i = 0; i < shuffled.length; i += 2) {
    matches.push({
      id: `${prefix}r${nextRound}m${i / 2}`,
      playerA: shuffled[i],
      playerB: shuffled[i + 1],
      winner: null,
      round: nextRound,
    })
  }
  return matches
}

export function getRoundName(totalPlayers, round) {
  const playersInRound = totalPlayers / Math.pow(2, round - 1)
  if (playersInRound === 2) return 'Final'
  if (playersInRound === 4) return 'Semifinales'
  if (playersInRound === 8) return 'Cuartos de Final'
  if (playersInRound === 16) return 'Octavos de Final'
  if (playersInRound === 32) return 'Ronda de 32'
  return `Ronda de ${playersInRound}`
}
