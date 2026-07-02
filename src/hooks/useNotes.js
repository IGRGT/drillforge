// Per-question notes Gil writes after clicking "I don't know".
// Stored in localStorage so they survive across sessions and resurface
// the next time the same question appears.
const KEY = 'drillforge.notes.v1'

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAll(map) {
  try { localStorage.setItem(KEY, JSON.stringify(map)) } catch {}
}

export function getNotes(questionId) {
  if (!questionId) return []
  const all = readAll()
  const list = all[questionId]
  return Array.isArray(list) ? list : []
}

export function addNote(questionId, text) {
  if (!questionId || !text || !text.trim()) return getNotes(questionId)
  const all = readAll()
  const list = Array.isArray(all[questionId]) ? all[questionId] : []
  list.push({ text: text.trim(), ts: new Date().toISOString() })
  all[questionId] = list
  writeAll(all)
  return list
}
