import { TYPE_LABELS, DOMAIN_LABELS } from '../data'
import PannableImage from './PannableImage'

const DOMAIN_COLOR = {
  '1': 'var(--d1)', '2': 'var(--d2)', '3': 'var(--d3)', '4': 'var(--d4)', '5': 'var(--d5)',
}

const LETTERS = ['A', 'B', 'C', 'D']

function CorrectIdentify({ question }) {
  return (
    <ul className="review-options">
      {question.options.map((opt, i) => (
        <li key={i} className={i === question.correct ? 'review-option correct' : 'review-option'}>
          <span className="option-letter">{LETTERS[i]}</span>
          <span>{opt}</span>
          {i === question.correct && <span className="review-mark">✓</span>}
        </li>
      ))}
    </ul>
  )
}

function CorrectOrder({ question }) {
  return (
    <ol className="review-order">
      {question.correct.map((item, i) => (
        <li key={i}><span className="review-order-num">{i + 1}</span>{item}</li>
      ))}
    </ol>
  )
}

function CorrectMatch({ question }) {
  return (
    <ul className="review-pairs">
      {question.pairs.map(({ left, right }) => (
        <li key={left}><strong>{left}</strong> → {right}</li>
      ))}
    </ul>
  )
}

function CorrectTroubleshoot({ question }) {
  return (
    <ol className="review-steps">
      {question.steps.map((step, i) => (
        <li key={i} className="review-step">
          <div className="review-step-q">{step.question}</div>
          <div className="review-step-answer">
            ✓ <strong>{LETTERS[step.correct]}.</strong> {step.options[step.correct]}
          </div>
          {step.feedback && <div className="review-step-feedback">{step.feedback}</div>}
        </li>
      ))}
    </ol>
  )
}

function ReviewCard({ entry }) {
  const { question, miss, hit } = entry
  const domainColor = DOMAIN_COLOR[question.domain] || 'var(--accent)'
  const totalAttempts = (miss || 0) + (hit || 0)
  const missPct = totalAttempts > 0 ? Math.round((miss / totalAttempts) * 100) : 0

  return (
    <div className="card review-card">
      <div className="progress-label">
        <span style={{ color: domainColor, fontWeight: 600 }}>
          {DOMAIN_LABELS[question.domain] || `Domain ${question.domain}`}
        </span>
        <span className="review-stats">
          {Math.ceil(miss)} miss{Math.ceil(miss) === 1 ? '' : 'es'} · {missPct}% wrong of {Math.round(totalAttempts)} attempt{Math.round(totalAttempts) === 1 ? '' : 's'}
        </span>
      </div>

      <div className="q-meta">
        <span className="q-tag tag-type">{TYPE_LABELS[question.type]}</span>
        <span className="q-tag tag-topic">{question.topic}</span>
      </div>

      {question.image && (
        <div className="question-image-wrap">
          <PannableImage src={question.image} alt="" className="question-image" />
        </div>
      )}

      {question.scenario && (
        <div className="scenario-box">
          <strong>Scenario</strong>
          {question.scenario}
        </div>
      )}

      {question.question && <p className="q-text">{question.question}</p>}

      {question.type === 'identify'     && <CorrectIdentify question={question} />}
      {question.type === 'order'        && <CorrectOrder question={question} />}
      {question.type === 'match'        && <CorrectMatch question={question} />}
      {question.type === 'troubleshoot' && <CorrectTroubleshoot question={question} />}

      {question.explanation && (
        <div className="feedback correct" style={{ marginTop: 14 }}>
          <div className="feedback-header">Explanation</div>
          <div>{question.explanation}</div>
        </div>
      )}
    </div>
  )
}

export default function ReviewBoard({ items, onBack, onDrill }) {
  if (!items || items.length === 0) {
    return (
      <div className="card">
        <p>Nothing to review.</p>
        <div className="actions">
          <button className="btn-primary" onClick={onBack}>← Back</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card review-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h2 className="selector-title" style={{ marginBottom: 4 }}>
              Review · {items.length} question{items.length === 1 ? '' : 's'}
            </h2>
            <p className="selector-sub" style={{ marginBottom: 0 }}>
              Read through. Each question shows the correct answer and the explanation.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" onClick={onBack}>← Back</button>
            <button className="btn-primary" onClick={() => onDrill(items.map(i => i.question))}>
              Drill these →
            </button>
          </div>
        </div>
      </div>

      {items.map((entry, i) => (
        <ReviewCard key={`${entry.question.id}-${i}`} entry={entry} />
      ))}

      <div className="card" style={{ textAlign: 'center' }}>
        <button className="btn-primary" onClick={onBack}>← Back to Home</button>
      </div>
    </>
  )
}
