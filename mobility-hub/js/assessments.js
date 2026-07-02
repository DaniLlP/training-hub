/* Mobility Hub — Assessment system (FMS-inspired, evidence-referenced)
 *
 * Each test defines:
 *  - fields[]      : the inputs the user logs (primary field drives scoring/progression)
 *  - better        : 'higher' | 'lower'  (does a bigger number mean better mobility?)
 *  - scale[]       : anchor points {v: measuredValue, s: subScore 0-100} for interpolation
 *  - progression   : {tau (weeks), plateau (value in the field's unit)} for the projection engine
 *  - regions[]     : body regions this test scores (feeds the radar / joint scores)
 *
 * See RESEARCH.md §4 for validity/reliability grades.
 */
(function (root) {
  "use strict";
  var MH = (root.MH = root.MH || {});

  MH.assessments = [
    {
      id: "toe-touch", name: "Toe Touch / Sit & Reach", region: "hamstrings", regions: ["hamstrings", "lowback"],
      evidence: "B", refs: ["mayorga2014sitreach"], sided: false, unit: "cm",
      primary: "value", better: "lower",
      about: "Standing forward fold. Measure the vertical distance from fingertips to the floor. Above the floor is positive; reaching past the toes (toward palms-down) is negative.",
      how: [
        "Stand with feet together, knees straight (not locked).",
        "Hinge and reach down slowly toward the floor.",
        "Measure fingertip-to-floor distance: +cm above the floor, -cm if you pass the toes."
      ],
      fields: [
        { key: "value", label: "Fingertips vs floor", type: "number", unit: "cm", min: -20, max: 60, step: 0.5, hint: "+ above floor, − past toes" }
      ],
      scale: [ { v: 30, s: 15 }, { v: 15, s: 40 }, { v: 5, s: 60 }, { v: 0, s: 72 }, { v: -8, s: 88 }, { v: -15, s: 100 } ],
      progression: { tau: 7, plateau: -15 }
    },
    {
      id: "ankle-wall", name: "Knee-to-Wall (Ankle Dorsiflexion)", region: "ankles", regions: ["ankles"],
      evidence: "A", refs: ["bennell1998wblt", "powden2015wblt"], sided: true, unit: "cm",
      primary: "value", better: "higher",
      about: "The weight-bearing lunge test — the most reliable objective measure in this app. Distance (cm) from the big toe to the wall while the knee touches the wall with the heel down.",
      how: [
        "Face a wall in a half-kneel, front foot pointing straight at it.",
        "Drive the knee forward to touch the wall while keeping the heel flat.",
        "Move the foot back until the knee can just still touch. Measure toe-to-wall distance. Test both sides."
      ],
      fields: [
        { key: "value", label: "Toe-to-wall distance", type: "number", unit: "cm", min: 0, max: 20, step: 0.5 },
        { key: "heelLift", label: "Heel lifted?", type: "bool" },
        { key: "kneeTouch", label: "Knee touched wall?", type: "bool" }
      ],
      scale: [ { v: 0, s: 15 }, { v: 4, s: 40 }, { v: 6, s: 55 }, { v: 10, s: 80 }, { v: 13, s: 95 }, { v: 16, s: 100 } ],
      progression: { tau: 7, plateau: 15 }
    },
    {
      id: "deep-squat", name: "Deep Squat Screen", region: "hips", regions: ["hips", "ankles", "thoracic"],
      evidence: "B", refs: ["cook2016fms", "cook2006fms"], sided: false, unit: "/10",
      primary: "depth", better: "higher",
      about: "Overhead or arms-forward bodyweight squat. Rate depth, note pain, balance and whether the heels lift.",
      how: [
        "Squat as deep as control allows, chest tall, arms reaching forward or overhead.",
        "Rate depth 1–10 (10 = hips well below knees, effortless).",
        "Note pain (0 none – 10 severe), balance 1–10, and any heel lift."
      ],
      fields: [
        { key: "depth", label: "Depth quality", type: "score", min: 1, max: 10 },
        { key: "pain", label: "Pain (0 none – 10 severe)", type: "score", min: 0, max: 10 },
        { key: "balance", label: "Balance", type: "score", min: 1, max: 10 },
        { key: "heelLift", label: "Heels lift?", type: "bool" }
      ],
      scale: [ { v: 1, s: 10 }, { v: 3, s: 30 }, { v: 5, s: 55 }, { v: 7, s: 78 }, { v: 9, s: 95 }, { v: 10, s: 100 } ],
      progression: { tau: 8, plateau: 10 }
    },
    {
      id: "hip-ir", name: "Hip Internal Rotation", region: "hips", regions: ["hips"],
      evidence: "B", refs: ["konrad2023chronic"], sided: true, unit: "°",
      primary: "value", better: "higher",
      about: "Seated or prone, measure how far the lower leg travels outward (foot away from midline) — reflecting hip internal rotation. Estimate degrees or use a 0–45 scale.",
      how: [
        "Sit on a table with knees bent 90° over the edge (or prone with knee bent).",
        "Let the foot swing outward, rotating the thigh inward.",
        "Estimate the angle from vertical (0–45°). Test both hips."
      ],
      fields: [ { key: "value", label: "Internal rotation", type: "number", unit: "°", min: 0, max: 60, step: 1 } ],
      scale: [ { v: 0, s: 15 }, { v: 15, s: 45 }, { v: 25, s: 65 }, { v: 35, s: 85 }, { v: 45, s: 100 } ],
      progression: { tau: 8, plateau: 42 }
    },
    {
      id: "hip-er", name: "Hip External Rotation", region: "hips", regions: ["hips", "glutes"],
      evidence: "B", refs: ["konrad2023chronic"], sided: true, unit: "°",
      primary: "value", better: "higher",
      about: "Seated or prone, measure how far the lower leg travels inward/across — reflecting hip external rotation.",
      how: [
        "From the same seated 90° position, let the foot swing inward across the midline.",
        "Estimate the angle from vertical (0–60°). Test both hips."
      ],
      fields: [ { key: "value", label: "External rotation", type: "number", unit: "°", min: 0, max: 70, step: 1 } ],
      scale: [ { v: 0, s: 15 }, { v: 20, s: 45 }, { v: 35, s: 70 }, { v: 45, s: 88 }, { v: 60, s: 100 } ],
      progression: { tau: 8, plateau: 55 }
    },
    {
      id: "nine-ninety", name: "90/90 Position", region: "hips", regions: ["hips"],
      evidence: "C", refs: ["cook2006fms"], sided: false, unit: "/10",
      primary: "value", better: "higher",
      about: "Seated 90/90. Rate how well both knees rest toward the floor with a tall spine (combined IR of the back hip + ER of the front hip).",
      how: [
        "Sit with front and back shins at 90°, knees on the floor.",
        "Keep the chest tall without leaning back.",
        "Rate 1–10 how easily both knees stay down with good posture."
      ],
      fields: [ { key: "value", label: "Position quality", type: "score", min: 1, max: 10 } ],
      scale: [ { v: 1, s: 12 }, { v: 4, s: 40 }, { v: 6, s: 62 }, { v: 8, s: 85 }, { v: 10, s: 100 } ],
      progression: { tau: 8, plateau: 9 }
    },
    {
      id: "shoulder-reach", name: "Shoulder Mobility (Behind-the-Back)", region: "shoulders", regions: ["shoulders", "scapula"],
      evidence: "B", refs: ["cook2016fms"], sided: true, unit: "cm",
      primary: "value", better: "lower",
      about: "Reach one hand over the shoulder and the other up the back; measure the gap between fists. Overlap is negative (better); a gap is positive. Record which hand is on top.",
      how: [
        "Make fists; reach the top hand down the back and the bottom hand up the back.",
        "Measure the vertical distance between the fists.",
        "Negative if they overlap, positive if there's a gap. Test both sides (top hand)."
      ],
      fields: [ { key: "value", label: "Gap between fists", type: "number", unit: "cm", min: -20, max: 45, step: 0.5, hint: "− overlap, + gap" } ],
      scale: [ { v: 25, s: 18 }, { v: 12, s: 42 }, { v: 5, s: 62 }, { v: 0, s: 75 }, { v: -6, s: 90 }, { v: -12, s: 100 } ],
      progression: { tau: 8, plateau: -10 }
    },
    {
      id: "thoracic-rot", name: "Thoracic Rotation", region: "thoracic", regions: ["thoracic"],
      evidence: "B", refs: ["konrad2023chronic"], sided: true, unit: "°",
      primary: "value", better: "higher",
      about: "Seated or quadruped rotation isolated to the upper back. Estimate degrees of rotation to each side.",
      how: [
        "Sit tall (or in quadruped rock-back) with the pelvis fixed.",
        "Rotate the upper back and shoulders as far as possible without the hips moving.",
        "Estimate the angle turned (0–70°). Test both directions."
      ],
      fields: [ { key: "value", label: "Rotation", type: "number", unit: "°", min: 0, max: 80, step: 1 } ],
      scale: [ { v: 15, s: 20 }, { v: 30, s: 45 }, { v: 45, s: 72 }, { v: 55, s: 90 }, { v: 70, s: 100 } ],
      progression: { tau: 8, plateau: 60 }
    },
    {
      id: "sl-balance", name: "Single-Leg Balance", region: "fullbody", regions: ["ankles", "fullbody"],
      evidence: "A", refs: ["schiftan2015balance", "rivera2017proprio"], sided: true, unit: "s",
      primary: "eyesClosed", better: "higher",
      about: "Time you can balance on one leg. Eyes-closed is the more sensitive measure. Test both legs.",
      how: [
        "Stand on one leg, hands on hips, other foot off the floor.",
        "Time how long you hold steady with eyes open, then eyes closed (stop when the foot touches down or you hop).",
        "Test both legs."
      ],
      fields: [
        { key: "eyesOpen", label: "Eyes open", type: "number", unit: "s", min: 0, max: 120, step: 1 },
        { key: "eyesClosed", label: "Eyes closed", type: "number", unit: "s", min: 0, max: 90, step: 1 }
      ],
      scale: [ { v: 3, s: 20 }, { v: 8, s: 45 }, { v: 15, s: 68 }, { v: 25, s: 88 }, { v: 40, s: 100 } ],
      progression: { tau: 6, plateau: 45 }
    },
    {
      id: "aslr", name: "Active Straight-Leg Raise", region: "hamstrings", regions: ["hamstrings", "hips"],
      evidence: "B", refs: ["cook2016fms", "mayorga2014sitreach"], sided: true, unit: "°",
      primary: "value", better: "higher",
      about: "Lying on your back, raise one straight leg as high as possible with the other flat. Estimate the hip-flexion angle. Test both legs.",
      how: [
        "Lie flat, both legs straight.",
        "Raise one straight leg (knee locked) as high as possible; the other stays down.",
        "Estimate the angle from the floor (0–90°). Test both legs."
      ],
      fields: [ { key: "value", label: "Leg-raise angle", type: "number", unit: "°", min: 0, max: 100, step: 1 } ],
      scale: [ { v: 40, s: 22 }, { v: 55, s: 50 }, { v: 65, s: 72 }, { v: 75, s: 90 }, { v: 85, s: 100 } ],
      progression: { tau: 7, plateau: 82 }
    },
    {
      id: "couch-stretch", name: "Couch Stretch Position", region: "hips", regions: ["hips"],
      evidence: "C", refs: ["konrad2024"], sided: true, unit: "/10",
      primary: "value", better: "higher",
      about: "Back foot elevated behind you, torso upright. Rate how upright you can get with the pelvis tucked (reflects hip-flexor/quad length). Test both sides.",
      how: [
        "Half-kneel with the back shin up a wall/couch.",
        "Tuck the pelvis and raise the torso as upright as possible without the low back arching.",
        "Rate 1–10 (10 = torso vertical, easy). Test both sides."
      ],
      fields: [ { key: "value", label: "Position quality", type: "score", min: 1, max: 10 } ],
      scale: [ { v: 1, s: 12 }, { v: 4, s: 42 }, { v: 6, s: 65 }, { v: 8, s: 86 }, { v: 10, s: 100 } ],
      progression: { tau: 8, plateau: 9 }
    },
    {
      id: "cervical-rot", name: "Neck Rotation", region: "neck", regions: ["neck"],
      evidence: "C", refs: ["page2012"], sided: true, unit: "°",
      primary: "value", better: "higher",
      about: "Seated, rotate the head to look over each shoulder. Estimate degrees (normal ~ 70–80°).",
      how: [
        "Sit tall, look straight ahead.",
        "Rotate the head to look over one shoulder as far as comfortable.",
        "Estimate the angle (0–90°). Test both directions."
      ],
      fields: [ { key: "value", label: "Rotation", type: "number", unit: "°", min: 0, max: 90, step: 1 } ],
      scale: [ { v: 30, s: 25 }, { v: 50, s: 55 }, { v: 65, s: 80 }, { v: 75, s: 95 }, { v: 85, s: 100 } ],
      progression: { tau: 6, plateau: 80 }
    },
    {
      id: "wrist-ext", name: "Wrist Extension", region: "wrists", regions: ["wrists"],
      evidence: "C", refs: ["page2012"], sided: true, unit: "°",
      primary: "value", better: "higher",
      about: "Palm pressed to a surface / prayer position; estimate wrist extension angle (functional target ~ 70–90° for weight-bearing).",
      how: [
        "Press palms together in front of the chest (prayer) and lower the hands.",
        "Or place a palm flat and rock forward; estimate the wrist angle.",
        "Record degrees for each wrist."
      ],
      fields: [ { key: "value", label: "Extension", type: "number", unit: "°", min: 0, max: 100, step: 1 } ],
      scale: [ { v: 30, s: 25 }, { v: 50, s: 55 }, { v: 70, s: 82 }, { v: 85, s: 97 }, { v: 95, s: 100 } ],
      progression: { tau: 6, plateau: 88 }
    }
  ];

  MH.assessmentById = function (id) {
    for (var i = 0; i < MH.assessments.length; i++) if (MH.assessments[i].id === id) return MH.assessments[i];
    return null;
  };
})(typeof window !== "undefined" ? window : this);
