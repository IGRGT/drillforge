import { useState, useEffect } from 'react'

const LETTERS = ['A', 'B', 'C', 'D']

export default function IdentifyQuestion({ question, onSubmit, submitted, onIdk }) {
  const [selected, setSelected] = useState(null)

  // Reset when question changes
  useEffect(() => { setSelected(null) }, [question.id])

  // Keyboard shortcuts: 1-4 to select, Enter to submit
  useEffect(() => {
    if (submitted) return
    function onKey(e) {
      if (['1','2','3','4'].includes(e.key)) {
        const i = parseInt(e.key) - 1
        if (i < question.options.length) setSelected(i)
      }
      if (e.key === 'Enter' && selected !== null) {
        onSubmit(selected === question.correct)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [submitted, selected, question])

  function choose(i) {
    if (submitted) return
    setSelected(i)
  }

  function submit() {
    if (selected === null) return
    onSubmit(selected === question.correct)
  }

  function btnClass(i) {
    if (!submitted) return selected === i ? 'option-btn selected' : 'option-btn'
    if (i === question.correct) return 'option-btn correct'
    if (i === selected && selected !== question.correct) return 'option-btn incorrect'
    return 'option-btn'
  }

  return (
    <>
      <p className="q-text">{question.question}</p>

      {!submitted && (
        <div className="kb-hint">
          <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd> to select &nbsp;·&nbsp; <kbd>Enter</kbd> to submit
        </div>
      )}

      <div className="options-list">
        {question.options.map((opt, i) => (
          <button
            key={i}
            className={btnClass(i)}
            onClick={() => choose(i)}
            disabled={submitted}
          >
            <span className="option-letter">{LETTERS[i]}</span>
            <span>{opt}</span>
          </button>
        ))}
      </div>

      {!submitted && (
        <div className="actions" style={{ justifyContent: 'space-between' }}>
          {onIdk ? (
            <button className="btn-ghost" onClick={onIdk}>
              I don't know <kbd style={{ marginLeft: 6 }}>0</kbd>
            </button>
          ) : <span />}
          <button className="btn-primary" onClick={submit} disabled={selected === null}>
            Submit
          </button>
        </div>
      )}
    </>
  )
}
