import { domain1 } from './domain1-mobile'
import { domain2 } from './domain2-networking'
import { domain3 } from './domain3-hardware'
import { domain4 } from './domain4-virtualization'
import { domain5 } from './domain5-troubleshooting'
import { core2Domain1 } from './core2-domain1-os'
import { core2Domain2 } from './core2-domain2-security'
import { core2Domain3 } from './core2-domain3-software-troubleshooting'
import { core2Domain4 } from './core2-domain4-operational-procedures'
import { expansion20260513 } from './expansion-2026-05-13'

// Existing Core 1 questions don't carry a `core` field — they're tagged here
// so Core 1 and Core 2 selections never bleed into the same drill.
const core1All = [...domain1, ...domain2, ...domain3, ...domain4, ...domain5]
  .map(q => q.core ? q : { ...q, core: '1' })

// Expansion file mixes Core 1 (no `core` field) and Core 2 (`core: '2'`).
// Apply the same auto-tag so Core 1 entries pick up `core: '1'`.
const expansionTagged = expansion20260513.map(q => q.core ? q : { ...q, core: '1' })

export const allScenarios = [
  ...core1All,
  ...core2Domain1,
  ...core2Domain2,
  ...core2Domain3,
  ...core2Domain4,
  ...expansionTagged,
]

// Weight = 1 baseline + 2× net misses on this exact question + 0.5× net misses
// on its topic. "Net" = miss − 0.5·hit, floored at 0, so a question you've
// since mastered drifts back toward weight 1. With no history every weight is
// 1, which collapses to a uniform shuffle.
function questionWeight(q, stats) {
  if (!stats) return 1
  const id = stats.byId?.[q.id]
  const tp = stats.byTopic?.[q.topic]
  const idNet    = id ? Math.max(0, id.miss - 0.5 * id.hit) : 0
  const topicNet = tp ? Math.max(0, tp.miss - 0.5 * tp.hit) : 0
  return 1 + 2 * idNet + 0.5 * topicNet
}

// Weighted sample without replacement using exponential keys
// (key = -ln(r)/w; sort ascending, take first n). Equivalent to repeatedly
// drawing without replacement proportional to weight, but O(n log n).
function weightedShuffle(pool, stats) {
  return pool
    .map(q => ({ q, key: -Math.log(Math.random()) / questionWeight(q, stats) }))
    .sort((a, b) => a.key - b.key)
    .map(x => x.q)
}

export function getScenarios(domains = ['1', '2', '3', '4', '5'], types = null, limit = null, shuffle = true, stats = null, core = '1') {
  let pool = allScenarios.filter(q => q.core === core && domains.includes(q.domain))
  if (types) pool = pool.filter(q => types.includes(q.type))
  if (shuffle) pool = weightedShuffle(pool, stats)
  return limit ? pool.slice(0, limit) : pool
}

export const DOMAIN_LABELS = {
  '1': 'Domain 1 — Mobile Devices',
  '2': 'Domain 2 — Networking',
  '3': 'Domain 3 — Hardware',
  '4': 'Domain 4 — Virtualization & Cloud',
  '5': 'Domain 5 — Troubleshooting',
}

// Core 2 (220-1202) domain labels. Selectors swap labels by `core`.
export const CORE2_DOMAIN_LABELS = {
  '1': 'Domain 1 — Operating Systems',
  '2': 'Domain 2 — Security',
  '3': 'Domain 3 — Software Troubleshooting',
  '4': 'Domain 4 — Operational Procedures',
}

export const CORE_META = {
  '1': {
    label: 'Core 1 — 220-1201',
    domains: ['1', '2', '3', '4', '5'],
    weights: { '1': '13%', '2': '23%', '3': '25%', '4': '11%', '5': '28%' },
    descs: {
      '1': 'Laptop hardware, display, disassembly, mobile devices',
      '2': 'IP addressing, subnets, cables, wireless, network tools',
      '3': 'Motherboards, CPUs, RAM, PSU, printers, storage',
      '4': 'Virtualization, hypervisors, cloud models (IaaS/PaaS/SaaS)',
      '5': 'Symptom → cause → fix for hardware, display, network, printer',
    },
    labels: {
      '1': 'Domain 1 — Mobile Devices',
      '2': 'Domain 2 — Networking',
      '3': 'Domain 3 — Hardware',
      '4': 'Domain 4 — Virtualization & Cloud',
      '5': 'Domain 5 — Troubleshooting',
    },
  },
  '2': {
    label: 'Core 2 — 220-1202',
    domains: ['1', '2', '3', '4'],
    weights: { '1': '28%', '2': '28%', '3': '23%', '4': '21%' },
    descs: {
      '1': 'Windows, macOS, Linux, mobile OS — install, config, CLI',
      '2': 'Malware, MFA, BitLocker, Zero Trust, physical & logical security',
      '3': 'BSOD, slow systems, malware removal, mobile/app issues',
      '4': 'Documentation, change mgmt, backups, safety, AUP, AI ethics',
    },
    labels: {
      '1': 'Domain 1 — Operating Systems',
      '2': 'Domain 2 — Security',
      '3': 'Domain 3 — Software Troubleshooting',
      '4': 'Domain 4 — Operational Procedures',
    },
  },
}

export const TYPE_LABELS = {
  identify:     'Identify',
  order:        'Order',
  match:        'Match',
  troubleshoot: 'Troubleshoot',
}
