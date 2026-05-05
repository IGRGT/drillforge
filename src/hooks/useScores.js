// DrillForge — score persistence + xp dashboard integration.
//
// Two layers of storage:
//   1. localStorage (always on)        — source of truth for the app itself
//   2. Connected data folder (optional) — for the xp dashboard to read
//
// On first run, user clicks "Connect data folder" and picks
// gamify-learning/data/a-plus/. From then on, every saved session silently
// writes BOTH formats (raw + summary.json) into that folder. The folder
// handle persists in IndexedDB across reloads. No manual export step needed.

const KEY = 'pbq_scores'
const WEIGHTS = { '1': 0.15, '2': 0.20, '3': 0.25, '4': 0.11, '5': 0.29 }
const DOMAIN_NAMES = {
  '1': 'D1 Mobile',
  '2': 'D2 Networking',
  '3': 'D3 Hardware',
  '4': 'D4 Virt/Cloud',
  '5': 'D5 Troubleshooting',
}

// ── localStorage layer ──────────────────────────────────────────────────────

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return {
      sessions: parsed.sessions || [],
      // Stats survive session pruning — they're the long-term miss memory
      // used to weight which questions surface in future drills.
      stats: parsed.stats || { byId: {}, byTopic: {} },
    }
  } catch {
    return { sessions: [], stats: { byId: {}, byTopic: {} } }
  }
}

