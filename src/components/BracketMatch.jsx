export default function BracketMatch({ match, onWinner, label }) {
  if (!match) return null

  return (
    <div className="bracket-match">
      {label && <div className="bracket-label">{label}</div>}
      <button
        className={`bracket-player ${match.winner === match.playerA ? 'winner' : ''} ${!match.playerA ? 'bye' : ''}`}
        onClick={() => match.playerA && !match.winner && onWinner(match.id, match.playerA)}
        disabled={!!match.winner}
      >
        {match.playerA || 'TBD'}
        {match.winner === match.playerA && <span className="crown"> ★</span>}
      </button>
      <div className="bracket-divider">VS</div>
      <button
        className={`bracket-player ${match.winner === match.playerB ? 'winner' : ''} ${!match.playerB ? 'bye' : ''}`}
        onClick={() => match.playerB && !match.winner && onWinner(match.id, match.playerB)}
        disabled={!!match.winner}
      >
        {match.playerB || 'TBD'}
        {match.winner === match.playerB && <span className="crown"> ★</span>}
      </button>
    </div>
  )
}
