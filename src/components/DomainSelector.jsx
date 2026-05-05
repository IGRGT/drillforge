import { useState } from 'react'
import { allScenarios, CORE_META } from '../data'

const LIMITS  = [5, 10, 15, 20, 999]
const LIMIT_LABELS = {
  5:   '5 questions',
  10:  '10 questions',
  15:  '15 questions',
  20:  '20 questions',
  999: 'All available',
}

const TIMERS = [0, 15, 30, 45, 90]
const TIMER_LABELS = {
  0:  'No timer',
  15: '15 min',
  30: '30 min',
  45: '45 min',
  90: '90 min (full exam)',
}

const DOMAIN_COLOR = {
  '1': 'var(--d1)',
  '2': 'var(--d2)',
  '3': 'var(--d3)',
  '4': 'var(--d4)',
  '5': 'var(--d5)',
}

export default function DomainSelector({ onStart }) {
  const [core,     setCore]     = useState('1')
  const [selected, setSelected] = useState(CORE_META['1'].domains)
  const [limit,    setLimit]    = useState(10)
  const [timer,    setTimer]    = useState(0)
  const [shuffle,  setShuffle]  = useState(true)

  const meta    = CORE_META[core]
  const DOMAINS = meta.domains

  function switchCore(newCore) {
    if (newCore === core) return
    setCore(newCore)
    setSelected(CORE_META[newCore].domains)
  }

  function toggle(domain) {
    setSelected(prev =>
      prev.includes(domain)
        ? prev.length > 1 ? prev.filter(d => d !== domain) : prev
        : [...prev, domain]
    )
  }

  const available = allScenarios.filter(q => q.core === core && selected.includes(q.domain)).length
  const toRun     = limit === 999 ? available : Math.min(limit, available)

  return (
    <div className="card">
      <h2 className="selector-title">Start a Drill</h2>
      <p className="selector-sub">Pick a core, choose domains, and go.</p>

      <div className="domain-quick-toggle" style={{ marginBottom: 12 }}>
        {Object.entries(CORE_META).map(([k, m]) => (
          <button
            key={k}
            className={`domain-toggle-btn ${core === k ? 'selected' : ''}`}
            onClick={() => switchCore(k)}
            style={core === k ? { background: 'var(--accent)', color: 'white' } : null}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="domain-quick-toggle">
        <button
          className="domain-toggle-btn"
          onClick={() => setSelected(meta.domains)}
          disabled={selected.length === meta.domains.length}
        >
          All domains
        </button>
        {core === '1' && (
          <button
            className="domain-toggle-btn"
            onClick={() => setSelected(['5'])}
            disabled={selected.length === 1 && selected[0] === '5'}
          >
            Highest weight only (D5)
          </button>
        )}
        {core === '2' && (
          <button
            className="domain-toggle-btn"
            onClick={() => setSelected(['1'])}
            disabled={selected.length === 1 && selected[0] === '1'}
          >
            Highest weight only (D1)
          </button>
        )}
      </div>

      <div className="domain-grid">
        {DOMAINS.map(d => {
          const all   = allScenarios.filter(q => q.core === core && q.domain === d)
          const count = all.length
          const v15   = all.filter(q => /V15/i.test(q.topic || '')).length
          const isSelected = selected.includes(d)
          return (
            <button
              key={d}
              className={`domain-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggle(d)}
            >
              <div className="domain-card-left">
                <div className="domain-dot" style={{ background: DOMAIN_COLOR[d] }} />
                <div>
                  <div className="domain-card-label">
                    {meta.labels[d]}
                    <span className="domain-weight-badge">{meta.weights[d]}</span>
                  </div>
                  <div className="domain-card-count">{meta.descs[d]}</div>
                  <div className="domain-card-count" style={{ marginTop: 2 }}>
                    {count} scenario{count !== 1 ? 's' : ''}{v15 > 0 && <span className="domain-v15-badge"> · {v15} V15</span>}
                  </div>
                </div>
              </div>
              <div className="domain-card-check">{isSelected && '✓'}</div>
            </button>
          )
        })}
      </div>

      <div className="session-options">
        <label>Session length:</label>
        <select value={limit} onChange={e => setLimit(Number(e.target.value))}>
          {LIMITS.map(l => (
            <option key={l} value={l}>{LIMIT_LABELS[l]}</option>
          ))}
        </select>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {toRun} question{toRun !== 1 ? 's' : ''} from {available} available
        </span>
      </div>

      <div className="session-options">
        <label>Timer:</label>
        <select value={timer} onChange={e => setTimer(Number(e.target.value))}>
          {TIMERS.map(t => (
            <option key={t} value={t}>{TIMER_LABELS[t]}</option>
          ))}
        </select>
        <label className="shuffle-label">
          <input
            type="checkbox"
            checked={shuffle}
            onChange={e => setShuffle(e.target.checked)}
          />
          Shuffle
        </label>
      </div>

      <div className="actions">
        <button
          className="btn-primary"
          onClick={() => onStart({
            core,
            domains: selected,
            limit:   limit === 999 ? null : limit,
            timer:   timer * 60,
            shuffle,
          })}
          disabled={available === 0}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Start Drill →
        </button>
      </div>
    </div>
  )
}
