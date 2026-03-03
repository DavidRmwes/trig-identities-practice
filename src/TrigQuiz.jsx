import { useState, useCallback } from "react";

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Theme tokens ──
const THEMES = {
  light: {
    page: "#f4f5f7", header: "#ffffff", headerBorder: "#e0e0e0", headerText: "#1a1a2e",
    headerSub: "#888", scoreBar: "#fafafa", scoreBarBorder: "#eee", scoreText: "#1a1a2e",
    scoreMuted: "#999", resetBg: "#f0f0f0", resetBorder: "#ddd", resetText: "#777",
    tabBg: "#fff", tabBorder: "#ddd", tabText: "#666", tabActiveBg: "light",
    cardBg: "#fff", cardBorderAlpha: "44", qBg: "#f8f9fa", qBorder: "#eee", qText: "#1a1a1a",
    optBg: "#fff", optBorder: "#e0e0e0", optText: "#333", optHover: "#f5f5f5",
    letterBorder: "#ccc", letterText: "#888",
    okBg: "#E8F5E9", okBdr: "#4CAF50", okTxt: "#1B5E20",
    noBg: "#FFEBEE", noBdr: "#E53935", noTxt: "#B71C1C",
    offBg: "#fafafa", offBdr: "#eee", offTxt: "#bbb",
    expOkBg: "#f0faf2", expOkBdr: "#c8e6c9", expNoBg: "#fff8f0", expNoBdr: "#ffe0b2",
    expOkTitle: "#2E7D32", expNoTitle: "#E65100",
    stepTxt: "#555", mathTxt: "#1a1a1a", mathBg: "#f5f7fa", mathBdr: "#e0e0e0",
    divider: "#e0e0e0", nextTxt: "#000",
    toggleBg: "#e8e8e8", toggleKnob: "#FF9800", toggleIcon: "☀️",
  },
  dark: {
    // Lightened dark: slate-gray, not pitch black
    page: "#2b2f3e", header: "#343848", headerBorder: "#444960", headerText: "#f0f1f5",
    headerSub: "#a0a4b8", scoreBar: "#313545", scoreBarBorder: "#444960", scoreText: "#f0f1f5",
    scoreMuted: "#9095aa", resetBg: "#3c4156", resetBorder: "#555a70", resetText: "#c0c4d4",
    tabBg: "#343848", tabBorder: "#4e5368", tabText: "#b0b4c8", tabActiveBg: "dark",
    cardBg: "#343848", cardBorderAlpha: "66", qBg: "#3c4158", qBorder: "#50556a", qText: "#f0f1f5",
    optBg: "#3c4158", optBorder: "#50556a", optText: "#e0e2f0", optHover: "#444962",
    letterBorder: "#5a5f75", letterText: "#a0a4ba",
    okBg: "#253d30", okBdr: "#66BB6A", okTxt: "#a5d6a7",
    noBg: "#3d2528", noBdr: "#ef5350", noTxt: "#ef9a9a",
    offBg: "#313545", offBdr: "#444960", offTxt: "#666a80",
    expOkBg: "#253830", expOkBdr: "#4CAF5044", expNoBg: "#3a3228", expNoBdr: "#FF980044",
    expOkTitle: "#a5d6a7", expNoTitle: "#FFB74D",
    stepTxt: "#c0c4d8", mathTxt: "#f0f1f5", mathBg: "#ffffff0c", mathBdr: "#ffffff22",
    divider: "#50556a", nextTxt: "#000",
    toggleBg: "#50556a", toggleKnob: "#42A5F5", toggleIcon: "🌙",
  },
};

const SC = {
  A: { color: "#FF9800", lBg: "#FFF3E0", dBg: "#3d3428", glow: "#FF980030" },
  B: { color: "#42A5F5", lBg: "#E3F2FD", dBg: "#2a3548", glow: "#42A5F530" },
  C: { color: "#EC407A", lBg: "#FCE4EC", dBg: "#3d2838", glow: "#EC407A30" },
  D: { color: "#26C6DA", lBg: "#E0F7FA", dBg: "#283d40", glow: "#26C6DA30" },
  E: { color: "#66BB6A", lBg: "#E8F5E9", dBg: "#2a3d2c", glow: "#66BB6A30" },
  F: { color: "#AB47BC", lBg: "#F3E5F5", dBg: "#2e2840", glow: "#AB47BC30" },
};

