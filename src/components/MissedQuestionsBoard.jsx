import { useMemo } from 'react'
import { allScenarios } from '../data'
import { getMissStats } from '../hooks/useScores'

// Buckets: "missed once" (1), "missed twice" (2), "missed 3+" (3+).
// Miss counts are floats (half-credit retries), so we ceil to bucket.
function bucket(missCount) {
  const c = Math.ceil(missCount)
  if (c <= 0) return null
  if (c === 1) return 'once'
  if (c === 2) return 'twice'
  return 'thrice'
}

const BUCKET_LABELS = {
  once:   { label: 'Missed once',   tone: 'warning' },
  twice:  { label: 'Missed twice',  tone: 'incorrect' },
  thrice: { label: 'Missed 3+',     tone: 'incorrect-strong' },
}

export default function MissedQuestionsBoard({ onDrill, onReview }) {
  const { all, byBucket } = useMemo(() => {
    const stats = getMissStats()
    const byId  = stats?.byId || {}
    const idIndex = new Map(allScenarios.map(q => [q.id, q]))

    const missed = Object.entries(byId)
      .filter(([, v]) => (v?.miss ?? 0) > 0)
      .map(([id, v]) => {
        const q = idIndex.get(id)
        if (!q) return null
        return { question: q, miss: v.miss, hit: v.hit ?? 0 }
      })
      .filter(Boolean)

    const byBucket = { once: [], twice: [], thrice: [] }
    missed.forEach(m => {
      const b = bucket(m.miss)
      if (b) byBucket[b].push(m)
    })

    // Sort each bucket by miss count desc, then by hit count asc (least-mastered first)
    Object.keys(byBucket).forEach(b => {
      byBucket[b].sort((a, b2) => (b2.miss - a.miss) || (a.hit - b2.hit))
    })

    return { all: missed, byBucket }
  }, [])

  if (all.length === 0) return null

  const allQuestions = all.map(m => m.question)

  function handleDrill(questions) {
    if (questions.length === 0) return
    onDrill(questions)
  }
  function handleReview(items) {
    if (items.length === 0) return
    onReview(items)
  }

  return (
    <div className="card missed-board">
      <h2 className="selector-title">Missed Questions</h2>
      <p className="selector-sub">
        Drill the ones you keep getting wrong, or review them with the answer visible.
      </p>

      <div className="missed-rows">
        {Object.entries(byBucket).map(([key, items]) => {
          if (items.length === 0) return null
          const { label, tone } = BUCKET_LABELS[key]
          return (
            <div key={key} className={`missed-row tone-${tone}`}>
              <div className="missed-row-label">
                <strong>{label}</strong>
                <span className="missed-count">{items.length} question{items.length === 1 ? '' : 's'}</span>
              </div>
              <div className="missed-row-actions">
                <button className="btn-ghost" onClick={() => handleReview(items)}>
                  Review
                </button>
                <button className="btn-secondary" onClick={() => handleDrill(items.map(i => i.question))}>
                  Drill →
                </button>
              </div>
            </div>
          )
        })}

        <div className="missed-row tone-all">
          <div className="missed-row-label">
            <strong>All missed</strong>
            <span className="missed-count">{all.length} question{all.length === 1 ? '' : 's'}</span>
          </div>
          <div className="missed-row-actions">
            <button className="btn-ghost" onClick={() => handleReview(all)}>
              Review all
            </button>
            <button className="btn-primary" onClick={() => handleDrill(allQuestions)}>
              Drill all →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
