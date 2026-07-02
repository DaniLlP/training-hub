# Mobility Hub — Research Summary & Evidence Base

This document explains **why** each mobility method and drill category in Mobility Hub was
selected, **what level of evidence** supports it, and **where the evidence is weak or
conflicting**. It is written to be read alongside the in‑app *Science* panels, which link
each exercise and assessment back to the reference IDs listed here.

> **Honesty note.** Mobility/flexibility research is dominated by small, short (4–12 week)
> trials with heterogeneous protocols. Effect sizes for range‑of‑motion (ROM) gains are
> generally *moderate and reliable*; claims about injury prevention and long‑term
> performance transfer are *weaker and more context‑dependent*. Where the literature is
> mixed, the app says so rather than overstating benefits. All progression projections are
> **conservative population averages, not guarantees.**

---

## 1. Methodology

We performed a targeted review of secondary evidence (systematic reviews and meta‑analyses)
plus foundational primary studies, prioritising:

- **PubMed / NCBI / PMC**, **Europe PMC**, **CrossRef / DOI**, publisher pages
  (Springer *Sports Medicine*, SAGE *AJSM*, BMJ *BJSM*, Frontiers, MDPI, *JSAMS*, *JSSM*).
- Preference order: **meta‑analysis / systematic review → RCT → cohort/reliability study →
  narrative review**. Low‑quality blogs were not used as evidence; practitioner channels
  (Squat University, E3 Rehab, Physiotutors, etc.) are used only as *demonstration* links in
  the video library and are clearly separated from the evidence base.

## 2. Evidence grading legend

The app tags every recommendation with one of these levels:

| Level | Meaning |
|-------|---------|
| **A** | Consistent meta‑analysis / systematic‑review evidence, or a validated clinical measure |
| **B** | Individual RCTs or good reliability/validity studies; generally consistent |
| **C** | Limited, mixed, or indirect evidence; mechanistic or expert‑consensus rationale |

---

## 3. What the evidence says (method level)

### 3.1 Static stretch training increases ROM — **Level A**
Multiple meta‑analyses show chronic (multi‑week) static stretching produces **moderate**
increases in joint ROM versus control, and reduces passive muscle‑tendon stiffness.
Total **weekly duration** matters more than any single session's length, and gains largely
**reverse (detrain)** when stretching stops. Practical implication used in the app: prescribe
holds of ~**30–60 s**, accumulate volume across the week, and keep sessions frequent rather
than occasional. *(refs: konrad2024, konrad2023chronic, nakamura2023stiffness, page2012)*

### 3.2 Dynamic stretching is the better *warm‑up* — **Level A/B**
Network meta‑analysis of warm‑up methods found **dynamic stretching** improves subsequent
countermovement‑jump height and sprint time, whereas **prolonged static stretching before
performance** can slightly *reduce* explosive output. The app therefore front‑loads
**dynamic mobility** in "warm‑up / athletic" sessions and reserves long static holds for
standalone ROM or evening "wind‑down" sessions. The acute static‑stretch performance
decrement is small and largely offset when followed by dynamic activity. *(refs:
warmup2023meta, behm2011review, behm2016acute)*

### 3.3 PNF (contract‑relax) is at least as effective as static — **Level B**
Proprioceptive Neuromuscular Facilitation (e.g., contract‑relax) yields ROM gains
**comparable to, and sometimes greater than,** static stretching, plausibly via
autogenic/reciprocal inhibition. Evidence is not unanimously in PNF's favour for every joint,
so the app offers PNF as an **optional progression**, not a mandate. *(refs: hindle2012pnf,
behm2016acute)*

### 3.4 Foam rolling / self‑myofascial release — **Level B (acute), Level C (chronic)**
Foam rolling produces a **small‑to‑moderate acute** ROM increase and may aid perceived
recovery/DOMS **without impairing performance** — making it a good *preparation* tool. It is
**not clearly superior** to stretching, and multi‑week ROM adaptations from rolling alone are
uncertain. The app uses rolling as an **optional soft‑tissue primer** at the start of
sessions, never as the primary ROM driver. *(refs: wiewelhove2019foam, konrad2022foam,
konrad2024)*

### 3.5 Balance / proprioceptive training reduces ankle‑sprain risk — **Level A**
Meta‑analyses show proprioceptive/balance training **reduces the incidence of ankle sprains**
(risk reductions on the order of ~35–60%), with the strongest effect in those with a prior
sprain. This is the app's best‑supported *injury‑prevention* claim and underpins the
single‑leg balance drills and stability progressions. *(refs: schiftan2015balance,
rivera2017proprio)*

