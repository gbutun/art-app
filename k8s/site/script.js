const galleryGrid = document.getElementById("galleryGrid");
const template = document.getElementById("paintingCardTemplate");
const detailModal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");
const featuredButton = document.querySelector("[data-open-first]");
const languageButtons = document.querySelectorAll("[data-language]");
const featuredHeroArt = document.querySelector(".hero-art-featured");
const accentHeroArt = document.querySelector(".hero-art-accent");
let currentLanguage = "en";
let activePaintingId = null;

function applyHeroImages() {
  if (featuredHeroArt && siteConfig?.heroImages?.featured) {
    featuredHeroArt.style.backgroundImage = `linear-gradient(180deg, rgba(38, 34, 30, 0.18), rgba(38, 34, 30, 0.08)), url('${siteConfig.heroImages.featured}')`;
  }

  if (accentHeroArt && siteConfig?.heroImages?.accent) {
    accentHeroArt.style.backgroundImage = `linear-gradient(180deg, rgba(44, 38, 31, 0.2), rgba(44, 38, 31, 0.06)), url('${siteConfig.heroImages.accent}')`;
  }
}

function renderGallery() {
  galleryGrid.innerHTML = "";
  const ui = translations[currentLanguage];

  artists.forEach((artistEntry) => {
    const artistPaintings = getPaintingsByArtistId(artistEntry.id).slice(-4).reverse();

    if (!artistPaintings.length) {
      return;
    }

    const preview = document.createElement("section");
    preview.className = "artist-preview";

    const header = document.createElement("div");
    header.className = "artist-preview-header";

    const titleGroup = document.createElement("div");
    titleGroup.className = "artist-preview-copy";

    const title = document.createElement("h3");
    title.className = "artist-preview-title";
    title.textContent = artistEntry.name[currentLanguage];

    const role = document.createElement("p");
    role.className = "artist-preview-role";
    role.textContent = artistEntry.role[currentLanguage];

    const moreLink = document.createElement("a");
    moreLink.className = "artist-preview-link";
    moreLink.href = getArtistUrl(artistEntry.id, currentLanguage);
    moreLink.textContent = ui.galleryMore;

    titleGroup.appendChild(title);
    titleGroup.appendChild(role);
    header.appendChild(titleGroup);
    header.appendChild(moreLink);
    preview.appendChild(header);

    const previewGrid = document.createElement("div");
    previewGrid.className = "gallery-grid artist-preview-grid";

    artistPaintings.forEach((painting, index) => {
      const card = template.content.firstElementChild.cloneNode(true);
      const button = card.querySelector(".painting-card-link");
      const image = card.querySelector("img");
      const cardTitle = card.querySelector("h3");
      const artist = card.querySelector(".artist-name");

      image.src = painting.image;
      image.alt = `${painting.title[currentLanguage]} by ${painting.artist[currentLanguage]}`;
      cardTitle.textContent = painting.title[currentLanguage];
      artist.textContent = painting.artist[currentLanguage];
      artist.href = getArtistUrl(painting.artistId, currentLanguage);
      card.style.animationDelay = `${index * 70}ms`;

      artist.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      button.addEventListener("click", () => openPainting(painting.id));
      previewGrid.appendChild(card);
    });

    preview.appendChild(previewGrid);
    galleryGrid.appendChild(preview);
  });
}

function openPainting(id) {
  const painting = paintings.find((entry) => entry.id === id);
  const ui = translations[currentLanguage];

  if (!painting) {
    return;
  }

  activePaintingId = id;

  detailContent.innerHTML = `
    <div class="detail-image-wrap">
      <img src="${painting.image}" alt="${painting.title[currentLanguage]} by ${painting.artist[currentLanguage]}" />
    </div>
    <div class="detail-copy">
      <p class="eyebrow">${ui.detailEyebrow}</p>
      <h2>${painting.title[currentLanguage]}</h2>
      <p class="artist-name"><a class="artist-inline-link" href="${getArtistUrl(
        painting.artistId,
        currentLanguage
      )}">${painting.artist[currentLanguage]}</a></p>
      <p>${painting.description[currentLanguage]}</p>
      <ul class="detail-facts">
        <li><strong>${ui.factsYear}:</strong> ${painting.year}</li>
        <li><strong>${ui.factsMedium}:</strong> ${painting.medium[currentLanguage]}</li>
        <li><strong>${ui.factsDimensions}:</strong> ${painting.dimensions}</li>
      </ul>
    </div>
  `;

  detailModal.showModal();
}

function applyTranslations(language) {
  currentLanguage = language;
  const ui = translations[language];

  document.documentElement.lang = language;
  document.title = ui.pageTitle;

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

  renderGallery();

  if (detailModal.open && activePaintingId) {
    openPainting(activePaintingId);
  }
}

featuredButton.addEventListener("click", () => openPainting(paintings[0].id));
languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyTranslations(button.dataset.language));
});

applyHeroImages();
applyTranslations(currentLanguage);
