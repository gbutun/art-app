const artistProfile = document.getElementById("artistProfile");
const artistWorksGrid = document.getElementById("artistWorksGrid");
const artistWorkTemplate = document.getElementById("artistWorkCardTemplate");
const artistWorksEmpty = document.getElementById("artistWorksEmpty");
const languageButtons = document.querySelectorAll("[data-language]");
const backHomeLink = document.querySelector("[data-back-home]");
const artistsDirectoryLink = document.querySelector("[data-nav-artists]");
const params = new URLSearchParams(window.location.search);
const artistId = params.get("id") || artists[0].id;
let currentLanguage = params.get("lang") || "en";

function updateChrome() {
  const ui = translations[currentLanguage];

  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    if (ui[key]) {
      element.textContent = ui[key];
    }
  });

  backHomeLink.href = `./index.html#gallery`;
  artistsDirectoryLink.href = `./artists.html?lang=${encodeURIComponent(currentLanguage)}`;

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderArtistProfile() {
  const ui = translations[currentLanguage];
  const artist = getArtistById(artistId);

  if (!artist) {
    artistProfile.innerHTML = "";
    artistWorksGrid.innerHTML = "";
    artistWorksEmpty.hidden = false;
    document.title = ui.pageTitle;
    return;
  }

  document.title = `${artist.name[currentLanguage]} | ${ui.artistPageTitleSuffix}`;

  artistProfile.innerHTML = `
    <div class="artist-profile-card">
      <div class="artist-profile-portrait" aria-hidden="true"></div>
      <div class="artist-profile-copy">
        <p class="eyebrow">${ui.artistPageEyebrow}</p>
        <h2>${artist.name[currentLanguage]}</h2>
        <p class="artist-profile-role">${artist.role[currentLanguage]}</p>
        <div class="artist-profile-block">
          <h3>${ui.artistBioLabel}</h3>
          <p>${artist.biography[currentLanguage]}</p>
        </div>
        <div class="artist-profile-block">
          <h3>${ui.artistFocusLabel}</h3>
          <p>${artist.focus[currentLanguage]}</p>
        </div>
        <div class="artist-profile-block">
          <h3>${ui.artistBackgroundLabel}</h3>
          <p>${artist.origin[currentLanguage]}</p>
        </div>
      </div>
    </div>
  `;
}

function renderArtistWorks() {
  const artistWorks = getPaintingsByArtistId(artistId);
  artistWorksGrid.innerHTML = "";
  artistWorksEmpty.hidden = artistWorks.length > 0;

  artistWorks.forEach((painting, index) => {
    const card = artistWorkTemplate.content.firstElementChild.cloneNode(true);
    const image = card.querySelector("img");
    const title = card.querySelector("h3");
    const artistName = card.querySelector(".artist-name");

    image.src = painting.image;
    image.alt = `${painting.title[currentLanguage]} by ${painting.artist[currentLanguage]}`;
    title.textContent = painting.title[currentLanguage];
    artistName.textContent = painting.artist[currentLanguage];
    card.style.animationDelay = `${index * 70}ms`;

    artistWorksGrid.appendChild(card);
  });
}

function applyLanguage(language) {
  currentLanguage = language;
  updateChrome();
  renderArtistProfile();
  renderArtistWorks();
  history.replaceState({}, "", getArtistUrl(artistId, currentLanguage));
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});

applyLanguage(currentLanguage);
