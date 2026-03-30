const paintings = [
  {
    id: "quiet-harbor",
    title: "Quiet Harbor Morning",
    artist: "Amal Rahman",
    year: "2025",
    medium: "Oil on canvas",
    dimensions: "80 x 60 cm",
    description:
      "A realist coastal study built around morning light, softened reflections, and the stillness of fishing boats before the day begins.",
    image:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#e9d7b6"/>
              <stop offset="52%" stop-color="#c8b39b"/>
              <stop offset="100%" stop-color="#8d785f"/>
            </linearGradient>
          </defs>
          <rect width="640" height="480" fill="url(#sky)"/>
          <rect y="250" width="640" height="230" fill="#7d8d8f"/>
          <rect y="285" width="640" height="195" fill="#5b706f"/>
          <ellipse cx="420" cy="105" rx="72" ry="34" fill="#f4ddb0" opacity=".85"/>
          <path d="M120 258 C180 210, 260 210, 334 252 C265 266, 205 272, 120 258Z" fill="#49382c"/>
          <path d="M330 260 C400 214, 503 216, 586 260 C506 277, 422 277, 330 260Z" fill="#3f3127"/>
          <rect x="170" y="164" width="6" height="96" fill="#2e241d"/>
          <path d="M176 164 L238 222 L176 224 Z" fill="#e7e0d2"/>
          <path d="M360 160 L445 236 L360 238 Z" fill="#d6ccb6"/>
          <rect x="356" y="160" width="7" height="100" fill="#2e241d"/>
          <path d="M0 330 C100 304, 200 345, 300 326 S500 308, 640 336 L640 480 L0 480 Z" fill="#4d5f5e" opacity=".62"/>
        </svg>
      `),
  },
  {
    id: "study-in-umber",
    title: "Study in Umber",
    artist: "Layla Nassar",
    year: "2024",
    medium: "Acrylic on board",
    dimensions: "60 x 75 cm",
    description:
      "A portrait-driven interior scene with careful tonal transitions and a restrained earthy palette, designed to feel intimate and contemplative.",
    image:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 700">
          <rect width="520" height="700" fill="#cdb69b"/>
          <rect x="40" y="40" width="440" height="620" rx="10" fill="#8c6a4d"/>
          <rect x="62" y="62" width="396" height="576" fill="#a48061"/>
          <ellipse cx="260" cy="215" rx="86" ry="112" fill="#dfc1a0"/>
          <path d="M155 518 C174 410, 211 338, 262 338 C313 338, 348 410, 367 518 Z" fill="#5b4738"/>
          <path d="M196 175 C217 113, 302 111, 326 176 C305 138, 225 138, 196 175Z" fill="#584130"/>
          <circle cx="228" cy="212" r="7" fill="#3a2d24"/>
          <circle cx="293" cy="212" r="7" fill="#3a2d24"/>
          <path d="M228 272 C246 287, 277 287, 294 272" stroke="#7b5545" stroke-width="7" fill="none" stroke-linecap="round"/>
          <rect x="120" y="547" width="280" height="72" rx="18" fill="#dbc4a8" opacity=".55"/>
        </svg>
      `),
  },
  {
    id: "fields-after-rain",
    title: "Fields After Rain",
    artist: "Yousef Kareem",
    year: "2026",
    medium: "Oil on linen",
    dimensions: "100 x 70 cm",
    description:
      "A landscape composition centered on atmosphere rather than spectacle, with low clouds, wet ground, and measured realism in the distance.",
    image:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 500">
          <rect width="700" height="500" fill="#d9d2c6"/>
          <rect y="0" width="700" height="240" fill="#c1c7c4"/>
          <path d="M0 240 C80 225, 150 252, 232 236 S420 220, 510 238 S620 250, 700 232 L700 500 L0 500 Z" fill="#738167"/>
          <path d="M0 305 C110 282, 206 312, 334 288 S540 271, 700 304 L700 500 L0 500 Z" fill="#8b8861"/>
          <path d="M0 355 C110 340, 240 376, 340 356 S518 336, 700 366 L700 500 L0 500 Z" fill="#5d644f"/>
          <path d="M0 160 C90 122, 173 184, 270 149 S472 118, 700 170 L700 240 L0 240 Z" fill="#a4afab" opacity=".75"/>
          <rect x="466" y="190" width="11" height="115" fill="#4d4436"/>
          <circle cx="471" cy="169" r="44" fill="#6d7765"/>
        </svg>
      `),
  },
  {
    id: "library-light",
    title: "Library Light",
    artist: "Mariam Haddad",
    year: "2025",
    medium: "Mixed media",
    dimensions: "90 x 65 cm",
    description:
      "A still interior built around filtered light, polished wood, and the quiet dignity of arranged objects within a lived-in room.",
    image:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 780">
          <rect width="620" height="780" fill="#d3c0a4"/>
          <rect x="60" y="85" width="500" height="610" fill="#6f4d34"/>
          <rect x="88" y="114" width="444" height="552" fill="#9d7859"/>
          <rect x="120" y="140" width="165" height="250" fill="#47352a"/>
          <rect x="335" y="140" width="165" height="250" fill="#47352a"/>
          <rect x="165" y="435" width="290" height="140" rx="12" fill="#5d4231"/>
          <rect x="195" y="458" width="230" height="18" fill="#b48b61"/>
          <rect x="212" y="492" width="196" height="12" fill="#d5c29e"/>
          <rect x="124" y="160" width="24" height="190" fill="#aa835b"/>
          <rect x="150" y="180" width="34" height="170" fill="#cda376"/>
          <rect x="188" y="169" width="42" height="181" fill="#e0c79c"/>
          <rect x="340" y="168" width="26" height="182" fill="#caa982"/>
          <rect x="372" y="151" width="42" height="199" fill="#ab7d56"/>
          <rect x="420" y="178" width="30" height="172" fill="#e2cda7"/>
        </svg>
      `),
  },
];

const galleryGrid = document.getElementById("galleryGrid");
const template = document.getElementById("paintingCardTemplate");
const detailModal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");
const featuredButton = document.querySelector("[data-open-first]");

function renderGallery() {
  paintings.forEach((painting, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const button = card.querySelector(".painting-card-link");
    const image = card.querySelector("img");
    const title = card.querySelector("h3");
    const artist = card.querySelector(".artist-name");

    image.src = painting.image;
    image.alt = `${painting.title} by ${painting.artist}`;
    title.textContent = painting.title;
    artist.textContent = painting.artist;
    card.style.animationDelay = `${index * 70}ms`;

    button.addEventListener("click", () => openPainting(painting.id));
    galleryGrid.appendChild(card);
  });
}

function openPainting(id) {
  const painting = paintings.find((entry) => entry.id === id);

  if (!painting) {
    return;
  }

  detailContent.innerHTML = `
    <div class="detail-image-wrap">
      <img src="${painting.image}" alt="${painting.title} by ${painting.artist}" />
    </div>
    <div class="detail-copy">
      <p class="eyebrow">Painting Details</p>
      <h2>${painting.title}</h2>
      <p class="artist-name">${painting.artist}</p>
      <p>${painting.description}</p>
      <ul class="detail-facts">
        <li><strong>Year:</strong> ${painting.year}</li>
        <li><strong>Medium:</strong> ${painting.medium}</li>
        <li><strong>Dimensions:</strong> ${painting.dimensions}</li>
      </ul>
    </div>
  `;

  detailModal.showModal();
}

featuredButton.addEventListener("click", () => openPainting(paintings[0].id));

renderGallery();
