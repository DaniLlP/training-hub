/* Mobility Hub — Catalog: regions, sports, goals, video channels, achievements */
(function (root) {
  "use strict";
  var MH = (root.MH = root.MH || {});

  /* Body regions (order = display order). icon = inline SVG path key handled in ui. */
  MH.regions = [
    { id: "hips", name: "Hips", blurb: "Rotation, flexion, extension, stability" },
    { id: "ankles", name: "Ankles", blurb: "Dorsiflexion, plantar flexion, stability" },
    { id: "knees", name: "Knees", blurb: "Mechanics, control, resilience" },
    { id: "hamstrings", name: "Hamstrings", blurb: "Posterior-chain length" },
    { id: "glutes", name: "Glutes", blurb: "Hip extension & rotation" },
    { id: "adductors", name: "Adductors", blurb: "Groin length & lateral range" },
    { id: "lowback", name: "Low Back", blurb: "Spinal control & extension" },
    { id: "thoracic", name: "Thoracic Spine", blurb: "Rotation & extension" },
    { id: "shoulders", name: "Shoulders", blurb: "Overhead & behind-the-back" },
    { id: "scapula", name: "Scapula", blurb: "Blade control & posture" },
    { id: "wrists", name: "Wrists", blurb: "Load tolerance" },
    { id: "neck", name: "Neck", blurb: "Rotation & posture" },
    { id: "fullbody", name: "Full Body", blurb: "Flows, balance, integration" }
  ];
  MH.regionName = function (id) {
    for (var i = 0; i < MH.regions.length; i++) if (MH.regions[i].id === id) return MH.regions[i].name;
    return id;
  };

  /* Sports → priority regions + one-line rationale (see RESEARCH.md §6). */
  MH.sports = [
    { id: "running", name: "Running", emoji: "🏃", regions: ["ankles", "hips", "hamstrings", "glutes", "thoracic"],
      blurb: "Hip extension, ankle dorsiflexion and posterior-chain function drive economical stride." },
    { id: "skiing", name: "Skiing", emoji: "🎿", regions: ["ankles", "hips", "adductors", "knees", "fullbody"],
      blurb: "Deep-squat mechanics, lateral hip range and single-leg balance for edge control." },
    { id: "surfing", name: "Surfing", emoji: "🏄", regions: ["thoracic", "hips", "shoulders", "fullbody", "hamstrings"],
      blurb: "Pop-up needs T-spine + hip rotation, shoulder mobility and balance." },
    { id: "football", name: "Football", emoji: "⚽", regions: ["hips", "adductors", "ankles", "thoracic", "fullbody"],
      blurb: "Hip IR/ER and adductor length for cutting; ankle stability for change of direction." },
    { id: "padel", name: "Padel", emoji: "🎾", regions: ["thoracic", "hips", "shoulders", "ankles", "fullbody"],
      blurb: "Rotational T-spine and shoulder mobility for swings; ankle agility." },
    { id: "functional", name: "Functional Fitness", emoji: "🏋️", regions: ["hips", "ankles", "thoracic", "shoulders", "hamstrings"],
      blurb: "Deep squat, overhead position and full-range control for varied lifts." },
    { id: "cycling", name: "Cycling", emoji: "🚴", regions: ["hips", "thoracic", "lowback", "hamstrings", "neck"],
      blurb: "Hip flexor length, T-spine extension and neck comfort for the aero position." },
    { id: "scuba", name: "Scuba Diving", emoji: "🤿", regions: ["shoulders", "thoracic", "hips", "scapula", "neck"],
      blurb: "Overhead & behind-the-back reach for tanks/valves; T-spine and hip range for trim and wetsuits." }
  ];
  MH.sportById = function (id) {
    for (var i = 0; i < MH.sports.length; i++) if (MH.sports[i].id === id) return MH.sports[i];
    return null;
  };

  /* Goals → regions prioritised + (optional) the assessment that tracks them. */
  MH.goals = [
    { id: "touch-toes", name: "Touch toes comfortably", regions: ["hamstrings", "lowback"], track: "toe-touch" },
    { id: "palms-floor", name: "Palms flat on floor", regions: ["hamstrings", "hips"], track: "toe-touch" },
    { id: "deep-squat", name: "Pain-free deep squat", regions: ["ankles", "hips", "adductors", "thoracic"], track: "deep-squat" },
    { id: "ankle-df", name: "Better ankle dorsiflexion", regions: ["ankles"], track: "ankle-wall" },
    { id: "hip-mobility", name: "Better hip mobility", regions: ["hips", "glutes", "adductors"], track: "hip-ir" },
    { id: "overhead", name: "Better overhead mobility", regions: ["shoulders", "scapula", "thoracic"], track: "shoulder-reach" },
    { id: "run-mechanics", name: "Better running mechanics", regions: ["hips", "ankles", "hamstrings", "glutes"], track: "aslr" },
    { id: "surf-mobility", name: "Better surfing mobility", regions: ["thoracic", "hips", "shoulders"], track: "thoracic-rot" },
    { id: "ski-mobility", name: "Better skiing mobility", regions: ["ankles", "hips", "adductors"], track: "deep-squat" },
    { id: "scuba-tank", name: "Scuba tank / valve reach", regions: ["shoulders", "scapula", "thoracic"], track: "shoulder-reach" },
    { id: "wetsuit", name: "Easier wetsuit dressing", regions: ["shoulders", "thoracic", "hips"], track: "shoulder-reach" },
    { id: "posture", name: "Better posture", regions: ["thoracic", "scapula", "neck", "lowback"], track: "thoracic-rot" }
  ];
  MH.goalById = function (id) {
    for (var i = 0; i < MH.goals.length; i++) if (MH.goals[i].id === id) return MH.goals[i];
    return null;
  };

  /* YouTube channel handles for the video library (channel-scoped search = always resolves). */
  MH.channels = {
    "Squat University": "@SquatUniversity",
    "E3 Rehab": "@E3Rehab",
    "The Prehab Guys": "@ThePrehabGuys",
    "Physiotutors": "@Physiotutors",
    "Strength Side": "@Strengthside",
    "Tom Merrick": "@TomMerrick",
    "The Ready State": "@thereadystate",
    "Athlean-X": "@athleanx",
    "Precision Movement": "@PrecisionMovementRehab"
  };
  // Build a channel-scoped YouTube search URL (robust vs. dead video IDs).
  MH.videoUrl = function (video) {
    if (!video) return "https://www.youtube.com/";
    var handle = MH.channels[video.channel];
    var q = encodeURIComponent(video.query || "");
    if (handle) return "https://www.youtube.com/" + handle + "/search?query=" + q;
    return "https://www.youtube.com/results?search_query=" + encodeURIComponent((video.channel || "") + " " + (video.query || ""));
  };

  /* Achievements — evaluated by engine.evaluateAchievements(state). */
  MH.achievements = [
    { id: "first-session", name: "First Steps", desc: "Complete your first session", icon: "🌱", type: "sessions", threshold: 1 },
    { id: "ten-sessions", name: "Getting Consistent", desc: "Complete 10 sessions", icon: "🔟", type: "sessions", threshold: 10 },
    { id: "fifty-sessions", name: "Mobility Habit", desc: "Complete 50 sessions", icon: "🏅", type: "sessions", threshold: 50 },
    { id: "streak-3", name: "On a Roll", desc: "3-day streak", icon: "🔥", type: "streak", threshold: 3 },
    { id: "streak-7", name: "Week Warrior", desc: "7-day streak", icon: "⚡", type: "streak", threshold: 7 },
    { id: "streak-30", name: "Unbreakable", desc: "30-day streak", icon: "💎", type: "streak", threshold: 30 },
    { id: "minutes-60", name: "First Hour", desc: "60 total minutes", icon: "⏱️", type: "minutes", threshold: 60 },
    { id: "minutes-600", name: "Ten Hours In", desc: "600 total minutes", icon: "🕙", type: "minutes", threshold: 600 },
    { id: "assessed", name: "Know Thyself", desc: "Log your first assessment", icon: "📏", type: "assessments", threshold: 1 },
    { id: "reassessed", name: "Tracking Progress", desc: "Re-test any assessment", icon: "📈", type: "reassess", threshold: 1 },
    { id: "score-70", name: "Solid Mover", desc: "Reach a Mobility Score of 70", icon: "🎯", type: "score", threshold: 70 },
    { id: "score-85", name: "Fluid", desc: "Reach a Mobility Score of 85", icon: "🌊", type: "score", threshold: 85 },
    { id: "week-goal", name: "Target Met", desc: "Hit your weekly minutes goal", icon: "✅", type: "weekgoal", threshold: 1 },
    { id: "all-regions", name: "Well Rounded", desc: "Train every body region at least once", icon: "🧭", type: "regions", threshold: 13 }
  ];
})(typeof window !== "undefined" ? window : this);
