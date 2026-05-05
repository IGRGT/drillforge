import { useState, useEffect, useRef } from 'react'
import IdentifyQuestion from './questions/IdentifyQuestion'
import OrderQuestion from './questions/OrderQuestion'
import MatchQuestion from './questions/MatchQuestion'
import TroubleshootQuestion from './questions/TroubleshootQuestion'
import Feedback from './Feedback'
import { TYPE_LABELS, DOMAIN_LABELS } from '../data'

const DOMAIN_COLOR = {
  '1': 'var(--d1)',
  '2': 'var(--d2)',
  '3': 'var(--d3)',
  '4': 'var(--d4)',
  '5': 'var(--d5)',
}

const IMAGE_CAPTIONS = {
  '/images/sata-cable.jpg':           'SATA data cable — 7-pin L-shaped connector',
  '/images/thermal-paste.jpg':        'Thermal paste applied to CPU heat spreader',
  '/images/atx-24pin.jpg':            'ATX 24-pin main power connector',
  '/images/laser-printer-cutaway.jpg':'Laser printer internal components',
  '/images/rj45-connector.jpg':       'RJ45 Ethernet connector',
  '/images/cat6-cable.jpg':           'Cat6 twisted-pair Ethernet cable',
  '/images/crimper-rj45.jpg':         'RJ45 crimping tool',
  '/images/m2-slot.jpg':              'M.2 slot on a motherboard — supports both SATA and NVMe drives',
  '/images/hdd-internals.jpg':        'Hard drive with exposed platters and read/write head',
}

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// videoTime is authored as 'M:SS' or 'H:MM:SS' or a raw seconds number.
// Returns total seconds, or null if missing/unparseable.
function parseVideoTime(t) {
  if (t == null) return null
  if (typeof t === 'number') return Math.max(0, Math.floor(t))
  const parts = String(t).split(':').map(p => parseInt(p, 10))
  if (parts.some(isNaN)) return null
  return parts.reduce((sum, p) => sum * 60 + p, 0)
}

// Append &t=Ns (or ?t=Ns if no query yet) to a YouTube URL.
function withTimestamp(url, secs) {
  if (secs == null) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}t=${secs}s`
}

export default function PBQRunner({ question, index, total, results, timerSecs, onAnswer, onNext, onTimeUp }) {
  const [submitted,    setSubmitted]    = useState(false)
  const [result,       setResult]       = useState(null)
  const [timeLeft,     setTimeLeft]     = useState(timerSecs)
  const [attempt,      setAttempt]      = useState(1)   // 1 = first try, 2 = retry
  const resultsRef = useRef(results)

  // keep resultsRef in sync so timer callback sees latest results
  useEffect(() => { resultsRef.current = results }, [results])

  // reset per question
  useEffect(() => {
    setSubmitted(false)
    setResult(null)
    setAttempt(1)
  }, [question.id])

  // countdown timer
  useEffect(() => {
    if (!timerSecs) return
    setTimeLeft(timerSecs)
  }, [timerSecs])

  useEffect(() => {
    if (!timerSecs || submitted) return
    if (timeLeft <= 0) {
      onTimeUp(resultsRef.current)
      return
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, timerSecs, submitted])

  function handleSubmit(isCorrect) {
    // partial = got it right ONLY on retry (attempt 2). Worth half points.
    const partial = isCorrect && attempt === 2
    const r = { question, correct: isCorrect, partial }
    setResult({ correct: isCorrect, explanation: question.explanation, partial })
    setSubmitted(true)
    onAnswer(r)
  }

  function tryAgain() {
    // Reset just enough state to allow a second submission.
    setSubmitted(false)
    setResult(null)
    setAttempt(2)
  }

  function advance() {
    setSubmitted(false)
    setResult(null)
    setAttempt(1)
    onNext([...results, {
      question,
      correct: result?.correct ?? false,
      partial: result?.partial ?? false,
    }])
  }

  const progress    = (index / total) * 100
  const domainColor = DOMAIN_COLOR[question.domain] || 'var(--accent)'

  const diffClass = {
    easy:   'tag-diff-easy',
    medium: 'tag-diff-medium',
    hard:   'tag-diff-hard',
  }[question.difficulty] || 'tag-diff-easy'

  const timerWarning = timerSecs > 0 && timeLeft <= 60
  const timerDanger  = timerSecs > 0 && timeLeft <= 30

  return (
    <div className="card fade-in" key={question.id}>
      {/* Progress + timer */}
      <div className="progress-label">
        <span style={{ color: domainColor, fontWeight: 600 }}>
          {DOMAIN_LABELS[question.domain] || `Domain ${question.domain}`}
        </span>
        <span>{index + 1} / {total}</span>
        {timerSecs > 0 && (
          <span className={`timer-badge ${timerWarning ? 'warning' : ''} ${timerDanger ? 'danger' : ''}`}>
            ⏱ {formatTime(timeLeft)}
          </span>
        )}
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${progress}%`, background: domainColor }} />
      </div>

      {/* Tags */}
      <div className="q-meta">
        <span className="q-tag tag-type">{TYPE_LABELS[question.type]}</span>
        <span className="q-tag tag-topic">{question.topic}</span>
        <span className={`q-tag ${diffClass}`}>{question.difficulty}</span>
      </div>

      {/* Image */}
      {question.image && (
        <div className="question-image-wrap">
          <img
            src={question.image}
            alt={IMAGE_CAPTIONS[question.image] || 'Reference image'}
            className="question-image"
          />
          {IMAGE_CAPTIONS[question.image] && (
            <div className="question-image-caption">{IMAGE_CAPTIONS[question.image]}</div>
          )}
        </div>
      )}

      {/* Question component */}
      {question.type === 'identify' && (
        <IdentifyQuestion question={question} onSubmit={handleSubmit} submitted={submitted} />
      )}
      {question.type === 'order' && (
        <OrderQuestion question={question} onSubmit={handleSubmit} submitted={submitted} />
      )}
      {question.type === 'match' && (
        <MatchQuestion question={question} onSubmit={handleSubmit} submitted={submitted} />
      )}
      {question.type === 'troubleshoot' && (
        <TroubleshootQuestion question={question} onSubmit={handleSubmit} submitted={submitted} />
      )}

      {/* Feedback + advance */}
      {submitted && result && (
        <>
          <Feedback correct={result.correct} explanation={result.explanation} partial={result.partial} />
          <div className="actions">
            {question.video && (() => {
              const secs  = parseVideoTime(question.videoTime)
              const label = secs != null ? `▶ Messer video at ${formatTime(secs)}` : '▶ Messer video'
              return (
                <a className="video-link" href={withTimestamp(question.video, secs)} target="_blank" rel="noreferrer">
                  {label}
                </a>
              )
            })()}
            {/* Retry-for-half-points: only after wrong first attempt */}
            {!result.correct && attempt === 1 && (
              <button className="btn-secondary" onClick={tryAgain}>
                ↻ Try again for half points
              </button>
            )}
            <button className="btn-primary" onClick={advance}>
              {index + 1 >= total ? 'See Results' : 'Next →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
