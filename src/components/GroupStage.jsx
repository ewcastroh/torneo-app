import { useState } from 'react'
import { computeGroupStandings } from '../utils/tournament'

function MatchCard({ match, onWinner }) {
  return (
    <div className="match-card">
      <button
        className={`match-player ${match.winner === match.playerA ? 'winner' : ''}`}
        onClick={() => onWinner(match.id, match.playerA)}
      >
        {match.playerA}
        {match.winner === match.playerA && <span className="crown">★</span>}
      </button>
      <span className="vs">VS</span>
      <button
        className={`match-player ${match.winner === match.playerB ? 'winner' : ''}`}
        onClick={() => onWinner(match.id, match.playerB)}
      >
        {match.winner === match.playerB && <span className="crown">★</span>}
        {match.playerB}
      </button>
    </div>
  )
}

function GroupCard({ group, onWinner }) {
  const standings = computeGroupStandings(group)
  const allPlayed = group.matches.every(m => m.winner !== null)

  return (
    <div className={`group-card ${allPlayed ? 'group-done' : ''}`}>
      <div className="group-header">
        <h3>{group.name}</h3>
        {allPlayed && <span className="badge-done">✓ Completo</span>}
      </div>

      <div className="group-body">
        <div className="group-matches">
          <h4>Partidos</h4>
          {group.matches.map(m => (
            <MatchCard key={m.id} match={m} onWinner={onWinner} />
          ))}
        </div>

        <div className="group-standings">
          <h4>Clasificación</h4>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>V</th>
                <th>D</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, i) => (
                <tr key={s.name} className={i < 2 ? 'qualifies' : 'repechaje-row'}>
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.wins}</td>
                  <td>{s.losses}</td>
                  <td><strong>{s.points}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="legend">
            <span className="legend-q">■ Clasifica</span>
            <span className="legend-r">■ Repechaje</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GroupStage({ groups, onMatchResult, onAdvance }) {
  const [activeGroup, setActiveGroup] = useState(0)
  const allDone = groups.every(g => g.matches.every(m => m.winner !== null))

  return (
    <div className="group-stage">
      <div className="phase-header">
        <h2>Fase de Grupos</h2>
        <p>Cada grupo juega 2 partidos: 1° vs 3° y 2° vs 4°. Los 2 ganadores clasifican directo, los 2 perdedores van al repechaje.</p>
      </div>

      <div className="group-tabs">
        {groups.map((g, i) => {
          const done = g.matches.every(m => m.winner !== null)
          return (
            <button
              key={g.id}
              className={`tab ${activeGroup === i ? 'tab-active' : ''} ${done ? 'tab-done' : ''}`}
              onClick={() => setActiveGroup(i)}
            >
              {g.name}
              {done && ' ✓'}
            </button>
          )
        })}
      </div>

      <GroupCard
        group={groups[activeGroup]}
        onWinner={(matchId, winner) => onMatchResult(activeGroup, matchId, winner)}
      />

      {allDone && (
        <div className="advance-bar">
          <div className="advance-summary">
            <strong>¡Fase de grupos completada!</strong>
            <p>16 jugadores clasificados directo · 16 jugadores al repechaje</p>
          </div>
          <button className="btn-advance" onClick={onAdvance}>
            Continuar al Repechaje →
          </button>
        </div>
      )}
    </div>
  )
}
