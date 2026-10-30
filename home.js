const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const LETTERS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

// Header glass once the page scrolls.
const header = document.querySelector(".top");
addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 24), { passive: true });

// Big headline enters character by character.
for (const el of document.querySelectorAll(".split")) {
  el.innerHTML = [...el.textContent].map((c, i) => `<span class="c" style="--i:${i}">${c}</span>`).join("");
}
const seen = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); seen.unobserve(e.target); }
}, { threshold: .18 });
document.querySelectorAll(".reveal, .split").forEach(el => seen.observe(el));

// Stars for the night sky.
const stars = document.getElementById("stars");
for (let i = 0; i < 70; i++) {
  const s = document.createElement("i");
  if (i % 12 === 0) s.className = "big";
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--t:${2 + Math.random() * 4}s;--dl:${-Math.random() * 5}s`;
  stars.append(s);
}

// ---------- Mascot: eyes follow the pointer, blinks, hops on a fixed key ----------
const mascots = [...document.querySelectorAll(".mascot")];
addEventListener("pointermove", e => {
  for (const m of mascots) {
    const r = m.getBoundingClientRect(), dx = e.clientX - (r.left + r.width * .6), dy = e.clientY - (r.top + r.height * .65);
    const len = Math.hypot(dx, dy) || 1, k = Math.min(1, len / 300) * 2.4;
    m.querySelector(".eyes").style.transform = `translate(${dx / len * k}px, ${dy / len * k}px)`;
  }
}, { passive: true });
if (!reduced) setInterval(() => {
  const m = mascots[Math.floor(Math.random() * mascots.length)];
  m.classList.add("blink"); setTimeout(() => m.classList.remove("blink"), 140);
}, 2600);
function hop() { const m = mascots[0]; m.classList.remove("hop"); void m.getBoundingClientRect(); m.classList.add("hop"); }

// ---------- Demo keyboard ----------
const kb = document.getElementById("kb");
const rows = document.getElementById("rows");
const keys = {};
const rowSpec = [
  [...LETTERS[0]], [...LETTERS[1]],
  [["⇧", "wide"], ...LETTERS[2], ["⌫", "wide"]],
  [["123", "wide"], ["☺", "wide"], ["", "space"], ["⏎", "wide ret"]],
];
for (const spec of rowSpec) {
  const row = document.createElement("div");
  row.className = "row";
  for (const k of spec) {
    const [label, cls] = Array.isArray(k) ? k : [k, ""];
    const el = document.createElement("span");
    el.className = "key " + cls;
    if (label === "EMOJI") el.innerHTML = `<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0"/><circle cx="9" cy="10" r=".6"/><circle cx="15" cy="10" r=".6"/></svg>`;
    else el.textContent = label;
    row.append(el);
    if (!cls) keys[label] = el;
  }
  rows.append(row);
}
// iOS 26 keeps the globe and dictation below the keys.
rows.insertAdjacentHTML("afterend", `<div class="sys"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/></svg></div>`);

// Each phrase: Xiaohe codes as intended, the keys actually hit, candidates as the code grows.
const phrases = [
  { text: "今天天气不错，", want: "jbtmtmqibuco", hit: "jbtntmqibyco",
    cands: [["今", "进", "金"], ["今天", "金田", "进"], ["今天天", "今天", "金田"], ["今天天气", "今天"], ["今天天气不", "今天天气"], ["今天天气不错", "今天天气"]] },
  { text: "我们周日晚上见。", want: "womfvzriwjuhjm", hit: "womgvzriwkuhjm",
    cands: [["我", "窝", "握"], ["我们", "我"], ["我们周", "我们"], ["我们周日", "我们"], ["我们周日晚", "我们周日"], ["我们周日晚上", "我们周日"], ["我们周日晚上见", "我们周日晚上"]] },
];
const comp = document.getElementById("comp");
const cands = document.getElementById("cands");
const sheet = document.getElementById("sheet");

