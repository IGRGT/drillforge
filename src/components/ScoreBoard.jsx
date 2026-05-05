import { DOMAIN_LABELS } from '../data'

const DOMAIN_COLOR = {
  '1': 'var(--d1)',
  '2': 'var(--d2)',
  '3': 'var(--d3)',
  '4': 'var(--d4)',
  '5': 'var(--d5)',
}

export default function ScoreBoard({ results, onRestart, onDrillMissed }) {
  const total   = results.length
  const correct = results.filter(r => r.correct).length
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0
  const pass    = pct >= 75
  const missed  = results.filter(r => !r.correct)

  const domains = [...new Set(results.map(r => r.question.domain))].sort()
  const breakdown = domains.map(d => {
    const dResults = results.filter(r => r.question.domain === d)
    const dCorrect = dResults.filter(r => r.correct).length
    const dPct     = dResults.length > 0 ? Math.round((dCorrect / dResults.length) * 100) : 0
    return { domain: d, correct: dCorrect, total: dResults.length, pct: dPct }
  })

  function handleDrillMissed() {
    const missedQuestions = missed.map(r => r.question)
    onDrillMissed(missedQuestions)
  }

  return (
    <div className="card fade-in">
      {/* Score */}
      <div className="score-header">
        <div className="score-circle">
          <div className={`score-circle-fill ${pass ? 'pass' : 'fail'}`} />
          <div className={`score-pct ${pass ? 'pass' : 'fail'}`}>{pct}%</div>
          <div className="score-label">{pass ? 'PASS' : 'KEEP DRILLING'}</div>
        </div>
        <p className="score-summary">{correct} / {total} correct</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          {pass
            ? 'Above 75% — strong. Review misses below and drill again.'
            : 'Below 75%. Read each explanation, then drill the misses.'}
        </p>
      </div>

      {/* Domain breakdown */}
      {breakdown.length > 1 && (
        <div className="domain-breakdown">
          <div className="domain-breakdown-title">By Domain</div>
          {breakdown.map(({ domain, correct: dc, total: dt, pct: dp }) => (
            <div key={domain} className="domain-row">
              <div className="domain-row-name">
                {DOMAIN_LABELS[domain] || `Domain ${domain}`}
              </div>
              <div className="domain-bar-wrap">
                <div
                  className="domain-bar-fill"
                  style={{
                    width: `${dp}%`,
                    background: dp >= 75 ? 'var(--correct)' : dp >= 50 ? 'var(--warning)' : 'var(--incorrect)',
                  }}
                />
              </div>
              <div className="domain-row-pct" style={{ color: dp >= 75 ? 'var(--correct)' : dp >= 50 ? 'var(--warning)' : 'var(--incorrect)' }}>
                {dp}% ({dc}/{dt})
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Missed questions */}
      {missed.length > 0 && (
        <div className="missed-section">
          <div className="missed-title">Review These ({missed.length})</div>
          {missed.map(({ question }) => (
            <div key={question.id} className="missed-item">
              <div className="missed-item-topic">
                {question.topic} — {question.type}
              </div>
              <div className="missed-item-q">
                {question.type === 'troubleshoot' ? question.scenario : question.question}
              </div>
              {question.video && (
                <a className="missed-video-link" href={question.video} target="_blank" rel="noreferrer">
                  ▶ Watch Messer video for this topic
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="score-actions">
        {missed.length > 0 && (
          <button className="btn-secondary" onClick={handleDrillMissed}>
            ↺ Drill Missed ({missed.length})
          </button>
        )}
        <button className="btn-primary" onClick={onRestart}>New Drill</button>
      </div>
    </div>
  )
}
