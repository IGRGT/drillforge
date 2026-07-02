import { useState, useMemo } from 'react'

export default function OrderQuestion({ question, onSubmit, submitted, onIdk }) {
  const shuffled = useMemo(
    () => [...question.items].sort(() => Math.random() - 0.5),
    [question.id]
  )

  const [order, setOrder] = useState([]) // array of item strings in user-placed order

  function clickItem(item) {
    if (submitted) return
    if (order.includes(item)) {
      setOrder(prev => prev.filter(i => i !== item))
    } else {
      setOrder(prev => [...prev, item])
    }
  }

  function submit() {
    if (order.length !== question.items.length) return
    const correct = order.every((item, i) => item === question.correct[i])
    onSubmit(correct)
  }

  function itemState(item) {
    if (!submitted) {
      return order.includes(item) ? 'placed' : ''
    }
    const userIdx = order.indexOf(item)
    if (userIdx === -1) return ''
    return order[userIdx] === question.correct[userIdx] ? 'placed' : 'wrong-place'
  }

  return (
    <>
      <p className="q-text">{question.question}</p>

      <div className="order-instructions">
        Click items in the correct order (1 → {question.items.length}). Click again to deselect.
      </div>

      {submitted && (
        <div style={{ marginBottom: 14, fontSize: 13, color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text)' }}>Correct order:</strong>{' '}
          {question.correct.join(' → ')}
        </div>
      )}

      <div className="order-items">
        {shuffled.map(item => {
          const pos = order.indexOf(item)
          const state = itemState(item)
          return (
            <button
              key={item}
              className={`order-item ${state}`}
              onClick={() => clickItem(item)}
              disabled={submitted}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: undefined }}
            >
              <div className={`order-num ${pos === -1 ? 'empty' : ''}`}>
                {pos === -1 ? '·' : pos + 1}
              </div>
              <span style={{ fontSize: 14 }}>{item}</span>
            </button>
          )
        })}
      </div>

      {!submitted && (
        <div className="actions" style={{ justifyContent: 'space-between' }}>
          {onIdk ? (
            <button className="btn-ghost" onClick={onIdk}>
              I don't know <kbd style={{ marginLeft: 6 }}>0</kbd>
            </button>
          ) : <span />}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn-ghost"
              onClick={() => setOrder([])}
              disabled={order.length === 0}
            >
              Reset
            </button>
            <button
              className="btn-primary"
              onClick={submit}
              disabled={order.length !== question.items.length}
            >
              Submit ({order.length}/{question.items.length})
            </button>
          </div>
        </div>
      )}

    </>
  )
}