function center(el) {
  const k = el.getBoundingClientRect(), b = kb.getBoundingClientRect();
  return { x: k.left - b.left + k.width / 2, y: k.top - b.top + k.height / 2, w: k.width, h: k.height };
}
function tap(want, hit) {
  const target = keys[hit], c = center(target), miss = want !== hit;
  let x = c.x + (Math.random() - .5) * c.w * .45, y = c.y + (Math.random() - .5) * c.h * .4;
  if (miss) { const w = center(keys[want]); x = c.x + (w.x - c.x) * .38; y = c.y + (w.y - c.y) * .38; }
  const dot = document.createElement("span");
  dot.className = "dot" + (miss ? "" : " ok");
  dot.style.left = x + "px"; dot.style.top = y + "px";
  kb.append(dot);
  setTimeout(() => dot.remove(), 950);
  target.classList.add(miss ? "miss" : "hit");
  if (miss) setTimeout(hop, 260);
  setTimeout(() => target.classList.remove("hit", "miss"), 220);
}
function showComposing(p, n) {
  let html = "";
  for (let i = 0; i < n; i++) {
    if (i && i % 2 === 0) html += " ";
    html += p.want[i] === p.hit[i] ? p.hit[i] : `<span class="fix">${p.hit[i]}</span>`;
  }
  comp.innerHTML = html;
}
function showCands(list) {
  cands.innerHTML = list.map((c, i) => `<span class="${i ? "" : "top1"}">${c}</span>`).join("") + `<b class="more">⌄</b>`;
}
function commit(text) {
  for (const ch of text) {
    const s = document.createElement("span");
    s.className = "ch"; s.textContent = ch;
    sheet.append(s);
  }
}
async function play() {
  if (reduced) { commit(phrases.map(p => p.text).join("")); return; }
  for (;;) {
    for (const p of phrases) {
      for (let i = 0; i < p.hit.length; i++) {
        tap(p.want[i], p.hit[i]);
        showComposing(p, i + 1);
        if (i % 2) showCands(p.cands[(i - 1) / 2]);
        await sleep(p.want[i] === p.hit[i] ? 230 + Math.random() * 120 : 420);
      }
      await sleep(700);
      cands.firstElementChild.classList.add("pressed");
      await sleep(260);
      let i = 0;
      for (const ch of p.text) { await sleep(i++ ? 55 : 0); commit(ch); }
      comp.innerHTML = ""; cands.innerHTML = "";
      await sleep(1300);
    }
    await sleep(1600);
    sheet.innerHTML = "";
  }
}
const demoSeen = new IntersectionObserver(e => { if (e[0].isIntersecting) { demoSeen.disconnect(); setTimeout(play, 900); } });
demoSeen.observe(kb);

// ---------- Taps anywhere on the page ----------
const taps = document.getElementById("taps"), tctx = taps.getContext("2d");
let ripples = [];
function sizeTaps() { taps.width = innerWidth * devicePixelRatio; taps.height = innerHeight * devicePixelRatio; }
sizeTaps(); addEventListener("resize", sizeTaps);
addEventListener("pointerdown", e => { if (!reduced) { ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (ripples.length === 1) requestAnimationFrame(drawTaps); } });
function drawTaps(now) {
  const d = devicePixelRatio;
  tctx.clearRect(0, 0, taps.width, taps.height);
  ripples = ripples.filter(r => now - r.t < 700);
  for (const r of ripples) {
    const p = (now - r.t) / 700, ease = 1 - (1 - p) ** 3;
    tctx.beginPath(); tctx.arc(r.x * d, r.y * d, (8 + ease * 46) * d, 0, Math.PI * 2);
    tctx.strokeStyle = `rgba(247,191,47,${.7 * (1 - p)})`; tctx.lineWidth = 2 * d; tctx.stroke();
    tctx.beginPath(); tctx.arc(r.x * d, r.y * d, 5 * d * (1 - p), 0, Math.PI * 2);
    tctx.fillStyle = `rgba(255,122,89,${1 - p})`; tctx.fill();
  }
  if (ripples.length) requestAnimationFrame(drawTaps);
}

