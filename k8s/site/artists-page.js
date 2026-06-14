const artistsGrid = document.getElementById("artistsGrid");
const artistTemplate = document.getElementById("artistCardTemplate");
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

function renderArtistsDirectory() {
  artistsGrid.innerHTML = "";

  artists.forEach((artistEntry, index) => {
    const card = artistTemplate.content.firstElementChild.cloneNode(true);
    const link = card.querySelector(".artist-card-link");
    const portrait = card.querySelector(".artist-portrait");
    const role = card.querySelector(".artist-role");
    const name = card.querySelector("h3");
    const bio = card.querySelector(".artist-bio");
    const focus = card.querySelector(".artist-focus");
    const origin = card.querySelector(".artist-origin");

    link.href = getArtistUrl(artistEntry.id, currentLanguage);
    if (artistEntry.portrait) {
      portrait.innerHTML = `<img class="artist-portrait-image" src="${artistEntry.portrait}" alt="${artistEntry.name[currentLanguage]}" loading="lazy" />`;
      portrait.removeAttribute("aria-hidden");
      const portraitImage = portrait.querySelector(".artist-portrait-image");
      if (portraitImage) {
        assignImageWithFallback(portraitImage, artistEntry.portrait);
      }
    }
    role.textContent = artistEntry.role[currentLanguage];
    name.textContent = artistEntry.name[currentLanguage];
    bio.textContent = artistEntry.biography[currentLanguage];
    focus.textContent = `${translations[currentLanguage].artistFocusLabel}: ${artistEntry.focus[currentLanguage]}`;
    origin.textContent = `${translations[currentLanguage].artistBackgroundLabel}: ${artistEntry.origin[currentLanguage]}`;
    card.style.animationDelay = `${index * 80}ms`;

    artistsGrid.appendChild(card);
  });
}

function applyLanguage(language) {
  currentLanguage = language;
  const ui = translations[language];

  document.documentElement.lang = language;
  document.title = `${ui.navArtists} | ${ui.siteTitle}`;

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

  renderArtistsDirectory();
  history.replaceState({}, "", `./artists.html?lang=${encodeURIComponent(currentLanguage)}`);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});

applyLanguage(currentLanguage);
