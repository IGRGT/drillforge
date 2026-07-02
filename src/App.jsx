import { useState, useEffect } from 'react'
import DomainSelector from './components/DomainSelector'
import PBQRunner from './components/PBQRunner'
import ScoreBoard from './components/ScoreBoard'
import ReadinessBar from './components/ReadinessBar'
import MissedQuestionsBoard from './components/MissedQuestionsBoard'
import ReviewBoard from './components/ReviewBoard'
import { getScenarios } from './data'
import { saveSession, getReadiness, getMissStats } from './hooks/useScores'

const THEME_KEY = 'drillforge.theme'

function readInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return 'dark'
}

export default function App() {
  const [screen,       setScreen]       = useState('home')
  const [questions,    setQuestions]    = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results,      setResults]      = useState([])
  const [readiness,    setReadiness]    = useState(() => getReadiness())
  const [saved,        setSaved]        = useState(false)
  const [timerSecs,    setTimerSecs]    = useState(0)
  const [theme,        setTheme]        = useState(readInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(THEME_KEY, theme) } catch {}
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  function startSession({ core = '1', domains, limit, timer = 0, shuffle = true }) {
    // Pull fresh stats each session so questions you just missed/mastered
    // affect this drill's weighting, not next reload's.
    const qs = getScenarios(domains, null, limit, shuffle, getMissStats(), core)
    if (qs.length === 0) return
    setQuestions(qs)
    setCurrentIndex(0)
    setResults([])
    setSaved(false)
    setTimerSecs(timer)
    setScreen('quiz')
  }

  function drillMissed(missedQuestions) {
    if (missedQuestions.length === 0) return
    setQuestions(missedQuestions)
    setCurrentIndex(0)
    setResults([])
    setSaved(false)
    setTimerSecs(0)
    setScreen('quiz')
  }

  const [reviewItems, setReviewItems] = useState([])
  function startReview(items) {
    if (!items || items.length === 0) return
    setReviewItems(items)
    setScreen('review')
  }

  function handleAnswer(result) {
    setResults(prev => [...prev, result])
  }

  function handleNext(currentResults) {
    if (currentIndex + 1 >= questions.length) {
      if (!saved) {
        saveSession(currentResults)
        setReadiness(getReadiness())
        setSaved(true)
      }
      setScreen('results')
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  function handleTimeUp(currentResults) {
    if (!saved) {
      saveSession(currentResults)
      setReadiness(getReadiness())
      setSaved(true)
    }
    setScreen('results')
  }

  function restart() {
    setScreen('home')
    setQuestions([])
    setResults([])
    setCurrentIndex(0)
    setSaved(false)
    setTimerSecs(0)
  }

  return (
    <>
      <header className="app-header">
        <h1>DrillForge</h1>
        <span className="badge">A+ V15 · Core 1 + Core 2</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </button>
          {screen !== 'home' && (
            <button className="btn-ghost" onClick={restart}>← Exit</button>
          )}
        </div>
      </header>

      <main className="main">
        <div className="container">
          {screen === 'home' && (
            <>
              <ReadinessBar readiness={readiness.readiness} domainAvg={readiness.domainAvg} domainCounts={readiness.domainCounts} />
              <MissedQuestionsBoard onDrill={drillMissed} onReview={startReview} />
              <DomainSelector onStart={startSession} />
            </>
          )}
          {screen === 'quiz' && (
            <PBQRunner
              question={questions[currentIndex]}
              index={currentIndex}
              total={questions.length}
              results={results}
              timerSecs={timerSecs}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onTimeUp={handleTimeUp}
            />
          )}
          {screen === 'review' && (
            <ReviewBoard
              items={reviewItems}
              onBack={restart}
              onDrill={drillMissed}
            />
          )}
          {screen === 'results' && (
            <ScoreBoard
              results={results}
              onRestart={restart}
              onDrillMissed={drillMissed}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p className="app-footer-line">
          Created by <a href="https://gilruiz.dev" target="_blank" rel="noopener noreferrer">Gilberto Ruiz</a>
          {' · '}
          <a href="https://github.com/IGRGT/drillforge" target="_blank" rel="noopener noreferrer">open source on GitHub</a>
        </p>
        <p className="app-footer-note">
          Question content authored from CompTIA's official 220-1201 / 220-1202 V15 exam objectives. Lab images CC-licensed from Wikimedia Commons. Free to fork, modify, and redistribute. Not affiliated with or endorsed by CompTIA.
        </p>
      </footer>
    </>
  )
}
