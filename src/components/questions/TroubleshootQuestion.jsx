import { useState } from 'react'

const LETTERS = ['A', 'B', 'C', 'D']

export default function TroubleshootQuestion({ question, onSubmit, submitted, onIdk }) {
  const [stepIndex,  setStepIndex]  = useState(0)
  const [selected,   setSelected]   = useState(null)
  const [stepResult, setStepResult] = useState(null)
  const [allCorrect, setAllCorrect] = useState(true)
  const [doneSteps,  setDoneSteps]  = useState([])

  const currentStep = question.steps[stepIndex]
  const isLastStep  = stepIndex === question.steps.length - 1

  function choose(i) {
    if (stepResult) return
    setSelected(i)
  }

  function submitStep() {
    if (selected === null) return
    const correct = selected === currentStep.correct
    if (!correct) setAllCorrect(false)
    setStepResult({ correct, feedback: currentStep.feedback })
    setDoneSteps(prev => [...prev, correct])
  }

  function nextStep() {
    if (isLastStep) {
      onSubmit(allCorrect && stepResult.correct)
    } else {
      setStepIndex(i => i + 1)
      setSelected(null)
      setStepResult(null)
    }
  }

  function btnClass(i) {
    if (!stepResult) return selected === i ? 'option-btn selected' : 'option-btn'
    if (i === currentStep.correct) return 'option-btn correct'
    if (i === selected && selected !== currentStep.correct) return 'option-btn incorrect'
    return 'option-btn'
  }

  return (
    <>
      <div className="scenario-box">
        <strong>Scenario</strong>
        {question.scenario}
      </div>

      {/* Step indicator with dots */}
      <div className="ts-step-label">
        Step {stepIndex + 1} of {question.steps.length}
        <div className="ts-step-dots">
          {question.steps.map((_, i) => (
            <div
              key={i}
              className={`ts-dot ${
                i < doneSteps.length
                  ? 'done'
                  : i === stepIndex
                    ? 'active'
                    : ''
              }`}
            />
          ))}
        </div>
      </div>

      <p className="q-text">{currentStep.question}</p>

      <div className="options-list">
        {currentStep.options.map((opt, i) => (
          <button
            key={i}
            className={btnClass(i)}
            onClick={() => choose(i)}
            disabled={!!stepResult}
          >
            <span className="option-letter">{LETTERS[i]}</span>
            <span>{opt}</span>
          </button>
        ))}
      </div>

      {stepResult && (
        <div
          className={`feedback ${stepResult.correct ? 'correct' : 'incorrect'}`}
          style={{ marginBottom: 16 }}
        >
          <div className="feedback-header">
            {stepResult.correct ? '✓ Correct' : '✗ Incorrect'}
          </div>
          {stepResult.feedback}
        </div>
      )}

      {!stepResult ? (
        <div className="actions" style={{ justifyContent: 'space-between' }}>
          {onIdk && stepIndex === 0 ? (
            <button className="btn-ghost" onClick={onIdk}>
              I don't know <kbd style={{ marginLeft: 6 }}>0</kbd>
            </button>
          ) : <span />}
          <button className="btn-primary" onClick={submitStep} disabled={selected === null}>
            Submit
          </button>
        </div>
      ) : (
        !submitted && (
          <div className="actions">
            <button className="btn-primary" onClick={nextStep}>
              {isLastStep ? 'Finish →' : 'Next Step →'}
            </button>
          </div>
        )
      )}
    </>
  )
}