// ---------- Probability cloud ----------
const cloud = document.getElementById("cloud"), ctx = cloud.getContext("2d");
let W, H, K = [], points = [], pointer = null, userPointer = false, born = 0, cloudOn = false;
function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function layoutCloud() {
  const d = devicePixelRatio, r = cloud.getBoundingClientRect();
  W = cloud.width = r.width * d; H = cloud.height = r.height * d;
  const pad = W * .04, kw = (W - pad * 2) / 10, kh = (H - pad * 2) / 3;
  K = []; points = [];
  LETTERS.forEach((row, ri) => [...row].forEach((ch, ci) => {
    const x = pad + kw * (ci + (ri === 1 ? .5 : ri === 2 ? 1.5 : 0)) + kw / 2, y = pad + kh * ri + kh / 2;
    K.push({ ch, x, y, kw, kh });
  }));
  for (const k of K) for (let i = 0; i < 70; i++) {
    points.push({ k, x: k.x + gauss() * k.kw * .26, y: k.y + gauss() * k.kh * .24, delay: Math.random() * 1400 });
  }
}
function likelihood(px, py) {
  const s = K.map(k => Math.exp(-(((px - k.x) / (k.kw * .3)) ** 2 + ((py - k.y) / (k.kh * .28)) ** 2) / 2));
  const sum = s.reduce((a, b) => a + b, 0) || 1;
  return K.map((k, i) => ({ k, p: s[i] / sum })).sort((a, b) => b.p - a.p);
}
const dark = matchMedia("(prefers-color-scheme: dark)");
function drawCloud(now) {
  const ink = dark.matches ? "243,238,227" : "43,33,20", idle = dark.matches ? "120,150,220" : "190,140,60";
  const d = devicePixelRatio, age = now - born;
  ctx.clearRect(0, 0, W, H);
  // Nobody hovering: a finger wanders over the keys on its own.
  if (!userPointer && !reduced) {
    const t = now / 1000;
    pointer = { x: W * (.5 + .38 * Math.sin(t * .53) + .04 * Math.sin(t * 2.1)), y: H * (.5 + .26 * Math.sin(t * .91 + 1)) };
  }
  const ranked = pointer ? likelihood(pointer.x, pointer.y) : null;
  const weight = new Map(ranked ? ranked.map(r => [r.k, r.p]) : []);
  for (const k of K) {
    const w = weight.get(k) || 0;
    ctx.strokeStyle = `rgba(${ink},${.12 + w * .6})`; ctx.lineWidth = d;
    ctx.beginPath(); ctx.roundRect(k.x - k.kw * .44, k.y - k.kh * .4, k.kw * .88, k.kh * .8, 8 * d); ctx.stroke();
    ctx.fillStyle = `rgba(${ink},${.4 + w * .6})`;
    ctx.font = `${600} ${k.kh * .26}px "JetBrains Mono", monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(k.ch, k.x, k.y);
  }
  for (const p of points) {
    const t = Math.min(1, Math.max(0, (age - p.delay) / 500));
    if (!t) continue;
    const w = weight.get(p.k) || 0;
    ctx.fillStyle = w > .02 ? `rgba(${dark.matches ? "247,191,47" : "232,140,0"},${.3 + w * .7})` : `rgba(${idle},${.35 * t})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, (1.3 + w * 2.2) * d * t, 0, Math.PI * 2); ctx.fill();
  }
  if (ranked) {
    const top3 = ranked.slice(0, 3).filter(r => r.p > .01);
    const label = top3.map(r => `${r.k.ch} ${Math.round(r.p * 100)}%`).join("   ");
    ctx.font = `600 ${15 * d}px "JetBrains Mono", monospace`; ctx.textAlign = "left";
    const tw = ctx.measureText(label).width, bx = Math.min(pointer.x + 18 * d, W - tw - 30 * d), by = Math.max(pointer.y - 44 * d, 10 * d);
    ctx.fillStyle = "rgba(11,15,26,.88)"; ctx.beginPath(); ctx.roundRect(bx, by, tw + 24 * d, 32 * d, 10 * d); ctx.fill();
    ctx.fillStyle = "#f7bf2f"; ctx.fillText(label, bx + 12 * d, by + 16 * d);
    ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 7 * d, 0, Math.PI * 2); ctx.fillStyle = "#ff7a59"; ctx.fill();
    ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 16 * d, 0, Math.PI * 2); ctx.strokeStyle = "rgba(255,122,89,.5)"; ctx.lineWidth = 2 * d; ctx.stroke();
  }
  if (cloudOn) requestAnimationFrame(drawCloud);
}
layoutCloud();
addEventListener("resize", layoutCloud);
cloud.addEventListener("pointermove", e => { const r = cloud.getBoundingClientRect(), d = devicePixelRatio; userPointer = true; pointer = { x: (e.clientX - r.left) * d, y: (e.clientY - r.top) * d }; });
cloud.addEventListener("pointerdown", e => cloud.dispatchEvent(new PointerEvent("pointermove", e)));
cloud.addEventListener("pointerleave", () => { userPointer = false; pointer = null; });
new IntersectionObserver(e => {
  cloudOn = e[0].isIntersecting;
  if (cloudOn) { if (!born) born = reduced ? -1e6 : performance.now(); requestAnimationFrame(drawCloud); }
}, { threshold: .2 }).observe(cloud);

// ---------- Feature keycaps tilt toward the pointer ----------
for (const el of document.querySelectorAll(".feature-cap")) {
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - .5) * 14}deg`);
    el.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - .5) * 14}deg`);
  });
  el.addEventListener("pointerleave", () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
}
