/* Mobility Hub — Scientific references
 * Loaded first. Establishes the global MH namespace.
 * Each entry mirrors RESEARCH.md. Evidence level: A (meta-analysis/validated),
 * B (RCT / good reliability), C (limited/mixed/mechanistic).
 */
(function (root) {
  "use strict";
  var MH = (root.MH = root.MH || {});

  MH.EVIDENCE = {
    A: { label: "Strong", desc: "Consistent meta-analysis / systematic review, or a validated clinical measure" },
    B: { label: "Moderate", desc: "Individual RCTs or good reliability/validity studies; generally consistent" },
    C: { label: "Limited", desc: "Limited, mixed, or indirect evidence; mechanistic or expert-consensus rationale" }
  };

  MH.references = {
    konrad2024: {
      level: "A", year: 2024,
      authors: "Konrad A, et al.",
      title: "Static Stretch Training versus Foam Rolling Training Effects on Range of Motion: A Systematic Review and Meta-Analysis",
      journal: "Sports Medicine", doi: "10.1007/s40279-024-02041-0",
      url: "https://doi.org/10.1007/s40279-024-02041-0",
      summary: "Both static stretching and foam rolling produce moderate ROM gains vs. control, with no clear superiority between them."
    },
    konrad2023chronic: {
      level: "A", year: 2023,
      authors: "Konrad A, et al.",
      title: "Chronic effects of stretching on range of motion with consideration of potential moderating variables",
      journal: "J Sport Health Sci (rel.)", pmid: "37301370",
      url: "https://pubmed.ncbi.nlm.nih.gov/37301370/",
      summary: "Weekly stretching volume is a key driver of ROM gains; single-session duration matters less than accumulated volume."
    },
    nakamura2023stiffness: {
      level: "B", year: 2023,
      authors: "Nakamura M, Konrad A, et al.",
      title: "Long-term static stretching can decrease muscle stiffness: a systematic review and meta-analysis",
      journal: "Scand J Med Sci Sports (rel.)", pmid: "37231582",
      url: "https://pubmed.ncbi.nlm.nih.gov/37231582/",
      summary: "3–12 weeks of static stretch training moderately reduces passive muscle stiffness."
    },
    behm2016acute: {
      level: "A", year: 2016,
      authors: "Behm DG, Blazevich AJ, Kay AD, McHugh M",
      title: "Acute effects of muscle stretching on physical performance, range of motion, and injury incidence in healthy active individuals: a systematic review",
      journal: "Appl Physiol Nutr Metab 41(1):1-11", pmid: "26642915",
      url: "https://pubmed.ncbi.nlm.nih.gov/26642915/",
      summary: "Dynamic stretching best preserves performance in a warm-up; prolonged pre-activity static stretching can cause small performance decrements."
    },
    behm2011review: {
      level: "B", year: 2011,
      authors: "Behm DG, Chaouachi A",
      title: "A review of the acute effects of static and dynamic stretching on performance",
      journal: "Eur J Appl Physiol 111:2633-2651", doi: "10.1007/s00421-011-1879-2",
      url: "https://doi.org/10.1007/s00421-011-1879-2",
      summary: "Dynamic stretching tends to maintain or enhance subsequent performance; static stretching is best used for standalone ROM goals."
    },
    warmup2023meta: {
      level: "A", year: 2023,
      authors: "Zhang Q, et al.",
      title: "Effects of different warm-up methods on acute lower-limb explosive strength: a systematic review and network meta-analysis",
      journal: "BMC Sports Sci Med Rehabil 15:93", doi: "10.1186/s13102-023-00703-6",
      url: "https://doi.org/10.1186/s13102-023-00703-6",
      summary: "Dynamic stretching improved jump height and sprint time; static stretching had a small negative effect on sprint time."
    },
    hindle2012pnf: {
      level: "B", year: 2012,
      authors: "Hindle KB, et al.",
      title: "Proprioceptive Neuromuscular Facilitation (PNF): its mechanisms and effects on range of motion and muscular function",
      journal: "J Hum Kinet 31:105-113", doi: "10.2478/v10078-012-0011-y",
      url: "https://pubmed.ncbi.nlm.nih.gov/23487249/",
      summary: "Contract-relax PNF produces ROM gains comparable to or greater than static stretching via neural inhibition mechanisms."
    },
    wiewelhove2019foam: {
      level: "B", year: 2019,
      authors: "Wiewelhove T, et al.",
      title: "A meta-analysis of the effects of foam rolling on performance and recovery",
      journal: "Front Physiol 10:376", doi: "10.3389/fphys.2019.00376",
      url: "https://doi.org/10.3389/fphys.2019.00376",
      summary: "Pre-rolling gives small acute flexibility/sprint benefits without harming performance; post-rolling modestly aids recovery."
    },
    konrad2022foam: {
      level: "B", year: 2022,
      authors: "Konrad A, Nakamura M, Behm DG",
      title: "Foam Rolling Training Effects on Range of Motion: A Systematic Review and Meta-Analysis",
      journal: "Sports Medicine 52:2523-2535", doi: "10.1007/s40279-022-01699-8",
      url: "https://doi.org/10.1007/s40279-022-01699-8",
      summary: "Multi-week foam-rolling training can increase ROM, though long-term adaptations are less established than for stretching."
    },
    schiftan2015balance: {
      level: "A", year: 2015,
      authors: "Schiftan GS, Ross LA, Hahne AJ",
      title: "The effectiveness of proprioceptive training in preventing ankle sprains in sporting populations: a systematic review and meta-analysis",
      journal: "J Sci Med Sport 18(3):238-244", doi: "10.1016/j.jsams.2014.04.005",
      url: "https://doi.org/10.1016/j.jsams.2014.04.005",
      summary: "Proprioceptive/balance training significantly reduces ankle-sprain incidence, especially with a prior sprain history."
    },
    rivera2017proprio: {
      level: "A", year: 2017,
      authors: "Rivera MJ, et al.",
      title: "Proprioceptive Training for the Prevention of Ankle Sprains: An Evidence-Based Review",
      journal: "J Athl Train 52(11):1065-1067", doi: "10.4085/1062-6050-52.11.16",
      url: "https://pubmed.ncbi.nlm.nih.gov/29140127/",
      summary: "Balance training reduces first-time and recurrent ankle sprains; a practical, well-supported prevention strategy."
    },
    bennell1998wblt: {
      level: "A", year: 1998,
      authors: "Bennell KL, et al.",
      title: "Intra-rater and inter-rater reliability of a weight-bearing lunge measure of ankle dorsiflexion",
      journal: "Aust J Physiother 44(3):175-180", pmid: "11676731",
      url: "https://pubmed.ncbi.nlm.nih.gov/11676731/",
      summary: "The weight-bearing lunge (knee-to-wall) test shows excellent reliability (ICC ~0.97-0.99)."
    },
    powden2015wblt: {
      level: "A", year: 2015,
      authors: "Powden CJ, Hoch JM, Hoch MC",
      title: "Reliability and minimal detectable change of the weight-bearing lunge test: a systematic review",
      journal: "Man Ther 20(4):524-532", pmid: "25704110",
      url: "https://pubmed.ncbi.nlm.nih.gov/25704110/",
      summary: "Good inter- and intra-clinician reliability (ICC 0.65-0.99); establishes minimal detectable change for tracking progress."
    },
    cook2016fms: {
      level: "B", year: 2016,
      authors: "Cuchna JW, Hoch MC, Hoch JM",
      title: "Reliability, validity, and injury predictive value of the Functional Movement Screen: a systematic review and meta-analysis",
      journal: "Am J Sports Med", doi: "10.1177/0363546516641937",
      url: "https://doi.org/10.1177/0363546516641937",
      summary: "FMS has good rater reliability but limited stand-alone injury-prediction value; best used as a movement-quality screen."
    },
    moran2016fms: {
      level: "B", year: 2016,
      authors: "Moran RW, et al.",
      title: "How reliable are Functional Movement Screening scores? A systematic review of rater reliability",
      journal: "Br J Sports Med 50(9):527-536", doi: "10.1136/bjsports-2015-094913",
      url: "https://bjsm.bmj.com/content/50/9/527",
      summary: "Composite FMS scores show acceptable rater reliability across studies."
    },
    mayorga2014sitreach: {
      level: "B", year: 2014,
      authors: "Mayorga-Vega D, Merino-Marban R, Viciana J",
      title: "Criterion-related validity of sit-and-reach tests for estimating hamstring and lumbar extensibility: a meta-analysis",
      journal: "J Sports Sci Med 13(1):1-14", pmid: "24570599",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3918544/",
      summary: "Sit-and-reach/toe-touch have moderate validity for hamstring extensibility but low validity for lumbar extensibility."
    },
    page2012: {
      level: "C", year: 2012,
      authors: "Page P",
      title: "Current concepts in muscle stretching for exercise and rehabilitation",
      journal: "Int J Sports Phys Ther 7(1):109-119", pmid: "22319684",
      url: "https://pubmed.ncbi.nlm.nih.gov/22319684/",
      summary: "Practical synthesis: 30–60 s holds, regular frequency, and warm tissue optimise flexibility outcomes."
    },
    cook2006fms: {
      level: "B", year: 2006,
      authors: "Cook G, Burton L, Hoogenboom B",
      title: "Pre-participation screening: the use of fundamental movements as an assessment of function (FMS Parts 1 & 2)",
      journal: "N Am J Sports Phys Ther 1(2-3)", pmid: "21522216",
      url: "https://pubmed.ncbi.nlm.nih.gov/21522216/",
      summary: "Foundational description of the Functional Movement Screen and its scoring rubric."
    }
  };

  MH.refList = function () {
    return Object.keys(MH.references).map(function (k) {
      var r = MH.references[k];
      r.id = k;
      return r;
    });
  };
})(typeof window !== "undefined" ? window : this);
