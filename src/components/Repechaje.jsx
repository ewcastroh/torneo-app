import BracketMatch from './BracketMatch'
import { getRoundName } from '../utils/tournament'

export default function Repechaje({ rounds, onWinner, onAdvance, mainCount }) {
  const currentRoundIdx = rounds.findIndex(r => r.some(m => !m.winner))
  const currentRound = currentRoundIdx === -1 ? rounds[rounds.length - 1] : rounds[currentRoundIdx]
  const currentRoundNum = currentRoundIdx === -1 ? rounds.length : currentRoundIdx + 1
  const allDone = rounds.every(r => r.every(m => m.winner))
  const totalPlayers = rounds[0].length * 2

  const survivors = allDone
    ? rounds[rounds.length - 1].map(m => m.winner).filter(Boolean)
    : []

  return (
    <div className="bracket-stage">
      <div className="phase-header repechaje-header">
        <h2>🔄 Repechaje</h2>
        <p>
          {allDone
            ? `¡Campeón del repechaje: ${survivors[0]}! Los ${mainCount} clasificados directos continúan a la eliminatoria principal.`
            : 'Los jugadores que no clasificaron directamente compiten en este bracket de consolación.'}
        </p>
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

      {currentRoundIdx === -1 && rounds.length > 1 && (
        <div className="past-rounds">
          <h4>Rondas anteriores</h4>
          {rounds.slice(0, -1).map((r, i) => (
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

      {allDone && (
        <div className="advance-bar repechaje-advance">
          <div className="advance-summary">
            <strong>🥈 Campeón del Repechaje: {survivors[0]}</strong>
            <p>Los {mainCount} clasificados directos de los grupos continúan a la eliminatoria principal.</p>
          </div>
          <button className="btn-advance" onClick={onAdvance}>
            Continuar a la Eliminatoria →
          </button>
        </div>
      )}
    </div>
  )
}
