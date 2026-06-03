/**
 * Thirukkural viewer — needs on page:
 *   #athigaramList, #kuralDisplay
 * Optional: window.ATHIGARAM_RANGE = { start, end }
 */

let data = [];
let activeAthigaram = null;

const range = (() => {
  const r = window.ATHIGARAM_RANGE;
  if (!r || typeof r.start !== "number" || typeof r.end !== "number") return null;
  return { start: Math.max(1, r.start), end: Math.min(133, r.end) };
})();

const listDiv = () => document.getElementById("athigaramList");
const displayDiv = () => document.getElementById("kuralDisplay");

function setListMessage(text) {
  const el = listDiv();
  if (el) el.innerHTML = `<p class="loading">${text}</p>`;
}

fetch("kural.json")
  .then((res) => {
    if (!res.ok) throw new Error("kural.json not found");
    return res.json();
  })
  .then((result) => {
    data = Array.isArray(result) ? result : [];
    if (data.length === 0) {
      setListMessage("குறள் தரவு கிடைக்கவில்லை.");
      return;
    }
    createButtons();
  })
  .catch(() => {
    setListMessage(
      "குறள்கள் ஏற்ற முடியவில்லை. Local server-ல் திறக்கவும் (file://-ல் fetch block ஆகலாம்)."
    );
  });

function createButtons() {
  const el = listDiv();
  if (!el) return;

  el.innerHTML = "";

  const filtered = range
    ? data.filter((item) => item.athigaram >= range.start && item.athigaram <= range.end)
    : data;

  filtered.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = item.athigaram + ". " + item.name;
    btn.className = "athigaram-btn";
    applyAthigaramGradient(btn, item.athigaram);
    btn.style.animationDelay = `${index * 0.03}s`;
    btn.onclick = () => showKurals(item.athigaram, btn);
    el.appendChild(btn);
  });
}

function applyAthigaramGradient(btn, num) {
  const hue = ((num - 1) * 360) / 133;
  const hue2 = (hue + 42) % 360;
  const hue3 = (hue + 18) % 360;
  btn.style.background = `linear-gradient(135deg, hsl(${hue}, 68%, 38%) 0%, hsl(${hue2}, 72%, 48%) 50%, hsl(${hue3}, 65%, 42%) 100%)`;
  btn.style.backgroundSize = "200% 200%";
  btn.dataset.hue = String(hue);
}

function showKurals(num, clickedBtn) {
  const display = displayDiv();
  if (!display) return;

  const selected = data.find((a) => a.athigaram === num);
  if (!selected || !Array.isArray(selected.kurals)) return;

  activeAthigaram = num;

  document.querySelectorAll("#athigaramList button").forEach((b) => {
    b.classList.toggle("active", b === clickedBtn);
  });

  display.innerHTML = "";
  display.classList.add("visible");

  const h2 = document.createElement("h2");
  h2.textContent = selected.athigaram + ". " + selected.name;
  display.appendChild(h2);

  selected.kurals.forEach((kural, i) => {
    const p = document.createElement("p");
    const globalNum = (num - 1) * 10 + (i + 1);
    p.textContent = globalNum + ". " + kural;
    display.appendChild(p);
  });

  display.scrollIntoView({ behavior: "smooth", block: "start" });
}
