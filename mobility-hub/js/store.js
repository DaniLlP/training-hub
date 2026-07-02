/* Mobility Hub — Local persistence (no backend).
 * Everything lives in localStorage under a single versioned key.
 * Emits 'change' via MH.store.subscribe so views can re-render.
 */
(function (root) {
  "use strict";
  var MH = (root.MH = root.MH || {});
  var KEY = "mobilityHub.v1";

  function todayISO(d) {
    d = d || new Date();
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var day = ("0" + d.getDate()).slice(-2);
    return d.getFullYear() + "-" + m + "-" + day;
  }
  MH.todayISO = todayISO;

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  MH.uid = uid;

  function defaultState() {
    return {
      version: 1,
      createdAt: new Date().toISOString(),
      profile: {
        name: "",
        onboarded: false,
        sports: [],
        goals: [],
        difficulty: 2, // 1 beginner, 2 intermediate, 3 advanced
        units: "cm",
        // Weekly planner: day -> minutes the user wants that day (0/absent = rest).
        days: { mon: 10, tue: 0, wed: 15, thu: 0, fri: 10, sat: 0, sun: 20 },
      },
      sessions: [], // {id, dateISO, ts, programId, name, minutes, exerciseIds[], regions[]}
      assessments: [], // {id, testId, side, values{}, primaryValue, score, dateISO, ts}
      achievements: {}, // id -> unlockedISO
      videos: {}, // exerciseId -> user-attached YouTube video id
      prefs: { reduceMotion: false, sound: true },
      lastActive: null,
    };
  }

  var listeners = [];
  var state = null;

  function load() {
    try {
      var raw = root.localStorage && root.localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        state = mergeDefaults(parsed);
      } else {
        state = defaultState();
      }
    } catch (e) {
      state = defaultState();
    }
    return state;
  }

  // Fill in any keys added in later versions without wiping user data.
  function mergeDefaults(saved) {
    var base = defaultState();
    var out = Object.assign({}, base, saved);
    out.profile = Object.assign({}, base.profile, saved.profile || {});
    out.profile.days = Object.assign(
      {},
      base.profile.days,
      (saved.profile && saved.profile.days) || {},
    );
    out.prefs = Object.assign({}, base.prefs, saved.prefs || {});
    out.sessions = Array.isArray(saved.sessions) ? saved.sessions : [];
    out.assessments = Array.isArray(saved.assessments) ? saved.assessments : [];
    out.achievements = saved.achievements || {};
    out.videos = saved.videos || {};
    return out;
  }

  function persist() {
    try {
      if (root.localStorage)
        root.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* private mode / quota — app still works in-memory */
    }
  }

  function emit() {
    for (var i = 0; i < listeners.length; i++) {
      try {
        listeners[i](state);
      } catch (e) {}
    }
  }

  MH.store = {
    init: function () {
      if (!state) load();
      return state;
    },
    get: function () {
      return state || load();
    },
    subscribe: function (fn) {
      listeners.push(fn);
      return function () {
        listeners = listeners.filter(function (l) {
          return l !== fn;
        });
      };
    },

    save: function () {
      persist();
      emit();
    },

    setProfile: function (patch) {
      state.profile = Object.assign({}, state.profile, patch);
      persist();
      emit();
    },
    setDays: function (days) {
      state.profile.days = Object.assign({}, state.profile.days, days);
      persist();
      emit();
    },
    setPref: function (key, val) {
      state.prefs[key] = val;
      persist();
      emit();
    },

    addSession: function (session) {
      session.id = session.id || uid();
      session.dateISO = session.dateISO || todayISO();
      session.ts = session.ts || Date.now();
      state.sessions.push(session);
      state.lastActive = session.ts;
      persist();
      emit();
      return session;
    },
    removeSession: function (id) {
      state.sessions = state.sessions.filter(function (s) {
        return s.id !== id;
      });
      persist();
      emit();
    },

    addAssessment: function (rec) {
      rec.id = rec.id || uid();
      rec.dateISO = rec.dateISO || todayISO();
      rec.ts = rec.ts || Date.now();
      state.assessments.push(rec);
      persist();
      emit();
      return rec;
    },
    removeAssessment: function (id) {
      state.assessments = state.assessments.filter(function (a) {
        return a.id !== id;
      });
      persist();
      emit();
    },

    unlock: function (achId) {
      if (!state.achievements[achId]) {
        state.achievements[achId] = new Date().toISOString();
        persist();
        emit();
        return true;
      }
      return false;
    },

    setVideo: function (exId, videoId, start) {
      state.videos[exId] = { id: videoId, s: start || 0, e: 0 };
      persist();
    },
    clearVideo: function (exId) {
      delete state.videos[exId];
      persist();
    },

    exportJSON: function () {
      return JSON.stringify(state, null, 2);
    },
    importJSON: function (json) {
      try {
        var parsed = JSON.parse(json);
        state = mergeDefaults(parsed);
        persist();
        emit();
        return true;
      } catch (e) {
        return false;
      }
    },
    reset: function () {
      state = defaultState();
      persist();
      emit();
    },
  };

  MH.store.init();
})(typeof window !== "undefined" ? window : this);