### 3.6 Strength through range / loaded mobility — **Level B/C**
Full‑ROM resistance training and end‑range isometrics (e.g., loaded 90/90, Cossack squats,
tibialis/hamstring loading) build **usable, controlled** range and improve movement quality.
Evidence for "eccentric/loaded lengthening → ROM" is promising but less mature than for
stretching, so it is graded B/C and framed as a way to *own* range rather than just acquire it.

---

## 4. Assessments — validity & reliability

| Test | Property | Grade |
|------|----------|-------|
| **Weight‑Bearing Lunge (Knee‑to‑Wall)** for ankle dorsiflexion | Excellent intra/inter‑rater reliability (ICC ≈ 0.80–0.99); reported MDC ≈ 1–2 cm | **A** *(bennell1998wblt, powden2015wblt)* |
| **Sit‑and‑Reach / Toe‑Touch** | Moderate criterion validity for **hamstring** extensibility (r ≈ 0.46–0.67); **low** for lumbar extensibility | **B** *(mayorga2014sitreach)* |
| **Functional Movement Screen (deep squat, ASLR, shoulder mobility, etc.)** | Good rater reliability; composite score has **limited** stand‑alone injury‑prediction value | **B** *(cook2016fms, moran2016fms)* |
| **Hip IR/ER, 90/90, thoracic rotation, single‑leg balance** | Field measures with supportive but more variable reliability data | **B/C** |

**Design consequence:** the app treats the **knee‑to‑wall test** as its most trustworthy
objective metric (measured in cm, both sides independently), uses **toe‑touch/sit‑and‑reach**
as a hamstring‑biased proxy (not a low‑back test), and presents the **FMS‑style composite** as
a *movement‑quality screen*, explicitly **not** a diagnostic or injury‑prediction tool.

---

## 5. Progression engine — how projections are derived

Projections use a conservative **exponential‑approach model**:

```
value(week) = plateau + (baseline − plateau) · e^(−week / τ)
```

- `τ` (time‑constant) is set from typical trial lengths (most ROM studies run 4–12 weeks and
  show the majority of gains by ~6–8 weeks), so the app uses **τ ≈ 6–8 weeks**.
- `plateau` is a realistic ceiling per test (e.g., "palms flat on floor" for toe‑touch),
  **not** an unlimited improvement.
- Projections are **scaled by adherence** (sessions completed vs. planned). Skipping work
  flattens the curve; detraining is acknowledged per §3.1.
- Every projection in the UI is labelled **"estimate based on research averages — individual
  results vary."**

This model is intentionally simple and transparent. It is a planning aid, **not** a clinical
prediction.

---

## 6. Sport‑specific rationale (why these joints for these sports)

- **Running / Cycling:** hip extension + ankle dorsiflexion + hamstring/glute function drive
  stride and pedal mechanics; thoracic/hip rotation for gait efficiency.
- **Skiing / Surfing / Functional fitness:** deep‑squat pattern = ankle DF + hip flexion/IR +
  T‑spine; rotational capacity and single‑leg balance for terrain/board control.
- **Football / Padel:** hip IR/ER and adductor length for cutting/lunging; ankle stability and
  T‑spine rotation for change‑of‑direction and swing mechanics.
- **Scuba diving:** shoulder overhead/behind‑the‑back reach (tank & valve manipulation),
  T‑spine and hip mobility for wetsuit dressing and trim.

These mappings prioritise the joints with the **strongest ROM‑response evidence** (ankle, hip,
hamstring, shoulder, thoracic) and pair them with the balance/stability work that has the
best injury‑prevention support.

---

## 7. Limitations & disclaimers

- This is an **educational tool, not medical advice.** It does not diagnose or treat.
  People with pain, injury, hypermobility, or medical conditions should consult a qualified
  clinician (DPT/MD).
- Much of the ROM literature uses young, healthy, recreationally active participants; transfer
  to older, clinical, or highly specialised populations is uncertain.
- "Mobility age" and "movement‑quality" scores are **motivational composites** derived from
  the assessment norms above, not validated diagnostic instruments.
- Injury‑prevention evidence is strongest for **balance training → ankle sprains**; broad
  "stretching prevents injury" claims are **not** well supported and are avoided.

---

## 8. Reference list

Evidence level in brackets. DOIs/PMIDs are provided where available for verification.

1. **[A] Konrad A, et al. (2024).** Static Stretch Training versus Foam Rolling Training
   Effects on Range of Motion: A Systematic Review and Meta‑Analysis. *Sports Medicine*
   54(9):2311–2326. doi:10.1007/s40279-024-02041-0 — `konrad2024`
