const newsGrid = document.getElementById("newsGrid");
const newsTemplate = document.getElementById("newsCardTemplate");
const languageButtons = document.querySelectorAll("[data-language]");
const params = new URLSearchParams(window.location.search);
let currentLanguage = params.get("lang") || "en";

function toLocalAssetUrl(assetUrl) {
  if (!assetUrl || !assetUrl.startsWith("http")) {
    return assetUrl;
  }

  try {
    const parsedUrl = new URL(assetUrl);
    const marker = "/artifacts/";
    const markerIndex = parsedUrl.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return assetUrl;
    }

    return `.${parsedUrl.pathname.slice(markerIndex)}${parsedUrl.search}`;
  } catch {
    return assetUrl;
  }
}

function assignImageWithFallback(image, primaryUrl) {
  const fallbackUrl = toLocalAssetUrl(primaryUrl);
  image.src = primaryUrl;

  if (!fallbackUrl || fallbackUrl === primaryUrl) {
    return;
  }

  image.addEventListener(
    "error",
    () => {
      if (image.dataset.fallbackApplied === "true") {
        return;
      }

      image.dataset.fallbackApplied = "true";
      image.src = fallbackUrl;
    },
    { once: true }
  );
}

function renderNewsEvents() {
  newsGrid.innerHTML = "";

  newsItems.forEach((item, index) => {
    const card = newsTemplate.content.firstElementChild.cloneNode(true);
    const media = card.querySelector(".news-card-media");
    const image = card.querySelector(".news-card-image");
    const type = card.querySelector(".news-card-type");
    const date = card.querySelector(".news-card-date");
    const title = card.querySelector(".news-card-title");
    const body = card.querySelector(".news-card-body");

    if (item.image) {
      media.hidden = false;
      assignImageWithFallback(image, item.image);
      image.alt = item.alt?.[currentLanguage] || item.title[currentLanguage];
    }

    type.textContent = item.type[currentLanguage];
    date.textContent = item.date[currentLanguage];
    title.textContent = item.title[currentLanguage];
    body.textContent = item.body[currentLanguage];
    card.style.animationDelay = `${index * 80}ms`;

    newsGrid.appendChild(card);
  });
}

function applyLanguage(language) {
  currentLanguage = language;
  const ui = translations[language];

  document.documentElement.lang = language;
  document.title = `${ui.navNews} | ${ui.siteTitle}`;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    if (ui[key]) {
      element.textContent = ui[key];
    }
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderNewsEvents();
  history.replaceState({}, "", `./news.html?lang=${encodeURIComponent(currentLanguage)}`);
}

function esc(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderArtRadar() {
  if (typeof artRadarEvents === "undefined" || !artRadarEvents.length) return;

  document.getElementById("artRadarSection").hidden = false;
  const grid = document.getElementById("artRadarGrid");

  grid.innerHTML = artRadarEvents.map((ev) => {
    const url = ev.url?.startsWith("http") ? ev.url : null;
    return `<div class="ar-event">
      <div class="ar-event-meta">
        <span class="ar-type">${esc(ev.type).replace("_", " ").toUpperCase()}</span>
        ${ev.scraped ? '<span class="ar-source">✓ Direct source</span>' : ""}
        <span class="ar-date">${esc(ev.date)}</span>
      </div>
      <div class="ar-title">${esc(ev.title)}</div>
      <div class="ar-detail">
        ${ev.location ? `<span>📍 ${esc(ev.location)}</span>` : ""}
        ${ev.organizer ? `<span>${esc(ev.organizer)}</span>` : ""}
      </div>
      ${ev.description ? `<div class="ar-desc">${esc(ev.description)}</div>` : ""}
      ${url ? `<a class="ar-link" href="${esc(url)}" target="_blank" rel="noopener">View event ↗</a>` : ""}
    </div>`;
  }).join("");
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});

applyLanguage(currentLanguage);
renderArtRadar();
