# Mobility Hub

An evidence-based, production-ready **mobility training web app** that feels like a
native Apple Health / Fitness experience. It runs entirely in the browser — no backend,
no build step, no account — and works offline as an installable PWA.

> **Educational tool, not medical advice.** If you have pain, an injury, are pregnant, or
> have a medical condition, consult a qualified clinician (DPT/MD) before starting.

---

## Highlights

- **FMS-style assessment system** — 13 measurable tests (knee-to-wall, toe-touch,
  deep-squat, hip IR/ER, 90/90, shoulder reach, thoracic rotation, single-leg balance,
  ASLR, couch stretch, neck rotation, wrist extension) with real reliability/validity data
  and per-side tracking.
- **Adaptive sessions, 5 → 60 minutes** — every session is _generated_ from a fully
  annotated exercise database and ordered by evidence (dynamic-first warm-ups, static/PNF
  for standalone ROM, calmer recovery flows).
- **Progression engine** — conservative, clearly-labelled projections using an
  exponential-approach model scaled by your real adherence.
- **Apple-style dashboards** — activity rings, mobility score, mobility age, movement-quality
  score, joint radar/spider chart, trend line, calendar heatmap, weekly bars, per-joint
  scores, risk indicators and asymmetry flags.
- **Weekly planner** — pick any days and any minutes; the planner tracks weekly completion
  regardless of the combination.
- **Goals & sport tuning** — Running, Skiing, Surfing, Football, Padel, Functional Fitness,
  Cycling, Scuba. Goals and sports re-prioritise which drills surface.
- **Gamification** — streaks, badges, milestones and personal-record style achievements.
- **Inline demo videos** — every exercise has a short YouTube demonstration that streams
  **in-app** via YouTube's official privacy-enhanced embed (tap the poster to play). The IDs
  were sourced at build-time and **verified against YouTube's oEmbed**, and live in one file
  (`js/videos.js`) so they're easy to update. Videos are **not** re-hosted. You can also
  **attach your own** clip to any exercise (paste a YouTube link — it's saved on your device).
  Creators featured include Squat University, E3 Rehab, [P]rehab, Physiotutors, Strength Side,
  Tom Merrick, The Ready State and others.
- **Every recommendation cites its evidence** with a grade (A/B/C) and a linked reference.
- **Local-first & private** — all data lives in `localStorage`. Export / import / reset any time.
- **PWA** — installable, offline-capable, iPhone-safe-area aware.

---

## Scientific basis

The full literature review, evidence grading, model derivation and reference list is in
**[`RESEARCH.md`](RESEARCH.md)**, and every reference is also browsable in-app under
**Library → Science**.

Evidence grades used throughout:

| Grade | Meaning                                                                         |
| :---: | ------------------------------------------------------------------------------- |
| **A** | Consistent meta-analysis / systematic review, or a validated clinical measure   |
| **B** | Individual RCTs or good reliability/validity studies; generally consistent      |
| **C** | Limited, mixed, or indirect evidence; mechanistic or expert-consensus rationale |

Where evidence is weak or conflicting (e.g., "stretching prevents injury"), the app says so
rather than overstating benefits. The best-supported injury-prevention claim in the app is
**balance/proprioceptive training → reduced ankle-sprain risk**.

---

## Run it locally

The app is plain HTML/CSS/JS. Two options:

**Quick look** — double-click `index.html`. Everything works except the service worker
(offline install), which browsers only allow over `http(s)`.

**Full experience (recommended)** — serve the folder over HTTP so the PWA/service worker
registers:

```bash
# from the mobility-hub/ folder, pick any static server:
python -m http.server 8080
#   or
npx serve .
```

Then open `http://localhost:8080/`.

No dependencies, no build step. (The `_mhtest`/jsdom tooling used during development is not
part of the app.)

---

## Deploy to GitHub Pages

This folder is designed to live at `mobility-hub/` inside
[`DaniLlP/training-hub`](https://github.com/DaniLlP/training-hub) and to work from any
sub-path (all asset paths are relative).

1. Copy this `mobility-hub/` folder into the repository root and push:
   ```bash
   git add mobility-hub
   git commit -m "Add Mobility Hub"
   git push
   ```
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   choose your default branch and the `/ (root)` folder, save.
3. Your app will be available at:
   ```
   https://danillp.github.io/training-hub/mobility-hub/
   ```

Because `manifest.webmanifest` uses relative `start_url`/`scope` and the service worker uses
relative cache paths, the PWA installs correctly from that sub-path.

---

## Install on iPhone (PWA)

1. Open the deployed URL in **Safari**.
2. Tap the **Share** icon → **Add to Home Screen**.
3. Launch it from the home screen for a full-screen, native-feeling app with offline support.

---

## Data & privacy

- 100% client-side. Nothing is uploaded anywhere.
- Storage key: `mobilityHub.v1` in `localStorage`.
- **Plan → Settings & data**: Export (download JSON), Import, or Reset everything.

---

## Project structure

```
mobility-hub/
├── index.html               # App shell (loads everything below in order)
├── styles.css               # Design system (dark, glassmorphic, Apple-style)
├── script.js                # App controller + all views (Today/Train/Assess/Progress/Plan/Library)
├── manifest.webmanifest     # PWA manifest
├── service-worker.js        # Offline app-shell cache
├── js/
│   ├── references.js         # Scientific references (evidence-graded)
│   ├── exercises.js          # Exercise database (full coaching + science metadata)
│   ├── catalog.js            # Regions, sports, goals, channels, achievements
│   ├── assessments.js        # 13 tests: scoring anchors + progression params
│   ├── programs.js           # Session generator + program presets
│   ├── store.js              # localStorage persistence
│   ├── engine.js             # Scoring, projections, streaks, planner, achievements
│   ├── charts.js             # Canvas: rings, radar, trend, projection, bars
│   └── videos.js             # Curated, oEmbed-verified demo-video map (exerciseId → YouTube)
├── icons/                    # SVG app icons (any-size + maskable + favicon)
├── assets/                   # (reserved for future imagery)
├── videos/                   # (videos are linked, not hosted — see assets note)
├── RESEARCH.md               # Literature review, evidence grading, model derivation
└── README.md
```

**Architecture notes**

- No framework and no bundler — files attach to a single `window.MH` namespace and load in a
  deliberate order (data → state → logic → charts → controller). This keeps it debuggable,
  dependency-free and trivially hostable.
- Views are built with a tiny `h()` DOM helper; state changes flow through `MH.store`
  subscriptions.
- All charts are hand-rolled on `<canvas>` (DPR-aware) — no chart library.

---

## Browser support & accessibility

- Optimised for **iPhone Safari**; also tested logic/DOM paths headlessly (jsdom). Works in
  current Chrome, Edge, Safari and Firefox on phone, tablet and desktop.
- Dark-mode-first by design (matches the Apple Fitness aesthetic).
- Honours `prefers-reduced-motion` and offers an in-app **Reduce motion** toggle.
- Semantic landmarks, `aria-label`s on icon buttons, switch roles on toggles, and keyboard-
  clickable controls. Full WCAG conformance would still require manual testing with assistive
  technology and expert review.

---

## Credits

- Exercise demonstrations link to their original creators on YouTube — please support them
  directly. Mobility Hub does not host or re-encode their content.
- Scientific references are attributed inline and in `RESEARCH.md` with DOIs/PMIDs.

## Disclaimer

Mobility Hub provides general educational information and estimates based on research
averages. It does not diagnose, treat, or replace professional medical care. "Mobility age"
and "movement-quality" scores are motivational composites, not validated diagnostic
instruments. Use at your own discretion and stop any movement that causes pain.