2. **[A] Konrad A, et al. (2023).** Chronic effects of stretching on range of motion with
   consideration of potential moderating variables. *J Sport Health Sci / rel.* PMID:37301370
   — `konrad2023chronic`
3. **[B] Nakamura M, Konrad A, et al. (2023).** Long‑term static stretching can decrease muscle
   stiffness: a systematic review and meta‑analysis. PMID:37231582 — `nakamura2023stiffness`
4. **[A] Behm DG, Blazevich AJ, Kay AD, McHugh M (2016).** Acute effects of muscle stretching
   on physical performance, range of motion, and injury incidence in healthy active
   individuals: a systematic review. *Appl Physiol Nutr Metab* 41(1):1–11. PMID:26642915 —
   `behm2016acute`
5. **[B] Behm DG, Chaouachi A (2011).** A review of the acute effects of static and dynamic
   stretching on performance. *Eur J Appl Physiol* 111:2633–2651.
   doi:10.1007/s00421-011-1879-2 — `behm2011review`
6. **[A] Zhang Q, et al. (2023).** Effects of different warm‑up methods on acute lower‑limb
   explosive strength: a systematic review and network meta‑analysis. *BMC Sports Sci Med
   Rehabil* 15:93. doi:10.1186/s13102-023-00703-6 — `warmup2023meta`
7. **[B] Hindle KB, et al. (2012).** Proprioceptive Neuromuscular Facilitation (PNF): its
   mechanisms and effects on range of motion and muscular function. *J Hum Kinet* 31:105–113.
   — `hindle2012pnf`
8. **[B] Wiewelhove T, et al. (2019).** A meta‑analysis of the effects of foam rolling on
   performance and recovery. *Front Physiol* 10:376. doi:10.3389/fphys.2019.00376 —
   `wiewelhove2019foam`
9. **[B] Konrad A, Nakamura M, Behm DG (2022).** Foam Rolling Training Effects on Range of
   Motion: A Systematic Review and Meta‑Analysis. *Sports Medicine* 52:2523–2535.
   doi:10.1007/s40279-022-01699-8 — `konrad2022foam`
10. **[A] Schiftan GS, Ross LA, Hahne AJ (2015).** The effectiveness of proprioceptive training
    in preventing ankle sprains in sporting populations: a systematic review and
    meta‑analysis. *J Sci Med Sport* 18(3):238–244. doi:10.1016/j.jsams.2014.04.005 —
    `schiftan2015balance`
11. **[A] Rivera MJ, et al. (2017).** Proprioceptive Training for the Prevention of Ankle
    Sprains: An Evidence‑Based Review. *J Athl Train* 52(11):1065–1067. — `rivera2017proprio`
12. **[A] Bennell KL, et al. (1998).** Intra‑rater and inter‑rater reliability of a
    weight‑bearing lunge measure of ankle dorsiflexion. *Aust J Physiother* 44(3):175–180.
    PMID:11676731 — `bennell1998wblt`
13. **[A] Powden CJ, Hoch JM, Hoch MC (2015).** Reliability and minimal detectable change of
    the weight‑bearing lunge test: a systematic review. *Man Ther* 20(4):524–532.
    PMID:25704110 — `powden2015wblt`
14. **[B] Cuchna JW, Hoch MC, Hoch JM (2016).** Reliability, validity, and injury predictive
    value of the Functional Movement Screen: a systematic review and meta‑analysis. *Am J
    Sports Med.* doi:10.1177/0363546516641937 — `cook2016fms`
15. **[B] Moran RW, et al. (2016).** How reliable are Functional Movement Screening scores? A
    systematic review of rater reliability. *Br J Sports Med* 50(9):527–536. — `moran2016fms`
16. **[B] Mayorga‑Vega D, Merino‑Marban R, Viciana J (2014).** Criterion‑related validity of
    sit‑and‑reach tests for estimating hamstring and lumbar extensibility: a meta‑analysis.
    *J Sports Sci Med* 13(1):1–14. PMC3918544 — `mayorga2014sitreach`
17. **[C] Page P (2012).** Current concepts in muscle stretching for exercise and
    rehabilitation. *Int J Sports Phys Ther* 7(1):109–119. — `page2012`
18. **[B] Cook G, Burton L, Hoogenboom B (2006).** Pre‑participation screening: the use of
    fundamental movements as an assessment of function (FMS, Parts 1 & 2). *N Am J Sports Phys
    Ther* 1(2–3). — `cook2006fms`

*Last reviewed: 2026. Re‑verify DOIs and check for newer meta‑analyses periodically.*
