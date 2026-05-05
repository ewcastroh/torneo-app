import { useState } from 'react'

const DEMO_PLAYERS = [
  'Carlos', 'María', 'Juan', 'Ana', 'Pedro', 'Lucía', 'Diego', 'Sofía',
  'Miguel', 'Valeria', 'Andrés', 'Isabella', 'Sebastián', 'Camila', 'Felipe', 'Daniela',
  'Alejandro', 'Paula', 'Ricardo', 'Natalia', 'Jorge', 'Laura', 'Marcos', 'Andrea',
  'Roberto', 'Verónica', 'Francisco', 'Patricia', 'Eduardo', 'Gabriela', 'Antonio', 'Elena',
]

export default function PlayerInput({ onStart }) {
  const [players, setPlayers] = useState(Array(32).fill(''))
  const [sport, setSport] = useState('')
  const [tournamentName, setTournamentName] = useState('')

  function handleChange(i, val) {
    const next = [...players]
    next[i] = val
    setPlayers(next)
  }

  function fillDemo() {
    setPlayers([...DEMO_PLAYERS])
    setSport('Tenis de Mesa')
    setTournamentName('Torneo Demo 2026')
  }

  function handleStart() {
    const names = players.map(p => p.trim()).filter(Boolean)
    if (names.length < 32) {
      alert(`Faltan ${32 - names.length} jugadores por ingresar.`)
      return
    }
    onStart({ players: names.slice(0, 32), sport, tournamentName })
  }

  const filled = players.filter(p => p.trim()).length

  return (
    <div className="player-input">
      <div className="input-header">
        <h2>Configurar Torneo</h2>
        <div className="meta-fields">
          <input
            className="meta-input"
            placeholder="Nombre del torneo"
            value={tournamentName}
            onChange={e => setTournamentName(e.target.value)}
          />
          <input
            className="meta-input"
            placeholder="Deporte (ej: Tenis, Fútbol...)"
            value={sport}
            onChange={e => setSport(e.target.value)}
          />
        </div>
      </div>

      <div className="players-grid-header">
        <span>Jugadores ({filled}/32)</span>
        <button className="btn-demo" onClick={fillDemo}>Rellenar con demo</button>
      </div>

      <div className="players-grid">
        {players.map((p, i) => (
          <div key={i} className="player-row">
            <span className="player-num">{i + 1}</span>
            <input
              className={`player-name-input ${p.trim() ? 'filled' : ''}`}
              value={p}
              placeholder={`Jugador ${i + 1}`}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const next = document.querySelectorAll('.player-name-input')[i + 1]
                  if (next) next.focus()
                }
              }}
            />
          </div>
        ))}
      </div>

      <div className="start-bar">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(filled / 32) * 100}%` }} />
        </div>
        <button
          className="btn-start"
          onClick={handleStart}
          disabled={filled < 32}
        >
          {filled < 32 ? `Faltan ${32 - filled} jugadores` : 'Iniciar Torneo →'}
        </button>
      </div>
    </div>
  )
}
