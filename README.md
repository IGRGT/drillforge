# DrillForge — CompTIA A+ PBQ Simulator

Interactive performance-based question simulator covering both CompTIA A+ V15 exams: **220-1201 Core 1** (Mobile, Networking, Hardware, Virtualization, Troubleshooting) and **220-1202 Core 2** (Operating Systems, Security, Software Troubleshooting, Operational Procedures). Authored from the official V15 objectives. ~200 scenarios across all 9 domains.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Question types

| Type | How it works |
|------|-------------|
| **Identify** | Read the scenario, pick the correct answer from 4 options |
| **Order** | Click items in the correct sequence (e.g., laser printer steps) |
| **Match** | Click a term, then click its matching definition |
| **Troubleshoot** | Multi-step scenario — answer each decision point in sequence |

## Adding scenarios

Edit the files in `src/data/`. Each scenario follows this shape:

```js
// Identify
{ id, type: 'identify', domain, topic, difficulty, question, options: [], correct: index, explanation }

// Order
{ id, type: 'order', domain, topic, difficulty, question, items: [], correct: [], explanation }

// Match
{ id, type: 'match', domain, topic, difficulty, question, pairs: [{ left, right }], explanation }

// Troubleshoot
{ id, type: 'troubleshoot', domain, topic, difficulty, scenario, steps: [{ question, options, correct, feedback }] }
```

## Scoring

Pass threshold: 75%. Missed questions are listed on the results screen for review.