const SECTIONS = {
  A: {
    title: "Simplify the Expression", desc: "Reduce to a single trig function or constant.",
    problems: [
      { q: "sin θ · csc θ", answer: "1", d: ["sin θ", "cos θ", "csc θ"], steps: ["Recall that csc θ is the reciprocal of sin θ:", "  csc θ = 1/sin θ", "Substitute into the expression:", "  sin θ · (1/sin θ)", "The sin θ cancels:", "  = 1"] },
      { q: "cos²θ + sin²θ", answer: "1", d: ["2", "sin 2θ", "cos 2θ"], steps: ["This is the fundamental Pythagorean Identity:", "  sin²θ + cos²θ = 1", "It holds for all values of θ.", "  cos²θ + sin²θ = 1"] },
      { q: "sec²θ − tan²θ", answer: "1", d: ["tan²θ", "sec²θ", "0"], steps: ["Start with the Pythagorean Identity:", "  1 + tan²θ = sec²θ", "Rearrange by subtracting tan²θ:", "  sec²θ − tan²θ = 1"] },
      { q: "sin θ / tan θ", answer: "cos θ", d: ["sin θ", "1", "cot θ"], steps: ["Replace tan θ with its quotient identity:", "  tan θ = sin θ / cos θ", "Dividing by a fraction = multiplying by reciprocal:", "  sin θ ÷ (sin θ/cos θ) = sin θ · (cos θ/sin θ)", "Cancel sin θ:", "  = cos θ"] },
      { q: "(1 − cos²θ) / sin θ", answer: "sin θ", d: ["cos θ", "1", "tan θ"], steps: ["Pythagorean Identity: 1 − cos²θ = sin²θ", "Substitute:", "  sin²θ / sin θ", "Cancel one sin θ:", "  = sin θ"] },
      { q: "tan θ · cos θ", answer: "sin θ", d: ["cos θ", "tan θ", "1"], steps: ["Replace tan θ = sin θ / cos θ:", "  (sin θ / cos θ) · cos θ", "cos θ cancels:", "  = sin θ"] },
      { q: "cot²θ + 1", answer: "csc²θ", d: ["sec²θ", "tan²θ", "1"], steps: ["Pythagorean Identity:", "  1 + cot²θ = csc²θ", "Derived by dividing sin²θ + cos²θ = 1 by sin²θ."] },
      { q: "sin²θ·csc²θ + cos²θ·sec²θ", answer: "2", d: ["1", "0", "sin²θ+cos²θ"], steps: ["First term: sin²θ · csc²θ", "  = sin²θ · (1/sin²θ) = 1", "Second term: cos²θ · sec²θ", "  = cos²θ · (1/cos²θ) = 1", "Add:", "  1 + 1 = 2"] },
      { q: "(sec θ−1)(sec θ+1)", answer: "tan²θ", d: ["sec²θ", "1", "cot²θ"], steps: ["Difference of squares: (a−b)(a+b) = a²−b²", "  = sec²θ − 1", "Pythagorean: sec²θ − 1 = tan²θ", "  = tan²θ"] },
      { q: "sin(−θ) / cos(−θ)", answer: "−tan θ", d: ["tan θ", "−cot θ", "cot θ"], steps: ["Even/Odd identities:", "  sin(−θ) = −sin θ  (odd)", "  cos(−θ) = cos θ   (even)", "Substitute:", "  −sin θ / cos θ = −tan θ"] },
      { q: "cos θ · tan θ", answer: "sin θ", d: ["cos θ", "tan θ", "cot θ"], steps: ["tan θ = sin θ/cos θ", "  cos θ · (sin θ/cos θ)", "Cancel cos θ:", "  = sin θ"] },
      { q: "csc θ · cos θ", answer: "cot θ", d: ["tan θ", "sin θ", "sec θ"], steps: ["csc θ = 1/sin θ", "  (1/sin θ) · cos θ = cos θ/sin θ", "Quotient identity:", "  = cot θ"] },
      { q: "sec θ · sin θ", answer: "tan θ", d: ["cot θ", "csc θ", "sin θ"], steps: ["sec θ = 1/cos θ", "  (1/cos θ) · sin θ = sin θ/cos θ", "  = tan θ"] },
      { q: "1 − sin²θ", answer: "cos²θ", d: ["sin²θ", "tan²θ", "1"], steps: ["Pythagorean Identity: sin²θ + cos²θ = 1", "Rearrange:", "  1 − sin²θ = cos²θ"] },
      { q: "(csc θ−1)(csc θ+1)", answer: "cot²θ", d: ["csc²θ", "tan²θ", "1"], steps: ["Difference of squares:", "  csc²θ − 1", "Pythagorean: csc²θ − 1 = cot²θ"] },
      { q: "sin θ · cot θ", answer: "cos θ", d: ["sin θ", "tan θ", "1"], steps: ["cot θ = cos θ/sin θ", "  sin θ · (cos θ/sin θ)", "Cancel sin θ:", "  = cos θ"] },
      { q: "tan²θ · cos²θ", answer: "sin²θ", d: ["cos²θ", "tan²θ", "1"], steps: ["tan²θ = sin²θ/cos²θ", "  (sin²θ/cos²θ) · cos²θ", "Cancel cos²θ:", "  = sin²θ"] },
      { q: "sec²θ − 1", answer: "tan²θ", d: ["sec²θ", "cot²θ", "1"], steps: ["Pythagorean: 1 + tan²θ = sec²θ", "Rearrange:", "  sec²θ − 1 = tan²θ"] },
      { q: "csc²θ − 1", answer: "cot²θ", d: ["csc²θ", "tan²θ", "1"], steps: ["Pythagorean: 1 + cot²θ = csc²θ", "Rearrange:", "  csc²θ − 1 = cot²θ"] },
      { q: "cos θ · csc θ · tan θ", answer: "1", d: ["sin θ", "cos θ", "tan θ"], steps: ["Replace each function:", "  csc θ = 1/sin θ,  tan θ = sin θ/cos θ", "Substitute:", "  cos θ · (1/sin θ) · (sin θ/cos θ)", "Everything cancels:", "  = 1"] },
      { q: "sin²θ · cot²θ", answer: "cos²θ", d: ["sin²θ", "1", "cot²θ"], steps: ["cot²θ = cos²θ/sin²θ", "  sin²θ · (cos²θ/sin²θ)", "Cancel sin²θ:", "  = cos²θ"] },
      { q: "(1 + sin θ)(1 − sin θ)", answer: "cos²θ", d: ["sin²θ", "1", "1 − sin²θ"], steps: ["Difference of squares: (a+b)(a−b) = a²−b²", "  = 1 − sin²θ", "Pythagorean Identity:", "  = cos²θ"] },
      { q: "(1 + cos θ)(1 − cos θ)", answer: "sin²θ", d: ["cos²θ", "1", "1 − cos²θ"], steps: ["Difference of squares:", "  = 1 − cos²θ", "Pythagorean Identity:", "  = sin²θ"] },
      { q: "tan θ · cot θ", answer: "1", d: ["tan²θ", "cot²θ", "0"], steps: ["cot θ is the reciprocal of tan θ:", "  cot θ = 1/tan θ", "Multiply:", "  tan θ · (1/tan θ) = 1"] },
      { q: "sec θ · cos θ", answer: "1", d: ["sec²θ", "cos²θ", "0"], steps: ["sec θ is the reciprocal of cos θ:", "  sec θ = 1/cos θ", "Multiply:", "  (1/cos θ) · cos θ = 1"] },
      { q: "csc θ · sin θ", answer: "1", d: ["csc²θ", "sin²θ", "0"], steps: ["csc θ is the reciprocal of sin θ:", "  csc θ = 1/sin θ", "Multiply:", "  (1/sin θ) · sin θ = 1"] },
      { q: "sin θ · sec θ", answer: "tan θ", d: ["cot θ", "sin θ", "sec θ"], steps: ["Replace sec θ = 1/cos θ:", "  sin θ · (1/cos θ)", "  = sin θ / cos θ", "Quotient identity:", "  = tan θ"] },
      { q: "cos θ · csc θ", answer: "cot θ", d: ["tan θ", "cos θ", "csc θ"], steps: ["Replace csc θ = 1/sin θ:", "  cos θ · (1/sin θ)", "  = cos θ / sin θ", "Quotient identity:", "  = cot θ"] },
      { q: "tan²θ + 1", answer: "sec²θ", d: ["csc²θ", "tan²θ", "1"], steps: ["This is a Pythagorean Identity:", "  1 + tan²θ = sec²θ", "Derived by dividing sin²θ + cos²θ = 1 by cos²θ."] },
      { q: "(sin θ + cos θ)² − 1", answer: "2 sin θ cos θ", d: ["sin 2θ", "1", "sin²θ"], steps: ["Expand (sin θ + cos θ)²:", "  = sin²θ + 2 sin θ cos θ + cos²θ", "Apply Pythagorean: sin²θ + cos²θ = 1", "  = 1 + 2 sin θ cos θ", "Subtract 1:", "  = 2 sin θ cos θ"] },
      { q: "sec²θ · sin²θ", answer: "tan²θ", d: ["sin²θ", "sec²θ", "1"], steps: ["Replace sec²θ = 1/cos²θ:", "  (1/cos²θ) · sin²θ", "  = sin²θ / cos²θ", "Quotient identity:", "  = tan²θ"] },
      { q: "csc²θ · cos²θ", answer: "cot²θ", d: ["cos²θ", "csc²θ", "1"], steps: ["Replace csc²θ = 1/sin²θ:", "  (1/sin²θ) · cos²θ", "  = cos²θ / sin²θ", "Quotient identity:", "  = cot²θ"] },
      { q: "1 − sec²θ", answer: "−tan²θ", d: ["tan²θ", "−sec²θ", "−1"], steps: ["Pythagorean: 1 + tan²θ = sec²θ", "Rearrange:", "  1 − sec²θ = −tan²θ"] },
      { q: "1 − csc²θ", answer: "−cot²θ", d: ["cot²θ", "−csc²θ", "−1"], steps: ["Pythagorean: 1 + cot²θ = csc²θ", "Rearrange:", "  1 − csc²θ = −cot²θ"] },
      { q: "sin(−θ) · csc(−θ)", answer: "1", d: ["−1", "0", "sin²θ"], steps: ["Apply odd identities:", "  sin(−θ) = −sin θ", "  csc(−θ) = −csc θ  (csc is odd)", "Multiply:", "  (−sin θ)(−csc θ) = sin θ · csc θ", "  = sin θ · (1/sin θ) = 1"] },
      { q: "cos(−θ) · sec(−θ)", answer: "1", d: ["−1", "0", "cos²θ"], steps: ["Apply even identities:", "  cos(−θ) = cos θ", "  sec(−θ) = sec θ  (sec is even)", "Multiply:", "  cos θ · sec θ = cos θ · (1/cos θ)", "  = 1"] },
      { q: "tan(−θ) · cot(−θ)", answer: "1", d: ["−1", "0", "tan²θ"], steps: ["Apply odd identities:", "  tan(−θ) = −tan θ", "  cot(−θ) = −cot θ  (cot is odd)", "Multiply:", "  (−tan θ)(−cot θ) = tan θ · cot θ", "  = tan θ · (1/tan θ) = 1"] },
      { q: "sin²θ / (1 − cos θ)", answer: "1 + cos θ", d: ["1 − cos θ", "sin θ", "cos²θ"], steps: ["Pythagorean: sin²θ = 1 − cos²θ", "Factor 1 − cos²θ as difference of squares:", "  = (1 − cos θ)(1 + cos θ)", "Substitute:", "  (1 − cos θ)(1 + cos θ) / (1 − cos θ)", "Cancel (1 − cos θ):", "  = 1 + cos θ"] },
      { q: "cos²θ / (1 − sin θ)", answer: "1 + sin θ", d: ["1 − sin θ", "cos θ", "sin²θ"], steps: ["Pythagorean: cos²θ = 1 − sin²θ", "Factor as difference of squares:", "  = (1 − sin θ)(1 + sin θ)", "Substitute:", "  (1 − sin θ)(1 + sin θ) / (1 − sin θ)", "Cancel (1 − sin θ):", "  = 1 + sin θ"] },
      { q: "(sec θ + tan θ)(sec θ − tan θ)", answer: "1", d: ["sec²θ", "tan²θ", "0"], steps: ["Difference of squares:", "  = sec²θ − tan²θ", "Pythagorean Identity:", "  sec²θ − tan²θ = 1"] },
      { q: "(csc θ + cot θ)(csc θ − cot θ)", answer: "1", d: ["csc²θ", "cot²θ", "0"], steps: ["Difference of squares:", "  = csc²θ − cot²θ", "Pythagorean Identity:", "  csc²θ − cot²θ = 1"] },
      { q: "tan θ / sec θ", answer: "sin θ", d: ["cos θ", "tan θ", "csc θ"], steps: ["Replace both with sin/cos:", "  tan θ = sin θ/cos θ", "  sec θ = 1/cos θ", "Divide:", "  (sin θ/cos θ) / (1/cos θ)", "  = (sin θ/cos θ) · cos θ", "  = sin θ"] },
      { q: "cot θ / csc θ", answer: "cos θ", d: ["sin θ", "cot θ", "sec θ"], steps: ["Replace both with sin/cos:", "  cot θ = cos θ/sin θ", "  csc θ = 1/sin θ", "Divide:", "  (cos θ/sin θ) / (1/sin θ)", "  = (cos θ/sin θ) · sin θ", "  = cos θ"] },
    ],
  },
  B: {
    title: "Evaluate Using Identities", desc: "Find exact values using trig identities.",
    problems: [
      { q: "If sin θ = 3/5 (Q I), find cos θ", answer: "4/5", d: ["3/5", "5/4", "5/3"], steps: ["Pythagorean: sin²θ + cos²θ = 1", "Substitute sin θ = 3/5:", "  (3/5)² + cos²θ = 1", "  9/25 + cos²θ = 1", "Solve:", "  cos²θ = 16/25", "Positive root (Q I):", "  cos θ = 4/5"] },
      { q: "If cos θ = 5/13 (Q I), find sin θ", answer: "12/13", d: ["5/13", "13/12", "5/12"], steps: ["Pythagorean: sin²θ + cos²θ = 1", "  sin²θ + 25/169 = 1", "  sin²θ = 144/169", "Positive root (Q I):", "  sin θ = 12/13"] },
      { q: "If tan θ = 4/3 (Q III), find sec θ", answer: "−5/3", d: ["5/3", "−3/5", "4/5"], steps: ["Pythagorean: 1 + tan²θ = sec²θ", "  1 + 16/9 = sec²θ", "  sec²θ = 25/9", "  sec θ = ±5/3", "Q III → cos negative → sec negative:", "  sec θ = −5/3"] },
      { q: "If sin θ = 3/5 (Q I), find sin 2θ", answer: "24/25", d: ["6/5", "12/25", "7/25"], steps: ["Double angle: sin 2θ = 2 sin θ cos θ", "Find cos θ:", "  cos θ = 4/5 (Pythagorean)", "Substitute:", "  sin 2θ = 2(3/5)(4/5) = 24/25"] },
      { q: "If cos θ = 4/5 (Q I), find cos 2θ", answer: "7/25", d: ["24/25", "8/25", "−7/25"], steps: ["Double angle: cos 2θ = 2cos²θ − 1", "  = 2(16/25) − 1", "  = 32/25 − 25/25", "  = 7/25"] },
      { q: "If cos θ = 3/5 (Q I), find tan θ", answer: "4/3", d: ["3/4", "5/3", "5/4"], steps: ["Find sin θ: sin²θ = 1 − 9/25 = 16/25 → sin θ = 4/5", "Quotient identity:", "  tan θ = (4/5)/(3/5) = 4/3"] },
      { q: "Find sin(75°) via sin(45°+30°)", answer: "(√6+√2)/4", d: ["(√6−√2)/4", "(√3+1)/4", "√3/2"], steps: ["Sum formula: sin(A+B) = sinAcosB + cosAsinB", "  = sin45°cos30° + cos45°sin30°", "  = (√2/2)(√3/2) + (√2/2)(1/2)", "  = √6/4 + √2/4", "  = (√6+√2)/4"] },
      { q: "Find cos(15°) via cos(45°−30°)", answer: "(√6+√2)/4", d: ["(√6−√2)/4", "(√3−1)/4", "√2/2"], steps: ["Difference formula: cos(A−B) = cosAcosB + sinAsinB", "  = (√2/2)(√3/2) + (√2/2)(1/2)", "  = (√6+√2)/4"] },
      { q: "Find sin(15°) via sin(45°−30°)", answer: "(√6−√2)/4", d: ["(√6+√2)/4", "(√3−1)/4", "1/4"], steps: ["sin(A−B) = sinAcosB − cosAsinB", "  = (√2/2)(√3/2) − (√2/2)(1/2)", "  = √6/4 − √2/4 = (√6−√2)/4"] },
      { q: "If cos θ = 3/5 (Q I), find sin(θ/2)", answer: "1/√5", d: ["2/√5", "√(3/5)", "1/√10"], steps: ["Half-angle: sin(θ/2) = ±√[(1−cosθ)/2]", "  = √[(1−3/5)/2]", "  = √[(2/5)/2] = √[1/5]", "  = 1/√5  (positive, Q I)"] },
      { q: "If cos θ = 3/5 (Q I), find cos(θ/2)", answer: "2/√5", d: ["1/√5", "√(3/5)", "3/√10"], steps: ["Half-angle: cos(θ/2) = ±√[(1+cosθ)/2]", "  = √[(1+3/5)/2]", "  = √[(8/5)/2] = √[4/5]", "  = 2/√5"] },
      { q: "If sin θ = 3/5 (Q I), find tan 2θ", answer: "24/7", d: ["7/24", "−24/7", "6/5"], steps: ["cos θ = 4/5", "sin 2θ = 2(3/5)(4/5) = 24/25", "cos 2θ = 2(16/25)−1 = 7/25", "tan 2θ = (24/25)/(7/25) = 24/7"] },
      { q: "If sin θ = 5/13 (Q I), find cos θ", answer: "12/13", d: ["5/12", "13/5", "13/12"], steps: ["Pythagorean: sin²θ + cos²θ = 1", "  (5/13)² + cos²θ = 1", "  25/169 + cos²θ = 1", "  cos²θ = 144/169", "Positive root (Q I):", "  cos θ = 12/13"] },
      { q: "If sin θ = 5/13 (Q I), find tan θ", answer: "5/12", d: ["12/5", "13/12", "13/5"], steps: ["First find cos θ:", "  cos²θ = 1 − 25/169 = 144/169 → cos θ = 12/13", "Quotient identity:", "  tan θ = sin θ/cos θ = (5/13)/(12/13)", "  = 5/12"] },
      { q: "If sin θ = 8/17 (Q I), find cos θ", answer: "15/17", d: ["8/15", "17/15", "9/17"], steps: ["Pythagorean: sin²θ + cos²θ = 1", "  64/289 + cos²θ = 1", "  cos²θ = 225/289", "Positive root (Q I):", "  cos θ = 15/17"] },
      { q: "If cos θ = 7/25 (Q I), find sin θ", answer: "24/25", d: ["7/24", "25/24", "18/25"], steps: ["Pythagorean: sin²θ + cos²θ = 1", "  sin²θ + 49/625 = 1", "  sin²θ = 576/625", "Positive root (Q I):", "  sin θ = 24/25"] },
      { q: "If sin θ = 3/5 (Q II), find cos θ", answer: "−4/5", d: ["4/5", "−3/5", "−5/4"], steps: ["Pythagorean: cos²θ = 1 − sin²θ", "  = 1 − 9/25 = 16/25", "  cos θ = ±4/5", "In Q II, cosine is negative:", "  cos θ = −4/5"] },
      { q: "If cos θ = −5/13 (Q II), find sin θ", answer: "12/13", d: ["−12/13", "5/13", "−5/12"], steps: ["Pythagorean: sin²θ = 1 − cos²θ", "  = 1 − 25/169 = 144/169", "  sin θ = ±12/13", "In Q II, sine is positive:", "  sin θ = 12/13"] },
      { q: "If sin θ = −3/5 (Q III), find cos θ", answer: "−4/5", d: ["4/5", "−3/4", "3/5"], steps: ["Pythagorean: cos²θ = 1 − 9/25 = 16/25", "  cos θ = ±4/5", "In Q III, cosine is negative:", "  cos θ = −4/5"] },
      { q: "If cos θ = −4/5 (Q III), find sin θ", answer: "−3/5", d: ["3/5", "−4/3", "4/5"], steps: ["Pythagorean: sin²θ = 1 − 16/25 = 9/25", "  sin θ = ±3/5", "In Q III, sine is negative:", "  sin θ = −3/5"] },
      { q: "If sin θ = −5/13 (Q IV), find cos θ", answer: "12/13", d: ["−12/13", "5/13", "−5/12"], steps: ["Pythagorean: cos²θ = 1 − 25/169 = 144/169", "  cos θ = ±12/13", "In Q IV, cosine is positive:", "  cos θ = 12/13"] },
      { q: "If cos θ = 12/13 (Q IV), find sin θ", answer: "−5/13", d: ["5/13", "−12/13", "12/5"], steps: ["Pythagorean: sin²θ = 1 − 144/169 = 25/169", "  sin θ = ±5/13", "In Q IV, sine is negative:", "  sin θ = −5/13"] },
      { q: "If tan θ = 5/12 (Q I), find sin θ", answer: "5/13", d: ["12/13", "5/12", "12/5"], steps: ["Use 1 + tan²θ = sec²θ:", "  sec²θ = 1 + 25/144 = 169/144", "  sec θ = 13/12 → cos θ = 12/13", "Then sin θ = tan θ · cos θ:", "  = (5/12)(12/13) = 5/13"] },
      { q: "If tan θ = −3/4 (Q II), find sin θ", answer: "3/5", d: ["−3/5", "4/5", "−4/5"], steps: ["Use 1 + tan²θ = sec²θ:", "  sec²θ = 1 + 9/16 = 25/16", "  sec θ = −5/4 (Q II, cos neg) → cos θ = −4/5", "sin θ = tan θ · cos θ:", "  = (−3/4)(−4/5) = 3/5"] },
      { q: "If sin θ = 5/13 (Q I), find sin 2θ", answer: "120/169", d: ["60/169", "10/13", "25/169"], steps: ["Double angle: sin 2θ = 2 sin θ cos θ", "Find cos θ:", "  cos θ = 12/13 (Pythagorean)", "Substitute:", "  sin 2θ = 2(5/13)(12/13)", "  = 120/169"] },
      { q: "If sin θ = 5/13 (Q I), find cos 2θ", answer: "119/169", d: ["−119/169", "120/169", "69/169"], steps: ["Double angle: cos 2θ = 1 − 2sin²θ", "  = 1 − 2(25/169)", "  = 1 − 50/169", "  = 119/169"] },
      { q: "If cos θ = 3/5 (Q I), find sin 2θ", answer: "24/25", d: ["12/25", "6/5", "16/25"], steps: ["Find sin θ: sin²θ = 1 − 9/25 = 16/25 → sin θ = 4/5", "Double angle: sin 2θ = 2 sin θ cos θ", "  = 2(4/5)(3/5)", "  = 24/25"] },
      { q: "If cos θ = 3/5 (Q I), find cos 2θ", answer: "−7/25", d: ["7/25", "18/25", "−18/25"], steps: ["Double angle: cos 2θ = 2cos²θ − 1", "  = 2(9/25) − 1", "  = 18/25 − 25/25", "  = −7/25"] },
      { q: "If sin θ = −3/5 (Q III), find sin 2θ", answer: "24/25", d: ["−24/25", "−7/25", "7/25"], steps: ["In Q III: cos θ = −4/5", "sin 2θ = 2 sin θ cos θ", "  = 2(−3/5)(−4/5)", "Negatives cancel:", "  = 24/25"] },
      { q: "If sin θ = −3/5 (Q III), find cos 2θ", answer: "7/25", d: ["−7/25", "24/25", "−24/25"], steps: ["cos 2θ = 1 − 2sin²θ", "  = 1 − 2(9/25)", "  = 1 − 18/25", "  = 7/25"] },
      { q: "If sin θ = 4/5 (Q I), find cos(θ/2)", answer: "√[(1+3/5)/2]", d: ["√[(1−3/5)/2]", "2/√5", "1/√5"], steps: ["First find cos θ: cos²θ = 1 − 16/25 = 9/25 → cos θ = 3/5", "Half-angle: cos(θ/2) = √[(1+cosθ)/2]", "  = √[(1+3/5)/2]", "  = √[(8/5)/2]", "  = √[4/5] = 2/√5"] },
      { q: "Find cos(75°) via cos(45°+30°)", answer: "(√6−√2)/4", d: ["(√6+√2)/4", "(√3−1)/4", "√2/2"], steps: ["Sum formula: cos(A+B) = cosAcosB − sinAsinB", "  = cos45°cos30° − sin45°sin30°", "  = (√2/2)(√3/2) − (√2/2)(1/2)", "  = √6/4 − √2/4", "  = (√6−√2)/4"] },
      { q: "Find tan(75°) via tan(45°+30°)", answer: "2+√3", d: ["2−√3", "√3+1", "√3−1"], steps: ["Sum formula: tan(A+B) = (tanA+tanB)/(1−tanAtanB)", "  = (1+√3/3)/(1−1·√3/3)", "  = (1+√3/3)/(1−√3/3)", "Multiply num and den by 3:", "  = (3+√3)/(3−√3)", "Rationalize by multiplying by (3+√3)/(3+√3):", "  = (9+6√3+3)/(9−3)", "  = (12+6√3)/6 = 2+√3"] },
      { q: "Find tan(15°) via tan(45°−30°)", answer: "2−√3", d: ["2+√3", "√3−1", "1−√3"], steps: ["Difference formula: tan(A−B) = (tanA−tanB)/(1+tanAtanB)", "  = (1−√3/3)/(1+√3/3)", "Multiply num and den by 3:", "  = (3−√3)/(3+√3)", "Rationalize by multiplying by (3−√3)/(3−√3):", "  = (9−6√3+3)/(9−3)", "  = (12−6√3)/6 = 2−√3"] },
      { q: "Find sin(105°) via sin(60°+45°)", answer: "(√6+√2)/4", d: ["(√6−√2)/4", "(√3+1)/4", "√3/2"], steps: ["sin(A+B) = sinAcosB + cosAsinB", "  = sin60°cos45° + cos60°sin45°", "  = (√3/2)(√2/2) + (1/2)(√2/2)", "  = √6/4 + √2/4", "  = (√6+√2)/4"] },
      { q: "Find cos(105°) via cos(60°+45°)", answer: "(√2−√6)/4", d: ["(√6−√2)/4", "(√6+√2)/4", "(√2+√6)/4"], steps: ["cos(A+B) = cosAcosB − sinAsinB", "  = cos60°cos45° − sin60°sin45°", "  = (1/2)(√2/2) − (√3/2)(√2/2)", "  = √2/4 − √6/4", "  = (√2−√6)/4"] },
      { q: "If sin θ = 8/17 (Q I), find sin 2θ", answer: "240/289", d: ["120/289", "16/17", "64/289"], steps: ["Find cos θ: cos²θ = 1 − 64/289 = 225/289 → cos θ = 15/17", "sin 2θ = 2 sin θ cos θ", "  = 2(8/17)(15/17)", "  = 240/289"] },
      { q: "If sin θ = 8/17 (Q I), find cos 2θ", answer: "161/289", d: ["−161/289", "240/289", "127/289"], steps: ["cos 2θ = 1 − 2sin²θ", "  = 1 − 2(64/289)", "  = 1 − 128/289", "  = 161/289"] },
      { q: "If sin θ = 7/25 (Q I), find cos θ", answer: "24/25", d: ["7/24", "25/24", "18/25"], steps: ["Pythagorean: cos²θ = 1 − sin²θ", "  = 1 − 49/625 = 576/625", "Positive root (Q I):", "  cos θ = 24/25"] },
      { q: "If tan θ = 7/24 (Q I), find sec θ", answer: "25/24", d: ["24/25", "7/25", "25/7"], steps: ["Pythagorean: 1 + tan²θ = sec²θ", "  1 + 49/576 = sec²θ", "  sec²θ = 625/576", "Positive root (Q I):", "  sec θ = 25/24"] },
      { q: "If cot θ = 4/3 (Q I), find csc θ", answer: "5/3", d: ["3/5", "4/5", "5/4"], steps: ["Pythagorean: 1 + cot²θ = csc²θ", "  1 + 16/9 = csc²θ", "  csc²θ = 25/9", "Positive root (Q I):", "  csc θ = 5/3"] },
    ],
  },
  C: {
    title: "Verify the Identity", desc: "Which identity correctly completes the equation?",
    problems: [
      { q: "sin θ · sec θ = ?", answer: "tan θ", d: ["cot θ", "csc θ", "cos θ"], steps: ["sec θ = 1/cos θ", "  sin θ · (1/cos θ) = sin θ/cos θ", "  = tan θ"] },
      { q: "cos θ · csc θ = ?", answer: "cot θ", d: ["tan θ", "sec θ", "sin θ"], steps: ["csc θ = 1/sin θ", "  cos θ/sin θ = cot θ"] },
      { q: "(1+sinθ)(1−sinθ) = ?", answer: "cos²θ", d: ["sin²θ", "1", "tan²θ"], steps: ["Difference of squares:", "  = 1 − sin²θ", "Pythagorean:", "  = cos²θ"] },
      { q: "sec θ − cos θ = ?", answer: "sinθ · tanθ", d: ["cosθ·cotθ", "tanθ·cosθ", "cscθ−sinθ"], steps: ["Rewrite: 1/cosθ − cosθ", "Common denominator:", "  = (1−cos²θ)/cosθ", "Pythagorean: 1−cos²θ = sin²θ", "  = sin²θ/cosθ", "  = sinθ · (sinθ/cosθ) = sinθ·tanθ"] },
      { q: "(sinθ+cosθ)² = ?", answer: "1 + 2sinθcosθ", d: ["1 − 2sinθcosθ", "sin2θ", "2"], steps: ["Expand (a+b)² = a²+2ab+b²:", "  = sin²θ + 2sinθcosθ + cos²θ", "Pythagorean:", "  = 1 + 2sinθcosθ"] },
      { q: "tanθ + cotθ = ?", answer: "secθ·cscθ", d: ["sinθcosθ", "2csc2θ", "1"], steps: ["Rewrite: sinθ/cosθ + cosθ/sinθ", "Common denominator:", "  = (sin²θ+cos²θ)/(sinθcosθ)", "  = 1/(sinθcosθ)", "  = secθ · cscθ"] },
      { q: "sin2θ / (1+cos2θ) = ?", answer: "tan θ", d: ["cot θ", "sin θ", "2tan θ"], steps: ["Double-angle:", "  sin2θ = 2sinθcosθ", "  1+cos2θ = 2cos²θ", "Substitute:", "  = 2sinθcosθ / 2cos²θ", "Cancel:", "  = sinθ/cosθ = tanθ"] },
      { q: "cos⁴θ − sin⁴θ = ?", answer: "cos 2θ", d: ["sin 2θ", "1", "−cos 2θ"], steps: ["Factor: (cos²θ+sin²θ)(cos²θ−sin²θ)", "  = 1 · (cos²θ−sin²θ)", "  = cos2θ"] },
      { q: "2sinθcosθ = ?", answer: "sin 2θ", d: ["cos 2θ", "tan 2θ", "sin θ"], steps: ["Double-angle formula for sine:", "  sin2θ = 2sinθcosθ", "Direct match."] },
      { q: "cos²θ − sin²θ = ?", answer: "cos 2θ", d: ["sin 2θ", "−cos 2θ", "1"], steps: ["Double-angle for cosine:", "  cos2θ = cos²θ − sin²θ", "Direct match."] },
      { q: "1/(1−sin²θ) = ?", answer: "sec²θ", d: ["csc²θ", "cos²θ", "1+sin²θ"], steps: ["Pythagorean: 1−sin²θ = cos²θ", "  1/cos²θ = sec²θ"] },
      { q: "cscθ − sinθ = ?", answer: "cosθ·cotθ", d: ["sinθtanθ", "secθ−cosθ", "tanθcosθ"], steps: ["  1/sinθ − sinθ", "  = (1−sin²θ)/sinθ", "  = cos²θ/sinθ", "  = cosθ · (cosθ/sinθ) = cosθ·cotθ"] },
      { q: "(1+tan²θ)cos²θ = ?", answer: "1", d: ["cos²θ", "sec²θ", "tan²θ"], steps: ["1+tan²θ = sec²θ", "  sec²θ · cos²θ = (1/cos²θ)·cos²θ = 1"] },
      { q: "sinθ/(1+cosθ) = ?", answer: "tan(θ/2)", d: ["sin(θ/2)", "cos(θ/2)", "cot(θ/2)"], steps: ["Half-angle identity:", "  tan(θ/2) = sinθ/(1+cosθ)", "Verify:", "  sinθ = 2sin(θ/2)cos(θ/2)", "  1+cosθ = 2cos²(θ/2)", "  = sin(θ/2)/cos(θ/2) = tan(θ/2)"] },
      { q: "(sinθ−cosθ)² = ?", answer: "1 − 2sinθcosθ", d: ["1 + 2sinθcosθ", "sin2θ", "−sin2θ"], steps: ["Expand (a−b)² = a²−2ab+b²:", "  = sin²θ − 2sinθcosθ + cos²θ", "Pythagorean:", "  = 1 − 2sinθcosθ"] },
      { q: "sin2θ / sinθ = ?", answer: "2cosθ", d: ["2sinθ", "cosθ", "cos2θ"], steps: ["Replace sin2θ = 2sinθcosθ:", "  2sinθcosθ / sinθ", "Cancel sinθ:", "  = 2cosθ"] },
      { q: "sin2θ / cosθ = ?", answer: "2sinθ", d: ["2cosθ", "sinθ", "sin2θ"], steps: ["Replace sin2θ = 2sinθcosθ:", "  2sinθcosθ / cosθ", "Cancel cosθ:", "  = 2sinθ"] },
      { q: "(1−cos2θ) / sin2θ = ?", answer: "tanθ", d: ["cotθ", "2sinθ", "sinθ"], steps: ["Double-angle identities:", "  1−cos2θ = 2sin²θ", "  sin2θ = 2sinθcosθ", "Substitute:", "  = 2sin²θ / 2sinθcosθ", "Cancel 2sinθ:", "  = sinθ/cosθ = tanθ"] },
      { q: "sin2θ / (1−cos2θ) = ?", answer: "cotθ", d: ["tanθ", "cscθ", "2cosθ"], steps: ["Double-angle identities:", "  sin2θ = 2sinθcosθ", "  1−cos2θ = 2sin²θ", "Substitute:", "  = 2sinθcosθ / 2sin²θ", "Cancel 2sinθ:", "  = cosθ/sinθ = cotθ"] },
      { q: "secθ − tanθsinθ = ?", answer: "cosθ", d: ["sinθ", "secθ", "1"], steps: ["Replace secθ = 1/cosθ and tanθ = sinθ/cosθ:", "  1/cosθ − (sinθ/cosθ)·sinθ", "  = 1/cosθ − sin²θ/cosθ", "Common denominator:", "  = (1 − sin²θ)/cosθ", "Pythagorean: 1 − sin²θ = cos²θ", "  = cos²θ/cosθ", "  = cosθ"] },
      { q: "cscθ − cotθcosθ = ?", answer: "sinθ", d: ["cosθ", "cscθ", "1"], steps: ["Replace cscθ = 1/sinθ and cotθ = cosθ/sinθ:", "  1/sinθ − (cosθ/sinθ)·cosθ", "  = 1/sinθ − cos²θ/sinθ", "Common denominator:", "  = (1 − cos²θ)/sinθ", "Pythagorean: 1 − cos²θ = sin²θ", "  = sin²θ/sinθ", "  = sinθ"] },
      { q: "sin⁴θ − cos⁴θ = ?", answer: "−cos2θ", d: ["cos2θ", "sin2θ", "1"], steps: ["Factor as difference of squares:", "  = (sin²θ+cos²θ)(sin²θ−cos²θ)", "Pythagorean: sin²θ+cos²θ = 1", "  = 1·(sin²θ−cos²θ)", "  = −(cos²θ−sin²θ)", "  = −cos2θ"] },
      { q: "1/(1−cosθ) − 1/(1+cosθ) = ?", answer: "2cscθcotθ", d: ["2secθtanθ", "csc²θ", "2cosθ"], steps: ["Common denominator (1−cosθ)(1+cosθ):", "  = [(1+cosθ)−(1−cosθ)] / (1−cos²θ)", "Simplify numerator:", "  = 2cosθ / (1−cos²θ)", "Pythagorean: 1−cos²θ = sin²θ", "  = 2cosθ/sin²θ", "  = 2·(cosθ/sinθ)·(1/sinθ)", "  = 2cotθcscθ"] },
      { q: "1/(1−sinθ) − 1/(1+sinθ) = ?", answer: "2secθtanθ", d: ["2cscθcotθ", "sec²θ", "2sinθ"], steps: ["Common denominator (1−sinθ)(1+sinθ):", "  = [(1+sinθ)−(1−sinθ)] / (1−sin²θ)", "Simplify numerator:", "  = 2sinθ / cos²θ", "  = 2·(sinθ/cosθ)·(1/cosθ)", "  = 2tanθsecθ"] },
      { q: "tanθ/(1+tan²θ) = ?", answer: "sinθcosθ", d: ["sin2θ", "tan2θ", "cos²θ"], steps: ["Replace 1+tan²θ = sec²θ:", "  = tanθ/sec²θ", "  = (sinθ/cosθ)·cos²θ", "  = sinθ·cosθ"] },
      { q: "sin²θ/(1+cosθ) = ?", answer: "1−cosθ", d: ["1+cosθ", "sinθ", "cosθ"], steps: ["Pythagorean: sin²θ = 1−cos²θ", "Factor:", "  = (1−cosθ)(1+cosθ)", "Substitute:", "  (1−cosθ)(1+cosθ)/(1+cosθ)", "Cancel:", "  = 1−cosθ"] },
      { q: "cos²θ/(1+sinθ) = ?", answer: "1−sinθ", d: ["1+sinθ", "cosθ", "sinθ"], steps: ["Pythagorean: cos²θ = 1−sin²θ", "Factor:", "  = (1−sinθ)(1+sinθ)", "Substitute:", "  (1−sinθ)(1+sinθ)/(1+sinθ)", "Cancel:", "  = 1−sinθ"] },
      { q: "sin²θ/(1−cosθ) = ?", answer: "1+cosθ", d: ["1−cosθ", "sinθ", "cos²θ"], steps: ["Pythagorean: sin²θ = 1−cos²θ", "Factor:", "  = (1−cosθ)(1+cosθ)", "Substitute:", "  (1−cosθ)(1+cosθ)/(1−cosθ)", "Cancel:", "  = 1+cosθ"] },
      { q: "tanθ + cotθ = ?", answer: "secθcscθ", d: ["1", "sinθcosθ", "tan²θ"], steps: ["Rewrite: sinθ/cosθ + cosθ/sinθ", "Common denominator sinθcosθ:", "  = (sin²θ+cos²θ)/(sinθcosθ)", "Pythagorean:", "  = 1/(sinθcosθ) = secθcscθ"] },
      { q: "sec²θ + csc²θ = ?", answer: "sec²θ·csc²θ", d: ["2", "tan²θ+cot²θ", "1"], steps: ["Rewrite:", "  1/cos²θ + 1/sin²θ", "Common denominator sin²θcos²θ:", "  = (sin²θ+cos²θ)/(sin²θcos²θ)", "Pythagorean:", "  = 1/(sin²θcos²θ)", "  = sec²θ·csc²θ"] },
      { q: "1/(secθ−1) + 1/(secθ+1) = ?", answer: "2csc²θcosθ", d: ["2secθ", "2cotθcscθ", "sec²θ"], steps: ["Common denominator (secθ−1)(secθ+1):", "  = [(secθ+1)+(secθ−1)] / (sec²θ−1)", "Simplify numerator:", "  = 2secθ / tan²θ", "Replace secθ = 1/cosθ, tan²θ = sin²θ/cos²θ:", "  = (2/cosθ) / (sin²θ/cos²θ)", "  = (2/cosθ)·(cos²θ/sin²θ)", "  = 2cosθ/sin²θ = 2cosθ·csc²θ"] },
      { q: "(1+cosθ)/sinθ = ?", answer: "cot(θ/2)", d: ["tan(θ/2)", "csc(θ/2)", "sec(θ/2)"], steps: ["Half-angle identity:", "  cot(θ/2) = (1+cosθ)/sinθ", "Verify:", "  1+cosθ = 2cos²(θ/2)", "  sinθ = 2sin(θ/2)cos(θ/2)", "  = 2cos²(θ/2) / 2sin(θ/2)cos(θ/2)", "  = cos(θ/2)/sin(θ/2) = cot(θ/2)"] },
      { q: "(1−cosθ)/sinθ = ?", answer: "tan(θ/2)", d: ["cot(θ/2)", "sin(θ/2)", "cos(θ/2)"], steps: ["Half-angle identity:", "  tan(θ/2) = (1−cosθ)/sinθ", "Verify:", "  1−cosθ = 2sin²(θ/2)", "  sinθ = 2sin(θ/2)cos(θ/2)", "  = 2sin²(θ/2) / 2sin(θ/2)cos(θ/2)", "  = sin(θ/2)/cos(θ/2) = tan(θ/2)"] },
      { q: "sin⁴θ + 2sin²θcos²θ + cos⁴θ = ?", answer: "1", d: ["sin²2θ", "2", "cos2θ"], steps: ["Recognize perfect square:", "  = (sin²θ + cos²θ)²", "Pythagorean:", "  = 1² = 1"] },
      { q: "sec⁴θ − tan⁴θ = ?", answer: "sec²θ + tan²θ", d: ["1", "sec²θ − tan²θ", "2sec²θ"], steps: ["Factor as difference of squares:", "  = (sec²θ+tan²θ)(sec²θ−tan²θ)", "Pythagorean: sec²θ−tan²θ = 1", "  = (sec²θ+tan²θ)·1", "  = sec²θ + tan²θ"] },
      { q: "csc⁴θ − cot⁴θ = ?", answer: "csc²θ + cot²θ", d: ["1", "csc²θ − cot²θ", "2csc²θ"], steps: ["Factor as difference of squares:", "  = (csc²θ+cot²θ)(csc²θ−cot²θ)", "Pythagorean: csc²θ−cot²θ = 1", "  = (csc²θ+cot²θ)·1", "  = csc²θ + cot²θ"] },
      { q: "sinθ/(cscθ−cotθ) = ?", answer: "1+cosθ", d: ["1−cosθ", "sinθ", "cscθ"], steps: ["Rewrite denominator:", "  cscθ−cotθ = 1/sinθ − cosθ/sinθ = (1−cosθ)/sinθ", "Divide:", "  sinθ / [(1−cosθ)/sinθ]", "  = sinθ · sinθ/(1−cosθ)", "  = sin²θ/(1−cosθ)", "Pythagorean: sin²θ = (1−cosθ)(1+cosθ)", "Cancel:", "  = 1+cosθ"] },
      { q: "cosθ/(secθ−tanθ) = ?", answer: "1+sinθ", d: ["1−sinθ", "cosθ", "secθ"], steps: ["Rewrite denominator:", "  secθ−tanθ = 1/cosθ − sinθ/cosθ = (1−sinθ)/cosθ", "Divide:", "  cosθ / [(1−sinθ)/cosθ]", "  = cos²θ/(1−sinθ)", "Pythagorean: cos²θ = (1−sinθ)(1+sinθ)", "Cancel:", "  = 1+sinθ"] },
    ],
  },
  D: {
    title: "Double & Half Angle", desc: "Apply double-angle, half-angle, or power-reducing formulas.",
    problems: [
      { q: "Simplify: 2cos²θ − 1", answer: "cos 2θ", d: ["sin 2θ", "−cos 2θ", "2cos θ"], steps: ["Double angle:", "  cos2θ = 2cos²θ − 1", "Direct match."] },
      { q: "Simplify: 1 − 2sin²θ", answer: "cos 2θ", d: ["sin 2θ", "−cos 2θ", "2sin θ"], steps: ["Double angle:", "  cos2θ = 1 − 2sin²θ", "Direct match."] },
      { q: "Simplify: 2tanθ/(1−tan²θ)", answer: "tan 2θ", d: ["2tanθ", "tan²θ", "cot 2θ"], steps: ["Double angle for tangent:", "  tan2θ = 2tanθ/(1−tan²θ)", "Exact match."] },
      { q: "cos²(3x) power-reduced = ?", answer: "(1+cos6x)/2", d: ["(1−cos6x)/2", "(1+cos3x)/2", "(1−cos3x)/2"], steps: ["cos²u = (1+cos2u)/2", "u=3x → 2u=6x:", "  cos²(3x) = (1+cos6x)/2"] },
      { q: "sin²(2x) power-reduced = ?", answer: "(1−cos4x)/2", d: ["(1+cos4x)/2", "(1−cos2x)/2", "(1+cos2x)/2"], steps: ["sin²u = (1−cos2u)/2", "u=2x → 2u=4x:", "  sin²(2x) = (1−cos4x)/2"] },
      { q: "sin²(5x) power-reduced = ?", answer: "(1−cos10x)/2", d: ["(1+cos10x)/2", "(1−cos5x)/2", "(1+cos5x)/2"], steps: ["sin²u = (1−cos2u)/2", "u=5x → 2u=10x:", "  = (1−cos10x)/2"] },
      { q: "cos²(4x) power-reduced = ?", answer: "(1+cos8x)/2", d: ["(1−cos8x)/2", "(1+cos4x)/2", "(1−cos4x)/2"], steps: ["cos²u = (1+cos2u)/2", "u=4x → 2u=8x:", "  = (1+cos8x)/2"] },
      { q: "Simplify: sin²θ − cos²θ", answer: "−cos 2θ", d: ["cos 2θ", "sin 2θ", "−sin 2θ"], steps: ["cos2θ = cos²θ − sin²θ", "Negate:", "  sin²θ − cos²θ = −cos2θ"] },
      { q: "Simplify: (1+cos2θ)/2", answer: "cos²θ", d: ["sin²θ", "cos2θ", "sinθ"], steps: ["Power-reducing:", "  cos²θ = (1+cos2θ)/2", "Direct match."] },
      { q: "Simplify: (1−cos2θ)/2", answer: "sin²θ", d: ["cos²θ", "sin2θ", "cosθ"], steps: ["Power-reducing:", "  sin²θ = (1−cos2θ)/2", "Direct match."] },
      { q: "cos²(θ/2)−sin²(θ/2) = ?", answer: "cos θ", d: ["sin θ", "cos(θ/2)", "1"], steps: ["cos2A = cos²A−sin²A, let A=θ/2:", "  = cos(2·θ/2) = cosθ"] },
      { q: "2sin(θ/2)cos(θ/2) = ?", answer: "sin θ", d: ["cos θ", "sin(θ/2)", "2sinθ"], steps: ["sin2A = 2sinAcosA, let A=θ/2:", "  = sin(2·θ/2) = sinθ"] },
      { q: "tan²(3x) power-reduced = ?", answer: "(1−cos6x)/(1+cos6x)", d: ["(1+cos6x)/(1−cos6x)", "(1−cos3x)/(1+cos3x)", "sin6x/cos6x"], steps: ["tan²u = (1−cos2u)/(1+cos2u)", "u=3x → 2u=6x:", "  = (1−cos6x)/(1+cos6x)"] },
      { q: "sin²(x/2) power-reduced = ?", answer: "(1−cosx)/2", d: ["(1+cosx)/2", "(1−cosx/2)/2", "(1+sinx)/2"], steps: ["sin²u = (1−cos2u)/2", "u=x/2 → 2u=x:", "  sin²(x/2) = (1−cosx)/2"] },
      { q: "cos²(x/2) power-reduced = ?", answer: "(1+cosx)/2", d: ["(1−cosx)/2", "(1+cosx/2)/2", "(1−sinx)/2"], steps: ["cos²u = (1+cos2u)/2", "u=x/2 → 2u=x:", "  cos²(x/2) = (1+cosx)/2"] },
      { q: "tan²(2x) power-reduced = ?", answer: "(1−cos4x)/(1+cos4x)", d: ["(1+cos4x)/(1−cos4x)", "(1−cos2x)/(1+cos2x)", "sin4x/cos4x"], steps: ["tan²u = (1−cos2u)/(1+cos2u)", "u=2x → 2u=4x:", "  = (1−cos4x)/(1+cos4x)"] },
      { q: "sin²(πx) power-reduced = ?", answer: "(1−cos2πx)/2", d: ["(1+cos2πx)/2", "(1−cosπx)/2", "(1+cosπx)/2"], steps: ["sin²u = (1−cos2u)/2", "u=πx → 2u=2πx:", "  = (1−cos2πx)/2"] },
      { q: "Simplify: 4sin²θcos²θ", answer: "sin²2θ", d: ["cos²2θ", "2sin2θ", "sin4θ"], steps: ["Rewrite as (2sinθcosθ)²:", "  = (2sinθcosθ)²", "Double angle: 2sinθcosθ = sin2θ", "  = sin²2θ"] },
      { q: "Simplify: cos⁴θ − sin⁴θ", answer: "cos2θ", d: ["sin2θ", "−cos2θ", "1"], steps: ["Factor as difference of squares:", "  = (cos²θ+sin²θ)(cos²θ−sin²θ)", "Pythagorean: cos²θ+sin²θ = 1", "  = cos²θ−sin²θ", "Double angle:", "  = cos2θ"] },
      { q: "Simplify: 8sin²θcos²θ", answer: "2sin²2θ", d: ["sin²2θ", "4sin2θ", "2cos²2θ"], steps: ["Factor out 2:", "  = 2·(4sin²θcos²θ)", "  = 2·(2sinθcosθ)²", "Double angle: 2sinθcosθ = sin2θ", "  = 2sin²2θ"] },
      { q: "Simplify: cos²θ − ½", answer: "cos2θ / 2", d: ["sin2θ/2", "−cos2θ/2", "½"], steps: ["Power-reducing: cos²θ = (1+cos2θ)/2", "Substitute:", "  (1+cos2θ)/2 − 1/2", "  = cos2θ/2"] },
      { q: "Simplify: ½ − sin²θ", answer: "cos2θ / 2", d: ["sin2θ/2", "−cos2θ/2", "½"], steps: ["Power-reducing: sin²θ = (1−cos2θ)/2", "Substitute:", "  1/2 − (1−cos2θ)/2", "  = [1 − (1−cos2θ)] / 2", "  = cos2θ/2"] },
      { q: "Simplify: 1 + cos2θ", answer: "2cos²θ", d: ["2sin²θ", "cos²θ", "1+cos²θ"], steps: ["Double angle: cos2θ = 2cos²θ − 1", "Add 1 to both sides:", "  1 + cos2θ = 2cos²θ"] },
      { q: "Simplify: 1 − cos2θ", answer: "2sin²θ", d: ["2cos²θ", "sin²θ", "1−sin²θ"], steps: ["Double angle: cos2θ = 1 − 2sin²θ", "Rearrange:", "  2sin²θ = 1 − cos2θ"] },
      { q: "Simplify: sin3θ/sinθ − cos3θ/cosθ", answer: "2", d: ["1", "3", "0"], steps: ["Use sum formula on sin3θ = sin(2θ+θ):", "Actually, use a cleaner approach:", "  sin3θcosθ − cos3θsinθ all over sinθcosθ", "Numerator = sin(3θ−θ) by difference formula:", "  = sin2θ", "So = sin2θ/(sinθcosθ)", "  = 2sinθcosθ/(sinθcosθ) = 2"] },
      { q: "Simplify: sin²(3θ)+cos²(3θ)", answer: "1", d: ["cos6θ", "sin6θ", "3"], steps: ["Pythagorean Identity applies for any angle:", "  sin²A + cos²A = 1 for all A", "Let A = 3θ:", "  sin²(3θ) + cos²(3θ) = 1"] },
      { q: "Simplify: 2cos²(3θ)−1", answer: "cos6θ", d: ["sin6θ", "cos3θ", "2cos3θ"], steps: ["Double angle: 2cos²A − 1 = cos2A", "Let A = 3θ:", "  2cos²(3θ)−1 = cos(2·3θ)", "  = cos6θ"] },
      { q: "Simplify: 1 − 2sin²(2θ)", answer: "cos4θ", d: ["sin4θ", "cos2θ", "2cos2θ"], steps: ["Double angle: 1 − 2sin²A = cos2A", "Let A = 2θ:", "  1 − 2sin²(2θ) = cos(2·2θ)", "  = cos4θ"] },
      { q: "Simplify: 2sin(3θ)cos(3θ)", answer: "sin6θ", d: ["cos6θ", "sin3θ", "2sin3θ"], steps: ["Double angle: 2sinAcosA = sin2A", "Let A = 3θ:", "  2sin(3θ)cos(3θ) = sin(2·3θ)", "  = sin6θ"] },
      { q: "Simplify: 2sin(5θ)cos(5θ)", answer: "sin10θ", d: ["cos10θ", "sin5θ", "2sin5θ"], steps: ["Double angle: 2sinAcosA = sin2A", "Let A = 5θ:", "  = sin(2·5θ) = sin10θ"] },
      { q: "Simplify: 2cos²(5x)−1", answer: "cos10x", d: ["sin10x", "cos5x", "2cos5x"], steps: ["Double angle: 2cos²A−1 = cos2A", "Let A = 5x:", "  = cos(2·5x) = cos10x"] },
      { q: "Simplify: 2tan(2θ)/(1−tan²(2θ))", answer: "tan4θ", d: ["2tan2θ", "tan²2θ", "cot4θ"], steps: ["Double angle: 2tanA/(1−tan²A) = tan2A", "Let A = 2θ:", "  = tan(2·2θ) = tan4θ"] },
      { q: "Simplify: sin4θ/(2cosθ)", answer: "2sinθcos2θ", d: ["sin2θ", "4sinθcosθ", "2sinθ"], steps: ["Rewrite sin4θ = 2sin2θcos2θ:", "  = 2sin2θcos2θ/(2cosθ)", "Replace sin2θ = 2sinθcosθ:", "  = 2·2sinθcosθ·cos2θ/(2cosθ)", "Cancel 2cosθ:", "  = 2sinθcos2θ"] },
      { q: "cos²(θ/2)+sin²(θ/2) = ?", answer: "1", d: ["cosθ", "sinθ", "½"], steps: ["Pythagorean Identity for any angle:", "  sin²A + cos²A = 1", "Let A = θ/2:", "  cos²(θ/2)+sin²(θ/2) = 1"] },
      { q: "Simplify: sin²θ·cos²θ", answer: "sin²2θ / 4", d: ["sin2θ/2", "cos²2θ/4", "sin4θ/4"], steps: ["We know 2sinθcosθ = sin2θ", "So sinθcosθ = sin2θ/2", "Square both sides:", "  sin²θcos²θ = sin²2θ/4"] },
      { q: "Simplify: (sinθ+cosθ)²−1", answer: "sin2θ", d: ["cos2θ", "2sinθ", "2cosθ"], steps: ["Expand (sinθ+cosθ)²:", "  = sin²θ + 2sinθcosθ + cos²θ", "  = 1 + 2sinθcosθ", "Subtract 1:", "  = 2sinθcosθ", "Double angle:", "  = sin2θ"] },
      { q: "Simplify: (sinθ−cosθ)²+sin2θ", answer: "1", d: ["2", "cos2θ", "sin2θ"], steps: ["Expand (sinθ−cosθ)²:", "  = sin²θ − 2sinθcosθ + cos²θ", "  = 1 − 2sinθcosθ", "  = 1 − sin2θ", "Add sin2θ:", "  = 1 − sin2θ + sin2θ = 1"] },
      { q: "Simplify: cos2θ + 2sin²θ", answer: "1", d: ["cos2θ", "2", "cos²θ"], steps: ["Double angle: cos2θ = 1 − 2sin²θ", "Substitute:", "  (1−2sin²θ) + 2sin²θ", "  = 1"] },
      { q: "Simplify: 2cos²θ − cos2θ", answer: "1", d: ["cos2θ", "2", "cos²θ"], steps: ["Double angle: cos2θ = 2cos²θ − 1", "Substitute:", "  2cos²θ − (2cos²θ−1)", "  = 2cos²θ − 2cos²θ + 1", "  = 1"] },
    ],
  },
  E: {
    title: "Sum, Difference & Product", desc: "Convert between sums and products of trig functions.",
    problems: [
      { q: "sin5x + sin3x = ?", answer: "2sin(4x)cos(x)", d: ["2cos(4x)sin(x)", "2sin(x)cos(4x)", "2cos(x)cos(4x)"], steps: ["sinA+sinB = 2sin[(A+B)/2]cos[(A−B)/2]", "A=5x, B=3x:", "  (A+B)/2=4x, (A−B)/2=x", "  = 2sin(4x)cos(x)"] },
      { q: "cos6x − cos2x = ?", answer: "−2sin(4x)sin(2x)", d: ["2sin(4x)sin(2x)", "−2cos(4x)cos(2x)", "2cos(4x)sin(2x)"], steps: ["cosA−cosB = −2sin[(A+B)/2]sin[(A−B)/2]", "  (A+B)/2=4x, (A−B)/2=2x", "  = −2sin(4x)sin(2x)"] },
      { q: "sin4x · cos2x = ?", answer: "½[sin6x+sin2x]", d: ["½[sin6x−sin2x]", "½[cos2x+cos6x]", "½[cos6x−cos2x]"], steps: ["sinAcosB = ½[sin(A+B)+sin(A−B)]", "  = ½[sin6x + sin2x]"] },
      { q: "cos5x · cos3x = ?", answer: "½[cos2x+cos8x]", d: ["½[cos2x−cos8x]", "½[sin2x+sin8x]", "½[cos8x−cos2x]"], steps: ["cosAcosB = ½[cos(A−B)+cos(A+B)]", "  = ½[cos2x + cos8x]"] },
      { q: "sin(x+π/6)+sin(x−π/6) = ?", answer: "√3 sin(x)", d: ["sin(x)", "2sin(x)", "√3 cos(x)"], steps: ["Sum-to-product:", "  = 2sin(x)cos(π/6)", "  = 2sin(x)·(√3/2)", "  = √3 sin(x)"] },
      { q: "cos(x+π/4)−cos(x−π/4) = ?", answer: "−√2 sin(x)", d: ["√2 sin(x)", "−√2 cos(x)", "√2 cos(x)"], steps: ["Sum-to-product:", "  = −2sin(x)sin(π/4)", "  = −2sin(x)·(√2/2)", "  = −√2 sin(x)"] },
      { q: "sin7x − sin3x = ?", answer: "2cos(5x)sin(2x)", d: ["2sin(5x)cos(2x)", "−2cos(5x)sin(2x)", "2sin(5x)sin(2x)"], steps: ["sinA−sinB = 2cos[(A+B)/2]sin[(A−B)/2]", "  = 2cos(5x)sin(2x)"] },
      { q: "cos3x + cosx = ?", answer: "2cos(2x)cos(x)", d: ["2sin(2x)cos(x)", "2cos(2x)sin(x)", "2sin(2x)sin(x)"], steps: ["cosA+cosB = 2cos[(A+B)/2]cos[(A−B)/2]", "  = 2cos(2x)cos(x)"] },
      { q: "sin3x · sinx = ?", answer: "½[cos2x−cos4x]", d: ["½[cos2x+cos4x]", "½[sin4x−sin2x]", "½[cos4x−cos2x]"], steps: ["sinAsinB = ½[cos(A−B)−cos(A+B)]", "  = ½[cos2x − cos4x]"] },
      { q: "cos2x · sinx = ?", answer: "½[sin3x−sinx]", d: ["½[sin3x+sinx]", "½[cos3x−cosx]", "½[cosx−cos3x]"], steps: ["cosAsinB = ½[sin(A+B)−sin(A−B)]", "  = ½[sin3x − sinx]"] },
      { q: "cos(x+π/3)+cos(x−π/3) = ?", answer: "cos(x)", d: ["2cos(x)", "√3 cos(x)", "sin(x)"], steps: ["Sum-to-product:", "  = 2cos(x)cos(π/3)", "  = 2cos(x)·(1/2)", "  = cos(x)"] },
      { q: "sin9x + sin5x = ?", answer: "2sin(7x)cos(2x)", d: ["2cos(7x)sin(2x)", "2sin(2x)cos(7x)", "2cos(2x)cos(7x)"], steps: ["sinA+sinB = 2sin[(A+B)/2]cos[(A−B)/2]", "A=9x, B=5x:", "  (A+B)/2=7x, (A−B)/2=2x", "  = 2sin(7x)cos(2x)"] },
      { q: "sin8x − sin2x = ?", answer: "2cos(5x)sin(3x)", d: ["2sin(5x)cos(3x)", "−2cos(5x)sin(3x)", "2sin(5x)sin(3x)"], steps: ["sinA−sinB = 2cos[(A+B)/2]sin[(A−B)/2]", "A=8x, B=2x:", "  (A+B)/2=5x, (A−B)/2=3x", "  = 2cos(5x)sin(3x)"] },
      { q: "sinx + sin5x = ?", answer: "2sin(3x)cos(2x)", d: ["2cos(3x)sin(2x)", "2sin(2x)cos(3x)", "2cos(2x)cos(3x)"], steps: ["sinA+sinB = 2sin[(A+B)/2]cos[(A−B)/2]", "A=5x, B=x (order doesn't matter for sum):", "  (A+B)/2=3x, (A−B)/2=2x", "  = 2sin(3x)cos(2x)"] },
      { q: "cos7x + cos3x = ?", answer: "2cos(5x)cos(2x)", d: ["2sin(5x)cos(2x)", "2cos(5x)sin(2x)", "2sin(5x)sin(2x)"], steps: ["cosA+cosB = 2cos[(A+B)/2]cos[(A−B)/2]", "A=7x, B=3x:", "  (A+B)/2=5x, (A−B)/2=2x", "  = 2cos(5x)cos(2x)"] },
      { q: "cos5x − cos9x = ?", answer: "2sin(7x)sin(2x)", d: ["−2sin(7x)sin(2x)", "2cos(7x)cos(2x)", "−2cos(7x)sin(2x)"], steps: ["cosA−cosB = −2sin[(A+B)/2]sin[(A−B)/2]", "A=5x, B=9x:", "  (A+B)/2=7x, (A−B)/2=−2x", "  = −2sin(7x)sin(−2x)", "sin(−2x) = −sin(2x):", "  = −2sin(7x)·(−sin2x)", "  = 2sin(7x)sin(2x)"] },
      { q: "cosx − cos5x = ?", answer: "2sin(3x)sin(2x)", d: ["−2sin(3x)sin(2x)", "2cos(3x)sin(2x)", "2sin(3x)cos(2x)"], steps: ["cosA−cosB = −2sin[(A+B)/2]sin[(A−B)/2]", "A=x, B=5x:", "  (A+B)/2=3x, (A−B)/2=−2x", "  = −2sin(3x)sin(−2x)", "sin(−2x) = −sin(2x):", "  = 2sin(3x)sin(2x)"] },
      { q: "sin6x · cos3x = ?", answer: "½[sin9x+sin3x]", d: ["½[sin9x−sin3x]", "½[cos3x+cos9x]", "½[cos9x−cos3x]"], steps: ["sinAcosB = ½[sin(A+B)+sin(A−B)]", "A=6x, B=3x:", "  = ½[sin9x + sin3x]"] },
      { q: "sin5x · cos3x = ?", answer: "½[sin8x+sin2x]", d: ["½[sin8x−sin2x]", "½[cos2x+cos8x]", "½[cos8x−cos2x]"], steps: ["sinAcosB = ½[sin(A+B)+sin(A−B)]", "A=5x, B=3x:", "  = ½[sin8x + sin2x]"] },
      { q: "cos4x · cosx = ?", answer: "½[cos3x+cos5x]", d: ["½[cos3x−cos5x]", "½[sin3x+sin5x]", "½[cos5x−cos3x]"], steps: ["cosAcosB = ½[cos(A−B)+cos(A+B)]", "A=4x, B=x:", "  = ½[cos3x + cos5x]"] },
      { q: "sin5x · sinx = ?", answer: "½[cos4x−cos6x]", d: ["½[cos4x+cos6x]", "½[sin6x−sin4x]", "½[cos6x−cos4x]"], steps: ["sinAsinB = ½[cos(A−B)−cos(A+B)]", "A=5x, B=x:", "  = ½[cos4x − cos6x]"] },
      { q: "sin4x · sin2x = ?", answer: "½[cos2x−cos6x]", d: ["½[cos2x+cos6x]", "½[sin6x−sin2x]", "½[cos6x−cos2x]"], steps: ["sinAsinB = ½[cos(A−B)−cos(A+B)]", "A=4x, B=2x:", "  = ½[cos2x − cos6x]"] },
      { q: "cos3x · sinx = ?", answer: "½[sin4x−sin2x]", d: ["½[sin4x+sin2x]", "½[cos4x−cos2x]", "½[cos2x−cos4x]"], steps: ["cosAsinB = ½[sin(A+B)−sin(A−B)]", "A=3x, B=x:", "  = ½[sin4x − sin2x]"] },
      { q: "cos6x · sin2x = ?", answer: "½[sin8x−sin4x]", d: ["½[sin8x+sin4x]", "½[cos4x−cos8x]", "½[cos8x−cos4x]"], steps: ["cosAsinB = ½[sin(A+B)−sin(A−B)]", "A=6x, B=2x:", "  = ½[sin8x − sin4x]"] },
      { q: "sin(x+π/4)+sin(x−π/4) = ?", answer: "√2 sin(x)", d: ["sin(x)", "2sin(x)", "√2 cos(x)"], steps: ["Sum-to-product:", "  = 2sin(x)cos(π/4)", "  = 2sin(x)·(√2/2)", "  = √2 sin(x)"] },
      { q: "sin(x+π/3)+sin(x−π/3) = ?", answer: "sin(x)", d: ["√3 sin(x)", "2sin(x)", "√3 cos(x)"], steps: ["Sum-to-product:", "  = 2sin(x)cos(π/3)", "  = 2sin(x)·(1/2)", "  = sin(x)"] },
      { q: "cos(x+π/6)−cos(x−π/6) = ?", answer: "−sin(x)", d: ["sin(x)", "−√3 sin(x)", "cos(x)"], steps: ["Sum-to-product:", "  cosA−cosB = −2sin[(A+B)/2]sin[(A−B)/2]", "  = −2sin(x)sin(π/6)", "  = −2sin(x)·(1/2)", "  = −sin(x)"] },
      { q: "cos(x+π/3)−cos(x−π/3) = ?", answer: "−√3 sin(x)", d: ["√3 sin(x)", "−sin(x)", "√3 cos(x)"], steps: ["cosA−cosB = −2sin[(A+B)/2]sin[(A−B)/2]", "  = −2sin(x)sin(π/3)", "  = −2sin(x)·(√3/2)", "  = −√3 sin(x)"] },
      { q: "cos(x+π/6)+cos(x−π/6) = ?", answer: "√3 cos(x)", d: ["cos(x)", "2cos(x)", "√3 sin(x)"], steps: ["cosA+cosB = 2cos[(A+B)/2]cos[(A−B)/2]", "  = 2cos(x)cos(π/6)", "  = 2cos(x)·(√3/2)", "  = √3 cos(x)"] },
      { q: "sin(x+π/4)−sin(x−π/4) = ?", answer: "√2 cos(x)", d: ["√2 sin(x)", "cos(x)", "−√2 cos(x)"], steps: ["sinA−sinB = 2cos[(A+B)/2]sin[(A−B)/2]", "  = 2cos(x)sin(π/4)", "  = 2cos(x)·(√2/2)", "  = √2 cos(x)"] },
      { q: "sin(x+π/3)−sin(x−π/3) = ?", answer: "√3 cos(x)", d: ["cos(x)", "√3 sin(x)", "−√3 cos(x)"], steps: ["sinA−sinB = 2cos[(A+B)/2]sin[(A−B)/2]", "  = 2cos(x)sin(π/3)", "  = 2cos(x)·(√3/2)", "  = √3 cos(x)"] },
      { q: "sin(x+π/6)−sin(x−π/6) = ?", answer: "cos(x)", d: ["sin(x)", "√3 cos(x)", "−cos(x)"], steps: ["sinA−sinB = 2cos[(A+B)/2]sin[(A−B)/2]", "  = 2cos(x)sin(π/6)", "  = 2cos(x)·(1/2)", "  = cos(x)"] },
      { q: "sinx · cosx = ?", answer: "½sin2x", d: ["sin2x", "½cos2x", "cos2x"], steps: ["Product-to-sum:", "  sinAcosB = ½[sin(A+B)+sin(A−B)]", "A=x, B=x:", "  = ½[sin2x + sin0]", "  = ½[sin2x + 0]", "  = ½sin2x"] },
      { q: "cos²x − sin²x = ?", answer: "cos2x", d: ["sin2x", "−cos2x", "1"], steps: ["This is the double-angle identity:", "  cos2A = cos²A − sin²A", "Direct match with A=x:", "  = cos2x", "(Also a product-to-sum result:", "  cosxcosx − sinxsinx = cos(x+x) = cos2x)"] },
      { q: "2cos(4x)sin(x) = ?", answer: "sin5x−sin3x", d: ["sin5x+sin3x", "cos5x−cos3x", "cos3x−cos5x"], steps: ["Product-to-sum: 2cosAsinB = sin(A+B)−sin(A−B)", "A=4x, B=x:", "  = sin(4x+x) − sin(4x−x)", "  = sin5x − sin3x"] },
      { q: "2cos(3x)cos(x) = ?", answer: "cos2x+cos4x", d: ["cos2x−cos4x", "sin2x+sin4x", "cos4x−cos2x"], steps: ["Product-to-sum: 2cosAcosB = cos(A−B)+cos(A+B)", "A=3x, B=x:", "  = cos(3x−x) + cos(3x+x)", "  = cos2x + cos4x"] },
      { q: "2sin(5x)sin(x) = ?", answer: "cos4x−cos6x", d: ["cos4x+cos6x", "cos6x−cos4x", "sin6x−sin4x"], steps: ["Product-to-sum: 2sinAsinB = cos(A−B)−cos(A+B)", "A=5x, B=x:", "  = cos(5x−x) − cos(5x+x)", "  = cos4x − cos6x"] },
      { q: "2sin(3x)cos(2x) = ?", answer: "sin5x+sinx", d: ["sin5x−sinx", "cos5x+cosx", "cosx−cos5x"], steps: ["Product-to-sum: 2sinAcosB = sin(A+B)+sin(A−B)", "A=3x, B=2x:", "  = sin(3x+2x) + sin(3x−2x)", "  = sin5x + sinx"] },
    ],
  },
  F: {
    title: "Unit Circle Exact Values", desc: "Recall exact sin, cos, and tan values at standard angles.",
    problems: [
      { q: "sin 0°", answer: "0", d: ["1", "½", "−1"], steps: ["On the unit circle, 0° is the point (1, 0).", "sin corresponds to the y-coordinate:", "  sin 0° = 0"] },
      { q: "cos 0°", answer: "1", d: ["0", "½", "−1"], steps: ["0° is the point (1, 0).", "cos corresponds to the x-coordinate:", "  cos 0° = 1"] },
      { q: "sin 30°", answer: "½", d: ["√3/2", "√2/2", "1"], steps: ["30° is in Q I with reference angle 30°.", "The 30-60-90 triangle gives:", "  sin 30° = ½"] },
      { q: "cos 30°", answer: "√3/2", d: ["½", "√2/2", "1"], steps: ["30° is in Q I.", "From the 30-60-90 triangle:", "  cos 30° = √3/2"] },
      { q: "tan 30°", answer: "√3/3", d: ["√3", "1", "½"], steps: ["tan = sin/cos:", "  tan 30° = (½)/(√3/2)", "  = 1/√3 = √3/3"] },
      { q: "sin 45°", answer: "√2/2", d: ["½", "√3/2", "1"], steps: ["45° comes from the 45-45-90 triangle.", "Both legs are equal:", "  sin 45° = √2/2"] },
      { q: "cos 45°", answer: "√2/2", d: ["½", "√3/2", "1"], steps: ["45-45-90 triangle, legs equal:", "  cos 45° = √2/2"] },
      { q: "tan 45°", answer: "1", d: ["√2", "√3/3", "0"], steps: ["sin 45° = cos 45° = √2/2", "tan = sin/cos:", "  = (√2/2)/(√2/2) = 1"] },
      { q: "sin 60°", answer: "√3/2", d: ["½", "√2/2", "1"], steps: ["60° is in Q I, 30-60-90 triangle:", "  sin 60° = √3/2"] },
      { q: "cos 60°", answer: "½", d: ["√3/2", "√2/2", "0"], steps: ["30-60-90 triangle:", "  cos 60° = ½"] },
      { q: "tan 60°", answer: "√3", d: ["√3/3", "1", "√2"], steps: ["tan = sin/cos:", "  tan 60° = (√3/2)/(½)", "  = √3"] },
      { q: "sin 90°", answer: "1", d: ["0", "½", "−1"], steps: ["90° is the point (0, 1) on the unit circle.", "  sin 90° = y-coordinate = 1"] },
      { q: "cos 90°", answer: "0", d: ["1", "½", "−1"], steps: ["90° is the point (0, 1).", "  cos 90° = x-coordinate = 0"] },
      { q: "tan 90°", answer: "undefined", d: ["0", "1", "−1"], steps: ["tan = sin/cos = 1/0", "Division by zero:", "  tan 90° is undefined"] },
      { q: "sin 120°", answer: "√3/2", d: ["−√3/2", "½", "−½"], steps: ["120° is in Q II. Reference angle = 180°−120° = 60°.", "Sine is positive in Q II:", "  sin 120° = sin 60° = √3/2"] },
      { q: "cos 120°", answer: "−½", d: ["½", "−√3/2", "√3/2"], steps: ["120° is in Q II. Reference angle = 60°.", "Cosine is negative in Q II:", "  cos 120° = −cos 60° = −½"] },
      { q: "tan 120°", answer: "−√3", d: ["√3", "−√3/3", "√3/3"], steps: ["tan = sin/cos:", "  = (√3/2)/(−½) = −√3", "Or: Q II, tan is negative, ref angle 60°:", "  tan 120° = −tan 60° = −√3"] },
      { q: "sin 135°", answer: "√2/2", d: ["−√2/2", "½", "−½"], steps: ["135° is in Q II. Reference angle = 180°−135° = 45°.", "Sine is positive in Q II:", "  sin 135° = sin 45° = √2/2"] },
      { q: "cos 135°", answer: "−√2/2", d: ["√2/2", "−½", "½"], steps: ["Q II, reference angle = 45°.", "Cosine is negative in Q II:", "  cos 135° = −cos 45° = −√2/2"] },
      { q: "tan 135°", answer: "−1", d: ["1", "0", "−√3"], steps: ["Q II, reference angle = 45°.", "Tangent is negative in Q II:", "  tan 135° = −tan 45° = −1"] },
      { q: "sin 150°", answer: "½", d: ["−½", "√3/2", "−√3/2"], steps: ["150° is in Q II. Reference angle = 30°.", "Sine positive in Q II:", "  sin 150° = sin 30° = ½"] },
      { q: "cos 150°", answer: "−√3/2", d: ["√3/2", "−½", "½"], steps: ["Q II, reference angle = 30°.", "Cosine negative in Q II:", "  cos 150° = −cos 30° = −√3/2"] },
      { q: "tan 150°", answer: "−√3/3", d: ["√3/3", "−√3", "√3"], steps: ["Q II, reference angle = 30°.", "Tangent negative in Q II:", "  tan 150° = −tan 30° = −√3/3"] },
      { q: "sin 180°", answer: "0", d: ["1", "−1", "½"], steps: ["180° is the point (−1, 0).", "  sin 180° = y-coordinate = 0"] },
      { q: "cos 180°", answer: "−1", d: ["0", "1", "½"], steps: ["180° is the point (−1, 0).", "  cos 180° = x-coordinate = −1"] },
      { q: "tan 180°", answer: "0", d: ["undefined", "1", "−1"], steps: ["tan = sin/cos = 0/(−1)", "  = 0"] },
      { q: "sin 210°", answer: "−½", d: ["½", "−√3/2", "√3/2"], steps: ["210° is in Q III. Reference angle = 210°−180° = 30°.", "Sine is negative in Q III:", "  sin 210° = −sin 30° = −½"] },
      { q: "cos 210°", answer: "−√3/2", d: ["√3/2", "−½", "½"], steps: ["Q III, reference angle = 30°.", "Cosine is negative in Q III:", "  cos 210° = −cos 30° = −√3/2"] },
      { q: "tan 210°", answer: "√3/3", d: ["−√3/3", "√3", "−√3"], steps: ["Q III, reference angle = 30°.", "Tangent is positive in Q III (both sin and cos negative):", "  tan 210° = tan 30° = √3/3"] },
      { q: "sin 225°", answer: "−√2/2", d: ["√2/2", "−½", "½"], steps: ["225° is in Q III. Reference angle = 45°.", "Sine negative in Q III:", "  sin 225° = −sin 45° = −√2/2"] },
      { q: "cos 225°", answer: "−√2/2", d: ["√2/2", "−½", "½"], steps: ["Q III, reference angle = 45°.", "Cosine negative in Q III:", "  cos 225° = −cos 45° = −√2/2"] },
      { q: "tan 225°", answer: "1", d: ["−1", "0", "√2"], steps: ["Q III, reference angle = 45°.", "Tangent positive in Q III:", "  tan 225° = tan 45° = 1"] },
      { q: "sin 240°", answer: "−√3/2", d: ["√3/2", "−½", "½"], steps: ["240° is in Q III. Reference angle = 60°.", "Sine negative in Q III:", "  sin 240° = −sin 60° = −√3/2"] },
      { q: "cos 240°", answer: "−½", d: ["½", "−√3/2", "√3/2"], steps: ["Q III, reference angle = 60°.", "Cosine negative in Q III:", "  cos 240° = −cos 60° = −½"] },
      { q: "tan 240°", answer: "√3", d: ["−√3", "√3/3", "−√3/3"], steps: ["Q III, reference angle = 60°.", "Tangent positive in Q III:", "  tan 240° = tan 60° = √3"] },
      { q: "sin 270°", answer: "−1", d: ["0", "1", "½"], steps: ["270° is the point (0, −1).", "  sin 270° = y-coordinate = −1"] },
      { q: "cos 270°", answer: "0", d: ["−1", "1", "½"], steps: ["270° is the point (0, −1).", "  cos 270° = x-coordinate = 0"] },
      { q: "tan 270°", answer: "undefined", d: ["0", "1", "−1"], steps: ["tan = sin/cos = −1/0", "Division by zero:", "  tan 270° is undefined"] },
      { q: "sin 300°", answer: "−√3/2", d: ["√3/2", "−½", "½"], steps: ["300° is in Q IV. Reference angle = 360°−300° = 60°.", "Sine negative in Q IV:", "  sin 300° = −sin 60° = −√3/2"] },
      { q: "cos 300°", answer: "½", d: ["−½", "√3/2", "−√3/2"], steps: ["Q IV, reference angle = 60°.", "Cosine positive in Q IV:", "  cos 300° = cos 60° = ½"] },
      { q: "tan 300°", answer: "−√3", d: ["√3", "−√3/3", "√3/3"], steps: ["Q IV, reference angle = 60°.", "Tangent negative in Q IV:", "  tan 300° = −tan 60° = −√3"] },
      { q: "sin 315°", answer: "−√2/2", d: ["√2/2", "−½", "½"], steps: ["315° is in Q IV. Reference angle = 45°.", "Sine negative in Q IV:", "  sin 315° = −sin 45° = −√2/2"] },
      { q: "cos 315°", answer: "√2/2", d: ["−√2/2", "½", "−½"], steps: ["Q IV, reference angle = 45°.", "Cosine positive in Q IV:", "  cos 315° = cos 45° = √2/2"] },
      { q: "tan 315°", answer: "−1", d: ["1", "0", "−√3"], steps: ["Q IV, reference angle = 45°.", "Tangent negative in Q IV:", "  tan 315° = −tan 45° = −1"] },
      { q: "sin 330°", answer: "−½", d: ["½", "−√3/2", "√3/2"], steps: ["330° is in Q IV. Reference angle = 30°.", "Sine negative in Q IV:", "  sin 330° = −sin 30° = −½"] },
      { q: "cos 330°", answer: "√3/2", d: ["−√3/2", "½", "−½"], steps: ["Q IV, reference angle = 30°.", "Cosine positive in Q IV:", "  cos 330° = cos 30° = √3/2"] },
      { q: "tan 330°", answer: "−√3/3", d: ["√3/3", "−√3", "√3"], steps: ["Q IV, reference angle = 30°.", "Tangent negative in Q IV:", "  tan 330° = −tan 30° = −√3/3"] },
      { q: "sin 360°", answer: "0", d: ["1", "−1", "½"], steps: ["360° = 0° (full rotation), point (1, 0).", "  sin 360° = 0"] },
      { q: "sin(π/6)", answer: "½", d: ["√3/2", "√2/2", "1"], steps: ["π/6 = 30°.", "  sin(π/6) = sin 30° = ½"] },
      { q: "cos(π/6)", answer: "√3/2", d: ["½", "√2/2", "1"], steps: ["π/6 = 30°.", "  cos(π/6) = cos 30° = √3/2"] },
      { q: "sin(π/4)", answer: "√2/2", d: ["½", "√3/2", "1"], steps: ["π/4 = 45°.", "  sin(π/4) = sin 45° = √2/2"] },
      { q: "cos(π/4)", answer: "√2/2", d: ["½", "√3/2", "1"], steps: ["π/4 = 45°.", "  cos(π/4) = cos 45° = √2/2"] },
      { q: "sin(π/3)", answer: "√3/2", d: ["½", "√2/2", "1"], steps: ["π/3 = 60°.", "  sin(π/3) = sin 60° = √3/2"] },
      { q: "cos(π/3)", answer: "½", d: ["√3/2", "√2/2", "0"], steps: ["π/3 = 60°.", "  cos(π/3) = cos 60° = ½"] },
      { q: "tan(π/3)", answer: "√3", d: ["√3/3", "1", "√2"], steps: ["π/3 = 60°.", "  tan(π/3) = tan 60° = √3"] },
      { q: "tan(π/6)", answer: "√3/3", d: ["√3", "1", "½"], steps: ["π/6 = 30°.", "  tan(π/6) = tan 30° = √3/3"] },
      { q: "sin(π/2)", answer: "1", d: ["0", "½", "−1"], steps: ["π/2 = 90°, point (0, 1).", "  sin(π/2) = 1"] },
      { q: "cos(π/2)", answer: "0", d: ["1", "½", "−1"], steps: ["π/2 = 90°, point (0, 1).", "  cos(π/2) = 0"] },
      { q: "sin(2π/3)", answer: "√3/2", d: ["−√3/2", "½", "−½"], steps: ["2π/3 = 120°, Q II, ref angle = π/3 = 60°.", "Sine positive in Q II:", "  sin(2π/3) = √3/2"] },
      { q: "cos(2π/3)", answer: "−½", d: ["½", "−√3/2", "√3/2"], steps: ["2π/3 = 120°, Q II, ref angle = 60°.", "Cosine negative in Q II:", "  cos(2π/3) = −½"] },
      { q: "sin(3π/4)", answer: "√2/2", d: ["−√2/2", "½", "−½"], steps: ["3π/4 = 135°, Q II, ref angle = π/4 = 45°.", "Sine positive in Q II:", "  sin(3π/4) = √2/2"] },
      { q: "cos(3π/4)", answer: "−√2/2", d: ["√2/2", "−½", "½"], steps: ["3π/4 = 135°, Q II, ref angle = 45°.", "Cosine negative in Q II:", "  cos(3π/4) = −√2/2"] },
      { q: "sin(5π/6)", answer: "½", d: ["−½", "√3/2", "−√3/2"], steps: ["5π/6 = 150°, Q II, ref angle = π/6 = 30°.", "Sine positive in Q II:", "  sin(5π/6) = ½"] },
      { q: "cos(5π/6)", answer: "−√3/2", d: ["√3/2", "−½", "½"], steps: ["5π/6 = 150°, Q II, ref angle = 30°.", "Cosine negative in Q II:", "  cos(5π/6) = −√3/2"] },
      { q: "sin(π)", answer: "0", d: ["1", "−1", "½"], steps: ["π = 180°, point (−1, 0).", "  sin(π) = 0"] },
      { q: "cos(π)", answer: "−1", d: ["0", "1", "½"], steps: ["π = 180°, point (−1, 0).", "  cos(π) = −1"] },
      { q: "sin(7π/6)", answer: "−½", d: ["½", "−√3/2", "√3/2"], steps: ["7π/6 = 210°, Q III, ref angle = π/6 = 30°.", "Sine negative in Q III:", "  sin(7π/6) = −½"] },
      { q: "cos(7π/6)", answer: "−√3/2", d: ["√3/2", "−½", "½"], steps: ["7π/6 = 210°, Q III, ref angle = 30°.", "Cosine negative in Q III:", "  cos(7π/6) = −√3/2"] },
      { q: "sin(5π/4)", answer: "−√2/2", d: ["√2/2", "−½", "½"], steps: ["5π/4 = 225°, Q III, ref angle = π/4 = 45°.", "Sine negative in Q III:", "  sin(5π/4) = −√2/2"] },
      { q: "cos(5π/4)", answer: "−√2/2", d: ["√2/2", "−½", "½"], steps: ["5π/4 = 225°, Q III, ref angle = 45°.", "Cosine negative in Q III:", "  cos(5π/4) = −√2/2"] },
      { q: "sin(4π/3)", answer: "−√3/2", d: ["√3/2", "−½", "½"], steps: ["4π/3 = 240°, Q III, ref angle = π/3 = 60°.", "Sine negative in Q III:", "  sin(4π/3) = −√3/2"] },
      { q: "cos(4π/3)", answer: "−½", d: ["½", "−√3/2", "√3/2"], steps: ["4π/3 = 240°, Q III, ref angle = 60°.", "Cosine negative in Q III:", "  cos(4π/3) = −½"] },
      { q: "sin(3π/2)", answer: "−1", d: ["0", "1", "½"], steps: ["3π/2 = 270°, point (0, −1).", "  sin(3π/2) = −1"] },
      { q: "cos(3π/2)", answer: "0", d: ["−1", "1", "½"], steps: ["3π/2 = 270°, point (0, −1).", "  cos(3π/2) = 0"] },
      { q: "sin(5π/3)", answer: "−√3/2", d: ["√3/2", "−½", "½"], steps: ["5π/3 = 300°, Q IV, ref angle = π/3 = 60°.", "Sine negative in Q IV:", "  sin(5π/3) = −√3/2"] },
      { q: "cos(5π/3)", answer: "½", d: ["−½", "√3/2", "−√3/2"], steps: ["5π/3 = 300°, Q IV, ref angle = 60°.", "Cosine positive in Q IV:", "  cos(5π/3) = ½"] },
      { q: "sin(7π/4)", answer: "−√2/2", d: ["√2/2", "−½", "½"], steps: ["7π/4 = 315°, Q IV, ref angle = π/4 = 45°.", "Sine negative in Q IV:", "  sin(7π/4) = −√2/2"] },
      { q: "cos(7π/4)", answer: "√2/2", d: ["−√2/2", "½", "−½"], steps: ["7π/4 = 315°, Q IV, ref angle = 45°.", "Cosine positive in Q IV:", "  cos(7π/4) = √2/2"] },
      { q: "sin(11π/6)", answer: "−½", d: ["½", "−√3/2", "√3/2"], steps: ["11π/6 = 330°, Q IV, ref angle = π/6 = 30°.", "Sine negative in Q IV:", "  sin(11π/6) = −½"] },
      { q: "cos(11π/6)", answer: "√3/2", d: ["−√3/2", "½", "−½"], steps: ["11π/6 = 330°, Q IV, ref angle = 30°.", "Cosine positive in Q IV:", "  cos(11π/6) = √3/2"] },
      { q: "tan(π/4)", answer: "1", d: ["0", "√3", "√2"], steps: ["π/4 = 45°.", "  tan(π/4) = 1"] },
      { q: "tan(2π/3)", answer: "−√3", d: ["√3", "−√3/3", "√3/3"], steps: ["2π/3 = 120°, Q II, ref angle = 60°.", "Tangent negative in Q II:", "  tan(2π/3) = −√3"] },
      { q: "tan(5π/4)", answer: "1", d: ["−1", "0", "√3"], steps: ["5π/4 = 225°, Q III, ref angle = 45°.", "Tangent positive in Q III:", "  tan(5π/4) = tan 45° = 1"] },
      { q: "tan(7π/6)", answer: "√3/3", d: ["−√3/3", "√3", "−√3"], steps: ["7π/6 = 210°, Q III, ref angle = 30°.", "Tangent positive in Q III:", "  tan(7π/6) = tan 30° = √3/3"] },
      { q: "tan(5π/3)", answer: "−√3", d: ["√3", "−√3/3", "1"], steps: ["5π/3 = 300°, Q IV, ref angle = 60°.", "Tangent negative in Q IV:", "  tan(5π/3) = −tan 60° = −√3"] },
      { q: "tan(11π/6)", answer: "−√3/3", d: ["√3/3", "−√3", "√3"], steps: ["11π/6 = 330°, Q IV, ref angle = 30°.", "Tangent negative in Q IV:", "  tan(11π/6) = −tan 30° = −√3/3"] },
    ],
  },
};

