/* Mobility Hub — Analytics & progression engine.
 * Pure computation over MH.store state + the data layer. No DOM here.
 */
(function (root) {
  "use strict";
  var MH = (root.MH = root.MH || {});
  var DOW = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

  /* ---- Scoring ---------------------------------------------------------- */

  // Piecewise-linear interpolation of a measured value onto a 0–100 sub-score.
  function interp(scale, v) {
    var pts = scale.slice().sort(function (a, b) { return a.v - b.v; });
    if (v <= pts[0].v) return clamp(pts[0].s, 0, 100);
    if (v >= pts[pts.length - 1].v) return clamp(pts[pts.length - 1].s, 0, 100);
    for (var i = 0; i < pts.length - 1; i++) {
      if (v >= pts[i].v && v <= pts[i + 1].v) {
        var t = (v - pts[i].v) / (pts[i + 1].v - pts[i].v);
        return clamp(pts[i].s + t * (pts[i + 1].s - pts[i].s), 0, 100);
      }
    }
    return clamp(pts[pts.length - 1].s, 0, 100);
  }

  MH.engine = {
    scoreValue: function (assessment, value) { return Math.round(interp(assessment.scale, value)); },

    scoreBand: function (score) {
      if (score == null) return { label: "No data", tone: "none" };
      if (score >= 85) return { label: "Excellent", tone: "great" };
      if (score >= 70) return { label: "Good", tone: "good" };
      if (score >= 55) return { label: "Fair", tone: "fair" };
      if (score >= 40) return { label: "Limited", tone: "low" };
      return { label: "Needs work", tone: "poor" };
    },

    // Latest record per test+side (keyed "testId|side").
    latestRecords: function () {
      var s = MH.store.get(), map = {};
      s.assessments.forEach(function (r) {
        var k = r.testId + "|" + (r.side || "");
        if (!map[k] || r.ts > map[k].ts) map[k] = r;
      });
      return map;
    },

    // Average latest score for a test across its sides (null if untested).
    testScore: function (testId) {
      var latest = this.latestRecords(), vals = [];
      Object.keys(latest).forEach(function (k) {
        if (latest[k].testId === testId && typeof latest[k].score === "number") vals.push(latest[k].score);
      });
      if (!vals.length) return null;
      return Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length);
    },

    // Score per body region = mean of the tests that map to that region.
    regionScores: function () {
      var self = this, out = {};
      MH.regions.forEach(function (reg) {
        var scores = [];
        MH.assessments.forEach(function (t) {
          if ((t.regions || []).indexOf(reg.id) >= 0) {
            var sc = self.testScore(t.id);
            if (sc != null) scores.push(sc);
          }
        });
        out[reg.id] = scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) : null;
      });
      return out;
    },

    // Overall mobility score = mean of every tested assessment (equal weight).
    mobilityScore: function () {
      var self = this, vals = [];
      MH.assessments.forEach(function (t) {
        var sc = self.testScore(t.id);
        if (sc != null) vals.push(sc);
      });
      if (!vals.length) return null;
      return Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length);
    },

    // Functional "movement quality" from the FMS-flavoured subset.
    movementQuality: function () {
      var self = this, ids = ["deep-squat", "aslr", "shoulder-reach", "sl-balance", "toe-touch"], vals = [];
      ids.forEach(function (id) { var sc = self.testScore(id); if (sc != null) vals.push(sc); });
      if (!vals.length) return null;
      return Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length);
    },

    // Motivational "mobility age" mapped from the overall score.
    mobilityAge: function () {
      var sc = this.mobilityScore();
      if (sc == null) return null;
      var anchors = [ { s: 100, a: 22 }, { s: 85, a: 28 }, { s: 70, a: 36 }, { s: 55, a: 46 }, { s: 40, a: 56 }, { s: 25, a: 66 }, { s: 0, a: 78 } ];
      var pts = anchors.map(function (p) { return { v: p.s, s: p.a }; });
      return Math.round(interp(pts, sc));
    },

    /* ---- Risk / asymmetry (evidence-anchored) --------------------------- */
    riskIndicators: function () {
      var self = this, out = [], rs = this.regionScores(), latest = this.latestRecords();

      MH.regions.forEach(function (reg) {
        var sc = rs[reg.id];
        if (sc == null) return;
        if (sc < 40) out.push({ type: "region", level: "priority", label: reg.name + " needs work", detail: "Score " + sc + "/100 — prioritise this region.", refs: [] });
        else if (sc < 55) out.push({ type: "region", level: "watch", label: reg.name + " is limited", detail: "Score " + sc + "/100 — worth some focused work.", refs: [] });
      });

      // Ankle DF / balance → ankle-sprain risk (best-supported prevention link).
      var awL = latest["ankle-wall|left"], awR = latest["ankle-wall|right"];
      var lowAnkle = [awL, awR].some(function (r) { return r && r.primaryValue < 9; });
      var balC = [latest["sl-balance|left"], latest["sl-balance|right"]].some(function (r) { return r && r.values && r.values.eyesClosed < 8; });
      if (lowAnkle || balC) {
        out.push({ type: "prevention", level: "watch", label: "Ankle stability worth attention",
          detail: "Limited dorsiflexion and/or single-leg balance are modifiable. Balance training is the best-supported way to lower ankle-sprain risk.",
          refs: ["schiftan2015balance", "rivera2017proprio"] });
      }

      // Left/right asymmetry on sided tests.
      MH.assessments.forEach(function (t) {
        if (!t.sided) return;
        var l = latest[t.id + "|left"], r = latest[t.id + "|right"];
        if (l && r && typeof l.score === "number" && typeof r.score === "number") {
          if (Math.abs(l.score - r.score) >= 15) {
            out.push({ type: "asymmetry", level: "watch", label: t.name + " left/right gap",
              detail: "Sides differ by " + Math.abs(l.score - r.score) + " points. Give the weaker side extra volume.", refs: [] });
          }
        }
      });
      return out;
    },

    /* ---- Progression projections (conservative estimates) --------------- */
    // Records for a test+side, chronologically.
    recordsFor: function (testId, side) {
      var s = MH.store.get();
      return s.assessments
        .filter(function (r) { return r.testId === testId && (side == null || r.side === side); })
        .sort(function (a, b) { return a.ts - b.ts; });
    },

    adherence: function () {
      var s = MH.store.get();
      var planned = 0;
      Object.keys(s.profile.days).forEach(function (k) { if (s.profile.days[k] > 0) planned++; });
      if (!planned) planned = 3;
      var since = Date.now() - 28 * 864e5;
      var recent = s.sessions.filter(function (x) { return x.ts >= since; }).length;
      var ratio = recent / (planned * 4);
      return clamp(ratio || 0.6, 0.4, 1.2);
    },

    projection: function (testId, side) {
      var recs = this.recordsFor(testId, side);
      if (!recs.length) return null;
      var a = MH.assessmentById(testId);
      var baseline = recs[0].primaryValue;
      var plateau = a.progression.plateau;
      var adh = this.adherence();
      var effTau = a.progression.tau / adh;             // better adherence → faster approach
      var elapsedWeeks = (Date.now() - recs[0].ts) / (7 * 864e5);

      function model(w) { return plateau + (baseline - plateau) * Math.exp(-w / effTau); }

      var weeks = [0, 1, 2, 4, 6, 8, 12, 16, 20];
      var points = weeks.map(function (w) { return { week: w, value: round1(model(w)), score: Math.round(interp(a.scale, model(w))) }; });
      var milestoneWeeks = [2, 4, 8, 12, 20];
      var milestones = milestoneWeeks.map(function (w) {
        var v = model(w);
        return { week: w, value: round1(v), score: Math.round(interp(a.scale, v)) };
      });
      var actuals = recs.map(function (r) {
        return { weeks: round1((r.ts - recs[0].ts) / (7 * 864e5)), value: r.primaryValue, score: r.score };
      });

      return {
        testId: testId, side: side, unit: a.unit, better: a.better,
        baseline: round1(baseline), current: round1(recs[recs.length - 1].primaryValue),
        plateau: plateau, tau: a.progression.tau, adherence: round2(adh),
        elapsedWeeks: round1(elapsedWeeks), expectedNow: round1(model(elapsedWeeks)),
        points: points, milestones: milestones, actuals: actuals
      };
    },

    /* ---- Streaks & activity -------------------------------------------- */
    sessionDays: function () {
      var set = {};
      MH.store.get().sessions.forEach(function (s) { set[s.dateISO] = (set[s.dateISO] || 0) + (s.minutes || 0); });
      return set;
    },

    streak: function () {
      var days = this.sessionDays();
      var d = new Date(); d.setHours(0, 0, 0, 0);
      if (!days[MH.todayISO(d)]) d.setDate(d.getDate() - 1); // grace: yesterday keeps streak alive today
      var count = 0, guard = 0;
      while (guard++ < 1000) {
        if (days[MH.todayISO(d)]) { count++; d.setDate(d.getDate() - 1); }
        else break;
      }
      return count;
    },

    bestStreak: function () {
      var days = Object.keys(this.sessionDays()).sort();
      if (!days.length) return 0;
      var best = 1, run = 1;
      for (var i = 1; i < days.length; i++) {
        var prev = new Date(days[i - 1]); prev.setDate(prev.getDate() + 1);
        if (MH.todayISO(prev) === days[i]) { run++; best = Math.max(best, run); }
        else run = 1;
      }
      return best;
    },

    startOfWeek: function (ref) {
      var d = ref ? new Date(ref) : new Date();
      d.setHours(0, 0, 0, 0);
      var day = d.getDay();
      d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));  // Monday
      return d;
    },

    weekStats: function () {
      var start = this.startOfWeek().getTime();
      var s = MH.store.get(), mins = 0, cnt = 0, dayset = {}, regionset = {};
      s.sessions.forEach(function (x) {
        if (x.ts >= start) {
          mins += x.minutes || 0; cnt++;
          dayset[x.dateISO] = true;
          (x.regions || []).forEach(function (r) { regionset[r] = true; });
        }
      });
      return { minutes: mins, count: cnt, days: Object.keys(dayset).length, regions: Object.keys(regionset) };
    },

    monthStats: function () {
      var now = new Date(), y = now.getFullYear(), m = now.getMonth();
      var s = MH.store.get(), mins = 0, cnt = 0;
      s.sessions.forEach(function (x) {
        var d = new Date(x.ts);
        if (d.getFullYear() === y && d.getMonth() === m) { mins += x.minutes || 0; cnt++; }
      });
      return { minutes: mins, count: cnt };
    },

    weeklyGoalMinutes: function () {
      var days = MH.store.get().profile.days, sum = 0;
      Object.keys(days).forEach(function (k) { sum += days[k] || 0; });
      return sum;
    },
    plannedDays: function () {
      var days = MH.store.get().profile.days, out = [];
      DOW.forEach(function (k) { if (days[k] > 0) out.push({ day: k, minutes: days[k] }); });
      return out;
    },

    weekProgress: function () {
      var goal = this.weeklyGoalMinutes();
      var w = this.weekStats();
      var plannedDayCount = this.plannedDays().length;
      return {
        doneMinutes: w.minutes, goalMinutes: goal,
        pct: goal ? clamp(Math.round((w.minutes / goal) * 100), 0, 100) : (w.minutes > 0 ? 100 : 0),
        doneDays: w.days, goalDays: plannedDayCount
      };
    },

    // Distribute the weekly minute target across the user's chosen days so the
    // weekly total is always met regardless of which days are selected.
    weeklyPlan: function () {
      var days = MH.store.get().profile.days;
      return DOW.map(function (k) { return { day: k, minutes: days[k] || 0 }; });
    },

    totals: function () {
      var s = MH.store.get(), mins = 0, regionset = {};
      s.sessions.forEach(function (x) { mins += x.minutes || 0; (x.regions || []).forEach(function (r) { regionset[r] = true; }); });
      return { sessions: s.sessions.length, minutes: mins, regions: Object.keys(regionset).length };
    },

    // Last N days for the calendar heatmap.
    calendar: function (numDays) {
      numDays = numDays || 84;
      var days = this.sessionDays(), out = [];
      var d = new Date(); d.setHours(0, 0, 0, 0);
      for (var i = numDays - 1; i >= 0; i--) {
        var dd = new Date(d); dd.setDate(dd.getDate() - i);
        var iso = MH.todayISO(dd);
        out.push({ dateISO: iso, minutes: days[iso] || 0, dow: dd.getDay() });
      }
      return out;
    },

    // Mobility-score trend from assessment history (weekly snapshots would be ideal;
    // here we recompute overall score after each assessment date).
    scoreTrend: function () {
      var s = MH.store.get();
      var byDate = {};
      s.assessments.forEach(function (r) { (byDate[r.dateISO] = byDate[r.dateISO] || []).push(r); });
      var dates = Object.keys(byDate).sort();
      // running "latest" snapshot recomputed cumulatively
      var seen = {}, trend = [];
      var self = this;
      dates.forEach(function (date) {
        byDate[date].forEach(function (r) { seen[r.testId + "|" + (r.side || "")] = r; });
        // compute score across seen
        var perTest = {};
        Object.keys(seen).forEach(function (k) {
          var r = seen[k];
          (perTest[r.testId] = perTest[r.testId] || []).push(r.score);
        });
        var tvals = Object.keys(perTest).map(function (t) {
          var arr = perTest[t]; return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
        });
        if (tvals.length) trend.push({ dateISO: date, score: Math.round(tvals.reduce(function (a, b) { return a + b; }, 0) / tvals.length) });
      });
      return trend;
    },

    /* ---- Achievements --------------------------------------------------- */
    evaluateAchievements: function (opts) {
      opts = opts || {};
      var s = MH.store.get();
      var totals = this.totals();
      var metrics = {
        sessions: totals.sessions,
        minutes: totals.minutes,
        streak: this.streak(),
        score: this.mobilityScore() || 0,
        regions: totals.regions,
        assessments: s.assessments.length,
        reassess: (function () {
          var byKey = {};
          s.assessments.forEach(function (r) { var k = r.testId + "|" + (r.side || ""); byKey[k] = (byKey[k] || 0) + 1; });
          return Object.keys(byKey).some(function (k) { return byKey[k] >= 2; }) ? 1 : 0;
        })(),
        weekgoal: this.weekProgress().pct >= 100 && this.weeklyGoalMinutes() > 0 ? 1 : 0
      };
      var newly = [];
      MH.achievements.forEach(function (a) {
        var val = metrics[a.type];
        var met = typeof val === "number" && val >= a.threshold;
        if (met && !s.achievements[a.id]) {
          if (opts.commit !== false) { MH.store.unlock(a.id); newly.push(a); }
          else newly.push(a);
        }
      });
      return { metrics: metrics, newlyUnlocked: newly };
    },
    achievementState: function () {
      var s = MH.store.get(), res = this.evaluateAchievements({ commit: false });
      return MH.achievements.map(function (a) {
        return { def: a, unlocked: !!s.achievements[a.id], progress: res.metrics[a.type] || 0 };
      });
    }
  };

  function round1(x) { return Math.round(x * 10) / 10; }
  function round2(x) { return Math.round(x * 100) / 100; }
})(typeof window !== "undefined" ? window : this);
