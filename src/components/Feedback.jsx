export default function Feedback({ correct, explanation, partial, idk }) {
  let header
  if (idk)                      header = '○ Skipped — no credit, full breakdown below'
  else if (correct && partial)  header = '½ Correct — half points (got it on retry)'
  else if (correct && !partial) header = '✓ Correct'
  else                          header = '✗ Incorrect'

  let className
  if (idk)          className = 'feedback skipped'
  else if (correct) className = partial ? 'feedback partial' : 'feedback correct'
  else              className = 'feedback incorrect'

  return (
    <div className={className}>
      <div className="feedback-header">{header}</div>
      <div>{explanation}</div>
    </div>
  )
}
