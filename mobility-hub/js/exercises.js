/* Mobility Hub — Exercise database
 * Every exercise carries full coaching + scientific metadata.
 * region:  hips|ankles|knees|hamstrings|glutes|adductors|lowback|thoracic|shoulders|scapula|wrists|neck|fullbody
 * type:    soft-tissue|dynamic|static|pnf|strength|stability|caps
 * phase:   prep|mobilize|lengthen|stabilize   (drives session ordering)
 * difficulty: 1 beginner | 2 intermediate | 3 advanced
 * Timing fields feed the session generator (see programs.js estSeconds()).
 */
(function (root) {
  "use strict";
  var MH = (root.MH = root.MH || {});

  MH.exercises = [
    /* ---------------------------------------------------------------- ANKLES */
    {
      id: "ankle-band-df", name: "Banded Ankle Dorsiflexion Mobilization",
      region: "ankles", type: "mobilize", phase: "mobilize",
      primary: ["Tibialis anterior", "Gastrocnemius", "Soleus", "Talus (joint glide)"],
      purpose: "Restore forward shin travel (dorsiflexion) needed for deep squat, running and skiing.",
      rationale: "A posterior-to-anterior band traction on the talus creates a joint mobilization that pairs with active lunging; weight-bearing dorsiflexion drills improve the measurable knee-to-wall distance.",
      execution: [
        "Loop a band around a post at ankle height; hook it over the front of the ankle.",
        "Step forward into a half-kneel, band pulling the ankle backward.",
        "Drive the knee forward over the toes, heel glued down.",
        "Return and repeat with a smooth 2-second rhythm."
      ],
      mistakes: ["Heel lifting off the floor", "Knee caving inward", "Band placed on the shin instead of the joint line"],
      sets: 2, reps: 10, holdSec: 0, bilateral: true,
      breathing: "Exhale as the knee travels forward.",
      difficulty: 1, regression: "Reduce range; no band, just active knee-over-toe rocks.",
      progression: "Add a slow 3s end-range hold each rep, or elevate the forefoot slightly.",
      targets: ["ankle-wall"], sports: ["running", "skiing", "functional", "football", "cycling"],
      goals: ["deep-squat", "ankle-df", "run-mechanics", "ski-mobility"],
      refs: ["bennell1998wblt", "konrad2024"],
      video: { channel: "Squat University", query: "ankle dorsiflexion mobility banded" }
    },
    {
      id: "calf-roll", name: "Calf Self-Myofascial Release",
      region: "ankles", type: "soft-tissue", phase: "prep",
      primary: ["Gastrocnemius", "Soleus"],
      purpose: "Prime calf tissue and reduce perceived tightness before dorsiflexion work.",
      rationale: "Foam rolling produces a small-to-moderate acute ROM increase without harming performance, making it a useful primer rather than the main driver of change.",
      execution: [
        "Sit with a roller under one calf, other leg crossed on top for load.",
        "Roll slowly from just above the ankle to below the knee.",
        "Pause 3–5 s on tender spots and gently pump the ankle."
      ],
      mistakes: ["Rolling too fast to have any effect", "Holding your breath", "Rolling directly on the back of the knee"],
      sets: 1, reps: 8, holdSec: 0, bilateral: true,
      breathing: "Slow nasal breathing; exhale on tender spots.",
      difficulty: 1, regression: "Less bodyweight through the roller.",
      progression: "Add ankle circles while paused on a trigger point.",
      targets: ["ankle-wall"], sports: ["running", "cycling", "functional", "skiing"],
      goals: ["ankle-df", "deep-squat"], refs: ["wiewelhove2019foam", "konrad2022foam"],
      video: { channel: "The Ready State", query: "calf smash foam roll" }
    },
    {
      id: "tib-raises", name: "Tibialis Raises",
      region: "ankles", type: "strength", phase: "stabilize",
      primary: ["Tibialis anterior"],
      purpose: "Build anterior shin strength for controlled dorsiflexion, deceleration and shin-splint resilience.",
      rationale: "Loading the tibialis through range develops usable, controlled dorsiflexion and supports the joint you just mobilized.",
      execution: [
        "Stand with heels ~10–15 cm from a wall, upper back lightly resting on it.",
        "Keep legs straight; pull the toes up toward the shins as high as possible.",
        "Lower under control to the floor."
      ],
      mistakes: ["Bouncing at the bottom", "Bending the knees to cheat", "Standing too far from the wall and losing balance"],
      sets: 2, reps: 15, holdSec: 0, bilateral: false,
      breathing: "Exhale pulling toes up.",
      difficulty: 1, regression: "Fewer reps; sit down and lift toes.",
      progression: "Add ankle weights or a slow 3s eccentric.",
      targets: ["ankle-wall", "sl-balance"], sports: ["running", "football", "functional", "padel"],
      goals: ["ankle-df", "run-mechanics"], refs: ["konrad2022foam"],
      video: { channel: "Strength Side", query: "tibialis raise" }
    },
    {
      id: "heel-raise-eccentric", name: "Eccentric Heel Raise (Plantar Flexion)",
      region: "ankles", type: "strength", phase: "stabilize",
      primary: ["Gastrocnemius", "Soleus", "Achilles tendon"],
      purpose: "Strengthen plantar flexion and load the Achilles for push-off in running, skiing and diving fin kicks.",
      rationale: "Slow eccentric calf loading is a well-established tendon-conditioning stimulus and complements dorsiflexion mobility with end-range control.",
      execution: [
        "Stand on the edge of a step, balls of the feet on the edge.",
        "Rise onto both toes, then shift to one leg.",
        "Lower slowly (3–4 s) below step level, feeling a calf stretch."
      ],
      mistakes: ["Dropping fast instead of controlling the lower", "Short range", "Rolling to the outside of the foot"],
      sets: 3, reps: 10, holdSec: 0, bilateral: false,
      breathing: "Exhale on the way up.",
      difficulty: 2, regression: "Two-leg raises on flat ground.",
      progression: "Add load in a backpack or hold a dumbbell.",
      targets: ["sl-balance"], sports: ["running", "skiing", "scuba", "functional", "cycling"],
      goals: ["run-mechanics", "ankle-df"], refs: ["page2012"],
      video: { channel: "E3 Rehab", query: "eccentric heel raise achilles" }
    },

    /* ------------------------------------------------------------------ HIPS */
    {
      id: "ninety-ninety-switch", name: "90/90 Hip Switches",
      region: "hips", type: "mobilize", phase: "mobilize",
      primary: ["Hip external rotators", "Hip internal rotators", "Glutes"],
      purpose: "Actively train hip internal and external rotation together — the pattern that unlocks deep squats and rotational sport.",
      rationale: "Active end-range rotation drills improve the 90/90 assessment and rotational capacity used in football, padel, surfing and skiing.",
      execution: [
        "Sit with front shin and back shin at 90°, both knees on the floor.",
        "Keep the chest tall; rotate both knees to the opposite side under control.",
        "Pause briefly at end range before switching."
      ],
      mistakes: ["Rounding the low back to force range", "Using hands to push knees down", "Rushing through mid-range"],
      sets: 2, reps: 10, holdSec: 0, bilateral: true,
      breathing: "Exhale as knees rotate down.",
      difficulty: 2, regression: "Hands behind you for support; smaller range.",
      progression: "Lift hands off floor; add a 3s end-range lift-off.",
      targets: ["hip-ir", "hip-er", "nine-ninety"], sports: ["football", "padel", "surfing", "skiing", "functional"],
      goals: ["hip-mobility", "deep-squat", "surf-mobility", "ski-mobility"],
      refs: ["konrad2023chronic", "cook2016fms"],
      video: { channel: "Squat University", query: "90 90 hip switch mobility" }
    },
    {
      id: "90-90-lift", name: "90/90 End-Range Lift-Off (Loaded IR/ER)",
      region: "hips", type: "strength", phase: "stabilize",
      primary: ["Hip internal rotators", "Hip external rotators"],
      purpose: "Own the end range of hip rotation with active, loaded control rather than passive stretch.",
      rationale: "End-range isometrics build strength and control at the limits of range, which helps range stick and translates to sport.",
      execution: [
        "From a 90/90 position, keep the back shin down.",
        "Internally rotate the back hip to lift the foot off the floor.",
        "Hold, then lower with control. Repeat, then switch to the front-leg external rotation lift."
      ],
      mistakes: ["Leaning the torso to fake the lift", "Lifting the knee instead of the foot", "Holding the breath"],
      sets: 2, reps: 8, holdSec: 3, bilateral: true,
      breathing: "Exhale during the lift and hold.",
      difficulty: 3, regression: "Passive 90/90 switches without lift-off.",
      progression: "Add a light ankle weight.",
      targets: ["hip-ir", "hip-er", "nine-ninety"], sports: ["football", "padel", "surfing", "functional"],
      goals: ["hip-mobility", "deep-squat"], refs: ["hindle2012pnf"],
      video: { channel: "The Prehab Guys", query: "90 90 hip lift off internal rotation" }
    },
    {
      id: "couch-stretch", name: "Couch Stretch (Hip Flexor / Quad)",
      region: "hips", type: "static", phase: "lengthen",
      primary: ["Iliopsoas", "Rectus femoris", "Quadriceps"],
      purpose: "Lengthen hip flexors and quads to restore hip extension for running stride and posture.",
      rationale: "Static stretch training reliably improves ROM; hip-flexor length supports extension needed in gait and reduces anterior-pelvic compensation.",
      execution: [
        "Half-kneel with the back foot up a wall or on a couch.",
        "Tuck the pelvis under (posterior tilt) to feel the front of the hip.",
        "Raise the torso tall and hold; keep glute of the back leg engaged."
      ],
      mistakes: ["Letting the low back arch instead of tucking the pelvis", "Knee pain from no padding", "Twisting the torso away"],
      sets: 2, reps: 0, holdSec: 40, bilateral: true,
      breathing: "Slow breathing; relax deeper on each exhale.",
      difficulty: 2, regression: "Foot on the floor in a standing lunge.",
      progression: "Foot higher up the wall; add a gentle glute squeeze contraction (PNF).",
      targets: ["couch-stretch"], sports: ["running", "cycling", "skiing", "functional"],
      goals: ["hip-mobility", "run-mechanics", "posture"], refs: ["konrad2024", "page2012"],
      video: { channel: "The Ready State", query: "couch stretch hip flexor" }
    },
    {
      id: "hip-cars", name: "Hip Controlled Articular Rotations (CARs)",
      region: "hips", type: "caps", phase: "mobilize",
      primary: ["Whole hip capsule", "Glutes", "Hip rotators"],
      purpose: "Actively explore the full circumference of hip motion to maintain joint health and control.",
      rationale: "Slow, maximal-effort rotations train active control through the outer limits of range, complementing passive flexibility work.",
      execution: [
        "On all fours or standing tall, lift one knee toward the chest.",
        "Sweep it out to the side (abduction + external rotation).",
        "Continue backward into extension, then internally rotate to close the circle.",
        "Move slowly and keep the rest of the body still."
      ],
      mistakes: ["Twisting the spine to gain fake range", "Rushing the circle", "Losing tension at the top"],
      sets: 2, reps: 4, holdSec: 0, bilateral: true,
      breathing: "Breathe continuously; do not hold.",
      difficulty: 2, regression: "Smaller circles; hold a support.",
      progression: "Maximal irradiation (brace whole body) for slower, harder reps.",
      targets: ["hip-ir", "hip-er"], sports: ["surfing", "football", "padel", "functional", "skiing"],
      goals: ["hip-mobility", "deep-squat"], refs: ["page2012"],
      video: { channel: "Strength Side", query: "hip CARs controlled articular rotations" }
    },
    {
      id: "worlds-greatest", name: "World's Greatest Stretch",
      region: "hips", type: "dynamic", phase: "mobilize",
      primary: ["Hip flexors", "Adductors", "Thoracic spine", "Hamstrings"],
      purpose: "A full lower-body + T-spine dynamic opener that hits hips, groin and rotation in one flow.",
      rationale: "Dynamic multi-joint mobility is the evidence-preferred warm-up style, improving ROM while preserving power output.",
      execution: [
        "Step into a deep forward lunge, both hands inside the front foot.",
        "Drop the back knee slightly and sink the hips.",
        "Rotate the inside arm up to the ceiling, following it with your eyes.",
        "Return the hand down and step through to the other side."
      ],
      mistakes: ["Back rounding", "Front heel lifting", "Rushing the rotation"],
      sets: 1, reps: 6, holdSec: 0, bilateral: true,
      breathing: "Exhale as you rotate open.",
      difficulty: 2, regression: "Hands on a low box; shorter lunge.",
      progression: "Add a 2s reach and a hamstring rock-back each rep.",
      targets: ["deep-squat", "thoracic-rot", "aslr"], sports: ["running", "football", "padel", "functional", "surfing"],
      goals: ["deep-squat", "hip-mobility", "run-mechanics"], refs: ["behm2011review", "warmup2023meta"],
      video: { channel: "Athlean-X", query: "worlds greatest stretch" }
    },
    {
      id: "deep-squat-hold", name: "Supported Deep Squat Hold (Prying)",
      region: "hips", type: "mobilize", phase: "mobilize",
      primary: ["Hips", "Ankles", "Adductors", "Thoracic spine"],
      purpose: "Spend time in the bottom of the squat to distribute mobility across ankles, hips and spine.",
      rationale: "Loaded positional work at end range builds tolerance and improves the deep-squat screen used across squat-dependent sports.",
      execution: [
        "Hold a support (rack/TRX) and sink into your deepest comfortable squat.",
        "Keep the heels down and chest tall.",
        "Gently 'pry' — push knees out with elbows and shift side to side."
      ],
      mistakes: ["Heels rising", "Collapsing the chest", "Bouncing aggressively"],
      sets: 2, reps: 0, holdSec: 45, bilateral: false,
      breathing: "Deep belly breaths to sink lower on exhales.",
      difficulty: 2, regression: "Heels on a small wedge; hold a support.",
      progression: "Let go of support; add goblet load.",
      targets: ["deep-squat", "ankle-wall"], sports: ["skiing", "surfing", "functional", "football"],
      goals: ["deep-squat", "hip-mobility", "ankle-df"], refs: ["cook2016fms", "konrad2023chronic"],
      video: { channel: "Squat University", query: "deep squat prying mobility" }
    },
    {
      id: "figure4-stretch", name: "Figure-4 Glute Stretch",
      region: "glutes", type: "static", phase: "lengthen",
      primary: ["Gluteus maximus", "Piriformis", "Deep hip rotators"],
      purpose: "Lengthen the glutes and deep rotators that limit hip flexion and external rotation.",
      rationale: "Static stretching of the posterior hip improves hip ROM used in squat depth and rotational positions.",
      execution: [
        "Lie on your back; cross one ankle over the opposite thigh (figure-4).",
        "Reach through and pull the back thigh toward your chest.",
        "Keep the crossed knee pushing open."
      ],
      mistakes: ["Pulling the neck/head up", "Letting the foot collapse instead of flexed", "Holding the breath"],
      sets: 2, reps: 0, holdSec: 40, bilateral: true,
      breathing: "Exhale and draw the knee closer.",
      difficulty: 1, regression: "Seated figure-4 in a chair.",
      progression: "Add a contract-relax (push shin into hands 5s, then relax deeper).",
      targets: ["hip-er", "deep-squat"], sports: ["running", "cycling", "football", "functional"],
      goals: ["hip-mobility", "deep-squat"], refs: ["konrad2024", "hindle2012pnf"],
      video: { channel: "E3 Rehab", query: "figure 4 glute stretch" }
    },

    /* ------------------------------------------------------------- HAMSTRINGS */
    {
      id: "aslr-band", name: "Active Straight-Leg Raise (Supine, Banded)",
      region: "hamstrings", type: "mobilize", phase: "mobilize",
      primary: ["Hamstrings", "Hip flexors (opposite)"],
      purpose: "Improve active hamstring length and the ASLR screen while teaching the opposite hip to stay down.",
      rationale: "Active straight-leg raise reflects hamstring extensibility and core-hip dissociation; it is a core FMS pattern.",
      execution: [
        "Lie on your back, one leg flat and anchored.",
        "Raise the other straight leg as high as possible with the knee locked.",
        "Lower under control; keep the down-leg pressed to the floor."
      ],
      mistakes: ["Bending the moving knee", "Down-leg lifting off the floor", "Yanking with a band instead of active lift"],
      sets: 2, reps: 10, holdSec: 0, bilateral: true,
      breathing: "Exhale as the leg rises.",
      difficulty: 1, regression: "Bend the down-leg knee, foot flat.",
      progression: "Add a 2s top hold; assist gently with a strap only at end range.",
      targets: ["aslr", "toe-touch"], sports: ["running", "football", "cycling", "functional"],
      goals: ["touch-toes", "run-mechanics", "hip-mobility"], refs: ["mayorga2014sitreach", "cook2016fms"],
      video: { channel: "The Prehab Guys", query: "active straight leg raise mobility" }
    },
    {
      id: "hamstring-static", name: "Standing/Seated Hamstring Stretch",
      region: "hamstrings", type: "static", phase: "lengthen",
      primary: ["Hamstrings", "Gastrocnemius"],
      purpose: "Increase hamstring extensibility to close the gap on the toe-touch / sit-and-reach.",
      rationale: "Static stretching reliably improves hamstring ROM; toe-touch distance is a valid hamstring extensibility proxy.",
      execution: [
        "Sit tall with one leg extended, the other tucked in.",
        "Hinge from the hips (not the low back) reaching toward the toes.",
        "Stop at a firm but tolerable stretch and hold."
      ],
      mistakes: ["Rounding the spine to reach further", "Bouncing", "Locking then hyperextending the knee"],
      sets: 2, reps: 0, holdSec: 45, bilateral: true,
      breathing: "Lengthen the spine on inhale, fold slightly more on exhale.",
      difficulty: 1, regression: "Slight knee bend; hands on shin.",
      progression: "Contract-relax PNF: push heel down 5s, relax, reach further.",
      targets: ["toe-touch", "aslr"], sports: ["running", "cycling", "functional", "surfing"],
      goals: ["touch-toes", "palms-floor"], refs: ["konrad2024", "hindle2012pnf", "mayorga2014sitreach"],
      video: { channel: "Tom Merrick", query: "seated hamstring stretch routine" }
    },
    {
      id: "jefferson-curl", name: "Jefferson Curl (Loaded Spinal + Hamstring Flexion)",
      region: "hamstrings", type: "strength", phase: "stabilize",
      primary: ["Hamstrings", "Erector spinae", "Posterior chain"],
      purpose: "Build strength and control into deep toe-touch flexion so range becomes robust, not fragile.",
      rationale: "Loaded lengthening trains the posterior chain through full flexion, helping range persist; use light loads and progress slowly.",
      execution: [
        "Stand on a box holding a light weight, feet together, knees straight.",
        "Slowly roll down one vertebra at a time, letting the weight drift toward the floor.",
        "Reverse the roll, stacking the spine back to standing."
      ],
      mistakes: ["Using too much weight too soon", "Moving fast", "Bending the knees to reach further"],
      sets: 2, reps: 6, holdSec: 0, bilateral: false,
      breathing: "Exhale rolling down, inhale to stack up.",
      difficulty: 3, regression: "Bodyweight only, off the floor (no box).",
      progression: "Add small weight increments once fully controlled.",
      targets: ["toe-touch"], sports: ["functional", "surfing"],
      goals: ["touch-toes", "palms-floor"], refs: ["page2012", "konrad2024"],
      video: { channel: "Squat University", query: "jefferson curl tutorial" }
    },

    /* -------------------------------------------------------------- ADDUCTORS */
    {
      id: "cossack-squat", name: "Cossack Squat",
      region: "adductors", type: "strength", phase: "stabilize",
      primary: ["Adductors", "Glutes", "Quadriceps", "Ankles"],
      purpose: "Strengthen and lengthen the groin through a wide lateral squat for cutting and skiing.",
      rationale: "Loaded lateral range builds usable adductor length and single-leg control valuable in field and board sports.",
      execution: [
        "Stand wide; shift onto one bent leg, other leg straight with toes up.",
        "Sink as low as control allows, chest tall.",
        "Push back to center and shift to the other side."
      ],
      mistakes: ["Heel of the bent leg lifting", "Rounding forward", "Collapsing the arch"],
      sets: 2, reps: 8, holdSec: 0, bilateral: true,
      breathing: "Exhale as you rise out of the bottom.",
      difficulty: 2, regression: "Hold a support; reduce depth.",
      progression: "Hold a light goblet weight; add a pause at the bottom.",
      targets: ["deep-squat", "hip-ir"], sports: ["skiing", "football", "padel", "functional"],
      goals: ["hip-mobility", "deep-squat", "ski-mobility"], refs: ["konrad2023chronic"],
      video: { channel: "Squat University", query: "cossack squat mobility" }
    },
    {
      id: "adductor-rockback", name: "Adductor Rock-Back",
      region: "adductors", type: "dynamic", phase: "mobilize",
      primary: ["Adductors", "Hips"],
      purpose: "Gently mobilize the inner thigh and hips before deeper lower-body work.",
      rationale: "Dynamic groin mobilization prepares tissue and joints for wider ranges without a pre-activity power cost.",
      execution: [
        "On all fours, extend one leg out to the side, foot flat.",
        "Rock the hips back toward the heel until you feel the inner thigh.",
        "Rock forward and repeat rhythmically."
      ],
      mistakes: ["Rounding the low back", "Forcing range with a bouncing motion", "Letting the extended foot roll"],
      sets: 2, reps: 10, holdSec: 0, bilateral: true,
      breathing: "Exhale on the rock back.",
      difficulty: 1, regression: "Smaller range; narrower stance.",
      progression: "Add a brief end-range hold; widen the leg.",
      targets: ["deep-squat"], sports: ["football", "skiing", "padel", "functional"],
      goals: ["hip-mobility", "deep-squat"], refs: ["behm2011review"],
      video: { channel: "The Prehab Guys", query: "adductor rock back mobility" }
    },

    /* ------------------------------------------------------------------ KNEES */
    {
      id: "knee-cars-atg", name: "ATG Split Squat (Knees-Over-Toes)",
      region: "knees", type: "strength", phase: "stabilize",
      primary: ["Quadriceps", "VMO", "Patellar tendon", "Glutes"],
      purpose: "Build pain-resilient knee strength and control through deep flexion.",
      rationale: "Progressive full-ROM loading of the knee improves tolerance and movement quality; start shallow and build depth gradually.",
      execution: [
        "In a long split stance, lower the back knee toward the floor.",
        "Let the front knee travel forward over (or past) the toes with the heel down.",
        "Drive back up through the front foot."
      ],
      mistakes: ["Progressing depth/load too fast", "Front heel lifting", "Knee collapsing inward"],
      sets: 2, reps: 8, holdSec: 0, bilateral: true,
      breathing: "Exhale on the way up.",
      difficulty: 3, regression: "Hold support; limit depth; elevate back foot only slightly.",
      progression: "Add load; increase depth as pain-free control allows.",
      targets: ["deep-squat", "ankle-wall"], sports: ["running", "skiing", "football", "functional"],
      goals: ["deep-squat", "run-mechanics"], refs: ["page2012", "cook2016fms"],
      video: { channel: "Squat University", query: "ATG split squat knee" }
    },
    {
      id: "terminal-knee-ext", name: "Quad Sets / Terminal Knee Extension",
      region: "knees", type: "strength", phase: "stabilize",
      primary: ["Quadriceps", "VMO"],
      purpose: "Reinforce full knee extension and quad control for joint mechanics and pain reduction.",
      rationale: "Simple quad activation restores end-range extension and is a low-risk entry point for cranky knees.",
      execution: [
        "Sit with the leg straight, a small towel roll under the knee.",
        "Press the knee down into the roll, tightening the thigh and lifting the heel.",
        "Hold, then relax."
      ],
      mistakes: ["Not fully straightening the knee", "Holding the breath", "Letting the hip do the work"],
      sets: 2, reps: 10, holdSec: 5, bilateral: true,
      breathing: "Exhale on the squeeze.",
      difficulty: 1, regression: "Fewer reps; shorter holds.",
      progression: "Add a band for terminal knee extension standing.",
      targets: [], sports: ["running", "cycling", "football", "functional"],
      goals: ["run-mechanics"], refs: ["page2012"],
      video: { channel: "E3 Rehab", query: "terminal knee extension quad set" }
    },

    /* --------------------------------------------------------------- LOW BACK */
    {
      id: "catcow", name: "Cat–Cow",
      region: "lowback", type: "dynamic", phase: "prep",
      primary: ["Spinal erectors", "Abdominals", "Multifidus"],
      purpose: "Gently mobilize the spine into flexion and extension to start any session.",
      rationale: "Low-load segmental spine motion is a safe, well-tolerated warm-up for the trunk with broad clinical use.",
      execution: [
        "On all fours, inhale and drop the belly, lifting the chest and tailbone (cow).",
        "Exhale and round the spine, tucking the chin and tailbone (cat).",
        "Move slowly through each segment."
      ],
      mistakes: ["Moving only from the neck/hips", "Rushing", "Forcing painful end ranges"],
      sets: 1, reps: 10, holdSec: 0, bilateral: false,
      breathing: "Inhale to extend, exhale to round.",
      difficulty: 1, regression: "Smaller range.",
      progression: "Add segmental control, pausing at each vertebra.",
      targets: [], sports: ["running", "cycling", "functional", "scuba", "surfing"],
      goals: ["posture", "hip-mobility"], refs: ["page2012"],
      video: { channel: "Physiotutors", query: "cat cow exercise" }
    },
    {
      id: "deadbug", name: "Dead Bug",
      region: "lowback", type: "stability", phase: "stabilize",
      primary: ["Deep core", "Transverse abdominis", "Hip flexors"],
      purpose: "Teach the trunk to stay stable while limbs move — the foundation for protecting the low back.",
      rationale: "Anti-extension core control lets you express hip and shoulder mobility without compensating through the lumbar spine.",
      execution: [
        "Lie on your back, arms up, hips and knees at 90°.",
        "Press the low back gently into the floor.",
        "Lower the opposite arm and leg slowly, then return and switch."
      ],
      mistakes: ["Low back arching off the floor", "Holding the breath", "Moving too fast"],
      sets: 2, reps: 8, holdSec: 0, bilateral: true,
      breathing: "Exhale as the limbs extend.",
      difficulty: 1, regression: "Move only the legs, arms still.",
      progression: "Add light weights or a longer lever.",
      targets: ["aslr"], sports: ["running", "football", "functional", "surfing", "padel"],
      goals: ["posture", "run-mechanics"], refs: ["cook2006fms"],
      video: { channel: "The Prehab Guys", query: "dead bug core exercise" }
    },
    {
      id: "prone-press", name: "Prone Press-Up (Extension)",
      region: "lowback", type: "mobilize", phase: "mobilize",
      primary: ["Lumbar erectors", "Spine (extension)"],
      purpose: "Restore gentle lumbar extension, often relieving flexion-dominant desk posture.",
      rationale: "Repeated extension is a common, well-tolerated movement to centralize symptoms and restore extension range for many people (not all).",
      execution: [
        "Lie face down, hands under the shoulders.",
        "Press the chest up while keeping the hips on the floor.",
        "Lower under control. Move in and out of range."
      ],
      mistakes: ["Forcing into pain", "Shrugging the shoulders", "Clenching the glutes hard"],
      sets: 2, reps: 8, holdSec: 0, bilateral: false,
      breathing: "Exhale pressing up.",
      difficulty: 1, regression: "Prop on the elbows only (sphinx).",
      progression: "Fuller press with a brief top pause.",
      targets: [], sports: ["cycling", "scuba", "functional"],
      goals: ["posture"], refs: ["page2012"],
      video: { channel: "Physiotutors", query: "prone press up extension mckenzie" }
    },

    /* --------------------------------------------------------------- THORACIC */
    {
      id: "openbook", name: "Open Book (Thoracic Rotation)",
      region: "thoracic", type: "mobilize", phase: "mobilize",
      primary: ["Thoracic spine", "Pecs", "Obliques"],
      purpose: "Reclaim upper-back rotation for overhead reaching, rotational sport and posture.",
      rationale: "Targeted thoracic rotation mobility supports the T-spine rotation screen and reduces compensation at the shoulder and low back.",
      execution: [
        "Lie on your side, knees stacked at 90°, arms together in front.",
        "Keep the knees down and sweep the top arm across to the other side.",
        "Follow the hand with your eyes, opening the chest to the ceiling."
      ],
      mistakes: ["Knees lifting to cheat rotation", "Rotating from the low back", "Rushing the reach"],
      sets: 2, reps: 8, holdSec: 2, bilateral: true,
      breathing: "Inhale to prep, exhale opening the book.",
      difficulty: 1, regression: "Smaller range; pillow under the head.",
      progression: "Add a 3–5s end-range hold with a big exhale.",
      targets: ["thoracic-rot", "shoulder-reach"], sports: ["padel", "surfing", "football", "scuba", "functional"],
      goals: ["overhead", "posture", "surf-mobility"], refs: ["konrad2023chronic", "cook2016fms"],
      video: { channel: "E3 Rehab", query: "open book thoracic rotation" }
    },
    {
      id: "quadruped-trot", name: "Quadruped Thoracic Rotation",
      region: "thoracic", type: "dynamic", phase: "mobilize",
      primary: ["Thoracic spine", "Scapular muscles"],
      purpose: "Train segmental upper-back rotation from a stable base.",
      rationale: "Isolating rotation to the thoracic segments improves rotational ROM used in swinging and paddling sports.",
      execution: [
        "Kneel and sit back toward the heels, one hand behind the head.",
        "Rotate the elbow down toward the opposite arm, then up to the ceiling.",
        "Move through the upper back, keeping the low back quiet."
      ],
      mistakes: ["Rotating from the lumbar spine", "Losing the hip-to-heel position", "Fast, uncontrolled reps"],
      sets: 2, reps: 8, holdSec: 0, bilateral: true,
      breathing: "Exhale rotating up.",
      difficulty: 2, regression: "Hand on the low back instead of head.",
      progression: "Add a brief end-range hold and reach.",
      targets: ["thoracic-rot"], sports: ["padel", "surfing", "football", "functional"],
      goals: ["overhead", "posture", "surf-mobility"], refs: ["konrad2023chronic"],
      video: { channel: "The Prehab Guys", query: "quadruped thoracic rotation" }
    },
    {
      id: "foam-tspine-ext", name: "Foam Roller Thoracic Extension",
      region: "thoracic", type: "soft-tissue", phase: "prep",
      primary: ["Thoracic spine (extension)", "Lats"],
      purpose: "Counter rounded upper-back posture and prep extension for overhead positions.",
      rationale: "Extension over a roller mobilizes stiff thoracic segments; a useful primer before overhead or rotation drills.",
      execution: [
        "Lie with a foam roller across the mid-back, hands supporting the head.",
        "Gently extend the upper back over the roller.",
        "Move the roller up a segment and repeat; keep ribs from flaring."
      ],
      mistakes: ["Extending from the low back (ribs flaring)", "Rolling the neck", "Going too fast"],
      sets: 1, reps: 8, holdSec: 0, bilateral: false,
      breathing: "Exhale as you extend back.",
      difficulty: 1, regression: "Smaller extensions; towel instead of roller.",
      progression: "Add a breath-hold exhale at each segment.",
      targets: ["thoracic-rot", "shoulder-reach"], sports: ["cycling", "scuba", "padel", "functional"],
      goals: ["overhead", "posture"], refs: ["wiewelhove2019foam"],
      video: { channel: "Squat University", query: "thoracic extension foam roller" }
    },

    /* -------------------------------------------------------------- SHOULDERS */
    {
      id: "shoulder-cars", name: "Shoulder Controlled Articular Rotations (CARs)",
      region: "shoulders", type: "caps", phase: "mobilize",
      primary: ["Rotator cuff", "Deltoid", "Shoulder capsule"],
      purpose: "Explore full active shoulder range to maintain overhead and behind-the-back mobility.",
      rationale: "Active rotations build control at end range, supporting the behind-the-back reach and overhead positions used in diving and paddling.",
      execution: [
        "Stand tall, brace the trunk. Raise one straight arm forward and up.",
        "Reach it overhead and behind, rotating the palm as you go.",
        "Continue the circle down and back to the start slowly."
      ],
      mistakes: ["Arching the low back to reach overhead", "Shrugging", "Rushing through range"],
      sets: 2, reps: 4, holdSec: 0, bilateral: true,
      breathing: "Breathe continuously.",
      difficulty: 2, regression: "Smaller circles; bent elbow.",
      progression: "Add irradiation (make a fist, brace hard) for slower reps.",
      targets: ["shoulder-reach"], sports: ["surfing", "scuba", "padel", "functional"],
      goals: ["overhead", "scuba-tank", "wetsuit"], refs: ["page2012"],
      video: { channel: "Strength Side", query: "shoulder CARs mobility" }
    },
    {
      id: "wall-slide", name: "Wall Slides (Overhead)",
      region: "shoulders", type: "mobilize", phase: "mobilize",
      primary: ["Serratus anterior", "Lower trapezius", "Rotator cuff"],
      purpose: "Groove clean overhead reach with the ribs down and shoulder blades moving well.",
      rationale: "Wall slides pair scapular upward rotation with overhead reach, improving the shoulder-mobility screen and overhead ROM.",
      execution: [
        "Stand with the back against a wall, forearms on the wall in a goalpost.",
        "Keep the ribs down and wrists/elbows on the wall.",
        "Slide the arms up until they straighten, then lower."
      ],
      mistakes: ["Ribs flaring / low back arching", "Elbows leaving the wall", "Shrugging at the top"],
      sets: 2, reps: 10, holdSec: 0, bilateral: false,
      breathing: "Exhale sliding up.",
      difficulty: 1, regression: "Reduce range; move slightly off the wall.",
      progression: "Add a light band around the wrists; add a lift-off at the top.",
      targets: ["shoulder-reach"], sports: ["scuba", "surfing", "padel", "functional"],
      goals: ["overhead", "scuba-tank", "posture", "wetsuit"], refs: ["cook2016fms"],
      video: { channel: "The Prehab Guys", query: "wall slides shoulder" }
    },
    {
      id: "behind-back-strap", name: "Behind-the-Back Reach (Strap-Assisted)",
      region: "shoulders", type: "static", phase: "lengthen",
      primary: ["Shoulder internal/external rotators", "Pecs"],
      purpose: "Improve the behind-the-back reach needed for the shoulder-mobility test, wetsuit zips and scuba valves.",
      rationale: "Combined internal/external rotation stretch directly targets the behind-the-back reach measured in the assessment.",
      execution: [
        "Hold a strap overhead with the top hand; drop it down the back.",
        "The bottom hand catches the strap behind the low back.",
        "Gently walk the hands toward each other, then switch sides."
      ],
      mistakes: ["Forcing painful ranges", "Cranking the neck forward", "Holding the breath"],
      sets: 2, reps: 0, holdSec: 30, bilateral: true,
      breathing: "Relax deeper on each exhale.",
      difficulty: 2, regression: "Wider strap grip.",
      progression: "Narrow the grip as range improves.",
      targets: ["shoulder-reach"], sports: ["scuba", "surfing", "padel"],
      goals: ["overhead", "scuba-tank", "wetsuit"], refs: ["konrad2024"],
      video: { channel: "Physiotutors", query: "behind back shoulder stretch towel" }
    },
    {
      id: "pec-doorway", name: "Doorway Pec Stretch",
      region: "shoulders", type: "static", phase: "lengthen",
      primary: ["Pectoralis major/minor", "Anterior deltoid"],
      purpose: "Open the chest to reduce rounded-shoulder posture and free overhead reach.",
      rationale: "Static pec lengthening supports overhead ROM and counters desk-driven internal rotation posture.",
      execution: [
        "Place the forearm on a doorframe, elbow ~shoulder height.",
        "Step through gently until you feel a chest stretch.",
        "Keep the ribs down; hold, then switch."
      ],
      mistakes: ["Ribs flaring", "Shrugging the shoulder up", "Overstretching into pain"],
      sets: 2, reps: 0, holdSec: 30, bilateral: true,
      breathing: "Exhale into the stretch.",
      difficulty: 1, regression: "Smaller step; lower elbow.",
      progression: "Higher elbow angle to bias different fibers.",
      targets: ["shoulder-reach"], sports: ["cycling", "scuba", "surfing", "functional"],
      goals: ["overhead", "posture"], refs: ["konrad2024", "page2012"],
      video: { channel: "E3 Rehab", query: "doorway pec stretch" }
    },

    /* --------------------------------------------------------------- SCAPULA */
    {
      id: "scap-pushup", name: "Scapular Push-Up (Protraction/Retraction)",
      region: "scapula", type: "strength", phase: "stabilize",
      primary: ["Serratus anterior", "Rhomboids", "Mid/lower trapezius"],
      purpose: "Train the shoulder blades to move and stabilize — the base for healthy overhead motion.",
      rationale: "Serratus and scapular control underpin upward rotation, supporting overhead reach and shoulder health.",
      execution: [
        "In a high plank (or on knees), keep the elbows straight.",
        "Let the chest sink slightly as the shoulder blades pinch (retract).",
        "Push the floor away, spreading the blades apart (protract)."
      ],
      mistakes: ["Bending the elbows (turning it into a push-up)", "Sagging the hips", "Shrugging toward the ears"],
      sets: 2, reps: 12, holdSec: 0, bilateral: false,
      breathing: "Exhale on the push away.",
      difficulty: 2, regression: "Perform on knees or against a wall.",
      progression: "Elevate feet; add a slow tempo.",
      targets: ["shoulder-reach"], sports: ["surfing", "scuba", "functional", "padel"],
      goals: ["overhead", "posture"], refs: ["cook2006fms"],
      video: { channel: "Athlean-X", query: "scapular push up serratus" }
    },
    {
      id: "prone-ytwl", name: "Prone Y-T-W Raises",
      region: "scapula", type: "strength", phase: "stabilize",
      primary: ["Lower trapezius", "Mid trapezius", "Rhomboids", "Rear deltoid"],
      purpose: "Strengthen the postural muscles that hold the shoulder blades back and down.",
      rationale: "Targeted scapular strengthening improves posture endurance and supports overhead capacity.",
      execution: [
        "Lie face down; raise the arms into a Y (thumbs up), then reset.",
        "Raise into a T (arms out to the sides), then reset.",
        "Raise into a W (elbows bent, squeezing the blades)."
      ],
      mistakes: ["Shrugging the shoulders up", "Cranking the neck back", "Using momentum"],
      sets: 2, reps: 8, holdSec: 0, bilateral: false,
      breathing: "Exhale lifting.",
      difficulty: 2, regression: "No weight; fewer reps.",
      progression: "Add very light plates or hold 2s at the top.",
      targets: ["shoulder-reach"], sports: ["cycling", "surfing", "scuba", "functional"],
      goals: ["posture", "overhead"], refs: ["cook2006fms"],
      video: { channel: "Physiotutors", query: "prone Y T W scapular exercise" }
    },

    /* ---------------------------------------------------------------- WRISTS */
    {
      id: "wrist-rocks", name: "Wrist Extension/Flexion Rocks",
      region: "wrists", type: "mobilize", phase: "mobilize",
      primary: ["Wrist flexors", "Wrist extensors", "Forearm"],
      purpose: "Prepare the wrists for load-bearing positions (push-ups, surfing pop-ups, functional fitness).",
      rationale: "Progressive wrist loading through range builds tolerance for weight-bearing on the hands.",
      execution: [
        "On all fours, place the palms down, fingers forward.",
        "Rock forward and back, keeping the palms flat.",
        "Then turn the hands to fingers-back and gently rock."
      ],
      mistakes: ["Letting the palms peel up", "Forcing into sharp pain", "Bouncing"],
      sets: 2, reps: 10, holdSec: 0, bilateral: false,
      breathing: "Relaxed, continuous.",
      difficulty: 1, regression: "Do it standing against a wall with less load.",
      progression: "Shift more weight onto the hands; add fingertip variations.",
      targets: [], sports: ["surfing", "functional", "padel"],
      goals: ["posture"], refs: ["page2012"],
      video: { channel: "Precision Movement", query: "wrist mobility warm up" }
    },

    /* ------------------------------------------------------------------ NECK */
    {
      id: "neck-cars", name: "Neck Controlled Rotations & Nods",
      region: "neck", type: "mobilize", phase: "prep",
      primary: ["Deep neck flexors", "Cervical extensors", "Upper trapezius"],
      purpose: "Gently mobilize the neck and reduce desk-driven stiffness.",
      rationale: "Low-load, controlled cervical movement maintains range and eases tension without provocative end-range loading.",
      execution: [
        "Sit or stand tall. Slowly rotate the head left and right to a comfortable end range.",
        "Then nod yes (chin tuck to look down) and gently look up.",
        "Finally, ear-to-shoulder side bends. Keep every rep smooth."
      ],
      mistakes: ["Forcing painful ranges", "Jamming the head back into extension", "Moving quickly"],
      sets: 1, reps: 6, holdSec: 0, bilateral: true,
      breathing: "Slow and continuous.",
      difficulty: 1, regression: "Smaller ranges.",
      progression: "Add a light hand-assisted end-range hold on side bends.",
      targets: [], sports: ["cycling", "scuba", "surfing", "functional"],
      goals: ["posture"], refs: ["page2012"],
      video: { channel: "Precision Movement", query: "neck mobility routine" }
    },
    {
      id: "chin-tuck", name: "Chin Tucks (Deep Neck Flexor)",
      region: "neck", type: "strength", phase: "stabilize",
      primary: ["Deep neck flexors"],
      purpose: "Strengthen the deep neck flexors to support upright head posture.",
      rationale: "Deep neck flexor endurance is associated with better cervical postural control and less neck strain.",
      execution: [
        "Sit or stand tall. Draw the chin straight back (make a 'double chin').",
        "Keep the eyes level; hold briefly.",
        "Release and repeat."
      ],
      mistakes: ["Tilting the head down instead of gliding back", "Overclenching the jaw", "Holding the breath"],
      sets: 2, reps: 10, holdSec: 3, bilateral: false,
      breathing: "Exhale on the tuck.",
      difficulty: 1, regression: "Lying down with head on the floor.",
      progression: "Longer holds; against a light resistance band.",
      targets: [], sports: ["cycling", "scuba", "functional"],
      goals: ["posture"], refs: ["page2012"],
      video: { channel: "Physiotutors", query: "chin tuck deep neck flexor" }
    },

    /* -------------------------------------------------------------- FULL BODY */
    {
      id: "sl-balance", name: "Single-Leg Balance Progression",
      region: "fullbody", type: "stability", phase: "stabilize",
      primary: ["Ankle stabilizers", "Glute medius", "Foot intrinsics"],
      purpose: "Build the balance and proprioception that best-supported evidence links to fewer ankle sprains.",
      rationale: "Proprioceptive/balance training significantly reduces ankle-sprain incidence — the strongest injury-prevention finding in this app.",
      execution: [
        "Stand on one leg, soft knee, eyes forward. Hold steady.",
        "Progress: close the eyes, or stand on a pillow/cushion.",
        "Add small reaches with the free foot to challenge control."
      ],
      mistakes: ["Gripping with the toes constantly (let the whole foot work)", "Holding the breath", "Progressing to eyes-closed too soon"],
      sets: 3, reps: 0, holdSec: 30, bilateral: true,
      breathing: "Relaxed breathing throughout.",
      difficulty: 1, regression: "Fingertips on a wall; eyes open.",
      progression: "Eyes closed, unstable surface, or add a reach/toss.",
      targets: ["sl-balance"], sports: ["skiing", "surfing", "football", "running", "padel"],
      goals: ["ski-mobility", "surf-mobility", "run-mechanics"],
      refs: ["schiftan2015balance", "rivera2017proprio"],
      video: { channel: "E3 Rehab", query: "single leg balance progression" }
    },
    {
      id: "leg-swings", name: "Leg Swings (Front-Back & Side-Side)",
      region: "fullbody", type: "dynamic", phase: "prep",
      primary: ["Hip flexors", "Hamstrings", "Adductors", "Glutes"],
      purpose: "A dynamic hip warm-up that raises tissue temperature and rehearses running/skating ranges.",
      rationale: "Dynamic stretching is the evidence-preferred warm-up, improving ROM while maintaining explosive output.",
      execution: [
        "Hold a support. Swing one leg forward and back through a comfortable arc.",
        "Gradually increase range over reps.",
        "Then swing side to side across the body. Switch legs."
      ],
      mistakes: ["Swinging into a hard end-range too soon", "Arching the low back", "Twisting the torso excessively"],
      sets: 1, reps: 12, holdSec: 0, bilateral: true,
      breathing: "Rhythmic, continuous.",
      difficulty: 1, regression: "Smaller arcs.",
      progression: "Larger, faster (but controlled) arcs.",
      targets: ["aslr"], sports: ["running", "football", "skiing", "padel", "functional"],
      goals: ["run-mechanics", "hip-mobility"], refs: ["behm2011review", "warmup2023meta"],
      video: { channel: "Tom Merrick", query: "leg swings dynamic warm up" }
    },
    {
      id: "cat-camel-flow", name: "Down-Dog to Cobra Flow",
      region: "fullbody", type: "dynamic", phase: "mobilize",
      primary: ["Hamstrings", "Calves", "Spine", "Shoulders"],
      purpose: "A flowing full-body sequence linking posterior-chain length with spinal extension.",
      rationale: "Multi-joint dynamic flows combine mobility demands efficiently, ideal for time-limited sessions.",
      execution: [
        "From a downward dog (hips high, heels reaching down), shift forward.",
        "Lower the hips and lift the chest into a cobra/up-dog.",
        "Press back up to downward dog and repeat."
      ],
      mistakes: ["Cranking the low back in cobra", "Locking the elbows harshly", "Rushing the transitions"],
      sets: 2, reps: 8, holdSec: 0, bilateral: false,
      breathing: "Exhale to down-dog, inhale to cobra.",
      difficulty: 2, regression: "Bend the knees in down-dog; sphinx instead of cobra.",
      progression: "Add a brief calf-pedaling pause in down-dog.",
      targets: ["toe-touch", "shoulder-reach"], sports: ["surfing", "functional", "running"],
      goals: ["touch-toes", "overhead", "posture"], refs: ["behm2011review"],
      video: { channel: "Tom Merrick", query: "down dog to cobra flow mobility" }
    }
  ];

  /* Lookups */
  MH.exerciseById = function (id) {
    for (var i = 0; i < MH.exercises.length; i++) if (MH.exercises[i].id === id) return MH.exercises[i];
    return null;
  };
})(typeof window !== "undefined" ? window : this);