function gen(key) {
  const p = pick(SECTIONS[key].problems);
  return { ...p, distractors: p.d, options: shuffle([p.answer, ...p.d]), section: key };
}

function Toggle({ isDark, onToggle, t }) {
  return (
    <button onClick={onToggle} aria-label="Toggle theme" style={{
      position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
      background: t.toggleBg, border: "none", borderRadius: 20,
      width: 54, height: 28, cursor: "pointer", padding: 0, transition: "background 0.3s",
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", background: t.toggleKnob,
        transform: isDark ? "translateX(28px)" : "translateX(4px)",
        transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
      }}>
        {t.toggleIcon}
      </div>
    </button>
  );
}

function Tab({ k, active, onClick, stats, t }) {
  const sc = SC[k]; const s = SECTIONS[k];
  const cr = stats?.correct||0, tot = stats?.total||0;
  return (
    <button onClick={() => onClick(k)} style={{
      padding: "10px 14px", border: `2px solid ${active ? sc.color : t.tabBorder}`, borderRadius: 10,
      background: active ? (t.tabActiveBg==="dark" ? sc.dBg : sc.lBg) : t.tabBg,
      cursor: "pointer", transition: "all 0.25s", textAlign: "left", flex: "1 1 0",
      minWidth: 140, position: "relative", boxShadow: active ? `0 0 16px ${sc.glow}` : "none",
    }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: sc.color, marginBottom: 2 }}>Section {k}</div>
      <div style={{ fontSize: 11, color: t.tabText, lineHeight: 1.3 }}>{s.title}</div>
      {tot > 0 && (
        <div style={{ position: "absolute", top: 6, right: 8, background: cr===tot ? "#4CAF50" : sc.color,
          color: "#000", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}>
          {cr}/{tot}
        </div>
      )}
    </button>
  );
}

