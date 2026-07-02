import { useState, useMemo } from 'react'

export default function MatchQuestion({ question, onSubmit, submitted, onIdk }) {
  const shuffledRight = useMemo(
    () => [...question.pairs].sort(() => Math.random() - 0.5).map(p => p.right),
    [question.id]
  )

  const [activeLeft, setActiveLeft] = useState(null)
  const [matches, setMatches] = useState({}) // left → right
  const [wrongPairs, setWrongPairs] = useState([]) // [left] that were wrong

  function clickLeft(left) {
    if (submitted || left in matches) return
    setActiveLeft(prev => prev === left ? null : left)
  }

  function clickRight(right) {
    if (submitted || !activeLeft) return
    if (Object.values(matches).includes(right)) return

    setMatches(prev => ({ ...prev, [activeLeft]: right }))
    setActiveLeft(null)
  }

  function submit() {
    if (Object.keys(matches).length !== question.pairs.length) return
    const wrong = []
    let allCorrect = true
    question.pairs.forEach(({ left, right }) => {
      if (matches[left] !== right) {
        allCorrect = false
        wrong.push(left)
      }
    })
    setWrongPairs(wrong)
    onSubmit(allCorrect)
  }

  function leftClass(left) {
    if (!submitted) {
      if (left in matches) return 'match-item matched-correct'
      return activeLeft === left ? 'match-item active' : 'match-item'
    }
    const correct = question.pairs.find(p => p.left === left)?.right
    return matches[left] === correct ? 'match-item matched-correct' : 'match-item matched-incorrect'
  }

  function rightClass(right) {
    if (!submitted) {
      if (Object.values(matches).includes(right)) return 'match-item matched-correct'
      return 'match-item'
    }
    const pair = question.pairs.find(p => p.right === right)
    return matches[pair?.left] === right ? 'match-item matched-correct' : 'match-item matched-incorrect'
  }

  const matchedCount = Object.keys(matches).length
  const total = question.pairs.length

  return (
    <>
      <p className="q-text">{question.question}</p>

      <div className="match-layout">
        <div>
          <div className="match-col-label">Term</div>
          {question.pairs.map(({ left }) => (
            <div key={left} className={leftClass(left)} onClick={() => clickLeft(left)}>
              {left}
              {left in matches && !submitted && (
                <span style={{ float: 'right', fontSize: 11, color: 'var(--text-muted)' }}>✓ matched</span>
              )}
            </div>
          ))}
        </div>
        <div>
          <div className="match-col-label">Definition</div>
          {shuffledRight.map(right => (
            <div key={right} className={rightClass(right)} onClick={() => clickRight(right)}>
              {right}
            </div>
          ))}
        </div>
      </div>

      {submitted && (
        <div style={{ fontSize: 13, marginBottom: 14 }}>
          <strong style={{ color: 'var(--text)' }}>Correct matches:</strong>
          <ul style={{ marginTop: 8, paddingLeft: 20, color: 'var(--text-muted)' }}>
            {question.pairs.map(({ left, right }) => (
              <li key={left}><strong style={{ color: 'var(--text)' }}>{left}</strong> → {right}</li>
            ))}
          </ul>
        </div>
      )}

      {!submitted && (
        <>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
            {activeLeft ? `Select a definition for "${activeLeft}"` : matchedCount < total ? 'Click a term to match it' : 'All matched — submit when ready'}
          </div>
          <div className="actions" style={{ justifyContent: 'space-between' }}>
            {onIdk ? (
              <button className="btn-ghost" onClick={onIdk}>
                I don't know <kbd style={{ marginLeft: 6 }}>0</kbd>
              </button>
            ) : <span />}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-ghost"
                onClick={() => { setMatches({}); setActiveLeft(null) }}
                disabled={matchedCount === 0}
              >
                Reset
              </button>
              <button
                className="btn-primary"
                onClick={submit}
                disabled={matchedCount !== total}
              >
                Submit ({matchedCount}/{total})
              </button>
            </div>
          </div>
        </>
      )}

    </>
  )
}