function save(store) {
  localStorage.setItem(KEY, JSON.stringify(store))
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ── IndexedDB: persist directory handle across reloads ─────────────────────

const IDB_NAME = 'drillforge'
const IDB_STORE = 'handles'
const HANDLE_KEY = 'dataFolder'

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(IDB_STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbGet(key) {
  const db = await openIDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly')
    const req = tx.objectStore(IDB_STORE).get(key)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbSet(key, value) {
  const db = await openIDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function idbDelete(key) {
  const db = await openIDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// ── File System Access API ─────────────────────────────────────────────────

export function isFSAccessSupported() {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window
}

async function verifyPermission(handle, mode = 'readwrite') {
  if (!handle) return false
  if ((await handle.queryPermission({ mode })) === 'granted') return true
  if ((await handle.requestPermission({ mode })) === 'granted') return true
  return false
}

export async function connectDataFolder() {
  if (!isFSAccessSupported()) {
    throw new Error('Your browser doesn\'t support direct folder access. Use Chrome, Edge, Brave, or Arc.')
  }
  const handle = await window.showDirectoryPicker({
    id: 'drillforge-data',
    mode: 'readwrite',
    startIn: 'documents',
  })
  if (!(await verifyPermission(handle))) {
    throw new Error('Permission denied.')
  }
  await idbSet(HANDLE_KEY, handle)

  // Write current state immediately so dashboard has data right away
  await writeBothFormatsTo(handle, load())
  return handle
}

export async function getDataFolder() {
  const handle = await idbGet(HANDLE_KEY)
  if (!handle) return null
  if (!(await verifyPermission(handle))) return null
  return handle
}

export async function disconnectDataFolder() {
  await idbDelete(HANDLE_KEY)
}

async function writeFileToFolder(folder, filename, content) {
  const fileHandle = await folder.getFileHandle(filename, { create: true })
  const writable   = await fileHandle.createWritable()
  await writable.write(content)
  await writable.close()
}

// ── Summary builder (canonical xp dashboard schema) ────────────────────────

function buildSummary(store) {
  const sessions = store.sessions || []

  // Same confidence-weighting logic as getReadiness — keeps the dashboard
  // and the in-app number aligned.
  const domainAvg = {}
  const domainQuestions = {}
  Object.keys(WEIGHTS).forEach(d => {
    const relevant = sessions.filter(s => s.domainBreakdown?.[d]).slice(-5)
    if (relevant.length === 0) { domainAvg[d] = 0; domainQuestions[d] = 0; return }
    const totalQ = relevant.reduce((sum, s) => sum + s.domainBreakdown[d].total, 0)
    const totalP = relevant.reduce(
      (sum, s) => sum + (s.domainBreakdown[d].points ?? s.domainBreakdown[d].correct),
      0
    )
    const rawPct     = totalQ > 0 ? (totalP / totalQ) * 100 : 0
    const confidence = Math.min(1, totalQ / CONFIDENCE_THRESHOLD)
    domainAvg[d] = Math.round(rawPct * confidence)
    domainQuestions[d] = totalQ
  })

  const weightSum = Object.values(WEIGHTS).reduce((a, b) => a + b, 0)
  const readiness = Object.entries(WEIGHTS).reduce((sum, [d, w]) => {
    return sum + (domainAvg[d] * w)
  }, 0) / weightSum

  const last = sessions[sessions.length - 1]

  // Anchor last_activity to noon UTC of the LOCAL calendar date so
  // late-night sessions still count for the day Gil thinks they happened on.
  // (Without this, an 11pm CT session lands on the next UTC date and breaks streaks.)
  let lastActivity = null
  if (last) {
    const d = new Date(last.date)
    const yyyy = d.getFullYear()
    const mm   = String(d.getMonth() + 1).padStart(2, '0')
    const dd   = String(d.getDate()).padStart(2, '0')
    lastActivity = `${yyyy}-${mm}-${dd}T12:00:00Z`
  }

  return {
    name: 'CompTIA A+',
    abbrev: 'A+',
    readiness_pct: Math.round(readiness),
    headline_stat: `${sessions.length} session${sessions.length === 1 ? '' : 's'} logged · readiness ${Math.round(readiness)}%`,
    sub_bars: Object.keys(WEIGHTS).map(d => ({
      label: DOMAIN_NAMES[d],
      pct: domainAvg[d],
      questions: domainQuestions[d],
    })),
    last_activity: lastActivity,
    pinned: true,
  }
}

async function writeBothFormatsTo(folder, store) {
  const date = new Date().toISOString().slice(0, 10)
  await writeFileToFolder(folder, `pbq-scores-${date}.json`,
    JSON.stringify(store, null, 2))
  await writeFileToFolder(folder, 'summary.json',
    JSON.stringify(buildSummary(store), null, 2))
}

async function writeBothFormatsIfConnected(store) {
  const folder = await getDataFolder()
  if (!folder) return false
  await writeBothFormatsTo(folder, store)
  return true
}

// ── Public API ─────────────────────────────────────────────────────────────

export function saveSession(results) {
  const store = load()

  // Score each result: 1.0 for right first try, 0.5 for right after retry, 0 for wrong both times.
  const scoreOf = r => (r.correct && !r.partial) ? 1 : (r.correct && r.partial) ? 0.5 : 0

  // Update long-term per-id and per-topic stats used for future weighting.
  // Each result contributes 1.0 split between hit and miss:
  //   right first try → +1 hit
  //   right on retry  → +0.5 hit, +0.5 miss
  //   wrong both      → +1 miss
  results.forEach(r => {
    const { question } = r
    const hitDelta  = (r.correct && !r.partial) ? 1   : (r.correct && r.partial) ? 0.5 : 0
    const missDelta = (r.correct && !r.partial) ? 0   : (r.correct && r.partial) ? 0.5 : 1
    const idCell = store.stats.byId[question.id] ||= { miss: 0, hit: 0 }
    idCell.hit  += hitDelta
    idCell.miss += missDelta
    const topicCell = store.stats.byTopic[question.topic] ||= { miss: 0, hit: 0 }
    topicCell.hit  += hitDelta
    topicCell.miss += missDelta
  })

  const total   = results.length
  const correct = results.filter(r => r.correct).length      // any-attempt hit count
  const points  = results.reduce((sum, r) => sum + scoreOf(r), 0)
  const pct     = total > 0 ? Math.round((points / total) * 100) : 0

  const domainBreakdown = {}
  const missedTopics    = []

  results.forEach(r => {
    const { question, correct: isCorrect } = r
    const d = question.domain
    if (!domainBreakdown[d]) domainBreakdown[d] = { correct: 0, total: 0, points: 0, pct: 0 }
    domainBreakdown[d].total++
    domainBreakdown[d].points += scoreOf(r)
    if (isCorrect) domainBreakdown[d].correct++
    else if (!missedTopics.includes(question.topic)) missedTopics.push(question.topic)
  })

  Object.keys(domainBreakdown).forEach(d => {
    const { points: p, total: t } = domainBreakdown[d]
    domainBreakdown[d].pct = t > 0 ? Math.round((p / t) * 100) : 0
  })

  const session = {
    id: uid(),
    date: new Date().toISOString(),
    domains: [...new Set(results.map(r => r.question.domain))].sort(),
    total,
    correct,
    pct,
    domainBreakdown,
    missedTopics,
  }

  store.sessions.push(session)
  save(store)

  // Lab-writes-both: silently update the connected data folder, if any.
  // localStorage stays the source of truth — folder write failures are non-fatal.
  writeBothFormatsIfConnected(store).catch(err => {
    console.warn('[DrillForge] Could not write to data folder:', err)
  })

  return session
}

// Confidence weighting: a domain only gets FULL credit once you've drilled
// at least ~10 questions in it. Below that, the score is scaled down so a
// single 1-question session at 100% doesn't read as "domain mastered."
const CONFIDENCE_THRESHOLD = 10

export function getReadiness() {
  const { sessions } = load()
  const domainAvg = {}
  Object.keys(WEIGHTS).forEach(d => {
    const relevant = sessions.filter(s => s.domainBreakdown[d]).slice(-5)
    if (relevant.length === 0) { domainAvg[d] = 0; return }
    const totalQ = relevant.reduce((sum, s) => sum + s.domainBreakdown[d].total, 0)
    // Point-weighted score (retries count half). Old sessions fall back to .correct.
    const totalP = relevant.reduce(
      (sum, s) => sum + (s.domainBreakdown[d].points ?? s.domainBreakdown[d].correct),
      0
    )
    const rawPct     = totalQ > 0 ? (totalP / totalQ) * 100 : 0
    const confidence = Math.min(1, totalQ / CONFIDENCE_THRESHOLD)
    domainAvg[d] = Math.round(rawPct * confidence)
  })
  const weightSum = Object.values(WEIGHTS).reduce((a, b) => a + b, 0)
  const readiness = Object.entries(WEIGHTS).reduce((sum, [d, w]) => {
    return sum + (domainAvg[d] * w)
  }, 0) / weightSum
  return { readiness: Math.round(readiness), domainAvg }
}

export function getAllSessions() {
  return load().sessions
}

// Returns long-term miss/hit stats for weighted question selection.
// `byId` keys are question ids; `byTopic` keys are topic strings.
export function getMissStats() {
  return load().stats
}

// Manual export (kept as fallback for browsers without FS Access API)
export function exportJSON() {
  const store = load()
  const blob  = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' })
  const url   = URL.createObjectURL(blob)
  const a     = document.createElement('a')
  const date  = new Date().toISOString().slice(0, 10)
  a.href      = url
  a.download  = `pbq-scores-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}
