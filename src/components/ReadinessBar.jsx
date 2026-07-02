import { useEffect, useState } from 'react'
import { useRef } from 'react'
import {
  exportJSON,
  importJSON,
  getAllSessions,
  isFSAccessSupported,
  connectDataFolder,
  getDataFolder,
  disconnectDataFolder,
} from '../hooks/useScores'

const DOMAIN_LABELS_SHORT = {
  '1': 'D1 Mobile',
  '2': 'D2 Network',
  '3': 'D3 Hardware',
  '4': 'D4 Cloud',
  '5': 'D5 Troubleshoot',
}

const DOMAIN_WEIGHTS = {
  '1': 13, '2': 23, '3': 25, '4': 11, '5': 28
}

const DOMAIN_COLOR = {
  '1': 'var(--d1)',
  '2': 'var(--d2)',
  '3': 'var(--d3)',
  '4': 'var(--d4)',
  '5': 'var(--d5)',
}

function readinessColor(pct) {
  if (pct >= 75) return 'var(--correct)'
  if (pct >= 50) return 'var(--warning)'
  return 'var(--accent)'
}

export default function ReadinessBar({ readiness, domainAvg, domainCounts = {} }) {
  const sessions  = getAllSessions()
  const lastDrill = sessions.length > 0
    ? new Date(sessions[sessions.length - 1].date).toLocaleDateString()
    : null

  const [folderConnected, setFolderConnected] = useState(false)
  const [connectError, setConnectError]       = useState(null)
  const [importError,  setImportError]        = useState(null)
  const [importDone,   setImportDone]         = useState(false)
  const fileInputRef = useRef(null)
  const fsSupported = isFSAccessSupported()

  useEffect(() => {
    getDataFolder().then(handle => setFolderConnected(!!handle))
  }, [])

  async function handleConnect() {
    setConnectError(null)
    try {
      await connectDataFolder()
      setFolderConnected(true)
    } catch (err) {
      // User cancellation is silent; real errors surface.
      if (err.name !== 'AbortError') setConnectError(err.message)
    }
  }

  async function handleDisconnect() {
    await disconnectDataFolder()
    setFolderConnected(false)
  }

  return (
    <div className="readiness-card">
      {/* Main readiness number + bar */}
      <div className="readiness-header">
        <div>
          <div className="readiness-label">Exam Coverage</div>
          <div className="readiness-sub">
            {sessions.length === 0
              ? 'Complete your first drill to start tracking'
              : `${sessions.length} session${sessions.length !== 1 ? 's' : ''} logged${lastDrill ? ' · last drilled ' + lastDrill : ''}`}
          </div>
          <div className="readiness-formula-hint">
            Weighted % of exam questions <em>mastered</em> (answered right at least twice).
            Undrilled questions and one-off correct attempts don't count.
          </div>
        </div>
        <div className="readiness-pct" style={{ color: readinessColor(readiness) }}>
          {readiness}%
        </div>
      </div>

      <div className="readiness-bar-wrap">
        <div
          className="readiness-bar-fill"
          style={{
            width: `${readiness}%`,
            background: readiness === 0
              ? 'var(--border)'
              : `linear-gradient(90deg, var(--accent), ${readinessColor(readiness)})`,
          }}
        />
        {/* 75% pass marker */}
        <div className="readiness-marker" style={{ left: '75%' }}>
          <div className="readiness-marker-line" />
          <div className="readiness-marker-label">Pass</div>
        </div>
      </div>

      {/* Per-domain breakdown */}
      <div className="readiness-domains">
        {['1', '2', '3', '4', '5'].map(d => {
          const avg    = domainAvg[d] ?? 0
          const counts = domainCounts[d] || { mastered: 0, total: 0 }
          const done   = counts.mastered > 0
          return (
            <div key={d} className="readiness-domain-row">
              <div className="readiness-domain-name">
                <span className="readiness-dot" style={{ background: DOMAIN_COLOR[d] }} />
                {DOMAIN_LABELS_SHORT[d]}
                <span className="readiness-weight">({DOMAIN_WEIGHTS[d]}%)</span>
              </div>
              <div className="readiness-domain-bar-wrap">
                <div
                  className="readiness-domain-bar-fill"
                  style={{
                    width: `${avg}%`,
                    background: done ? DOMAIN_COLOR[d] : 'transparent',
                    opacity: done ? 1 : 0.3,
                  }}
                />
              </div>
              <div
                className="readiness-domain-pct"
                style={{ color: done ? (avg >= 75 ? 'var(--correct)' : 'var(--warning)') : 'var(--text-muted)' }}
                title={`${counts.mastered} of ${counts.total} questions mastered`}
              >
                {counts.total > 0 ? `${counts.mastered}/${counts.total}` : '—'}
              </div>
            </div>
          )
        })}
      </div>

      {/* xp dashboard integration */}
      <div className="readiness-xp">
        {fsSupported ? (
          folderConnected ? (
            <div className="readiness-xp-connected">
              <span className="readiness-xp-status">
                ✓ Connected — auto-syncing to xp dashboard
              </span>
              <button className="readiness-xp-disconnect" onClick={handleDisconnect}>
                disconnect
              </button>
            </div>
          ) : (
            <div className="readiness-xp-prompt">
              <button className="readiness-xp-connect" onClick={handleConnect}>
                ⚡ Connect to xp dashboard
              </button>
              <div className="readiness-xp-hint">
                One-time setup — pick the folder:
                <br />
                <code>Neural Network/projects/gamify-learning/data/a-plus</code>
              </div>
            </div>
          )
        ) : (
          <div className="readiness-xp-fallback">
            Auto-sync needs Chrome, Edge, Brave, or Arc. Use Export below for now.
          </div>
        )}
        {connectError && (
          <div className="readiness-xp-error">{connectError}</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        {sessions.length > 0 && (
          <button className="readiness-export" onClick={exportJSON}>
            ↓ Export scores JSON
          </button>
        )}
        <button className="readiness-export" onClick={() => fileInputRef.current?.click()}>
          ↑ Import scores JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setImportError(null)
            setImportDone(false)
            try {
              await importJSON(file)
              setImportDone(true)
              setTimeout(() => window.location.reload(), 800)
            } catch (err) {
              setImportError(err.message)
            }
            e.target.value = ''
          }}
        />
        {importDone  && <span style={{ fontSize: '12px', color: 'var(--correct)', alignSelf: 'center' }}>Imported — reloading…</span>}
        {importError && <span style={{ fontSize: '12px', color: 'var(--incorrect)', alignSelf: 'center' }}>{importError}</span>}
      </div>
    </div>
  )
}
