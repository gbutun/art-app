const newsGrid = document.getElementById("newsGrid");
const newsTemplate = document.getElementById("newsCardTemplate");
const languageButtons = document.querySelectorAll("[data-language]");
const params = new URLSearchParams(window.location.search);
let currentLanguage = params.get("lang") || "en";

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
      image.src = item.image;
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

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});

applyLanguage(currentLanguage);
