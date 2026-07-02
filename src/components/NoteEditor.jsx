import { useState } from 'react'
import { getNotes, addNote } from '../hooks/useNotes'

function fmtDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function NoteEditor({ questionId }) {
  const [notes, setNotes] = useState(() => getNotes(questionId))
  const [draft, setDraft] = useState('')
  const [justSaved, setJustSaved] = useState(false)

  function save() {
    if (!draft.trim()) return
    const updated = addNote(questionId, draft)
    setNotes(updated)
    setDraft('')
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1500)
  }

  return (
    <div className="note-block">
      <div className="note-block-header">
        Your notes {notes.length > 0 && `(${notes.length})`}
      </div>

      {notes.length > 0 && (
        <ul className="note-prior-list">
          {notes.map((n, i) => (
            <li key={i} className="note-prior-item">
              <div>{n.text}</div>
              <div className="note-prior-item-meta">{fmtDate(n.ts)}</div>
            </li>
          ))}
        </ul>
      )}

      <textarea
        className="note-textarea"
        placeholder="Write this in your own words so it sticks for next time…"
        value={draft}
        onChange={e => setDraft(e.target.value)}
      />
      <div className="note-actions">
        <button className="btn-secondary" onClick={save} disabled={!draft.trim()}>
          Save note
        </button>
        {justSaved && <span className="note-saved">✓ saved</span>}
      </div>
    </div>
  )
}
