import BracketMatch from './BracketMatch'
import { getRoundName } from '../utils/tournament'

export default function Knockout({ rounds, onWinner, champion }) {
  const currentRoundIdx = rounds.findIndex(r => r.some(m => !m.winner))
  const currentRound = currentRoundIdx === -1 ? rounds[rounds.length - 1] : rounds[currentRoundIdx]
  const totalPlayers = rounds[0].length * 2

  if (champion) {
    return (
      <div className="champion-screen">
        <div className="trophy">🏆</div>
        <h2>¡Campeón del Torneo!</h2>
        <div className="champion-name">{champion}</div>
        <p className="champion-sub">Ha conquistado el torneo tras {rounds.length} rondas de eliminatoria</p>
        <button className="btn-restart" onClick={() => window.location.reload()}>
          Nuevo Torneo
        </button>
      </div>
    )
  }

  return (
    <div className="bracket-stage">
      <div className="phase-header">
        <h2>⚔️ Eliminatoria</h2>
        <p>Ronda única, el perdedor queda eliminado. El ganador de la final es el campeón.</p>
      </div>

      <div className="rounds-nav">
        {rounds.map((r, i) => {
          const done = r.every(m => m.winner)
          const active = i === currentRoundIdx
          return (
            <span key={i} className={`round-badge ${active ? 'round-active' : ''} ${done ? 'round-done' : ''}`}>
              {getRoundName(totalPlayers, i + 1)} {done && '✓'}
            </span>
          )
        })}
      </div>

      <div className="matches-grid">
        {currentRound.map(m => (
          <BracketMatch key={m.id} match={m} onWinner={onWinner} />
        ))}
      </div>

      {currentRoundIdx > 0 && (
        <div className="past-rounds">
          <h4>Rondas anteriores</h4>
          {rounds.slice(0, currentRoundIdx === -1 ? rounds.length - 1 : currentRoundIdx).map((r, i) => (
            <div key={i} className="past-round">
              <span className="past-round-name">{getRoundName(totalPlayers, i + 1)}</span>
              <div className="past-matches">
                {r.map(m => (
                  <div key={m.id} className="past-match">
                    <span className={m.winner === m.playerA ? 'won' : 'lost'}>{m.playerA}</span>
                    <span className="vs-small">vs</span>
                    <span className={m.winner === m.playerB ? 'won' : 'lost'}>{m.playerB}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
