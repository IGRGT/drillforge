export default function Feedback({ correct, explanation, partial }) {
  let header
  if (correct && partial)       header = '½ Correct — half points (got it on retry)'
  else if (correct && !partial) header = '✓ Correct'
  else                          header = '✗ Incorrect'

  const className = correct
    ? (partial ? 'feedback partial' : 'feedback correct')
    : 'feedback incorrect'

  return (
    <div className={className}>
      <div className="feedback-header">{header}</div>
      <div>{explanation}</div>
    </div>
  )
}
