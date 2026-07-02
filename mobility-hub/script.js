/* Mobility Hub — App controller & views.
 * Loaded last. Depends on: references, exercises, catalog, assessments,
 * programs, store, engine, charts (all attach to window.MH).
 */
(function (root) {
  "use strict";
  var MH = root.MH || {};
  var store = MH.store,
    engine = MH.engine;

  /* ================================================================== ICONS */
  var ICONS = {
    today:
      '<path d="M3 12h2M12 3v2M19 12h2M5.6 5.6l1.4 1.4M18.4 5.6L17 7M12 8a4 4 0 100 8 4 4 0 000-8z"/><path d="M4 20h16"/>',
    train:
      '<path d="M6.5 6.5l11 11M4 9l2-2 3 3-2 2zM15 18l2-2 3 3-2 2zM8 4l2 2M14 16l2 2M4 14l2 2M16 4l2 2"/>',
    assess:
      '<path d="M4 4h16v6H4zM4 14h16v6H4z"/><path d="M8 4v3M12 4v4M16 4v3M8 14v3M12 14v4M16 14v3"/>',
    progress: '<path d="M4 19V5M4 19h16"/><path d="M8 15l3-4 3 2 4-6"/>',
    plan: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    library:
      '<path d="M4 5a2 2 0 012-2h5v18H6a2 2 0 01-2-2zM20 5a2 2 0 00-2-2h-5v18h5a2 2 0 002-2z"/>',
    back: '<path d="M15 18l-6-6 6-6"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    pause: '<path d="M8 5h3v14H8zM13 5h3v14h-3z"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    flame:
      '<path d="M12 3s5 4 5 9a5 5 0 01-10 0c0-2 1-3 1-3s0 2 2 2c1.5 0 1-3-1-5 2 0 3-2 3-3z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>',
    trophy:
      '<path d="M8 4h8v4a4 4 0 01-8 0zM6 4H4v2a3 3 0 003 3M18 4h2v2a3 3 0 01-3 3M9 18h6M10 14h4v4h-4z"/>',
    target:
      '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    share: '<path d="M4 12v8h16v-8M12 3v13M8 7l4-4 4 4"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    video:
      '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
    book: '<path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2zM8 3v14"/>',
    dot: '<circle cx="12" cy="12" r="4"/>',
    warn: '<path d="M12 3l9 16H3zM12 10v4M12 17h.01"/>',
    rotate:
      '<path d="M3 12a9 9 0 0115.5-6.2L21 8"/><path d="M21 4v4h-4"/><path d="M21 12a9 9 0 01-15.5 6.2L3 16"/><path d="M3 20v-4h4"/>',
    body: '<circle cx="12" cy="4.5" r="2"/><path d="M5 9l7-2 7 2M12 7v7M9 21l3-7 3 7"/>',
  };
  function icon(name, size) {
    size = size || 24;
    return (
      '<svg viewBox="0 0 24 24" width="' +
      size +
      '" height="' +
      size +
      '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || "") +
      "</svg>"
    );
  }

  /* ============================================================ DOM HELPERS */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    for (var k in attrs) {
      if (!attrs.hasOwnProperty(k)) continue;
      var v = attrs[k];
      if (v == null) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k === "text") el.textContent = v;
      else if (k === "style") el.setAttribute("style", v);
      else if (k.slice(0, 2) === "on" && typeof v === "function")
        el.addEventListener(k.slice(2), v);
      else if (k.slice(0, 5) === "data-") el.setAttribute(k, v);
      else if (k === "for") el.htmlFor = v;
      else if (v === true) el.setAttribute(k, "");
      else if (v === false) {
        /* skip */
      } else el.setAttribute(k, v);
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) {
      child.forEach(function (c) {
        append(el, c);
      });
      return;
    }
    if (child.nodeType) {
      el.appendChild(child);
      return;
    }
    var s = String(child);
    if (s.charAt(0) === "<") {
      // markup string (e.g. icon() SVG) → parse, don't show as text
      var tpl = document.createElement("template");
      tpl.innerHTML = s;
      el.appendChild(tpl.content);
      return;
    }
    el.appendChild(document.createTextNode(s));
  }
  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function frag() {
    return document.createDocumentFragment();
  }

  /* ============================================================ FORMATTING */
  function fmtNum(n) {
    return (Math.round(n * 10) / 10).toString();
  }
  function pill(text, cls) {
    return h("span", { class: "pill " + (cls || "") }, text);
  }

  function evidenceBadge(level) {
    var meta = MH.EVIDENCE[level] || { label: level };
    return h(
      "span",
      { class: "ev-badge ev-" + level, title: meta.desc },
      level + " · " + meta.label,
    );
  }

  var DIFF_LABEL = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" };
  var DAY_LABELS = [
    ["mon", "Mon"],
    ["tue", "Tue"],
    ["wed", "Wed"],
    ["thu", "Thu"],
    ["fri", "Fri"],
    ["sat", "Sat"],
    ["sun", "Sun"],
  ];

  /* =============================================================== OVERLAYS */
  function toast(msg, opts) {
    opts = opts || {};
    var rootEl = $("#toast-root");
    var t = h(
      "div",
      { class: "toast " + (opts.tone || "") },
      opts.icon
        ? h("span", { class: "toast-ic", html: icon(opts.icon, 20) })
        : null,
      h("span", {}, msg),
    );
    rootEl.appendChild(t);
    requestAnimationFrame(function () {
      t.classList.add("in");
    });
    setTimeout(function () {
      t.classList.remove("in");
      setTimeout(function () {
        t.remove();
      }, 300);
    }, opts.duration || 2600);
  }

  function openSheet(title, contentNode, opts) {
    opts = opts || {};
    closeSheet();
    var sheetRoot = $("#sheet-root");
    var backdrop = h("div", {
      class: "sheet-backdrop",
      onclick: function (e) {
        if (e.target === backdrop) closeSheet();
      },
    });
    var sheet = h(
      "div",
      { class: "sheet" },
      h("div", { class: "sheet-grip" }),
      h(
        "div",
        { class: "sheet-head" },
        h("h3", {}, title),
        h("button", {
          class: "icon-btn",
          "aria-label": "Close",
          onclick: closeSheet,
          html: icon("close", 22),
        }),
      ),
      h("div", { class: "sheet-body" }, contentNode),
    );
    backdrop.appendChild(sheet);
    sheetRoot.appendChild(backdrop);
    requestAnimationFrame(function () {
      backdrop.classList.add("in");
    });
    return backdrop;
  }
  function closeSheet() {
    var sr = $("#sheet-root");
    if (!sr) return;
    var b = sr.querySelector(".sheet-backdrop");
    if (b) {
      b.classList.remove("in");
      setTimeout(function () {
        b.remove();
      }, 260);
    }
  }

  function refSheet(refId) {
    var r = MH.references[refId];
    if (!r) return;
    var body = h(
      "div",
      {},
      h(
        "div",
        { class: "ref-meta" },
        evidenceBadge(r.level),
        h("span", { class: "muted" }, r.journal + " · " + r.year),
      ),
      h("h4", { class: "ref-title" }, r.title),
      h("p", { class: "muted" }, r.authors),
      h("p", {}, r.summary),
      r.doi
        ? h(
            "a",
            { class: "link", href: r.url, target: "_blank", rel: "noopener" },
            "DOI: " + r.doi,
          )
        : h(
            "a",
            { class: "link", href: r.url, target: "_blank", rel: "noopener" },
            r.pmid ? "PubMed " + r.pmid : "View source",
          ),
    );
    openSheet("Reference", body);
  }
  function refChips(refIds) {
    if (!refIds || !refIds.length) return null;
    var wrap = h("div", { class: "ref-chips" });
    refIds.forEach(function (id) {
      var r = MH.references[id];
      if (!r) return;
      wrap.appendChild(
        h(
          "button",
          {
            class: "ref-chip ev-dot-" + r.level,
            onclick: function () {
              refSheet(id);
            },
          },
          h("span", { class: "ref-chip-ev" }, r.level),
          r.authors.split(",")[0] + " " + r.year,
        ),
      );
    });
    return wrap;
  }

  /* ================================================================ ROUTER */
  var TABS = [
    { id: "today", label: "Today", icon: "today" },
    { id: "train", label: "Train", icon: "train" },
    { id: "assess", label: "Assess", icon: "assess" },
    { id: "progress", label: "Progress", icon: "progress" },
    { id: "plan", label: "Plan", icon: "plan" },
  ];

  var App = {
    player: null, // active session player state
    suppressRerender: false,
    lastFocus: {},

    boot: function () {
      store.init();
      // reduced motion pref
      applyMotionPref();
      window.addEventListener("hashchange", function () {
        App.render();
      });
      var reRenderOnChange = function () {
        if (App.suppressRerender) return;
        var r = parseRoute();
        // passive views recompute on data change
        if (
          ["today", "progress", "assess", "plan", "library"].indexOf(r.tab) >=
            0 &&
          !r.param
        )
          App.render();
      };
      store.subscribe(reRenderOnChange);
      window.addEventListener(
        "resize",
        debounce(function () {
          App.redrawCharts();
        }, 200),
      );
      if (!location.hash) location.hash = "#today";
      App.render();
      registerServiceWorker();
    },

    render: function () {
      var s = store.get();
      if (!s.profile.onboarded) {
        renderOnboarding();
        return;
      }
      var route = parseRoute();
      var view = $("#view");
      clear(view);
      view.scrollTop = 0;
      renderTopbar(route);
      renderTabbar(route);
      var builder = VIEWS[route.tab] || VIEWS.today;
      var node = builder(route);
      view.appendChild(node);
      App.afterRender();
      document.body.setAttribute("data-tab", route.tab);
    },

    // Post-layout hook: draw canvases after they're in the DOM.
    afterRender: function () {
      requestAnimationFrame(function () {
        App.redrawCharts();
      });
    },

    redrawCharts: function () {
      var pending = document.querySelectorAll("canvas[data-chart]");
      pending.forEach(function (cv) {
        var fn = cv.__draw;
        if (typeof fn === "function") fn();
      });
    },
  };
  MH.App = App;

  function parseRoute() {
    var hash = (location.hash || "#today").replace(/^#/, "");
    var parts = hash.split("/");
    return {
      tab: parts[0] || "today",
      sub: parts[1] || null,
      param: parts[2] || parts[1] || null,
      raw: hash,
      parts: parts,
    };
  }
  function go(hash) {
    location.hash = hash;
  }
  MH.go = go;

  function renderTopbar(route) {
    var bar = $("#topbar");
    clear(bar);
    var titles = {
      today: "Today",
      train: "Train",
      assess: "Assessment",
      progress: "Progress",
      plan: "Plan",
      library: "Library",
    };
    var isSub = route.parts.length > 1;
    var left;
    if (isSub) {
      left = h("button", {
        class: "icon-btn",
        "aria-label": "Back",
        html: icon("back", 24),
        onclick: function () {
          history.length > 1 ? history.back() : go("#" + route.tab);
        },
      });
    } else {
      left = h(
        "div",
        { class: "brand" },
        h("span", { class: "brand-dot" }),
        "Mobility Hub",
      );
    }
    var title = h(
      "h1",
      { class: "topbar-title" },
      titles[route.tab] || "Mobility Hub",
    );
    var libBtn = h("button", {
      class: "icon-btn",
      "aria-label": "Library",
      html: icon("library", 22),
      onclick: function () {
        go("#library");
      },
    });
    bar.appendChild(
      h(
        "div",
        { class: "topbar-inner" },
        left,
        isSub ? title : h("span"),
        libBtn,
      ),
    );
  }

  function renderTabbar(route) {
    var nav = $("#tabbar");
    clear(nav);
    TABS.forEach(function (t) {
      var active = route.tab === t.id;
      nav.appendChild(
        h(
          "button",
          {
            class: "tab" + (active ? " active" : ""),
            "aria-label": t.label,
            "aria-current": active ? "page" : null,
            onclick: function () {
              go("#" + t.id);
            },
          },
          h("span", { class: "tab-ic", html: icon(t.icon, 24) }),
          h("span", { class: "tab-lbl" }, t.label),
        ),
      );
    });
  }

  /* ============================================================= UTILITIES */
  function debounce(fn, ms) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }
  function applyMotionPref() {
    var s = store.get();
    document.body.classList.toggle("reduce-motion", !!s.prefs.reduceMotion);
  }
  function greeting() {
    var hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  }
  function bandTag(score) {
    var b = engine.scoreBand(score);
    return h("span", { class: "band band-" + b.tone }, b.label);
  }

  // Parse a YouTube video id + optional start time (secs) from a link/raw id.
  function parseYouTube(input) {
    if (!input) return null;
    input = String(input).trim();
    var id = null;
    if (/^[\w-]{11}$/.test(input)) id = input;
    else {
      var m = input.match(
        /(?:v=|\/embed\/|youtu\.be\/|\/shorts\/|\/v\/|\/live\/)([\w-]{11})/,
      );
      id = m ? m[1] : null;
    }
    if (!id) return null;
    var s = 0,
      mt;
    if ((mt = input.match(/[?&#]t=(?:(\d+)m)?(\d+)s/)))
      s = parseInt(mt[1] || 0, 10) * 60 + parseInt(mt[2], 10);
    else if ((mt = input.match(/[?&#](?:t|start)=(\d+)\b/)))
      s = parseInt(mt[1], 10);
    return { id: id, s: s || 0 };
  }

  // Inline demo-video panel. Streams via YouTube's official privacy-enhanced
  // player (no re-hosting). Resolution order: user-attached > curated > none.
  function videoPanel(ex) {
    var wrap = h("div", { class: "video-wrap" });

    function resolve() {
      var uid = store.get().videos ? store.get().videos[ex.id] : null;
      if (uid) {
        if (typeof uid === "string")
          return { id: uid, s: 0, e: 0, custom: true };
        return { id: uid.id, s: uid.s || 0, e: uid.e || 0, custom: true };
      }
      var cur = MH.videos ? MH.videos[ex.id] : null;
      return cur
        ? { id: cur.id, by: cur.by, t: cur.t, s: cur.s || 0, e: cur.e || 0 }
        : null;
    }

    function attach() {
      var input = h("input", {
        type: "text",
        class: "video-input",
        placeholder: "Paste a YouTube link or video ID",
        autocapitalize: "off",
        autocorrect: "off",
        spellcheck: "false",
      });
      var err = h("div", { class: "video-err small" });
      function save() {
        var p = parseYouTube(input.value);
        if (!p) {
          err.textContent = "Couldn't find a valid YouTube ID in that link.";
          return;
        }
        store.setVideo(ex.id, p.id, p.s);
        closeSheet();
        render();
        toast("Video attached", { icon: "check", tone: "great" });
      }
      openSheet(
        "Attach a demo video",
        h(
          "div",
          {},
          h(
            "p",
            { class: "muted small" },
            "Paste any YouTube link (watch, youtu.be, or Shorts) or an 11-character video ID. Tip: a link with a start time (…&t=90) trims where it begins. It streams in-app (muted) and is saved on this device.",
          ),
          input,
          err,
          h(
            "div",
            { class: "sheet-actions" },
            h(
              "button",
              { class: "btn ghost wide", onclick: closeSheet },
              "Cancel",
            ),
            h(
              "button",
              { class: "btn primary wide", onclick: save },
              "Save video",
            ),
          ),
        ),
      );
    }

    function render() {
      clear(wrap);
      var v = resolve();
      if (!v) {
        wrap.appendChild(
          h(
            "div",
            { class: "video-stage empty" },
            h(
              "div",
              { class: "video-empty" },
              icon("video", 34),
              h("p", {}, "No demo attached"),
              h(
                "div",
                { class: "video-empty-actions" },
                h(
                  "button",
                  { class: "btn ghost sm", onclick: attach },
                  icon("plus", 16),
                  "Add a video",
                ),
                h(
                  "a",
                  {
                    class: "btn ghost sm",
                    href: MH.videoUrl(ex.video),
                    target: "_blank",
                    rel: "noopener",
                  },
                  "Find on " + ex.video.channel,
                ),
              ),
            ),
          ),
        );
        return;
      }
      var params = [
        "autoplay=1",
        "mute=1",
        "loop=1",
        "playlist=" + v.id,
        "playsinline=1",
        "controls=1",
        "rel=0",
        "modestbranding=1",
      ];
      if (v.s) params.push("start=" + v.s);
      if (v.e) params.push("end=" + v.e);
      var stage = h(
        "div",
        { class: "video-stage playing" },
        h("iframe", {
          class: "video-frame",
          src:
            "https://www.youtube-nocookie.com/embed/" +
            v.id +
            "?" +
            params.join("&"),
          title: "Demo video for " + ex.name,
          allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
          allowfullscreen: true,
          frameborder: "0",
          loading: "lazy",
        }),
      );
      wrap.appendChild(stage);
      wrap.appendChild(
        h(
          "div",
          { class: "video-meta" },
          h(
            "span",
            { class: "video-credit muted small" },
            (v.custom ? "Your video" : "Demo: " + (v.by || "YouTube")) +
              " · muted (use player controls for sound)",
          ),
          h(
            "div",
            { class: "video-actions" },
            h(
              "a",
              {
                class: "link",
                href: "https://youtu.be/" + v.id + (v.s ? "?t=" + v.s : ""),
                target: "_blank",
                rel: "noopener",
              },
              "Full video",
            ),
            h("button", { class: "link", onclick: attach }, "Change"),
            v.custom
              ? h(
                  "button",
                  {
                    class: "link",
                    onclick: function () {
                      store.clearVideo(ex.id);
                      render();
                    },
                  },
                  "Reset",
                )
              : null,
          ),
        ),
      );
    }

    render();
    return wrap;
  }

  MH._ui = {
    h: h,
    append: append,
    clear: clear,
    $: $,
    frag: frag,
    icon: icon,
    toast: toast,
    openSheet: openSheet,
    closeSheet: closeSheet,
    refChips: refChips,
    refSheet: refSheet,
    evidenceBadge: evidenceBadge,
    pill: pill,
    bandTag: bandTag,
    go: go,
    greeting: greeting,
    fmtNum: fmtNum,
    DIFF_LABEL: DIFF_LABEL,
    DAY_LABELS: DAY_LABELS,
    App: App,
    debounce: debounce,
    applyMotionPref: applyMotionPref,
    videoPanel: videoPanel,
  };
  MH.VIEWS = {}; // views registered by appended sections
  var VIEWS = MH.VIEWS;

  /* =========================================================== ONBOARDING */
  function renderOnboarding() {
    var overlay = $("#onboard-root");
    clear(overlay);
    overlay.style.display = "block";
    var step = { i: 0 };
    var draft = {
      sports: [],
      goals: [],
      difficulty: 2,
      days: { mon: 10, tue: 0, wed: 15, thu: 0, fri: 10, sat: 0, sun: 20 },
    };

    function stepWelcome() {
      return h(
        "div",
        { class: "ob-step" },
        h(
          "div",
          { class: "ob-hero" },
          h("span", { class: "brand-dot big" }),
          h("h1", {}, "Mobility Hub"),
          h(
            "p",
            { class: "muted" },
            "Evidence-based mobility, built like your favourite fitness app. Train smarter, measure progress, move better.",
          ),
        ),
        h(
          "div",
          { class: "ob-points" },
          obPoint(
            "assess",
            "Assess",
            "FMS-style tests with real reliability data",
          ),
          obPoint(
            "train",
            "Train",
            "Science-ordered sessions from 5 to 60 minutes",
          ),
          obPoint(
            "progress",
            "Track",
            "Rings, radar and conservative projections",
          ),
        ),
        h(
          "div",
          { class: "disclaimer" },
          icon("info", 18),
          h(
            "span",
            {},
            "Educational tool, not medical advice. If you have pain, injury or a medical condition, consult a qualified clinician.",
          ),
        ),
        obNav(null, "Get started"),
      );
    }
    function stepSports() {
      var grid = h("div", { class: "chip-grid" });
      MH.sports.forEach(function (sp) {
        var chip = h(
          "button",
          {
            class: "select-chip",
            onclick: function () {
              toggle(draft.sports, sp.id);
              chip.classList.toggle("on");
            },
          },
          h("span", { class: "chip-emoji" }, sp.emoji),
          sp.name,
        );
        if (draft.sports.indexOf(sp.id) >= 0) chip.classList.add("on");
        grid.appendChild(chip);
      });
      return h(
        "div",
        { class: "ob-step" },
        h("h2", {}, "What do you train for?"),
        h(
          "p",
          { class: "muted" },
          "Pick any that apply — we'll prioritise the right joints. You can skip this.",
        ),
        grid,
        obNav("Back", "Continue"),
      );
    }
    function stepGoals() {
      var grid = h("div", { class: "chip-grid" });
      MH.goals.forEach(function (g) {
        var chip = h(
          "button",
          {
            class: "select-chip",
            onclick: function () {
              toggle(draft.goals, g.id);
              chip.classList.toggle("on");
            },
          },
          g.name,
        );
        if (draft.goals.indexOf(g.id) >= 0) chip.classList.add("on");
        grid.appendChild(chip);
      });
      return h(
        "div",
        { class: "ob-step" },
        h("h2", {}, "Your goals"),
        h(
          "p",
          { class: "muted" },
          "Choose what matters most. Goals steer which drills we surface.",
        ),
        grid,
        obNav("Back", "Continue"),
      );
    }
    function stepSchedule() {
      var wrap = h("div", { class: "day-planner" });
      DAY_LABELS.forEach(function (d) {
        wrap.appendChild(dayRow(d[0], d[1], draft.days));
      });
      var diff = h("div", { class: "seg" });
      [1, 2, 3].forEach(function (lvl) {
        var b = h(
          "button",
          {
            class: "seg-btn" + (draft.difficulty === lvl ? " on" : ""),
            onclick: function () {
              draft.difficulty = lvl;
              diff.querySelectorAll(".seg-btn").forEach(function (x) {
                x.classList.remove("on");
              });
              b.classList.add("on");
            },
          },
          DIFF_LABEL[lvl],
        );
        diff.appendChild(b);
      });
      return h(
        "div",
        { class: "ob-step" },
        h("h2", {}, "Weekly schedule"),
        h(
          "p",
          { class: "muted" },
          "Set minutes for the days you'll train. Any combination works — the planner keeps your weekly total on track.",
        ),
        wrap,
        h("h3", { class: "mt" }, "Experience level"),
        diff,
        obNav("Back", "Start moving"),
      );
    }

    var STEPS = [stepWelcome, stepSports, stepGoals, stepSchedule];

    function obPoint(ic, title, desc) {
      return h(
        "div",
        { class: "ob-point" },
        h("span", { class: "ob-point-ic", html: icon(ic, 22) }),
        h(
          "div",
          {},
          h("strong", {}, title),
          h("div", { class: "muted small" }, desc),
        ),
      );
    }
    function dayRow(key, label, days) {
      var val = h("span", { class: "day-min" }, (days[key] || 0) + "m");
      function set(v) {
        days[key] = Math.max(0, Math.min(90, v));
        val.textContent = days[key] || 0 ? days[key] + "m" : "Rest";
        row.classList.toggle("rest", !days[key]);
      }
      var row = h(
        "div",
        { class: "day-row" + (days[key] ? "" : " rest") },
        h("span", { class: "day-name" }, label),
        h(
          "div",
          { class: "stepper" },
          h("button", {
            class: "step-btn",
            "aria-label": "less",
            html: icon("minus", 18),
            onclick: function () {
              set((days[key] || 0) - 5);
            },
          }),
          val,
          h("button", {
            class: "step-btn",
            "aria-label": "more",
            html: icon("plus", 18),
            onclick: function () {
              set((days[key] || 0) + 5);
            },
          }),
        ),
      );
      return row;
    }
    function toggle(arr, id) {
      var i = arr.indexOf(id);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(id);
    }
    function obNav(backLabel, nextLabel) {
      return h(
        "div",
        { class: "ob-nav" },
        backLabel
          ? h(
              "button",
              {
                class: "btn ghost",
                onclick: function () {
                  step.i--;
                  draw();
                },
              },
              backLabel,
            )
          : h("span"),
        h(
          "div",
          { class: "ob-dots" },
          STEPS.map(function (_, idx) {
            return h("span", {
              class: "ob-dot" + (idx === step.i ? " on" : ""),
            });
          }),
        ),
        h("button", { class: "btn primary", onclick: next }, nextLabel),
      );
    }
    function next() {
      if (step.i < STEPS.length - 1) {
        step.i++;
        draw();
      } else {
        store.setProfile({
          onboarded: true,
          sports: draft.sports,
          goals: draft.goals,
          difficulty: draft.difficulty,
          days: draft.days,
        });
        overlay.style.display = "none";
        clear(overlay);
        go("#today");
        App.render();
        toast("Welcome to Mobility Hub", { icon: "check", tone: "great" });
      }
    }
    function draw() {
      clear(overlay);
      overlay.appendChild(
        h("div", { class: "onboard-scroll" }, STEPS[step.i]()),
      );
    }
    draw();
  }

  /* Boot */
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", App.boot);
  else App.boot();

  /* ---- Service worker (PWA) ---- */
  function registerServiceWorker() {
    if (
      "serviceWorker" in navigator &&
      location.protocol.indexOf("http") === 0
    ) {
      navigator.serviceWorker
        .register("service-worker.js")
        .catch(function () {});
    }
  }
})(typeof window !== "undefined" ? window : this);

/* ================================================================ VIEWS: TODAY + TRAIN + PLAYER */
(function (root) {
  "use strict";
  var MH = root.MH,
    U = MH._ui,
    engine = MH.engine,
    store = MH.store,
    charts = MH.charts;
  var h = U.h,
    icon = U.icon,
    go = U.go,
    toast = U.toast,
    App = U.App;
  var VIEWS = MH.VIEWS;

  var DOWKEY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  function todayKey() {
    return DOWKEY[new Date().getDay()];
  }

  function card(cls) {
    return h("section", { class: "card " + (cls || "") });
  }
  function sectionTitle(t, extra) {
    return h("div", { class: "sec-title" }, h("h2", {}, t), extra || null);
  }

  function canvasChart(drawFn, cls, aspect) {
    var cv = h("canvas", { class: "chart " + (cls || ""), "data-chart": "1" });
    if (aspect) cv.style.aspectRatio = aspect;
    cv.__draw = function () {
      try {
        drawFn(cv);
      } catch (e) {}
    };
    return cv;
  }

  /* --------------------------------------------------------------- TODAY */
  VIEWS.today = function () {
    var s = store.get();
    var wrap = h("div", { class: "view today" });

    // Hero
    wrap.appendChild(
      h(
        "div",
        { class: "hero" },
        h(
          "p",
          { class: "hero-greet" },
          U.greeting() + (s.profile.name ? ", " + s.profile.name : ""),
        ),
        h(
          "h1",
          { class: "hero-date" },
          new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),
        ),
      ),
    );

    // Rings summary
    var tKey = todayKey();
    var plannedToday = s.profile.days[tKey] || 0;
    var doneToday = s.sessions
      .filter(function (x) {
        return x.dateISO === MH.todayISO();
      })
      .reduce(function (a, b) {
        return a + (b.minutes || 0);
      }, 0);
    var wp = engine.weekProgress();
    var moScore = engine.mobilityScore();
    var moveGoal = plannedToday || 10;
    var ringsCard = card("rings-card");
    var ringCv = canvasChart(
      function (cv) {
        charts.rings(
          cv,
          [
            {
              value: moveGoal ? doneToday / moveGoal : 0,
              color: charts.palette.pink,
            },
            {
              value: wp.goalDays
                ? wp.doneDays / wp.goalDays
                : wp.doneDays > 0
                  ? 1
                  : 0,
              color: charts.palette.mint,
            },
            {
              value: moScore != null ? moScore / 100 : 0,
              color: charts.palette.blue,
            },
          ],
          { center: doneToday + "", centerSub: "min today" },
        );
      },
      "rings",
      "1/1",
    );
    ringsCard.appendChild(
      h(
        "div",
        { class: "rings-wrap" },
        ringCv,
        h(
          "div",
          { class: "rings-legend" },
          legendRow(
            charts.palette.pink,
            "Move",
            doneToday + " / " + moveGoal + " min",
          ),
          legendRow(
            charts.palette.mint,
            "Week",
            wp.doneDays + " / " + (wp.goalDays || 0) + " days",
          ),
          legendRow(
            charts.palette.blue,
            "Score",
            moScore != null ? moScore + " / 100" : "Not assessed",
          ),
        ),
      ),
    );
    wrap.appendChild(ringsCard);

    // Streak + quick stats
    var streak = engine.streak();
    var totals = engine.totals();
    wrap.appendChild(
      h(
        "div",
        { class: "stat-row" },
        miniStat(
          icon("flame", 22),
          streak,
          streak === 1 ? "day streak" : "day streak",
          "flame",
        ),
        miniStat(icon("clock", 22), wp.doneMinutes, "min this week", "mint"),
        miniStat(icon("check", 22), totals.sessions, "sessions", "blue"),
      ),
    );

    // Today's session recommendation
    wrap.appendChild(todaySessionCard(s, plannedToday, doneToday));

    // Focus / risk
    var risks = engine.riskIndicators();
    if (risks.length) {
      var rc = card("risk-card");
      rc.appendChild(
        sectionTitle(
          "Focus areas",
          h(
            "button",
            {
              class: "link",
              onclick: function () {
                go("#progress");
              },
            },
            "Details",
          ),
        ),
      );
      risks.slice(0, 3).forEach(function (r) {
        rc.appendChild(
          h(
            "div",
            { class: "risk-row " + r.level },
            h("span", {
              class: "risk-ic",
              html: icon(r.type === "prevention" ? "warn" : "target", 18),
            }),
            h(
              "div",
              {},
              h("strong", {}, r.label),
              h("div", { class: "muted small" }, r.detail),
              r.refs && r.refs.length ? U.refChips(r.refs) : null,
            ),
          ),
        );
      });
      wrap.appendChild(rc);
    } else if (s.assessments.length === 0) {
      var ac = card("cta-card");
      ac.appendChild(
        h(
          "div",
          {},
          h("h2", {}, "Measure your baseline"),
          h(
            "p",
            { class: "muted" },
            "Log a quick assessment to unlock your mobility score, radar and progress projections.",
          ),
        ),
      );
      ac.appendChild(
        h(
          "button",
          {
            class: "btn primary",
            onclick: function () {
              go("#assess");
            },
          },
          "Start assessment",
        ),
      );
      wrap.appendChild(ac);
    }

    // Next milestone
    var milestone = pickMilestone();
    if (milestone) wrap.appendChild(milestone);

    // Quick actions
    wrap.appendChild(
      h(
        "div",
        { class: "quick-actions" },
        quickAction("assess", "Assess", function () {
          go("#assess");
        }),
        quickAction("library", "Library", function () {
          go("#library");
        }),
        quickAction("plan", "Plan", function () {
          go("#plan");
        }),
      ),
    );

    return wrap;
  };

  function legendRow(color, label, val) {
    return h(
      "div",
      { class: "legend-row" },
      h("span", { class: "legend-dot", style: "background:" + color }),
      h("span", { class: "legend-lbl" }, label),
      h("span", { class: "legend-val" }, val),
    );
  }
  function miniStat(ic, val, label, tone) {
    return h(
      "div",
      { class: "mini-stat " + tone },
      h("span", { class: "mini-ic", html: ic }),
      h(
        "div",
        {},
        h("div", { class: "mini-val" }, String(val)),
        h("div", { class: "mini-lbl" }, label),
      ),
    );
  }
  function quickAction(ic, label, fn) {
    return h(
      "button",
      { class: "qa", onclick: fn },
      h("span", { class: "qa-ic", html: icon(ic, 22) }),
      label,
    );
  }

  function todaySessionCard(s, plannedToday, doneToday) {
    var c = card("session-cta");
    var mins = plannedToday || 5;
    var rest = plannedToday === 0;
    var prog = recommendProgram(s);
    c.appendChild(
      h(
        "div",
        { class: "session-cta-top" },
        h(
          "div",
          {},
          h("p", { class: "eyebrow" }, rest ? "Rest day" : "Today's session"),
          h("h2", {}, prog.emoji + " " + prog.name),
        ),
        h("span", { class: "dur-badge" }, mins + " min"),
      ),
    );
    c.appendChild(
      h(
        "p",
        { class: "muted" },
        rest
          ? "No session planned today. A short reset still helps — or just rest."
          : prog.blurb,
      ),
    );
    if (doneToday > 0)
      c.appendChild(
        h(
          "div",
          { class: "done-note" },
          icon("check", 16),
          "You've done " + doneToday + " min today. Nice.",
        ),
      );
    c.appendChild(
      h(
        "div",
        { class: "session-cta-actions" },
        h(
          "button",
          {
            class: "btn primary",
            onclick: function () {
              App.startSession({ program: prog, minutes: mins });
            },
          },
          icon("play", 18),
          "Start",
        ),
        h(
          "button",
          {
            class: "btn ghost",
            onclick: function () {
              go("#train");
            },
          },
          "Choose another",
        ),
      ),
    );
    return c;
  }

  function recommendProgram(s) {
    // Prefer a program aligned to first goal/sport, else full body.
    var goals = s.profile.goals || [],
      sports = s.profile.sports || [];
    if (goals.indexOf("deep-squat") >= 0 || goals.indexOf("ski-mobility") >= 0)
      return MH.programById("squat-prep");
    if (
      goals.indexOf("overhead") >= 0 ||
      goals.indexOf("posture") >= 0 ||
      goals.indexOf("scuba-tank") >= 0
    )
      return MH.programById("desk-reset");
    if (goals.indexOf("touch-toes") >= 0 || goals.indexOf("palms-floor") >= 0)
      return MH.programById("posterior-chain");
    if (sports.indexOf("running") >= 0) return MH.programById("hips-ankles");
    var hr = new Date().getHours();
    if (hr >= 20) return MH.programById("evening-winddown");
    return MH.programById("fullbody-flow");
  }

  function pickMilestone() {
    var s = store.get();
    // find a tracked assessment with >=1 record and a goal link
    var tracked = null;
    (s.profile.goals || []).forEach(function (gid) {
      var g = MH.goalById(gid);
      if (!g || !g.track || tracked) return;
      if (
        engine.recordsFor(g.track, null).length ||
        engine.recordsFor(g.track, "left").length
      )
        tracked = g.track;
    });
    if (!tracked) {
      for (var i = 0; i < s.assessments.length; i++) {
        tracked = s.assessments[i].testId;
        break;
      }
    }
    if (!tracked) return null;
    var a = MH.assessmentById(tracked);
    var side = a.sided ? "left" : null;
    var proj = engine.projection(tracked, side);
    if (!proj) return null;
    var m = proj.milestones[1]; // ~4 weeks
    var c = card("milestone-card");
    c.appendChild(sectionTitle("Next milestone", U.evidenceBadge(a.evidence)));
    c.appendChild(
      h(
        "div",
        { class: "milestone-body" },
        h(
          "div",
          {},
          h("div", { class: "muted small" }, a.name + (side ? " (left)" : "")),
          h(
            "div",
            { class: "milestone-val" },
            "~" + m.value + a.unit + " ",
            h("span", { class: "muted" }, "in " + m.week + " weeks"),
          ),
          h(
            "div",
            { class: "muted small" },
            "Now: " +
              proj.current +
              a.unit +
              " · estimate based on research averages",
          ),
        ),
        h(
          "button",
          {
            class: "link",
            onclick: function () {
              go("#assess/" + tracked);
            },
          },
          "View",
        ),
      ),
    );
    return c;
  }

  /* --------------------------------------------------------------- TRAIN */
  VIEWS.train = function (route) {
    if (route.sub === "session") return renderPlayer();
    var s = store.get();
    var wrap = h("div", { class: "view train" });

    if (App.trainMinutes == null)
      App.trainMinutes = s.profile.days[todayKey()] || 15;

    // Duration selector
    var durCard = card("dur-card");
    durCard.appendChild(sectionTitle("Session length"));
    var durRow = h("div", { class: "dur-row" });
    MH.DURATIONS.forEach(function (m) {
      var b = h(
        "button",
        {
          class: "dur-chip" + (App.trainMinutes === m ? " on" : ""),
          onclick: function () {
            App.trainMinutes = m;
            durRow.querySelectorAll(".dur-chip").forEach(function (x) {
              x.classList.remove("on");
            });
            b.classList.add("on");
          },
        },
        m + "m",
      );
      durRow.appendChild(b);
    });
    durCard.appendChild(durRow);
    wrap.appendChild(durCard);

    // For you
    if ((s.profile.goals || []).length || (s.profile.sports || []).length) {
      var fy = card("foryou-card");
      fy.appendChild(
        h(
          "div",
          {},
          h("p", { class: "eyebrow" }, "For you"),
          h("h2", {}, "Personalised session"),
        ),
      );
      fy.appendChild(
        h(
          "p",
          { class: "muted" },
          "Built from your goals and sports, ordered by evidence.",
        ),
      );
      fy.appendChild(
        h(
          "button",
          {
            class: "btn primary",
            onclick: function () {
              App.startSession({
                personalised: true,
                minutes: App.trainMinutes,
              });
            },
          },
          icon("play", 18),
          "Start " + App.trainMinutes + " min",
        ),
      );
      wrap.appendChild(fy);
    }

    // Programs
    wrap.appendChild(sectionTitle("Programs"));
    var grid = h("div", { class: "program-grid" });
    MH.programs.forEach(function (p) {
      grid.appendChild(
        h(
          "button",
          {
            class: "program-card",
            onclick: function () {
              App.startSession({ program: p, minutes: App.trainMinutes });
            },
          },
          h("span", { class: "program-emoji" }, p.emoji),
          h("span", { class: "program-name" }, p.name),
          h("span", { class: "program-blurb" }, p.blurb),
          h("span", { class: "program-go", html: icon("chevron", 20) }),
        ),
      );
    });
    wrap.appendChild(grid);

    wrap.appendChild(
      h(
        "button",
        {
          class: "btn ghost wide mt",
          onclick: function () {
            go("#library");
          },
        },
        icon("library", 18),
        "Browse all exercises",
      ),
    );
    return wrap;
  };

  // Build + launch a session
  App.startSession = function (opts) {
    var s = store.get();
    var program = opts.program || MH.programById("fullbody-flow");
    var genOpts = {
      minutes: opts.minutes || 15,
      intent: program ? program.intent : "mobility",
      focusRegions: [],
      sports: s.profile.sports || [],
      goals: s.profile.goals || [],
      difficultyMax: s.profile.difficulty || 3,
      seed: Date.now() % 100000,
    };
    if (opts.personalised) {
      var regions = {};
      (s.profile.sports || []).forEach(function (sp) {
        var o = MH.sportById(sp);
        if (o)
          o.regions.forEach(function (r) {
            regions[r] = 1;
          });
      });
      (s.profile.goals || []).forEach(function (g) {
        var o = MH.goalById(g);
        if (o)
          o.regions.forEach(function (r) {
            regions[r] = 1;
          });
      });
      genOpts.focusRegions = Object.keys(regions);
      genOpts.intent = "mobility";
      program = {
        id: "personalised",
        name: "For You",
        emoji: "✨",
        intent: "mobility",
      };
    } else if (program) {
      genOpts.focusRegions = program.focusRegions || [];
      if (program.goals)
        genOpts.goals = (genOpts.goals || []).concat(program.goals);
    }
    var session = MH.generateSession(genOpts);
    session.programId = program.id;
    session.programName = program.name;
    session.programEmoji = program.emoji || "🌀";
    App.player = {
      session: session,
      idx: 0,
      setIdx: 0,
      sideIdx: 0,
      remaining: 0,
      running: false,
      interval: null,
      completed: false,
    };
    go("#train/session");
  };

  /* ----------------------------------------------------------- PLAYER */
  function clearTimer() {
    if (App.player && App.player.interval) {
      clearInterval(App.player.interval);
      App.player.interval = null;
    }
  }

  function renderPlayer() {
    if (!App.player) {
      go("#train");
      return h("div");
    }
    App.suppressRerender = true;
    clearTimer();
    var P = App.player;
    var session = P.session;

    if (P.completed) return renderCompletion();

    var ex = session.exercises[P.idx];
    var wrap = h("div", { class: "view player" });

    // top: progress + close
    var pct = (P.idx / session.exercises.length) * 100;
    wrap.appendChild(
      h(
        "div",
        { class: "player-top" },
        h("button", {
          class: "icon-btn",
          "aria-label": "Exit",
          html: icon("close", 24),
          onclick: exitPlayer,
        }),
        h(
          "div",
          { class: "player-prog" },
          h("span", { style: "width:" + pct + "%" }),
        ),
        h(
          "span",
          { class: "player-count" },
          P.idx + 1 + "/" + session.exercises.length,
        ),
      ),
    );

    // exercise card
    var ec = h("div", { class: "ex-card" });
    ec.appendChild(U.videoPanel(ex)); // inline demo video
    ec.appendChild(
      h(
        "div",
        { class: "ex-head" },
        U.pill(MH.regionName(ex.region), "region"),
        h("span", { class: "ex-diff" }, "•".repeat(ex.difficulty)),
        ex.repeat ? U.pill("Round 2", "muted-pill") : null,
      ),
    );
    ec.appendChild(h("h1", { class: "ex-name" }, ex.name));
    ec.appendChild(h("p", { class: "ex-purpose" }, ex.purpose));

    // target line + timer
    var isHold = ex.holdSec > 0;
    var totalSets = ex.sets || 1;
    var targetTxt = isHold
      ? totalSets + " × " + ex.holdSec + "s hold"
      : totalSets + " × " + ex.reps + " reps";
    if (ex.bilateral) targetTxt += " · each side";
    ec.appendChild(h("div", { class: "ex-target" }, targetTxt));

    // set/side tracker
    var tracker = h("div", { class: "tracker" });
    function renderTracker() {
      MH._ui.clear(tracker);
      var sideLbl = ex.bilateral
        ? P.sideIdx === 0
          ? "Left side"
          : "Right side"
        : "";
      tracker.appendChild(
        h(
          "span",
          { class: "tracker-set" },
          "Set " +
            (P.setIdx + 1) +
            " / " +
            totalSets +
            (sideLbl ? " · " + sideLbl : ""),
        ),
      );
    }
    renderTracker();

    // timer widget (holds only)
    var timerWrap = h("div", { class: "timer-wrap" });
    if (isHold) {
      P.remaining = P.remaining || ex.holdSec;
      var timerCv = h("canvas", { class: "timer-ring", "data-chart": "1" });
      timerCv.__draw = function () {
        charts.rings(
          timerCv,
          [{ value: P.remaining / ex.holdSec, color: charts.palette.mint }],
          { center: fmtTime(P.remaining), thickness: 12 },
        );
      };
      var startBtn = h(
        "button",
        { class: "btn primary round", onclick: toggleTimer },
        icon("play", 22),
      );
      function drawTimer() {
        timerCv.__draw();
      }
      function tick() {
        P.remaining--;
        if (P.remaining <= 0) {
          P.remaining = 0;
          drawTimer();
          pauseTimer();
          doneSet(true);
          return;
        }
        drawTimer();
      }
      function toggleTimer() {
        P.running ? pauseTimer() : startTimer();
      }
      function startTimer() {
        P.running = true;
        startBtn.innerHTML = icon("pause", 22);
        clearTimer();
        P.interval = setInterval(tick, 1000);
      }
      function pauseTimer() {
        P.running = false;
        startBtn.innerHTML = icon("play", 22);
        clearTimer();
      }
      P._pause = pauseTimer;
      timerWrap.appendChild(h("div", { class: "timer-ringwrap" }, timerCv));
      timerWrap.appendChild(
        h(
          "div",
          { class: "timer-ctrls" },
          startBtn,
          h(
            "button",
            {
              class: "btn ghost",
              onclick: function () {
                pauseTimer();
                P.remaining = ex.holdSec;
                drawTimer();
              },
            },
            "Reset",
          ),
        ),
      );
      requestAnimationFrame(drawTimer);
    }
    ec.appendChild(h("div", { class: "tracker-timer" }, tracker, timerWrap));

    // done-set button
    var doneBtn = h(
      "button",
      {
        class: "btn accent wide",
        onclick: function () {
          doneSet(false);
        },
      },
      isHold ? "Done set" : "Done set",
    );
    ec.appendChild(doneBtn);

    function doneSet(fromTimer) {
      if (ex.bilateral && P.sideIdx === 0) {
        P.sideIdx = 1;
        P.remaining = ex.holdSec;
        renderTracker();
        if (isHold)
          requestAnimationFrame(function () {
            var cv = wrap.querySelector(".timer-ring");
            if (cv) cv.__draw();
          });
        toast("Switch to right side", { duration: 1400 });
        return;
      }
      P.sideIdx = 0;
      P.setIdx++;
      P.remaining = ex.holdSec;
      if (P.setIdx >= totalSets) {
        advance();
        return;
      }
      renderTracker();
      var cv = wrap.querySelector(".timer-ring");
      if (cv) cv.__draw();
      toast("Set " + P.setIdx + " done", { duration: 1200 });
    }

    // expandable detail sections
    ec.appendChild(
      detailSection(
        "How to do it",
        h(
          "ol",
          { class: "steps" },
          ex.execution.map(function (st) {
            return h("li", {}, st);
          }),
        ),
        true,
      ),
    );
    ec.appendChild(
      detailSection(
        "Common mistakes",
        h(
          "ul",
          { class: "mistakes" },
          ex.mistakes.map(function (m) {
            return h("li", {}, m);
          }),
        ),
      ),
    );
    ec.appendChild(
      detailSection("Breathing & tempo", h("p", {}, ex.breathing)),
    );
    ec.appendChild(
      detailSection(
        "Easier / harder",
        h(
          "div",
          {},
          h("p", {}, h("strong", {}, "Regression: "), ex.regression),
          h("p", {}, h("strong", {}, "Progression: "), ex.progression),
        ),
      ),
    );
    ec.appendChild(
      detailSection(
        "Why it works",
        h(
          "div",
          {},
          h("p", {}, ex.rationale),
          h(
            "p",
            { class: "muted small" },
            "Primary muscles: " + ex.primary.join(", "),
          ),
          U.refChips(ex.refs),
        ),
      ),
    );
    var vurl = MH.videoUrl(ex.video);
    ec.appendChild(
      h(
        "a",
        { class: "video-link", href: vurl, target: "_blank", rel: "noopener" },
        icon("video", 20),
        "Watch demo — " + ex.video.channel,
      ),
    );

    wrap.appendChild(ec);

    // nav
    wrap.appendChild(
      h(
        "div",
        { class: "player-nav" },
        h(
          "button",
          { class: "btn ghost", disabled: P.idx === 0, onclick: prev },
          "Previous",
        ),
        P.idx === session.exercises.length - 1
          ? h(
              "button",
              { class: "btn primary", onclick: finish },
              "Finish",
              icon("check", 18),
            )
          : h(
              "button",
              { class: "btn primary", onclick: next },
              "Next",
              icon("chevron", 18),
            ),
      ),
    );

    function resetForExercise() {
      P.setIdx = 0;
      P.sideIdx = 0;
      P.remaining = session.exercises[P.idx].holdSec || 0;
      P.running = false;
    }
    function advance() {
      if (P.idx < session.exercises.length - 1) {
        next();
      } else {
        finish();
      }
    }
    function next() {
      if (P._pause) P._pause();
      clearTimer();
      P.idx = Math.min(P.idx + 1, session.exercises.length - 1);
      resetForExercise();
      rebuild();
    }
    function prev() {
      if (P._pause) P._pause();
      clearTimer();
      P.idx = Math.max(P.idx - 1, 0);
      resetForExercise();
      rebuild();
    }
    function rebuild() {
      var v = MH._ui.$("#view");
      MH._ui.clear(v);
      v.scrollTop = 0;
      v.appendChild(renderPlayer());
      App.afterRender(); // redraw the timer canvas
    }

    return wrap;
  }

  function detailSection(title, contentNode, openByDefault) {
    var body = h("div", { class: "acc-body" }, contentNode);
    var sec = h("div", { class: "acc" + (openByDefault ? " open" : "") });
    var btn = h(
      "button",
      {
        class: "acc-head",
        onclick: function () {
          sec.classList.toggle("open");
        },
      },
      h("span", {}, title),
      h("span", { class: "acc-chev", html: icon("chevron", 18) }),
    );
    sec.appendChild(btn);
    sec.appendChild(body);
    return sec;
  }

  function exitPlayer() {
    clearTimer();
    App.suppressRerender = false;
    go("#train");
  }

  function finish() {
    clearTimer();
    var P = App.player,
      session = P.session;
    var regions = {};
    session.exercises.forEach(function (e) {
      regions[e.region] = 1;
    });
    var exIds = session.exercises.map(function (e) {
      return e.id;
    });
    store.addSession({
      programId: session.programId,
      name: session.programName,
      minutes: session.minutes,
      exerciseIds: exIds,
      regions: Object.keys(regions),
    });
    var res = engine.evaluateAchievements();
    P.completed = true;
    P.newAch = res.newlyUnlocked;
    App.suppressRerender = false;
    var v = MH._ui.$("#view");
    MH._ui.clear(v);
    v.appendChild(renderCompletion());
    requestAnimationFrame(function () {
      App.redrawCharts();
    });
  }

  function renderCompletion() {
    var P = App.player,
      session = P.session;
    var wrap = h("div", { class: "view completion" });
    var ringCv = h("canvas", { class: "chart big-ring", "data-chart": "1" });
    ringCv.__draw = function () {
      charts.rings(ringCv, [{ value: 1, color: charts.palette.green }], {
        center: "✓",
        centerSub: session.minutes + " min",
      });
    };
    wrap.appendChild(
      h(
        "div",
        { class: "completion-inner" },
        h("div", { class: "ring-pop" }, ringCv),
        h("h1", {}, "Session complete"),
        h(
          "p",
          { class: "muted" },
          session.programEmoji +
            " " +
            session.programName +
            " · " +
            session.exercises.length +
            " exercises",
        ),
        P.newAch && P.newAch.length
          ? h(
              "div",
              { class: "ach-unlocked" },
              P.newAch.map(function (a) {
                return h(
                  "div",
                  { class: "ach-toast" },
                  h("span", { class: "ach-emoji" }, a.icon),
                  h(
                    "div",
                    {},
                    h("strong", {}, a.name),
                    h("div", { class: "muted small" }, a.desc),
                  ),
                );
              }),
            )
          : null,
        h(
          "div",
          { class: "completion-actions" },
          h(
            "button",
            {
              class: "btn primary wide",
              onclick: function () {
                App.player = null;
                go("#progress");
              },
            },
            "See progress",
          ),
          h(
            "button",
            {
              class: "btn ghost wide",
              onclick: function () {
                App.player = null;
                go("#today");
              },
            },
            "Done",
          ),
        ),
      ),
    );
    return wrap;
  }

  function fmtTime(sec) {
    var m = Math.floor(sec / 60),
      s = sec % 60;
    return m + ":" + ("0" + s).slice(-2);
  }
})(typeof window !== "undefined" ? window : this);

/* ================================================================ VIEWS: ASSESS + PROGRESS */
(function (root) {
  "use strict";
  var MH = root.MH,
    U = MH._ui,
    engine = MH.engine,
    store = MH.store,
    charts = MH.charts;
  var h = U.h,
    icon = U.icon,
    go = U.go,
    toast = U.toast,
    App = U.App;
  var VIEWS = MH.VIEWS;

  function card(cls) {
    return h("section", { class: "card " + (cls || "") });
  }
  function sectionTitle(t, extra) {
    return h("div", { class: "sec-title" }, h("h2", {}, t), extra || null);
  }
  function canvasChart(drawFn, cls, aspect) {
    var cv = h("canvas", { class: "chart " + (cls || ""), "data-chart": "1" });
    if (aspect) cv.style.aspectRatio = aspect;
    cv.__draw = function () {
      try {
        drawFn(cv);
      } catch (e) {}
    };
    return cv;
  }
  var SHORT = {
    hips: "Hips",
    ankles: "Ankles",
    knees: "Knees",
    hamstrings: "Hams",
    glutes: "Glutes",
    adductors: "Adduct",
    lowback: "L-Back",
    thoracic: "T-Spine",
    shoulders: "Shldr",
    scapula: "Scap",
    wrists: "Wrist",
    neck: "Neck",
    fullbody: "Full",
  };

  /* --------------------------------------------------------------- ASSESS LIST */
  VIEWS.assess = function (route) {
    if (route.param && MH.assessmentById(route.param))
      return renderTestDetail(route.param);
    var wrap = h("div", { class: "view assess" });
    var mo = engine.mobilityScore();

    var head = card("assess-head");
    head.appendChild(
      h(
        "div",
        { class: "assess-head-top" },
        h(
          "div",
          {},
          h("p", { class: "eyebrow" }, "Movement screen"),
          h(
            "h1",
            {},
            mo != null ? mo + " " : "—",
            h("span", { class: "of" }, "/100"),
          ),
        ),
        mo != null ? U.bandTag(mo) : U.pill("Not assessed"),
      ),
    );
    head.appendChild(
      h(
        "p",
        { class: "muted" },
        "Log measurable tests to track real change. Based on validated field tests — see each test's evidence grade.",
      ),
    );
    wrap.appendChild(head);

    var latest = engine.latestRecords();
    var byRegion = {};
    MH.assessments.forEach(function (a) {
      (byRegion[a.region] = byRegion[a.region] || []).push(a);
    });

    MH.regions.forEach(function (reg) {
      var tests = byRegion[reg.id];
      if (!tests) return;
      var group = h("div", { class: "assess-group" });
      group.appendChild(h("h3", { class: "group-title" }, reg.name));
      tests.forEach(function (a) {
        var sc = engine.testScore(a.id);
        var latestVal = null;
        if (a.sided) {
          var l = latest[a.id + "|left"],
            r = latest[a.id + "|right"];
          latestVal = [l, r]
            .filter(Boolean)
            .map(function (x) {
              return x.primaryValue + a.unit;
            })
            .join(" / ");
        } else if (latest[a.id + "|"])
          latestVal = latest[a.id + "|"].primaryValue + a.unit;
        group.appendChild(
          h(
            "button",
            {
              class: "assess-row",
              onclick: function () {
                go("#assess/" + a.id);
              },
            },
            h(
              "div",
              { class: "assess-row-main" },
              h(
                "div",
                { class: "assess-row-name" },
                a.name,
                U.evidenceBadge(a.evidence),
              ),
              h(
                "div",
                { class: "muted small" },
                latestVal ? "Latest: " + latestVal : "Tap to measure",
              ),
            ),
            h(
              "div",
              { class: "assess-row-score" },
              sc != null
                ? h("span", { class: "score-num" }, sc)
                : h("span", { class: "muted" }, "—"),
              U.bandTag(sc),
            ),
            h("span", { class: "assess-chev", html: icon("chevron", 20) }),
          ),
        );
      });
      wrap.appendChild(group);
    });
    return wrap;
  };

  /* --------------------------------------------------------------- TEST DETAIL */
  function renderTestDetail(testId) {
    var a = MH.assessmentById(testId);
    var wrap = h("div", { class: "view test-detail" });
    if (App.assessSide == null) App.assessSide = "left";

    wrap.appendChild(
      h(
        "div",
        { class: "detail-hero" },
        h("h1", {}, a.name),
        h(
          "div",
          { class: "detail-badges" },
          U.evidenceBadge(a.evidence),
          U.pill(MH.regionName(a.region), "region"),
        ),
      ),
    );
    wrap.appendChild(h("p", { class: "detail-about" }, a.about));

    // how-to
    var howCard = card();
    howCard.appendChild(sectionTitle("How to measure"));
    howCard.appendChild(
      h(
        "ol",
        { class: "steps" },
        a.how.map(function (st) {
          return h("li", {}, st);
        }),
      ),
    );
    howCard.appendChild(U.refChips(a.refs));
    wrap.appendChild(howCard);

    // log form
    wrap.appendChild(buildLogForm(a));

    // projection + history container (re-renders on side toggle)
    var dyn = h("div", { class: "dyn" });
    function renderDyn() {
      MH._ui.clear(dyn);
      var side = a.sided ? App.assessSide : null;
      // side toggle
      if (a.sided) {
        var seg = h("div", { class: "seg small" });
        [
          ["left", "Left"],
          ["right", "Right"],
        ].forEach(function (sd) {
          var b = h(
            "button",
            {
              class: "seg-btn" + (App.assessSide === sd[0] ? " on" : ""),
              onclick: function () {
                App.assessSide = sd[0];
                renderDyn();
                requestAnimationFrame(function () {
                  App.redrawCharts();
                });
              },
            },
            sd[1],
          );
          seg.appendChild(b);
        });
        dyn.appendChild(
          h(
            "div",
            { class: "side-toggle" },
            h("span", { class: "muted small" }, "Projection & history for:"),
            seg,
          ),
        );
      }

      var proj = engine.projection(testId, side);
      var pc = card("proj-card");
      pc.appendChild(
        sectionTitle(
          "Projection",
          h("span", { class: "muted small" }, "estimate"),
        ),
      );
      pc.appendChild(
        canvasChart(
          function (cv) {
            charts.projection(cv, proj);
          },
          "proj-chart",
          "16/9",
        ),
      );
      if (proj) {
        pc.appendChild(
          h(
            "div",
            { class: "proj-legend" },
            h(
              "span",
              {},
              h("span", {
                class: "dash",
                style: "border-color:" + charts.palette.mint,
              }),
              "Projected",
            ),
            h(
              "span",
              {},
              h("span", {
                class: "dot",
                style: "background:" + charts.palette.blue,
              }),
              "Your logs",
            ),
          ),
        );
        var mtable = h("div", { class: "milestones" });
        proj.milestones.forEach(function (m) {
          var band = engine.scoreBand(m.score);
          mtable.appendChild(
            h(
              "div",
              { class: "milestone" },
              h("span", { class: "ms-week" }, m.week + "w"),
              h("span", { class: "ms-val" }, m.value + a.unit),
              h("span", { class: "band band-" + band.tone }, band.label),
            ),
          );
        });
        pc.appendChild(mtable);
        pc.appendChild(
          h(
            "p",
            { class: "disclaimer small" },
            icon("info", 15),
            h(
              "span",
              {},
              "Conservative estimate from research averages, scaled by your recent adherence (" +
                Math.round(proj.adherence * 100) +
                "% of plan). Individual results vary — not a guarantee.",
            ),
          ),
        );
      } else {
        pc.appendChild(
          h(
            "p",
            { class: "muted" },
            "Log this test at least once to see a projection. Log twice or more to overlay your real progress.",
          ),
        );
      }
      dyn.appendChild(pc);

      // history
      var recs = engine.recordsFor(testId, side).slice().reverse();
      if (recs.length) {
        var hc = card("history-card");
        hc.appendChild(
          sectionTitle(
            "History" + (a.sided ? " (" + App.assessSide + ")" : ""),
          ),
        );
        recs.forEach(function (r) {
          var band = engine.scoreBand(r.score);
          hc.appendChild(
            h(
              "div",
              { class: "hist-row" },
              h(
                "span",
                { class: "hist-date" },
                new Date(r.ts).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                }),
              ),
              h("span", { class: "hist-val" }, r.primaryValue + a.unit),
              h("span", { class: "band band-" + band.tone }, r.score),
              h("button", {
                class: "icon-btn tiny",
                "aria-label": "Delete",
                html: icon("trash", 16),
                onclick: function () {
                  store.removeAssessment(r.id);
                  App.render();
                },
              }),
            ),
          );
        });
        wrap.appendChild(hc);
      }
    }
    renderDyn();
    wrap.appendChild(dyn);
    return wrap;
  }

  function buildLogForm(a) {
    var c = card("log-card");
    c.appendChild(sectionTitle("Log a measurement"));
    var sides = a.sided ? ["left", "right"] : [null];
    var inputs = {}; // side -> {fieldKey -> getter}

    sides.forEach(function (side) {
      inputs[side || "_"] = {};
      var col = h("div", { class: "log-col" });
      if (a.sided)
        col.appendChild(
          h(
            "div",
            { class: "log-col-title" },
            side === "left" ? "Left" : "Right",
          ),
        );
      a.fields.forEach(function (f) {
        col.appendChild(buildField(f, inputs[side || "_"]));
      });
      c.appendChild(col);
    });

    c.appendChild(
      h(
        "button",
        {
          class: "btn primary wide mt",
          onclick: function () {
            save();
          },
        },
        "Save measurement",
      ),
    );

    function save() {
      var saved = 0;
      sides.forEach(function (side) {
        var g = inputs[side || "_"];
        var primaryGetter = g[a.primary];
        if (!primaryGetter) return;
        var pv = primaryGetter();
        if (pv == null || isNaN(pv)) return; // require primary
        var values = {};
        a.fields.forEach(function (f) {
          var val = g[f.key] ? g[f.key]() : null;
          if (val != null) values[f.key] = val;
        });
        var score = engine.scoreValue(a, pv);
        store.addAssessment({
          testId: a.id,
          side: side,
          values: values,
          primaryValue: pv,
          score: score,
        });
        saved++;
      });
      if (!saved) {
        toast("Enter at least the main measurement", { tone: "poor" });
        return;
      }
      var res = engine.evaluateAchievements();
      toast("Saved", { icon: "check", tone: "great" });
      res.newlyUnlocked.forEach(function (ach) {
        toast(ach.icon + " " + ach.name + " unlocked", { duration: 3000 });
      });
      App.render();
    }
    return c;
  }

  function buildField(f, store2) {
    if (f.type === "bool") {
      var on = false;
      var toggle = h(
        "button",
        {
          class: "toggle",
          role: "switch",
          "aria-checked": "false",
          onclick: function () {
            on = !on;
            toggle.classList.toggle("on", on);
            toggle.setAttribute("aria-checked", on ? "true" : "false");
          },
        },
        h("span", { class: "toggle-knob" }),
      );
      store2[f.key] = function () {
        return on;
      };
      return h(
        "div",
        { class: "field field-bool" },
        h("label", {}, f.label),
        toggle,
      );
    }
    if (f.type === "score") {
      var min = f.min != null ? f.min : 1,
        max = f.max != null ? f.max : 10;
      var range = h("input", {
        type: "range",
        min: min,
        max: max,
        step: 1,
        value: Math.round((min + max) / 2),
      });
      var out = h("span", { class: "range-out" }, range.value);
      range.addEventListener("input", function () {
        out.textContent = range.value;
      });
      store2[f.key] = function () {
        return parseFloat(range.value);
      };
      return h(
        "div",
        { class: "field field-score" },
        h(
          "label",
          {},
          f.label,
          h("span", { class: "range-max muted" }, " (" + min + "–" + max + ")"),
        ),
        h("div", { class: "range-wrap" }, range, out),
      );
    }
    // number
    var input = h("input", {
      type: "number",
      inputmode: "decimal",
      step: f.step || 1,
      min: f.min,
      max: f.max,
      placeholder: "0",
    });
    store2[f.key] = function () {
      return input.value === "" ? null : parseFloat(input.value);
    };
    return h(
      "div",
      { class: "field field-num" },
      h("label", {}, f.label),
      h(
        "div",
        { class: "num-wrap" },
        input,
        h("span", { class: "num-unit" }, f.unit || ""),
      ),
      f.hint ? h("span", { class: "field-hint muted" }, f.hint) : null,
    );
  }

  /* --------------------------------------------------------------- PROGRESS */
  VIEWS.progress = function () {
    var wrap = h("div", { class: "view progress" });
    var mo = engine.mobilityScore();

    if (mo == null) {
      var empty = card("cta-card");
      empty.appendChild(
        h(
          "div",
          {},
          h("h2", {}, "No data yet"),
          h(
            "p",
            { class: "muted" },
            "Complete a mobility assessment to unlock your dashboards: score, mobility age, radar and progress projections.",
          ),
        ),
      );
      empty.appendChild(
        h(
          "button",
          {
            class: "btn primary",
            onclick: function () {
              go("#assess");
            },
          },
          "Start assessing",
        ),
      );
      wrap.appendChild(empty);
      wrap.appendChild(activitySection());
      wrap.appendChild(achievementsSection());
      return wrap;
    }

    // Score hero
    var age = engine.mobilityAge(),
      mq = engine.movementQuality();
    var hero = card("score-hero");
    var ringCv = canvasChart(
      function (cv) {
        charts.rings(
          cv,
          [{ value: mo / 100, color: MH.toneColor(engine.scoreBand(mo).tone) }],
          { center: mo + "", centerSub: "/100", thickness: 14 },
        );
      },
      "score-ring",
      "1/1",
    );
    hero.appendChild(
      h(
        "div",
        { class: "score-hero-grid" },
        h("div", { class: "score-ring-wrap" }, ringCv),
        h(
          "div",
          { class: "score-meta" },
          h(
            "div",
            {},
            U.bandTag(mo),
            h("span", { class: "muted small" }, " overall mobility"),
          ),
          statLine("Mobility age", age != null ? age + " yrs" : "—"),
          statLine("Movement quality", mq != null ? mq + "/100" : "—"),
          h(
            "button",
            {
              class: "link",
              onclick: function () {
                go("#assess");
              },
            },
            "Update assessments",
          ),
        ),
      ),
    );
    wrap.appendChild(hero);

    // Radar
    var rs = engine.regionScores();
    var withData = MH.regions.filter(function (r) {
      return rs[r.id] != null;
    });
    var radarCard = card("radar-card");
    radarCard.appendChild(sectionTitle("Joint balance"));
    if (withData.length >= 3) {
      radarCard.appendChild(
        canvasChart(
          function (cv) {
            charts.radar(
              cv,
              {
                labels: withData.map(function (r) {
                  return SHORT[r.id] || r.name;
                }),
                values: withData.map(function (r) {
                  return rs[r.id];
                }),
              },
              { max: 100, color: charts.palette.mint },
            );
          },
          "radar",
          "1/1",
        ),
      );
    } else {
      radarCard.appendChild(
        h(
          "p",
          { class: "muted" },
          "Assess at least 3 regions to see your balance radar.",
        ),
      );
    }
    wrap.appendChild(radarCard);

    // Trend
    var trend = engine.scoreTrend();
    if (trend.length >= 2) {
      var tc = card("trend-card");
      tc.appendChild(sectionTitle("Mobility score trend"));
      tc.appendChild(
        canvasChart(
          function (cv) {
            charts.trend(
              cv,
              trend.map(function (p) {
                return {
                  label: new Date(p.dateISO).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  }),
                  value: p.score,
                };
              }),
              { min: 0, max: 100, color: charts.palette.blue },
            );
          },
          "trend",
          "16/9",
        ),
      );
      wrap.appendChild(tc);
    }

    // Region scores list
    var rlist = card("region-list");
    rlist.appendChild(sectionTitle("Joint-specific scores"));
    MH.regions.forEach(function (reg) {
      var sc = rs[reg.id];
      var band = engine.scoreBand(sc);
      rlist.appendChild(
        h(
          "div",
          { class: "region-row" },
          h("span", { class: "region-name" }, reg.name),
          h(
            "div",
            { class: "region-bar" },
            h("span", {
              class: "region-fill band-bg-" + band.tone,
              style: "width:" + (sc != null ? sc : 0) + "%",
            }),
          ),
          h("span", { class: "region-val" }, sc != null ? sc : "—"),
        ),
      );
    });
    wrap.appendChild(rlist);

    // Risk indicators
    var risks = engine.riskIndicators();
    if (risks.length) {
      var rc = card("risk-card");
      rc.appendChild(sectionTitle("Areas needing work"));
      risks.forEach(function (r) {
        rc.appendChild(
          h(
            "div",
            { class: "risk-row " + r.level },
            h("span", {
              class: "risk-ic",
              html: icon(r.type === "prevention" ? "warn" : "target", 18),
            }),
            h(
              "div",
              {},
              h("strong", {}, r.label),
              h("div", { class: "muted small" }, r.detail),
              r.refs && r.refs.length ? U.refChips(r.refs) : null,
            ),
          ),
        );
      });
      wrap.appendChild(rc);
    }

    wrap.appendChild(activitySection());
    wrap.appendChild(achievementsSection());
    return wrap;
  };

  function statLine(label, val) {
    return h(
      "div",
      { class: "stat-line" },
      h("span", { class: "muted" }, label),
      h("strong", {}, val),
    );
  }

  function activitySection() {
    var frag = document.createDocumentFragment();
    var totals = engine.totals(),
      mstat = engine.monthStats(),
      wp = engine.weekProgress();

    var stats = card("activity-card");
    stats.appendChild(sectionTitle("Activity"));
    stats.appendChild(
      h(
        "div",
        { class: "activity-grid" },
        bigStat(engine.streak(), "Day streak"),
        bigStat(engine.bestStreak(), "Best streak"),
        bigStat(totals.sessions, "Sessions"),
        bigStat(totals.minutes, "Total min"),
        bigStat(mstat.minutes, "This month"),
        bigStat(wp.doneMinutes + "/" + wp.goalMinutes, "Week min"),
      ),
    );

    // weekly minutes bars (last 7 days)
    var cal7 = engine.calendar(7);
    stats.appendChild(
      h(
        "div",
        { class: "bars-wrap" },
        canvasChart(
          function (cv) {
            charts.bars(
              cv,
              cal7.map(function (d, i) {
                return {
                  label: ["S", "M", "T", "W", "T", "F", "S"][d.dow],
                  value: d.minutes,
                  highlight: i === cal7.length - 1,
                };
              }),
              { color: charts.palette.mint },
            );
          },
          "bars",
          "2/1",
        ),
      ),
    );

    // calendar heatmap
    stats.appendChild(sectionTitle("Consistency"));
    stats.appendChild(heatmap(engine.calendar(84)));
    return (frag.appendChild(stats), frag);
  }
  function bigStat(val, label) {
    return h(
      "div",
      { class: "big-stat" },
      h("div", { class: "big-stat-val" }, String(val)),
      h("div", { class: "big-stat-lbl" }, label),
    );
  }

  function heatmap(days) {
    var grid = h("div", { class: "heatmap" });
    // leading offset so columns align to weeks (Mon-based)
    if (days.length) {
      var firstDow = days[0].dow;
      var offset = (firstDow + 6) % 7;
      for (var i = 0; i < offset; i++)
        grid.appendChild(h("span", { class: "hm-cell empty" }));
    }
    days.forEach(function (d) {
      var lvl =
        d.minutes === 0
          ? 0
          : d.minutes < 10
            ? 1
            : d.minutes < 20
              ? 2
              : d.minutes < 35
                ? 3
                : 4;
      grid.appendChild(
        h("span", {
          class: "hm-cell lvl-" + lvl,
          title: d.dateISO + ": " + d.minutes + " min",
        }),
      );
    });
    return h(
      "div",
      { class: "heatmap-wrap" },
      grid,
      h(
        "div",
        { class: "hm-legend" },
        h("span", { class: "muted small" }, "Less"),
        h("span", { class: "hm-cell lvl-0" }),
        h("span", { class: "hm-cell lvl-1" }),
        h("span", { class: "hm-cell lvl-2" }),
        h("span", { class: "hm-cell lvl-3" }),
        h("span", { class: "hm-cell lvl-4" }),
        h("span", { class: "muted small" }, "More"),
      ),
    );
  }

  function achievementsSection() {
    var c = card("ach-card");
    c.appendChild(sectionTitle("Achievements"));
    var states = engine.achievementState();
    var grid = h("div", { class: "ach-grid" });
    states.forEach(function (st) {
      var def = st.def;
      var el = h(
        "div",
        { class: "ach-item" + (st.unlocked ? " on" : "") },
        h("span", { class: "ach-emoji" }, def.icon),
        h("span", { class: "ach-name" }, def.name),
        h("span", { class: "ach-desc muted small" }, def.desc),
      );
      if (
        !st.unlocked &&
        ["sessions", "minutes", "streak", "score", "regions"].indexOf(
          def.type,
        ) >= 0
      ) {
        var p = Math.min(100, Math.round((st.progress / def.threshold) * 100));
        el.appendChild(
          h(
            "div",
            { class: "ach-prog" },
            h("span", { style: "width:" + p + "%" }),
          ),
        );
      }
      grid.appendChild(el);
    });
    c.appendChild(grid);
    return c;
  }
})(typeof window !== "undefined" ? window : this);

/* ================================================================ VIEWS: PLAN + LIBRARY */
(function (root) {
  "use strict";
  var MH = root.MH,
    U = MH._ui,
    engine = MH.engine,
    store = MH.store;
  var h = U.h,
    icon = U.icon,
    go = U.go,
    toast = U.toast,
    App = U.App;
  var VIEWS = MH.VIEWS;

  function card(cls) {
    return h("section", { class: "card " + (cls || "") });
  }
  function sectionTitle(t, extra) {
    return h("div", { class: "sec-title" }, h("h2", {}, t), extra || null);
  }

  /* --------------------------------------------------------------- PLAN */
  VIEWS.plan = function () {
    var s = store.get();
    var wrap = h("div", { class: "view plan" });

    // Weekly summary
    var goalMin = engine.weeklyGoalMinutes();
    var plannedDays = engine.plannedDays().length;
    var wp = engine.weekProgress();
    var sum = card("plan-sum");
    sum.appendChild(
      h(
        "div",
        { class: "plan-sum-grid" },
        sumStat(goalMin, "min / week"),
        sumStat(plannedDays, plannedDays === 1 ? "day / week" : "days / week"),
        sumStat(wp.pct + "%", "done this week"),
      ),
    );
    sum.appendChild(
      h(
        "p",
        { class: "muted small" },
        "Choose any days and any minutes. Your weekly total is the target — the planner tracks completion no matter which days you pick.",
      ),
    );
    wrap.appendChild(sum);

    // Day planner
    var planner = card("planner-card");
    planner.appendChild(sectionTitle("Weekly schedule"));
    var rows = h("div", { class: "day-planner" });
    U.DAY_LABELS.forEach(function (d) {
      rows.appendChild(dayRow(d[0], d[1]));
    });
    planner.appendChild(rows);
    // quick patterns
    var quick = h(
      "div",
      { class: "quick-patterns" },
      patternBtn("Daily 10", {
        mon: 10,
        tue: 10,
        wed: 10,
        thu: 10,
        fri: 10,
        sat: 10,
        sun: 10,
      }),
      patternBtn("3 × 15", {
        mon: 15,
        tue: 0,
        wed: 15,
        thu: 0,
        fri: 15,
        sat: 0,
        sun: 0,
      }),
      patternBtn("5 × 12", {
        mon: 12,
        tue: 12,
        wed: 12,
        thu: 12,
        fri: 12,
        sat: 0,
        sun: 0,
      }),
      patternBtn("Weekend", {
        mon: 0,
        tue: 0,
        wed: 0,
        thu: 0,
        fri: 0,
        sat: 30,
        sun: 30,
      }),
    );
    planner.appendChild(quick);
    wrap.appendChild(planner);

    function dayRow(key, label) {
      var days = store.get().profile.days;
      var val = h(
        "span",
        { class: "day-min" },
        days[key] ? days[key] + "m" : "Rest",
      );
      function set(v) {
        v = Math.max(0, Math.min(90, v));
        var patch = {};
        patch[key] = v;
        store.setDays(patch);
        val.textContent = v ? v + "m" : "Rest";
        row.classList.toggle("rest", !v);
        refreshSummary();
      }
      var row = h(
        "div",
        { class: "day-row" + (days[key] ? "" : " rest") },
        h("span", { class: "day-name" }, label),
        h(
          "div",
          { class: "stepper" },
          h("button", {
            class: "step-btn",
            "aria-label": "less",
            html: icon("minus", 18),
            onclick: function () {
              set((store.get().profile.days[key] || 0) - 5);
            },
          }),
          val,
          h("button", {
            class: "step-btn",
            "aria-label": "more",
            html: icon("plus", 18),
            onclick: function () {
              set((store.get().profile.days[key] || 0) + 5);
            },
          }),
        ),
      );
      return row;
    }
    function patternBtn(label, obj) {
      return h(
        "button",
        {
          class: "chip-btn",
          onclick: function () {
            store.setDays(obj);
            App.render();
            toast("Schedule updated");
          },
        },
        label,
      );
    }
    function refreshSummary() {
      var g = engine.weeklyGoalMinutes(),
        pd = engine.plannedDays().length,
        w = engine.weekProgress();
      var stats = sum.querySelectorAll(".sum-stat .sum-val");
      if (stats[0]) stats[0].textContent = g;
      if (stats[1]) stats[1].textContent = pd;
      if (stats[2]) stats[2].textContent = w.pct + "%";
    }

    // Goals
    var goalsCard = card();
    goalsCard.appendChild(sectionTitle("Goals"));
    var gGrid = h("div", { class: "chip-grid" });
    MH.goals.forEach(function (g) {
      var on = (store.get().profile.goals || []).indexOf(g.id) >= 0;
      var chip = h(
        "button",
        {
          class: "select-chip" + (on ? " on" : ""),
          onclick: function () {
            toggleProfileArr("goals", g.id);
            chip.classList.toggle("on");
          },
        },
        g.name,
      );
      gGrid.appendChild(chip);
    });
    goalsCard.appendChild(gGrid);
    wrap.appendChild(goalsCard);

    // Sports
    var sportsCard = card();
    sportsCard.appendChild(sectionTitle("Sports"));
    var sGrid = h("div", { class: "chip-grid" });
    MH.sports.forEach(function (sp) {
      var on = (store.get().profile.sports || []).indexOf(sp.id) >= 0;
      var chip = h(
        "button",
        {
          class: "select-chip" + (on ? " on" : ""),
          onclick: function () {
            toggleProfileArr("sports", sp.id);
            chip.classList.toggle("on");
          },
        },
        h("span", { class: "chip-emoji" }, sp.emoji),
        sp.name,
      );
      sGrid.appendChild(chip);
    });
    sportsCard.appendChild(sGrid);
    wrap.appendChild(sportsCard);

    // Experience
    var diffCard = card();
    diffCard.appendChild(sectionTitle("Experience level"));
    var seg = h("div", { class: "seg" });
    [1, 2, 3].forEach(function (lvl) {
      var b = h(
        "button",
        {
          class: "seg-btn" + (s.profile.difficulty === lvl ? " on" : ""),
          onclick: function () {
            store.setProfile({ difficulty: lvl });
            seg.querySelectorAll(".seg-btn").forEach(function (x) {
              x.classList.remove("on");
            });
            b.classList.add("on");
          },
        },
        U.DIFF_LABEL[lvl],
      );
      seg.appendChild(b);
    });
    diffCard.appendChild(seg);
    diffCard.appendChild(
      h(
        "p",
        { class: "muted small" },
        "Advanced unlocks harder progressions; beginner keeps things gentle.",
      ),
    );
    wrap.appendChild(diffCard);

    // Settings
    var setCard = card("settings-card");
    setCard.appendChild(sectionTitle("Settings & data"));
    var rm = h(
      "button",
      {
        class: "toggle" + (s.prefs.reduceMotion ? " on" : ""),
        role: "switch",
        "aria-checked": s.prefs.reduceMotion ? "true" : "false",
        onclick: function () {
          var v = !store.get().prefs.reduceMotion;
          store.setPref("reduceMotion", v);
          rm.classList.toggle("on", v);
          rm.setAttribute("aria-checked", v ? "true" : "false");
          U.applyMotionPref();
        },
      },
      h("span", { class: "toggle-knob" }),
    );
    setCard.appendChild(
      h("div", { class: "set-row" }, h("span", {}, "Reduce motion"), rm),
    );
    setCard.appendChild(
      h(
        "div",
        { class: "set-actions" },
        h(
          "button",
          { class: "btn ghost", onclick: exportData },
          icon("share", 18),
          "Export data",
        ),
        h("button", { class: "btn ghost", onclick: importData }, "Import data"),
        h(
          "button",
          { class: "btn danger", onclick: confirmReset },
          icon("trash", 18),
          "Reset",
        ),
      ),
    );
    wrap.appendChild(setCard);

    // About
    var about = card("about-card");
    about.appendChild(sectionTitle("About"));
    about.appendChild(
      h(
        "p",
        { class: "muted small" },
        "Mobility Hub is an evidence-based training tool. Every recommendation links to its scientific source with an evidence grade. It is educational and not a substitute for professional medical care.",
      ),
    );
    about.appendChild(
      h(
        "div",
        { class: "about-links" },
        h(
          "button",
          {
            class: "link",
            onclick: function () {
              go("#library/science");
            },
          },
          "Scientific references",
        ),
        h(
          "a",
          {
            class: "link",
            href: "RESEARCH.md",
            target: "_blank",
            rel: "noopener",
          },
          "Research summary",
        ),
        h(
          "a",
          {
            class: "link",
            href: "README.md",
            target: "_blank",
            rel: "noopener",
          },
          "Documentation",
        ),
      ),
    );
    about.appendChild(
      h(
        "div",
        { class: "disclaimer" },
        icon("info", 18),
        h(
          "span",
          {},
          "If you experience pain, have an injury, are pregnant, or have a medical condition, consult a qualified clinician before starting.",
        ),
      ),
    );
    wrap.appendChild(about);

    return wrap;
  };

  function sumStat(val, label) {
    return h(
      "div",
      { class: "sum-stat" },
      h("div", { class: "sum-val" }, String(val)),
      h("div", { class: "sum-lbl muted small" }, label),
    );
  }
  function toggleProfileArr(key, id) {
    var arr = (store.get().profile[key] || []).slice();
    var i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(id);
    var patch = {};
    patch[key] = arr;
    store.setProfile(patch);
  }

  function exportData() {
    try {
      var blob = new Blob([store.exportJSON()], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = h("a", { href: url, download: "mobility-hub-data.json" });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
      toast("Data exported", { icon: "check" });
    } catch (e) {
      toast("Export failed", { tone: "poor" });
    }
  }
  function importData() {
    var inp = h("input", {
      type: "file",
      accept: "application/json",
      style: "display:none",
    });
    inp.addEventListener("change", function () {
      var f = inp.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        if (store.importJSON(reader.result)) {
          toast("Data imported", { icon: "check", tone: "great" });
          U.applyMotionPref();
          App.render();
        } else toast("Invalid file", { tone: "poor" });
      };
      reader.readAsText(f);
    });
    document.body.appendChild(inp);
    inp.click();
    setTimeout(function () {
      inp.remove();
    }, 500);
  }
  function confirmReset() {
    var body = h(
      "div",
      {},
      h(
        "p",
        {},
        "This permanently deletes all your sessions, assessments, goals and settings on this device. This cannot be undone.",
      ),
      h(
        "div",
        { class: "sheet-actions" },
        h(
          "button",
          { class: "btn ghost wide", onclick: U.closeSheet },
          "Cancel",
        ),
        h(
          "button",
          {
            class: "btn danger wide",
            onclick: function () {
              store.reset();
              U.closeSheet();
              U.applyMotionPref();
              go("#today");
              App.render();
              toast("Everything reset");
            },
          },
          "Delete everything",
        ),
      ),
    );
    U.openSheet("Reset all data?", body);
  }

  /* --------------------------------------------------------------- LIBRARY */
  VIEWS.library = function (route) {
    if (route.sub === "exercise" && route.param)
      return renderExerciseDetail(route.param);
    var tab =
      route.sub === "videos"
        ? "videos"
        : route.sub === "science"
          ? "science"
          : "exercises";
    var wrap = h("div", { class: "view library" });

    var tabs = h("div", { class: "lib-tabs" });
    [
      ["exercises", "Exercises", "#library"],
      ["videos", "Videos", "#library/videos"],
      ["science", "Science", "#library/science"],
    ].forEach(function (t) {
      tabs.appendChild(
        h(
          "button",
          {
            class: "lib-tab" + (tab === t[0] ? " on" : ""),
            onclick: function () {
              go(t[2]);
            },
          },
          t[1],
        ),
      );
    });
    wrap.appendChild(tabs);

    if (tab === "exercises") wrap.appendChild(libExercises());
    else if (tab === "videos") wrap.appendChild(libVideos());
    else wrap.appendChild(libScience());
    return wrap;
  };

  function libExercises() {
    var frag = document.createDocumentFragment();
    if (App.libRegion == null) App.libRegion = "all";
    var filterRow = h("div", { class: "filter-row" });
    var chips = [["all", "All"]].concat(
      MH.regions.map(function (r) {
        return [r.id, r.name];
      }),
    );
    chips.forEach(function (c) {
      filterRow.appendChild(
        h(
          "button",
          {
            class: "filter-chip" + (App.libRegion === c[0] ? " on" : ""),
            onclick: function () {
              App.libRegion = c[0];
              App.render();
            },
          },
          c[1],
        ),
      );
    });
    frag.appendChild(filterRow);

    var list = h("div", { class: "ex-list" });
    var items = MH.exercises.filter(function (e) {
      return App.libRegion === "all" || e.region === App.libRegion;
    });
    items.forEach(function (e) {
      list.appendChild(
        h(
          "button",
          {
            class: "ex-list-row",
            onclick: function () {
              go("#library/exercise/" + e.id);
            },
          },
          h(
            "div",
            { class: "ex-list-main" },
            h("div", { class: "ex-list-name" }, e.name),
            h(
              "div",
              { class: "muted small" },
              MH.regionName(e.region) +
                " · " +
                typeLabel(e.type) +
                " · " +
                "•".repeat(e.difficulty),
            ),
          ),
          h("span", { class: "assess-chev", html: icon("chevron", 20) }),
        ),
      );
    });
    frag.appendChild(list);
    return frag;
  }
  function typeLabel(t) {
    return (
      {
        "soft-tissue": "Soft tissue",
        dynamic: "Dynamic",
        static: "Static",
        pnf: "PNF",
        strength: "Strength",
        stability: "Stability",
        caps: "CARs",
        mobilize: "Mobility",
      }[t] || t
    );
  }

  function renderExerciseDetail(id) {
    var e = MH.exerciseById(id);
    if (!e) {
      go("#library");
      return h("div");
    }
    var wrap = h("div", { class: "view test-detail" });
    wrap.appendChild(
      h(
        "div",
        { class: "detail-hero" },
        h("h1", {}, e.name),
        h(
          "div",
          { class: "detail-badges" },
          U.pill(MH.regionName(e.region), "region"),
          U.pill(typeLabel(e.type)),
          h("span", { class: "ex-diff" }, "•".repeat(e.difficulty)),
        ),
      ),
    );
    wrap.appendChild(h("p", { class: "detail-about" }, e.purpose));
    wrap.appendChild(U.videoPanel(e)); // inline demo video

    var dose = card("dose-card");
    var isHold = e.holdSec > 0;
    dose.appendChild(
      h(
        "div",
        { class: "dose-grid" },
        doseItem(e.sets, "sets"),
        isHold ? doseItem(e.holdSec + "s", "hold") : doseItem(e.reps, "reps"),
        doseItem(e.bilateral ? "Both" : "—", "sides"),
      ),
    );
    dose.appendChild(
      h("p", { class: "muted small" }, "Breathing: " + e.breathing),
    );
    wrap.appendChild(dose);

    var howCard = card();
    howCard.appendChild(sectionTitle("How to do it"));
    howCard.appendChild(
      h(
        "ol",
        { class: "steps" },
        e.execution.map(function (st) {
          return h("li", {}, st);
        }),
      ),
    );
    wrap.appendChild(howCard);

    var cueCard = card();
    cueCard.appendChild(sectionTitle("Common mistakes"));
    cueCard.appendChild(
      h(
        "ul",
        { class: "mistakes" },
        e.mistakes.map(function (m) {
          return h("li", {}, m);
        }),
      ),
    );
    wrap.appendChild(cueCard);

    var scaleCard = card();
    scaleCard.appendChild(sectionTitle("Easier / harder"));
    scaleCard.appendChild(
      h("p", {}, h("strong", {}, "Regression: "), e.regression),
    );
    scaleCard.appendChild(
      h("p", {}, h("strong", {}, "Progression: "), e.progression),
    );
    wrap.appendChild(scaleCard);

    var whyCard = card();
    whyCard.appendChild(sectionTitle("Why it works"));
    whyCard.appendChild(h("p", {}, e.rationale));
    whyCard.appendChild(
      h(
        "p",
        { class: "muted small" },
        "Primary muscles: " + e.primary.join(", "),
      ),
    );
    whyCard.appendChild(U.refChips(e.refs));
    wrap.appendChild(whyCard);

    // tags
    var tagCard = card();
    tagCard.appendChild(sectionTitle("Helps with"));
    var tags = h("div", { class: "tag-wrap" });
    (e.goals || []).forEach(function (g) {
      var o = MH.goalById(g);
      if (o) tags.appendChild(U.pill(o.name, "goal"));
    });
    (e.sports || []).forEach(function (sp) {
      var o = MH.sportById(sp);
      if (o) tags.appendChild(U.pill(o.emoji + " " + o.name, "sport"));
    });
    tagCard.appendChild(tags);
    if (e.targets && e.targets.length) {
      tagCard.appendChild(
        h(
          "div",
          { class: "linked-tests" },
          h("span", { class: "muted small" }, "Tracked by: "),
          e.targets.map(function (t) {
            var a = MH.assessmentById(t);
            return a
              ? h(
                  "button",
                  {
                    class: "link",
                    onclick: function () {
                      go("#assess/" + t);
                    },
                  },
                  a.name,
                )
              : null;
          }),
        ),
      );
    }
    wrap.appendChild(tagCard);

    wrap.appendChild(
      h(
        "a",
        {
          class: "video-link wide",
          href: MH.videoUrl(e.video),
          target: "_blank",
          rel: "noopener",
        },
        icon("video", 20),
        "Watch demo — " + e.video.channel,
      ),
    );
    return wrap;
  }
  function doseItem(val, label) {
    return h(
      "div",
      { class: "dose-item" },
      h("div", { class: "dose-val" }, String(val)),
      h("div", { class: "dose-lbl muted small" }, label),
    );
  }

  function libVideos() {
    var frag = document.createDocumentFragment();
    frag.appendChild(
      h(
        "p",
        { class: "muted small lib-note" },
        "Demonstrations link to the original creators' YouTube channels (channel-scoped search, so links stay valid). We don't re-host their videos — please support them directly.",
      ),
    );
    var byChannel = {};
    MH.exercises.forEach(function (e) {
      (byChannel[e.video.channel] = byChannel[e.video.channel] || []).push(e);
    });
    Object.keys(byChannel)
      .sort()
      .forEach(function (ch) {
        var c = card("video-group");
        c.appendChild(
          h(
            "div",
            { class: "video-group-head" },
            h("h3", {}, ch),
            h(
              "a",
              {
                class: "link",
                href: "https://www.youtube.com/" + (MH.channels[ch] || ""),
                target: "_blank",
                rel: "noopener",
              },
              "Channel",
            ),
          ),
        );
        byChannel[ch].forEach(function (e) {
          c.appendChild(
            h(
              "a",
              {
                class: "video-row",
                href: MH.videoUrl(e.video),
                target: "_blank",
                rel: "noopener",
              },
              h("span", { class: "video-ic", html: icon("play", 18) }),
              h(
                "div",
                {},
                h("div", { class: "video-name" }, e.name),
                h("div", { class: "muted small" }, MH.regionName(e.region)),
              ),
            ),
          );
        });
        frag.appendChild(c);
      });
    return frag;
  }

  function libScience() {
    var frag = document.createDocumentFragment();
    var legend = card("ev-legend");
    legend.appendChild(sectionTitle("Evidence grades"));
    ["A", "B", "C"].forEach(function (lv) {
      var m = MH.EVIDENCE[lv];
      legend.appendChild(
        h(
          "div",
          { class: "ev-legend-row" },
          U.evidenceBadge(lv),
          h("span", { class: "muted small" }, m.desc),
        ),
      );
    });
    legend.appendChild(
      h(
        "p",
        { class: "muted small mt" },
        "Mobility research is mostly short trials. ROM gains are reliable; injury-prevention and performance claims are weaker. We flag this rather than overstate benefits.",
      ),
    );
    frag.appendChild(legend);

    var refs = MH.refList().sort(function (a, b) {
      var order = { A: 0, B: 1, C: 2 };
      if (order[a.level] !== order[b.level])
        return order[a.level] - order[b.level];
      return b.year - a.year;
    });
    var list = card("ref-list");
    list.appendChild(sectionTitle("References (" + refs.length + ")"));
    refs.forEach(function (r) {
      list.appendChild(
        h(
          "button",
          {
            class: "ref-row",
            onclick: function () {
              U.refSheet(r.id);
            },
          },
          h(
            "div",
            { class: "ref-row-main" },
            h("div", { class: "ref-row-title" }, r.title),
            h(
              "div",
              { class: "muted small" },
              r.authors + " · " + r.journal + " · " + r.year,
            ),
          ),
          U.evidenceBadge(r.level),
        ),
      );
    });
    frag.appendChild(list);
    frag.appendChild(
      h(
        "p",
        { class: "muted small lib-note" },
        "Full methodology in the research summary shipped with this app (RESEARCH.md).",
      ),
    );
    return frag;
  }
})(typeof window !== "undefined" ? window : this);