function Steps({ steps, ok, t }) {
  return (
    <div style={{ marginTop: 16, padding: "16px 20px",
      background: ok ? t.expOkBg : t.expNoBg, borderRadius: 12,
      border: `1px solid ${ok ? t.expOkBdr : t.expNoBdr}`,
    }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: ok ? t.expOkTitle : t.expNoTitle,
        marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>{ok ? "✓" : "✗"}</span>
        {ok ? "Correct!" : "Not quite — here's how to solve it:"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {steps.map((s, i) => {
          const m = s.startsWith("  ");
          return (
            <div key={i} style={{
              fontFamily: m ? "'JetBrains Mono', monospace" : "inherit", fontSize: 13,
              color: m ? t.mathTxt : t.stepTxt, padding: m ? "5px 14px" : "3px 0",
              background: m ? t.mathBg : "transparent", borderRadius: m ? 6 : 0,
              borderLeft: m ? `3px solid ${t.mathBdr}` : "none", marginLeft: m ? 8 : 0, lineHeight: 1.7,
            }}>{s}</div>
          );
        })}
      </div>
    </div>
  );
}

function Card({ p, onAns, done, sel, t }) {
  const sc = SC[p.section]; const s = SECTIONS[p.section];
  const ok = done && p.options[sel] === p.answer;
  return (
    <div style={{ background: t.cardBg, borderRadius: 16, border: `1.5px solid ${sc.color}${t.cardBorderAlpha}`,
      boxShadow: `0 4px 24px ${sc.glow}`, overflow: "hidden", maxWidth: 660, width: "100%", transition: "all 0.3s" }}>
      <div style={{ background: t.tabActiveBg==="dark" ? sc.dBg : sc.lBg, borderBottom: `1px solid ${sc.color}33`, padding: "14px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: sc.color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
          Section {p.section} — {s.title}
        </div>
        <div style={{ fontSize: 12, color: t.scoreMuted }}>{s.desc}</div>
      </div>
      <div style={{ padding: "24px 24px 8px" }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600,
          color: t.qText, lineHeight: 1.4, marginBottom: 20, textAlign: "center", padding: "16px",
          background: t.qBg, borderRadius: 12, border: `1px solid ${t.qBorder}`, transition: "all 0.3s" }}>
          {p.q}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {p.options.map((opt, i) => {
            const isThis = done && sel===i;
            const isAns = done && opt===p.answer;
            let bg=t.optBg, bd=t.optBorder, cl=t.optText, gw="none";
            if (done) {
              if (isAns) { bg=t.okBg; bd=t.okBdr; cl=t.okTxt; gw=`0 0 10px ${t.okBdr}33`; }
              else if (isThis) { bg=t.noBg; bd=t.noBdr; cl=t.noTxt; gw=`0 0 10px ${t.noBdr}33`; }
              else { bg=t.offBg; bd=t.offBdr; cl=t.offTxt; }
            }
            return (
              <button key={i} onClick={() => !done && onAns(i)} disabled={done}
                style={{ padding: "14px 18px", border: `1.5px solid ${bd}`, borderRadius: 10, background: bg,
                  cursor: done ? "default" : "pointer", textAlign: "left",
                  fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: cl,
                  fontWeight: isAns&&done ? 700 : 400, transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 12, boxShadow: gw }}
                onMouseEnter={(e) => { if(!done){ e.currentTarget.style.borderColor=sc.color; e.currentTarget.style.background=t.optHover; }}}
                onMouseLeave={(e) => { if(!done){ e.currentTarget.style.borderColor=t.optBorder; e.currentTarget.style.background=t.optBg; }}}>
                <span style={{ width: 30, height: 30, borderRadius: "50%", border: `2px solid ${done?bd:t.letterBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700,
                  flexShrink: 0, fontFamily: "monospace",
                  background: done&&isAns ? "#4CAF50" : done&&isThis ? "#E53935" : "transparent",
                  color: (done&&(isAns||isThis)) ? "#fff" : t.letterText }}>
                  {done&&isAns ? "✓" : done&&isThis&&!isAns ? "✗" : String.fromCharCode(65+i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        {done && <Steps steps={p.steps} ok={ok} t={t} />}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

export default function TrigQuiz() {
  const [isDark, setIsDark] = useState(false);
  const t = isDark ? THEMES.dark : THEMES.light;
  const [sec, setSec] = useState("A");
  const [prob, setProb] = useState(() => gen("A"));
  const [done, setDone] = useState(false);
  const [sel, setSel] = useState(null);
  const [stats, setStats] = useState({A:{correct:0,total:0},B:{correct:0,total:0},C:{correct:0,total:0},D:{correct:0,total:0},E:{correct:0,total:0},F:{correct:0,total:0}});

  const tc = Object.values(stats).reduce((s,v)=>s+v.correct,0);
  const ta = Object.values(stats).reduce((s,v)=>s+v.total,0);
  const sc = SC[sec];

  return (
    <div style={{ minHeight: "100vh", background: t.page, color: t.scoreText, transition: "background 0.4s, color 0.3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Playfair+Display:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: t.header, padding: "22px 24px", textAlign: "center", borderBottom: `1px solid ${t.headerBorder}`, position: "relative", transition: "all 0.3s" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #FF9800, #EC407A, #42A5F5, #26C6DA, #66BB6A, #AB47BC)" }} />
        <h1 style={{ margin: 0, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: t.headerText }}>Trig Identities Practice</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: t.headerSub, fontFamily: "'Space Grotesk', sans-serif" }}>Precalculus · Random Problems · Infinite Practice</p>
        <Toggle isDark={isDark} onToggle={() => setIsDark(!isDark)} t={t} />
      </div>

      {/* Score */}
      <div style={{ display: "flex", justifyContent: "center", gap: 28, padding: "14px 20px", background: t.scoreBar, borderBottom: `1px solid ${t.scoreBarBorder}`, flexWrap: "wrap", alignItems: "center", transition: "all 0.3s" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: t.scoreText, fontFamily: "'JetBrains Mono', monospace" }}>{tc}/{ta}</div>
          <div style={{ fontSize: 10, color: t.scoreMuted, textTransform: "uppercase", letterSpacing: 1.5 }}>Score</div>
        </div>
        <div style={{ width: 1, height: 36, background: t.divider }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: ta>0 ? (tc/ta>=0.7 ? "#4CAF50" : "#FF9800") : t.scoreMuted, fontFamily: "'JetBrains Mono', monospace" }}>
            {ta>0 ? Math.round((tc/ta)*100) : 0}%
          </div>
          <div style={{ fontSize: 10, color: t.scoreMuted, textTransform: "uppercase", letterSpacing: 1.5 }}>Accuracy</div>
        </div>
        <div style={{ width: 1, height: 36, background: t.divider }} />
        <button onClick={() => setStats({A:{correct:0,total:0},B:{correct:0,total:0},C:{correct:0,total:0},D:{correct:0,total:0},E:{correct:0,total:0}})}
          style={{ padding: "8px 18px", border: `1px solid ${t.resetBorder}`, borderRadius: 8, background: t.resetBg, cursor: "pointer", fontSize: 12, color: t.resetText, fontFamily: "'Space Grotesk', sans-serif" }}>
          Reset Stats
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, padding: "16px 20px", overflowX: "auto", justifyContent: "center", flexWrap: "wrap" }}>
        {Object.keys(SECTIONS).map(k => <Tab key={k} k={k} active={sec===k} onClick={k => { setSec(k); setProb(gen(k)); setDone(false); setSel(null); }} stats={stats[k]} t={t} />)}
      </div>

      {/* Quiz */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 20px 60px" }}>
        <Card p={prob} onAns={i => {
          setSel(i); setDone(true);
          setStats(prev => ({...prev,[prob.section]:{correct:prev[prob.section].correct+(prob.options[i]===prob.answer?1:0),total:prev[prob.section].total+1}}));
        }} done={done} sel={sel} t={t} />
        {done && (
          <button onClick={() => { setProb(gen(sec)); setDone(false); setSel(null); }}
            style={{ marginTop: 20, padding: "14px 44px", border: "none", borderRadius: 10,
              background: sc.color, color: t.nextTxt, fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: `0 4px 20px ${sc.glow}`, transition: "all 0.2s", letterSpacing: 0.5 }}
            onMouseEnter={e => e.target.style.transform="translateY(-2px)"}
            onMouseLeave={e => e.target.style.transform="translateY(0)"}>
            Next Problem →
          </button>
        )}
      </div>
    </div>
  );
}
