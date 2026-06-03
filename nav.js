(function () {
  const PAGE_FLOW = [
    { file: "login.html", label: "உள்நுழைவு" },
    { file: "index.html", label: "முகப்பு" },
    { file: "teach.html", label: "ஆசிரியர் குறிப்பு" },
    { file: "about.html", label: "முப்பால் பகுப்பு" },
    { file: "aram.html", label: "அறத்துப்பால்" },
    { file: "porul.html", label: "பொருட்பால்" },
    { file: "inbam.html", label: "இன்பத்துப்பால்" },
  ];

  const ARROW_LEFT =
    '<span class="nav-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></span>';
  const ARROW_RIGHT =
    '<span class="nav-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>';

  function currentFile() {
    const path = location.pathname.split("/").pop() || "index.html";
    return path.split("?")[0].toLowerCase();
  }

  function buildNav() {
    const file = currentFile();
    const idx = PAGE_FLOW.findIndex((p) => p.file.toLowerCase() === file);
    if (idx === -1) return;

    const prev = idx > 0 ? PAGE_FLOW[idx - 1] : null;
    const next = idx < PAGE_FLOW.length - 1 ? PAGE_FLOW[idx + 1] : null;

    const nav = document.createElement("nav");
    nav.className = "page-nav";
    nav.setAttribute("aria-label", "பக்க வழிச்சல்");

    if (prev) {
      const a = document.createElement("a");
      a.href = prev.file;
      a.className = "nav-prev";
      a.innerHTML = ARROW_LEFT;
      a.title = prev.label;
      a.setAttribute("aria-label", prev.label);
      nav.appendChild(a);
    } else {
      const span = document.createElement("span");
      span.className = "nav-disabled nav-prev";
      span.innerHTML = ARROW_LEFT;
      nav.appendChild(span);
    }

    const center = document.createElement("div");
    center.className = "nav-center";
    const dots = document.createElement("div");
    dots.className = "nav-dots";
    dots.setAttribute("aria-hidden", "true");
    PAGE_FLOW.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "nav-dot" + (i === idx ? " active" : "");
      dots.appendChild(dot);
    });
    center.appendChild(dots);
    nav.appendChild(center);

    if (next) {
      const a = document.createElement("a");
      a.href = next.file;
      a.className = "nav-next";
      a.innerHTML = ARROW_RIGHT;
      a.title = next.label;
      a.setAttribute("aria-label", next.label);
      nav.appendChild(a);
    } else {
      const span = document.createElement("span");
      span.className = "nav-disabled nav-next";
      span.innerHTML = ARROW_RIGHT;
      nav.appendChild(span);
    }

    document.body.classList.add("has-page-nav");
    document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildNav);
  } else {
    buildNav();
  }
})();
