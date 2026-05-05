import { useState, useEffect } from 'react'
import PlayerInput from './components/PlayerInput'
import GroupStage from './components/GroupStage'
import Repechaje from './components/Repechaje'
import Knockout from './components/Knockout'
import { createGroups, computeGroupStandings, createBracket, advanceBracket } from './utils/tournament'

const PHASES = ['input', 'groups', 'repechaje', 'knockout']
const STORAGE_KEY = 'torneo-state'

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY)
}

export default function App() {
  const saved = loadState()

  const [phase, setPhase] = useState(saved?.phase || 'input')
  const [config, setConfig] = useState(saved?.config || null)
  const [groups, setGroups] = useState(saved?.groups || [])
  const [repechajeRounds, setRepechajeRounds] = useState(saved?.repechajeRounds || [])
  const [knockoutRounds, setKnockoutRounds] = useState(saved?.knockoutRounds || [])
  const [champion, setChampion] = useState(saved?.champion || null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      phase, config, groups, repechajeRounds, knockoutRounds, champion,
    }))
  }, [phase, config, groups, repechajeRounds, knockoutRounds, champion])

  function handleStart({ players, sport, tournamentName }) {
    const g = createGroups(players)
    setConfig({ sport, tournamentName })
    setGroups(g)
    setPhase('groups')
  }

  function handleGroupMatch(groupIdx, matchId, winner) {
    setGroups(prev => prev.map((g, i) => {
      if (i !== groupIdx) return g
      return {
        ...g,
        matches: g.matches.map(m =>
          m.id === matchId ? { ...m, winner } : m
        ),
      }
    }))
  }

  function handleGroupsAdvance() {
    const direct = []
    const repechaje = []
    groups.forEach(g => {
      const standings = computeGroupStandings(g)
      direct.push(standings[0].name, standings[1].name)
      repechaje.push(standings[2].name, standings[3].name)
    })
    const firstRound = createBracket(repechaje, 'rep')
    setRepechajeRounds([firstRound])
    setConfig(prev => ({ ...prev, directQualifiers: direct }))
    setPhase('repechaje')
  }

  function handleRepechajeMatch(matchId, winner) {
    setRepechajeRounds(prev => {
      const last = prev[prev.length - 1]
      const updated = last.map(m => m.id === matchId ? { ...m, winner } : m)
      const allDone = updated.every(m => m.winner)
      if (allDone && updated.length > 1) {
        const next = advanceBracket(updated, 'rep', prev.length + 1)
        return [...prev.slice(0, -1), updated, ...(next ? [next] : [])]
      }
      return [...prev.slice(0, -1), updated]
    })
  }

  function handleRepechajeAdvance() {
    const firstRound = createBracket(config.directQualifiers, 'k')
    setKnockoutRounds([firstRound])
    setPhase('knockout')
  }

  function handleKnockoutMatch(matchId, winner) {
    setKnockoutRounds(prev => {
      const last = prev[prev.length - 1]
      const updated = last.map(m => m.id === matchId ? { ...m, winner } : m)
      const allDone = updated.every(m => m.winner)

      if (allDone) {
        if (updated.length === 1) {
          setChampion(winner)
          return [...prev.slice(0, -1), updated]
        }
        const next = advanceBracket(updated, 'k', prev.length + 1)
        return [...prev.slice(0, -1), updated, ...(next ? [next] : [])]
      }
      return [...prev.slice(0, -1), updated]
    })
  }

  function handleReset() {
    resetState()
    window.location.reload()
  }

  const phaseLabels = {
    groups: 'Fase de Grupos',
    repechaje: 'Repechaje',
    knockout: 'Eliminatoria',
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="logo">🏅</span>
          <div>
            <h1>{config?.tournamentName || 'Torneo Deportivo'}</h1>
            {config?.sport && <span className="sport-tag">{config.sport}</span>}
          </div>
        </div>
        <div className="header-right">
          {phase !== 'input' && (
            <div className="phase-pills">
              {['groups', 'repechaje', 'knockout'].map(p => (
                <span
                  key={p}
                  className={`phase-pill ${phase === p ? 'pill-active' : ''} ${
                    PHASES.indexOf(p) < PHASES.indexOf(phase) ? 'pill-done' : ''
                  }`}
                >
                  {phaseLabels[p]}
                </span>
              ))}
            </div>
          )}
          {phase !== 'input' && (
            <button className="btn-reset" onClick={handleReset} title="Nuevo torneo">
              ✕ Nuevo torneo
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {phase === 'input' && <PlayerInput onStart={handleStart} />}

        {phase === 'groups' && (
          <GroupStage
            groups={groups}
            onMatchResult={handleGroupMatch}
            onAdvance={handleGroupsAdvance}
          />
        )}

        {phase === 'repechaje' && (
          <Repechaje
            rounds={repechajeRounds}
            onWinner={handleRepechajeMatch}
            onAdvance={handleRepechajeAdvance}
            mainCount={config?.directQualifiers?.length || 16}
          />
        )}

        {phase === 'knockout' && (
          <Knockout
            rounds={knockoutRounds}
            onWinner={handleKnockoutMatch}
            champion={champion}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}
