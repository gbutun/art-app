const galleryGrid = document.getElementById("galleryGrid");
const template = document.getElementById("paintingCardTemplate");
const detailModal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");
const featuredButton = document.querySelector("[data-open-first]");
const languageButtons = document.querySelectorAll("[data-language]");
let currentLanguage = "en";
let activePaintingId = null;

function renderGallery() {
  galleryGrid.innerHTML = "";

  paintings.forEach((painting, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const button = card.querySelector(".painting-card-link");
    const image = card.querySelector("img");
    const title = card.querySelector("h3");
    const artist = card.querySelector(".artist-name");

    image.src = painting.image;
    image.alt = `${painting.title[currentLanguage]} by ${painting.artist[currentLanguage]}`;
    title.textContent = painting.title[currentLanguage];
    artist.textContent = painting.artist[currentLanguage];
    artist.href = getArtistUrl(painting.artistId, currentLanguage);
    card.style.animationDelay = `${index * 70}ms`;

    artist.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    button.addEventListener("click", () => openPainting(painting.id));
    galleryGrid.appendChild(card);
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

applyTranslations(currentLanguage);
