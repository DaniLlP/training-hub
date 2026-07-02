/* Mobility Hub — Canvas visualizations (DPR-aware, dark-theme).
 * All functions are defensive: if the canvas isn't ready they no-op.
 */
(function (root) {
  "use strict";
  var MH = (root.MH = root.MH || {});

  var PALETTE = {
    pink: "#ff375f", mint: "#32d6c2", blue: "#0a84ff", purple: "#5e5ce6",
    green: "#30d158", orange: "#ff9f0a", red: "#ff453a", yellow: "#ffd60a",
    grid: "rgba(255,255,255,0.10)", track: "rgba(255,255,255,0.08)",
    text: "rgba(235,235,245,0.7)", textDim: "rgba(235,235,245,0.45)"
  };

  function setup(canvas) {
    if (!canvas || !canvas.getContext) return null;
    var dpr = root.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
    if (!w || !h) { w = canvas.width || 300; h = canvas.height || 150; }
    canvas.width = w * dpr; canvas.height = h * dpr;
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }

  function toneColor(tone) {
    return { great: PALETTE.green, good: PALETTE.mint, fair: PALETTE.yellow, low: PALETTE.orange, poor: PALETTE.red, none: PALETTE.textDim }[tone] || PALETTE.mint;
  }
  MH.toneColor = toneColor;

  MH.charts = {
    palette: PALETTE,

    /* Apple-style concentric progress rings.
     * rings: [{value 0..1, color, label}] from OUTER to inner. */
    rings: function (canvas, rings, opts) {
      var s = setup(canvas); if (!s) return;
      opts = opts || {};
      var ctx = s.ctx, cx = s.w / 2, cy = s.h / 2;
      var maxR = Math.min(s.w, s.h) / 2 - 6;
      var thickness = opts.thickness || Math.max(8, maxR * 0.18);
      var gap = opts.gap || 6;
      rings.forEach(function (ring, i) {
        var r = maxR - i * (thickness + gap);
        if (r < thickness / 2) return;
        // track
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = PALETTE.track; ctx.lineWidth = thickness; ctx.lineCap = "round";
        ctx.stroke();
        // value arc
        var val = Math.max(0, Math.min(1, ring.value || 0));
        if (val > 0) {
          ctx.beginPath();
          var start = -Math.PI / 2;
          ctx.arc(cx, cy, r, start, start + val * Math.PI * 2);
          ctx.strokeStyle = ring.color || PALETTE.mint; ctx.lineWidth = thickness; ctx.lineCap = "round";
          ctx.stroke();
        }
      });
      if (opts.center) {
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "700 " + Math.round(maxR * 0.42) + "px -apple-system,system-ui,sans-serif";
        ctx.fillText(opts.center, cx, cy - (opts.centerSub ? maxR * 0.12 : 0));
        if (opts.centerSub) {
          ctx.fillStyle = PALETTE.textDim;
          ctx.font = "600 " + Math.round(maxR * 0.16) + "px -apple-system,system-ui,sans-serif";
          ctx.fillText(opts.centerSub, cx, cy + maxR * 0.28);
        }
      }
    },

    /* Radar / spider chart. data: {labels:[], values:[0..max]}, opts.max default 100 */
    radar: function (canvas, data, opts) {
      var s = setup(canvas); if (!s) return;
      opts = opts || {};
      var ctx = s.ctx, cx = s.w / 2, cy = s.h / 2;
      var R = Math.min(s.w, s.h) / 2 - 24;
      var n = data.labels.length, max = opts.max || 100;
      if (n < 3) return;
      var color = opts.color || PALETTE.mint;

      // grid rings
      [0.25, 0.5, 0.75, 1].forEach(function (f) {
        ctx.beginPath();
        for (var i = 0; i <= n; i++) {
          var a = -Math.PI / 2 + (i % n) * (Math.PI * 2 / n);
          var x = cx + Math.cos(a) * R * f, y = cy + Math.sin(a) * R * f;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = PALETTE.grid; ctx.lineWidth = 1; ctx.stroke();
      });
      // spokes + labels
      ctx.fillStyle = PALETTE.textDim;
      ctx.font = "600 10px -apple-system,system-ui,sans-serif";
      for (var i = 0; i < n; i++) {
        var a = -Math.PI / 2 + i * (Math.PI * 2 / n);
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.strokeStyle = PALETTE.grid; ctx.stroke();
        var lx = cx + Math.cos(a) * (R + 12), ly = cy + Math.sin(a) * (R + 12);
        ctx.textAlign = Math.abs(Math.cos(a)) < 0.3 ? "center" : (Math.cos(a) > 0 ? "left" : "right");
        ctx.textBaseline = Math.abs(Math.sin(a)) < 0.3 ? "middle" : (Math.sin(a) > 0 ? "top" : "bottom");
        ctx.fillText(data.labels[i], lx, ly);
      }
      // data polygon
      ctx.beginPath();
      for (var j = 0; j <= n; j++) {
        var idx = j % n;
        var v = Math.max(0, Math.min(max, data.values[idx] || 0)) / max;
        var ang = -Math.PI / 2 + idx * (Math.PI * 2 / n);
        var x = cx + Math.cos(ang) * R * v, y = cy + Math.sin(ang) * R * v;
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = hexA(color, 0.22); ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      // vertices
      for (var k = 0; k < n; k++) {
        var vv = Math.max(0, Math.min(max, data.values[k] || 0)) / max;
        var ak = -Math.PI / 2 + k * (Math.PI * 2 / n);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ak) * R * vv, cy + Math.sin(ak) * R * vv, 3, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      }
    },

    /* Line chart. points: [{label, value}]. opts: {min,max,color,fill,unit,invert} */
    trend: function (canvas, points, opts) {
      var s = setup(canvas); if (!s) return;
      opts = opts || {};
      if (!points || !points.length) { emptyMsg(s, "No data yet"); return; }
      var ctx = s.ctx, padL = 30, padR = 12, padT = 12, padB = 22;
      var w = s.w - padL - padR, h = s.h - padT - padB;
      var color = opts.color || PALETTE.mint;
      var vals = points.map(function (p) { return p.value; });
      var min = opts.min != null ? opts.min : Math.min.apply(null, vals);
      var max = opts.max != null ? opts.max : Math.max.apply(null, vals);
      if (min === max) { min -= 1; max += 1; }
      var n = points.length;
      function X(i) { return padL + (n === 1 ? w / 2 : (i / (n - 1)) * w); }
      function Y(v) { var t = (v - min) / (max - min); if (opts.invert) t = 1 - t; return padT + (1 - t) * h; }

      // gridlines
      ctx.strokeStyle = PALETTE.grid; ctx.lineWidth = 1;
      ctx.fillStyle = PALETTE.textDim; ctx.font = "10px -apple-system,system-ui,sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var g = 0; g <= 3; g++) {
        var yy = padT + (g / 3) * h; var vv = max - (g / 3) * (max - min);
        ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(padL + w, yy); ctx.stroke();
        ctx.fillText(Math.round(vv), padL - 5, yy);
      }
      // area
      var grad = ctx.createLinearGradient(0, padT, 0, padT + h);
      grad.addColorStop(0, hexA(color, 0.30)); grad.addColorStop(1, hexA(color, 0));
      ctx.beginPath(); ctx.moveTo(X(0), Y(points[0].value));
      for (var i = 1; i < n; i++) ctx.lineTo(X(i), Y(points[i].value));
      ctx.lineTo(X(n - 1), padT + h); ctx.lineTo(X(0), padT + h); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      // line
      ctx.beginPath(); ctx.moveTo(X(0), Y(points[0].value));
      for (var j = 1; j < n; j++) ctx.lineTo(X(j), Y(points[j].value));
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke();
      // points + x labels
      ctx.fillStyle = PALETTE.textDim; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var k = 0; k < n; k++) {
        ctx.beginPath(); ctx.arc(X(k), Y(points[k].value), 3, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
        if (points[k].label && (n <= 8 || k % Math.ceil(n / 6) === 0)) {
          ctx.fillStyle = PALETTE.textDim;
          ctx.fillText(points[k].label, X(k), padT + h + 5);
        }
      }
    },

    /* Projection chart: dashed model line + solid actual points. */
    projection: function (canvas, proj) {
      var s = setup(canvas); if (!s) return;
      if (!proj) { emptyMsg(s, "Log this test twice to project"); return; }
      var ctx = s.ctx, padL = 34, padR = 12, padT = 12, padB = 22;
      var w = s.w - padL - padR, h = s.h - padT - padB;
      var color = PALETTE.mint, actualColor = PALETTE.blue;
      var xs = proj.points.map(function (p) { return p.week; });
      var maxW = Math.max.apply(null, xs);
      var allV = proj.points.map(function (p) { return p.value; }).concat(proj.actuals.map(function (a) { return a.value; }));
      var min = Math.min.apply(null, allV), max = Math.max.apply(null, allV);
      if (min === max) { min -= 1; max += 1; }
      var pad = (max - min) * 0.12; min -= pad; max += pad;
      function X(week) { return padL + (week / maxW) * w; }
      function Y(v) { return padT + (1 - (v - min) / (max - min)) * h; }

      ctx.strokeStyle = PALETTE.grid; ctx.lineWidth = 1;
      ctx.fillStyle = PALETTE.textDim; ctx.font = "10px -apple-system,system-ui,sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var g = 0; g <= 3; g++) {
        var yy = padT + (g / 3) * h; var vv = max - (g / 3) * (max - min);
        ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(padL + w, yy); ctx.stroke();
        ctx.fillText(Math.round(vv), padL - 5, yy);
      }
      // model (dashed)
      ctx.setLineDash([5, 4]); ctx.beginPath();
      proj.points.forEach(function (p, i) { i ? ctx.lineTo(X(p.week), Y(p.value)) : ctx.moveTo(X(p.week), Y(p.value)); });
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke(); ctx.setLineDash([]);
      // actuals
      ctx.fillStyle = actualColor;
      proj.actuals.forEach(function (a) {
        ctx.beginPath(); ctx.arc(X(a.weeks), Y(a.value), 4, 0, Math.PI * 2); ctx.fill();
      });
      // x labels
      ctx.fillStyle = PALETTE.textDim; ctx.textAlign = "center"; ctx.textBaseline = "top";
      [0, 4, 8, 12, 20].forEach(function (wk) { if (wk <= maxW) ctx.fillText(wk + "w", X(wk), padT + h + 5); });
    },

    /* Vertical bars. data: [{label, value}]. opts: {color, max, unit} */
    bars: function (canvas, data, opts) {
      var s = setup(canvas); if (!s) return;
      opts = opts || {};
      if (!data || !data.length) { emptyMsg(s, "No data"); return; }
      var ctx = s.ctx, padT = 10, padB = 20, padX = 6;
      var h = s.h - padT - padB, w = s.w - padX * 2;
      var color = opts.color || PALETTE.mint;
      var max = opts.max || Math.max.apply(null, data.map(function (d) { return d.value; })) || 1;
      var bw = w / data.length, innerW = Math.min(bw * 0.62, 34);
      data.forEach(function (d, i) {
        var bh = Math.max(0, (d.value / max) * h);
        var x = padX + i * bw + (bw - innerW) / 2, y = padT + (h - bh);
        roundRect(ctx, x, y, innerW, bh, Math.min(6, innerW / 2));
        ctx.fillStyle = d.highlight ? PALETTE.pink : color; ctx.fill();
        ctx.fillStyle = PALETTE.textDim; ctx.font = "10px -apple-system,system-ui,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(d.label, padX + i * bw + bw / 2, padT + h + 4);
      });
    }
  };

  function roundRect(ctx, x, y, w, h, r) {
    if (h <= 0) { return; }
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function emptyMsg(s, msg) {
    var ctx = s.ctx;
    ctx.fillStyle = PALETTE.textDim;
    ctx.font = "600 12px -apple-system,system-ui,sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(msg, s.w / 2, s.h / 2);
  }

  // "#rrggbb" + alpha → rgba()
  function hexA(hex, a) {
    if (hex[0] !== "#") return hex;
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
})(typeof window !== "undefined" ? window : this);
