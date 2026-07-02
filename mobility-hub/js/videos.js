/* Mobility Hub - curated demo video map (exerciseId -> YouTube video).
 * Sourced via keyless search at build-time and VERIFIED against YouTube oEmbed.
 * Prefer short, single-exercise clips; played via the official privacy-enhanced
 * embed (autoplay muted + loop). s/e = trim window secs (e:0 = to end). Users can
 * attach their own link (stored locally); to change a demo just edit the id.
 */
(function (root) {
  "use strict";
  var MH = (root.MH = root.MH || {});
  MH.videos = {
    "90-90-lift": { id: "m51AZSXMvEA", by: "The Active Life", t: "90 90 Hip Switch", s: 0, e: 0 },
    "adductor-rockback": { id: "zfO4HhPUxDw", by: "[P]rehab", t: "Adductor Rock Backs are the Ultimate Groin Stretch", s: 6, e: 40 },
    "ankle-band-df": { id: "ILSbK8RnGdI", by: "Squat University", t: "Banded Joint Mobilizations for Stiff Ankles", s: 0, e: 0 },
    "aslr-band": { id: "VDVOl93FWLg", by: "The Active Life", t: "Banded Reverse Active Straight Leg Raise", s: 0, e: 0 },
    "behind-back-strap": { id: "jDcerwWmq0w", by: "MGHOrthopaedics", t: "Internal Rotation Behind the Back with Towel Stretch", s: 0, e: 0 },
    "calf-roll": { id: "Echc5_BKUqI", by: "The Ready State", t: "Improve Ankle Mobility: Roller Bone Saw", s: 0, e: 0 },
    "cat-camel-flow": { id: "tRlQJMF0sJ0", by: "Nottingham Physio", t: "Downward Dog to Cobra Tutorial", s: 0, e: 0 },
    "catcow": { id: "1cs3SKwQZpM", by: "Baptist Health", t: "Cat Camel", s: 0, e: 0 },
    "chin-tuck": { id: "0JEWM_McBmM", by: "Physiotutors", t: "Neck Flexor Endurance Test | Deep Neck Flexors", s: 6, e: 40 },
    "cossack-squat": { id: "iPZNB5GsOnM", by: "The Active Life", t: "Cossack Squat Movement Demo", s: 0, e: 0 },
    "couch-stretch": { id: "qZlUzBDT-lg", by: "Adjusted Family Chiropractic", t: "41. Hip Flexor (Couch) Stretch", s: 0, e: 0 },
    "deadbug": { id: "o4GKiEoYClI", by: "Pursuit Physical Therapy", t: "Dead Bug Exercise For Core Stability  | Pursuit Physical Therapy", s: 0, e: 0 },
    "deep-squat-hold": { id: "enThal66tUs", by: "Squat University", t: "The Deep Squat Rotation (Mobility Exercise) By Squat University", s: 0, e: 0 },
    "figure4-stretch": { id: "SSbRKbeoFCs", by: "E3 Rehab Exercise Library", t: "Supine Figure 4 Stretch", s: 0, e: 0 },
    "foam-tspine-ext": { id: "7CQc5JpyZso", by: "E3 Rehab Exercise Library", t: "Thoracic Extension over Foam Roller Head Supported | Spine Range of Motion", s: 0, e: 0 },
    "hamstring-static": { id: "D8dJ9K7SIiE", by: "Ann & Robert H. Lurie Children's Hospital of Chicago", t: "Seated Hamstring Stretch", s: 0, e: 0 },
    "heel-raise-eccentric": { id: "yNhagYQX8Uk", by: "Sports Rehab Expert", t: "Eccentric Calf Raises | Eccentric Heel Raises", s: 0, e: 0 },
    "hip-cars": { id: "UV7YHcABLQE", by: "Strength in Motion Physical Therapy", t: "Capsule Hip CARs (Controlled Articular Rotations)", s: 0, e: 0 },
    "jefferson-curl": { id: "G8i6N7ysotA", by: "GymnasticBodies", t: "GymnasticBodies Jefferson Curl", s: 0, e: 0 },
    "knee-cars-atg": { id: "tJn68p0e_GA", by: "Beyond Performance ", t: "Front Foot Elevated ATG Split Squat w/ Knee Over Toes", s: 0, e: 0 },
    "leg-swings": { id: "difYoBtZi2s", by: "PureGym", t: "How To Do Leg Swings", s: 0, e: 0 },
    "neck-cars": { id: "c07dCHoVb6Y", by: "Dr. Daniel Birch", t: "Neck CARs (Controlled Articular Rotations)", s: 0, e: 0 },
    "ninety-ninety-switch": { id: "m51AZSXMvEA", by: "The Active Life", t: "90 90 Hip Switch", s: 0, e: 0 },
    "openbook": { id: "YcrYwyJ6gtc", by: "Craig Capurso", t: "Open Book   Side Lying Thoracic Rotation Stretch", s: 0, e: 0 },
    "pec-doorway": { id: "CEQMx4zFwYs", by: "MidwestOrtho", t: "Doorway Pec Stretch", s: 0, e: 0 },
    "prone-press": { id: "ZjgEge1cKwo", by: "E3 Rehab Exercise Library", t: "Prone Press Up on Elbows (Hold)", s: 0, e: 0 },
    "prone-ytwl": { id: "QdGTI4Lshg4", by: "The Active Life", t: "Prone Y T W", s: 0, e: 0 },
    "quadruped-trot": { id: "0HlAqsPdFR0", by: "[P]rehab", t: "Scapular stability with thoracic rotation", s: 0, e: 0 },
    "scap-pushup": { id: "huGj4aBk9C4", by: "Marcus Filly", t: "Scapular Push Up", s: 0, e: 0 },
    "shoulder-cars": { id: "2hyNG1U5wYs", by: "LivingFit", t: "How To Do Shoulder CARS", s: 0, e: 0 },
    "sl-balance": { id: "E-gC1Dwm5Mc", by: "E3 Rehab Exercise Library", t: "Y  Balance", s: 0, e: 0 },
    "terminal-knee-ext": { id: "VUjfxd5vkRw", by: "Patient Exercises", t: "Ball TKE Terminal Knee Extension | Patient Exercises", s: 0, e: 0 },
    "tib-raises": { id: "-4LLYFNbHrE", by: "Keith Riel", t: "Tibialis raises (weighted)", s: 0, e: 0 },
    "wall-slide": { id: "oMSVe7PWJ3o", by: "[P]rehab", t: "Wall Slides for Serratus Anterior  Activation", s: 0, e: 0 },
    "worlds-greatest": { id: "-CiWQ2IvY34", by: "Squat University", t: "The World's Greatest Stretch", s: 0, e: 0 },
    "wrist-rocks": { id: "6mLxoraF1jY", by: "Catalyst Athletics", t: "Wrist Mobility / Flexibility for Olympic Weightlifting", s: 3, e: 43 }
  };
  MH.exerciseVideo = function (exId) { return MH.videos[exId] || null; };
})(typeof window !== "undefined" ? window : this);
