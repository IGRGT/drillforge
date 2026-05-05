import { useState } from 'react'
import DomainSelector from './components/DomainSelector'
import PBQRunner from './components/PBQRunner'
import ScoreBoard from './components/ScoreBoard'
import ReadinessBar from './components/ReadinessBar'
import { getScenarios } from './data'
import { saveSession, getReadiness, getMissStats } from './hooks/useScores'

export default function App() {
  const [screen,       setScreen]       = useState('home')
  const [questions,    setQuestions]    = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results,      setResults]      = useState([])
  const [readiness,    setReadiness]    = useState(() => getReadiness())
  const [saved,        setSaved]        = useState(false)
  const [timerSecs,    setTimerSecs]    = useState(0)

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
        <span className="badge">A+ 220-1201 Core 1</span>
        {screen !== 'home' && (
          <button className="btn-ghost" style={{ marginLeft: 'auto' }} onClick={restart}>
            ← Exit
          </button>
        )}
      </header>

      <main className="main">
        <div className="container">
          {screen === 'home' && (
            <>
              <ReadinessBar readiness={readiness.readiness} domainAvg={readiness.domainAvg} />
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
          {screen === 'results' && (
            <ScoreBoard
              results={results}
              onRestart={restart}
              onDrillMissed={drillMissed}
            />
          )}
        </div>
      </main>
    </>
  )
}
