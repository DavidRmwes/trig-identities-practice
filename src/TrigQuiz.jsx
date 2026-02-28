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
  const [stats, setStats] = useState({A:{correct:0,total:0},B:{correct:0,total:0},C:{correct:0,total:0},D:{correct:0,total:0},E:{correct:0,total:0}});

  const tc = Object.values(stats).reduce((s,v)=>s+v.correct,0);
  const ta = Object.values(stats).reduce((s,v)=>s+v.total,0);
  const sc = SC[sec];

  return (
    <div style={{ minHeight: "100vh", background: t.page, color: t.scoreText, transition: "background 0.4s, color 0.3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Playfair+Display:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: t.header, padding: "22px 24px", textAlign: "center", borderBottom: `1px solid ${t.headerBorder}`, position: "relative", transition: "all 0.3s" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #FF9800, #EC407A, #42A5F5, #26C6DA, #66BB6A)" }} />
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
