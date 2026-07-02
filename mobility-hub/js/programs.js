/* Mobility Hub — Session generator + program presets
 *
 * Sessions are generated (not hard-coded) so any duration 5–60 min can be built
 * from the exercise DB while respecting evidence-based ORDERING:
 *   - Warm-up intent  → dynamic first, minimal long static holds (protects power output)
 *   - Mobility intent → prep → dynamic mobilize → static/PNF lengthen → stability
 *   - Recovery intent → soft-tissue + longer static holds, calming
 * (See RESEARCH.md §3.2 for why static holds are de-emphasised before activity.)
 */
(function (root) {
  "use strict";
  var MH = (root.MH = root.MH || {});

  MH.DURATIONS = [5, 10, 15, 20, 30, 40, 50, 60];

  var PHASE_PLANS = {
    warmup:   { phases: ["prep", "mobilize", "stabilize"],            weights: [0.25, 0.55, 0.20] },
    mobility: { phases: ["prep", "mobilize", "lengthen", "stabilize"], weights: [0.15, 0.35, 0.30, 0.20] },
    recovery: { phases: ["prep", "lengthen", "mobilize"],             weights: [0.20, 0.60, 0.20] }
  };

  var SETUP_SEC = 15, REST_SEC = 12, SEC_PER_REP = 3;

  // Deterministic RNG so "Today" is stable but different seeds vary.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Estimated seconds for a (possibly scaled) exercise item.
  MH.estSeconds = function (item) {
    var perSet = item.holdSec > 0 ? item.holdSec : (item.reps || 0) * SEC_PER_REP;
    var sideMult = item.bilateral ? 2 : 1;
    var sets = item.sets || 1;
    return SETUP_SEC + sets * (perSet * sideMult + REST_SEC);
  };

  function scaleExercise(e, maxSets, intent) {
    var sets = Math.min(e.sets || 1, maxSets);
    var holdSec = e.holdSec || 0;
    if (intent === "recovery" && e.type === "static" && holdSec > 0) {
      holdSec = Math.round(holdSec * 1.25); // linger a little longer in recovery
    }
    return {
      id: e.id, name: e.name, region: e.region, type: e.type, phase: e.phase,
      primary: e.primary, purpose: e.purpose, rationale: e.rationale, execution: e.execution,
      mistakes: e.mistakes, breathing: e.breathing, difficulty: e.difficulty,
      regression: e.regression, progression: e.progression, targets: e.targets,
      sports: e.sports, goals: e.goals, refs: e.refs, video: e.video,
      sets: sets, reps: e.reps || 0, holdSec: holdSec, bilateral: !!e.bilateral
    };
  }

  /* Core generator. opts:
   *  minutes, intent, focusRegions[], sports[], goals[], difficultyMax, seed
   */
  MH.generateSession = function (opts) {
    opts = opts || {};
    var minutes = opts.minutes || 10;
    var target = minutes * 60;
    var intent = PHASE_PLANS[opts.intent] ? opts.intent : "mobility";
    var focus = opts.focusRegions || [];
    var diffMax = opts.difficultyMax || 3;
    var rng = mulberry32((opts.seed || 1) * 2654435761 % 4294967295 | 0);
    var maxSets = minutes <= 5 ? 1 : (minutes <= 12 ? 2 : 3);

    var plan = PHASE_PLANS[intent];

    function relevance(e) {
      var s = 0;
      if (focus.length === 0) s += 1.5;                       // no focus → everything welcome
      if (focus.indexOf(e.region) >= 0) s += 3;
      if (e.region === "fullbody") s += 1;
      (opts.sports || []).forEach(function (sp) { if ((e.sports || []).indexOf(sp) >= 0) s += 1; });
      (opts.goals || []).forEach(function (g) { if ((e.goals || []).indexOf(g) >= 0) s += 1.5; });
      s += rng() * 0.9;                                       // jitter for variety
      return s;
    }

    var pool = MH.exercises.filter(function (e) { return e.difficulty <= diffMax; });
    var chosen = [], used = {}, totalSec = 0;
    var MAX_ITEMS = 40;

    // Pass 1 — fill each phase to its time budget.
    plan.phases.forEach(function (phase, idx) {
      var budget = target * plan.weights[idx];
      var cands = pool.filter(function (e) { return e.phase === phase && !used[e.id]; });
      cands.sort(function (a, b) { return relevance(b) - relevance(a); });
      var spent = 0;
      for (var i = 0; i < cands.length && chosen.length < MAX_ITEMS; i++) {
        if (spent >= budget && chosen.length > 0) break;
        var item = scaleExercise(cands[i], maxSets, intent);
        var sec = MH.estSeconds(item);
        if (totalSec + sec > target * 1.18 && chosen.length > 0) continue;
        chosen.push(item); used[cands[i].id] = true; spent += sec; totalSec += sec;
        if (totalSec >= target) break;
      }
    });

    // Pass 2 — top up with unused, relevant exercises (mobilize/lengthen first).
    var topUpOrder = ["mobilize", "lengthen", "stabilize", "prep"];
    var guard = 0;
    while (totalSec < target * 0.9 && chosen.length < MAX_ITEMS && guard++ < 200) {
      var added = false;
      for (var p = 0; p < topUpOrder.length; p++) {
        var cands2 = pool.filter(function (e) { return e.phase === topUpOrder[p] && !used[e.id]; });
        if (!cands2.length) continue;
        cands2.sort(function (a, b) { return relevance(b) - relevance(a); });
        var item2 = scaleExercise(cands2[0], maxSets, intent);
        var sec2 = MH.estSeconds(item2);
        if (totalSec + sec2 > target * 1.18 && chosen.length > 0) continue;
        chosen.push(item2); used[cands2[0].id] = true; totalSec += sec2; added = true;
        break;
      }
      if (!added) break;
    }

    // Pass 3 — long sessions / narrow focus: allow a second round (repeats) to reach time.
    guard = 0;
    while (totalSec < target * 0.85 && chosen.length < MAX_ITEMS && guard++ < 200) {
      var repeatCands = pool.slice().sort(function (a, b) { return relevance(b) - relevance(a); });
      var pick = null;
      for (var r = 0; r < repeatCands.length; r++) {
        // avoid immediate back-to-back duplicate
        if (chosen.length && chosen[chosen.length - 1].id === repeatCands[r].id) continue;
        pick = repeatCands[r]; break;
      }
      if (!pick) break;
      var item3 = scaleExercise(pick, maxSets, intent);
      item3.repeat = true;
      totalSec += MH.estSeconds(item3);
      chosen.push(item3);
    }

    // Order the final list by canonical phase order for a clean flow.
    var phaseRank = { prep: 0, mobilize: 1, lengthen: 2, stabilize: 3 };
    chosen.sort(function (a, b) { return (phaseRank[a.phase] || 1) - (phaseRank[b.phase] || 1); });

    return {
      minutes: minutes, intent: intent, focusRegions: focus,
      exercises: chosen, totalSec: totalSec,
      estMinutes: Math.round(totalSec / 60)
    };
  };

  /* Program presets shown in the Train tab. Duration is chosen by the user. */
  MH.programs = [
    { id: "fullbody-flow", name: "Full Body Flow", emoji: "🌀", intent: "mobility", focusRegions: [],
      blurb: "Balanced head-to-toe mobility. A great daily default.", tags: ["daily", "balanced"] },
    { id: "squat-prep", name: "Deep Squat Prep", emoji: "🏋️", intent: "mobility",
      focusRegions: ["ankles", "hips", "adductors", "thoracic"], goals: ["deep-squat"],
      blurb: "Open ankles, hips and T-spine to sit deeper, pain-free.", tags: ["squat", "lower"] },
    { id: "hips-ankles", name: "Hips & Ankles", emoji: "🦵", intent: "mobility",
      focusRegions: ["hips", "ankles", "adductors", "glutes"],
      blurb: "The two joints that limit most lower-body movement.", tags: ["lower"] },
    { id: "desk-reset", name: "Spine & Shoulders (Desk Reset)", emoji: "💺", intent: "mobility",
      focusRegions: ["thoracic", "shoulders", "scapula", "neck", "lowback"],
      blurb: "Undo hours of sitting: extend, rotate, open the chest.", tags: ["posture", "upper", "desk"] },
    { id: "athletic-warmup", name: "Athletic Warm-Up", emoji: "🔥", intent: "warmup",
      focusRegions: ["hips", "ankles", "thoracic", "fullbody"],
      blurb: "Dynamic prep before sport or lifting — keeps power intact.", tags: ["warmup", "dynamic"] },
    { id: "evening-winddown", name: "Evening Wind-Down", emoji: "🌙", intent: "recovery",
      focusRegions: ["hamstrings", "hips", "thoracic", "shoulders"],
      blurb: "Longer, calmer holds to decompress and improve ROM.", tags: ["recovery", "evening"] },
    { id: "posterior-chain", name: "Posterior Chain", emoji: "⛓️", intent: "mobility",
      focusRegions: ["hamstrings", "glutes", "lowback", "ankles"],
      blurb: "Hamstrings, glutes and low back for hinge and stride.", tags: ["lower", "posterior"] },
    { id: "balance-stability", name: "Balance & Stability", emoji: "🧘", intent: "mobility",
      focusRegions: ["fullbody", "ankles", "hips"],
      blurb: "Single-leg control — the best-supported injury-prevention work.", tags: ["balance", "prevention"] }
  ];
  MH.programById = function (id) {
    for (var i = 0; i < MH.programs.length; i++) if (MH.programs[i].id === id) return MH.programs[i];
    return null;
  };
})(typeof window !== "undefined" ? window : this);
