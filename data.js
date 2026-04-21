const translations = {
  en: {
    pageTitle: "Modern Heritage Gallery",
    artistPageTitleSuffix: "Artist Profile",
    headerEyebrow: "Private Collection",
    siteTitle: "Modern Heritage Gallery",
    navGallery: "Gallery",
    navArtists: "Artists",
    navAbout: "About",
    navBackHome: "Back to Gallery",
    heroEyebrow: "Traditional Realism, Curated with a Modern Eye",
    heroTitle: "A digital exhibition space for paintings that deserve room to breathe.",
    heroText: "",
    heroPrimaryAction: "Explore the Collection",
    heroSecondaryAction: "Open Featured Work",
    galleryEyebrow: "Collection Preview",
    galleryTitle: "Featured paintings",
    galleryText:
      "The cards below keep every work well scaled and easy to read, whether the original piece is portrait or landscape.",
    artistsEyebrow: "Artist Profiles",
    artistsTitle: "Meet the artists",
    artistsText:
      "Add a human story to the collection with biographies, artistic focus, and short notes that help visitors connect with each painter behind the work.",
    aboutEyebrow: "Commission a Painting",
    aboutTitle: "You like what you see?",
    aboutText:
      "Have a reproduction with the finest touch.\nHave a photograph turned into a real painting by our artists.\nHave your precious moments and family pictures immortalized.\n\nPlease reach us under info@ankacoresystems.com.",
    closeButton: "Close",
    detailEyebrow: "Painting Details",
    factsYear: "Year",
    factsMedium: "Medium",
    factsDimensions: "Dimensions",
    artistPageEyebrow: "Artist Profile",
    artistWorksEyebrow: "Selected Works",
    artistWorksTitle: "Paintings by this artist",
    artistBioLabel: "Biography",
    artistFocusLabel: "Artistic Focus",
    artistBackgroundLabel: "Background",
    artistWorksEmpty: "No paintings are linked to this artist yet.",
  },
  tr: {
    pageTitle: "Modern Miras Galerisi",
    artistPageTitleSuffix: "Sanatçı Profili",
    headerEyebrow: "Özel Koleksiyon",
    siteTitle: "Modern Miras Galerisi",
    navGallery: "Galeri",
    navArtists: "Sanatçılar",
    navAbout: "Hakkında",
    navBackHome: "Galeriye Dön",
    heroEyebrow: "Geleneksel Gerçekçilik, Modern Bir Yaklaşımla Sunuldu",
    heroTitle: "Nefes alacak alanı olan tablolar için dijital bir sergi mekanı.",
    heroText: "",
    heroPrimaryAction: "Koleksiyonu Keşfet",
    heroSecondaryAction: "Öne Çıkan Eseri Aç",
    galleryEyebrow: "Koleksiyon Ön İzleme",
    galleryTitle: "Öne çıkan tablolar",
    galleryText:
      "Aşağıdaki kartlar, eserin dikey ya da yatay olmasına bakmadan her tabloyu dengeli ve kolay okunur biçimde gösterir.",
    artistsEyebrow: "Sanatçı Profilleri",
    artistsTitle: "Sanatçılarla tanışın",
    artistsText:
      "Biyografiler, sanatsal odaklar ve kısa notlarla koleksiyona insani bir hikaye katın; ziyaretçiler her tablonun arkasındaki ressamla bağ kurabilsin.",
    aboutEyebrow: "Tablo Siparişi",
    aboutTitle: "Gördüklerinizi beğendiniz mi?",
    aboutText:
      "En zarif dokunuşla bir reprodüksiyon yaptırın.\nFotoğraflarınızı sanatçılarımız tarafından gerçek bir tabloya dönüştürün.\nDeğerli anılarınızı ve aile fotoğraflarınızı ölümsüzleştirin.\n\nBizimle info@ankacoresystems.com üzerinden iletişime geçin.",
    closeButton: "Kapat",
    detailEyebrow: "Eser Detayları",
    factsYear: "Yıl",
    factsMedium: "Teknik",
    factsDimensions: "Ölçüler",
    artistPageEyebrow: "Sanatçı Profili",
    artistWorksEyebrow: "Seçili Eserler",
    artistWorksTitle: "Bu sanatçıya ait tablolar",
    artistBioLabel: "Biyografi",
    artistFocusLabel: "Sanatsal Odak",
    artistBackgroundLabel: "Arka Plan",
    artistWorksEmpty: "Bu sanatçıya bağlı tablo henüz eklenmedi.",
  },
};

const paintings = [
  {
    id: "quiet-harbor",
    artistId: "mehmet-ozdemir",
    title: {
      en: "Quiet Harbor Morning",
      tr: "Sessiz Liman Sabahı",
    },
    artist: {
      en: "Mehmet Özdemir",
      tr: "Mehmet Özdemir",
    },
    year: "2025",
    medium: {
      en: "Oil on canvas",
      tr: "Tuval üzerine yağlı boya",
    },
    dimensions: "80 x 60 cm",
    description: {
      en: "A realist coastal study built around morning light, softened reflections, and the stillness of fishing boats before the day begins.",
      tr: "Sabah ışığını, yumuşatılmış yansımaları ve gün başlamadan önce balıkçı teknelerinin durgunluğunu merkeze alan gerçekçi bir kıyı çalışması.",
    },
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
    artistId: "layla-nassar",
    title: {
      en: "Study in Umber",
      tr: "Umber Etüdü",
    },
    artist: {
      en: "Mahmut Şahin",
      tr: "Mahmut Şahin",
    },
    year: "2024",
    medium: {
      en: "Acrylic on board",
      tr: "Panel üzerine akrilik",
    },
    dimensions: "60 x 75 cm",
    description: {
      en: "A portrait-driven interior scene with careful tonal transitions and a restrained earthy palette, designed to feel intimate and contemplative.",
      tr: "Dikkatli tonal geçişler ve ölçülü toprak tonlarıyla kurulan, samimi ve düşünceli bir atmosfer taşıyan portre odaklı bir iç mekan sahnesi.",
    },
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
    artistId: "yousef-kareem",
    title: {
      en: "Fields After Rain",
      tr: "Yağmur Sonrası Tarlalar",
    },
    artist: {
      en: "Yousef Kareem",
      tr: "Yousef Kareem",
    },
    year: "2026",
    medium: {
      en: "Oil on linen",
      tr: "Keten üzerine yağlı boya",
    },
    dimensions: "100 x 70 cm",
    description: {
      en: "A landscape composition centered on atmosphere rather than spectacle, with low clouds, wet ground, and measured realism in the distance.",
      tr: "Gösterişten çok atmosfere odaklanan; alçak bulutlar, ıslak toprak ve uzakta ölçülü bir gerçekçilik taşıyan peyzaj kompozisyonu.",
    },
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
    artistId: "mariam-haddad",
    title: {
      en: "Library Light",
      tr: "Kütüphane Işığı",
    },
    artist: {
      en: "Mariam Haddad",
      tr: "Mariam Haddad",
    },
    year: "2025",
    medium: {
      en: "Mixed media",
      tr: "Karışık teknik",
    },
    dimensions: "90 x 65 cm",
    description: {
      en: "A still interior built around filtered light, polished wood, and the quiet dignity of arranged objects within a lived-in room.",
      tr: "Süzülen ışık, cilalı ahşap ve yaşanmış bir odadaki nesnelerin sakin asaleti etrafında kurulan durgun bir iç mekan resmi.",
    },
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

const artists = [
  {
    id: "amal-rahman",
    name: {
      en: "Mehmet Özdemir",
      tr: "Mehmet Özdemir",
    },
    role: {
      en: "Realist Painter",
      tr: "Gerçekçi Ressam",
    },
    biography: {
      en: "Mehmet Özdemir focuses on coastal scenes, quiet labor, and the changing color of early light. Her work combines careful observation with a calm, almost meditative atmosphere.",
      tr: "Mehmet Özdemir, kıyı sahnelerine, gündelik emeğin sakin anlarına ve sabah ışığının değişen tonlarına odaklanır. Eserleri dikkatli gözlemi dingin ve neredeyse meditatif bir atmosferle birleştirir.",
    },
    focus: {
      en: "Coastal realism, natural light, reflective water",
      tr: "Kıyı gerçekçiliği, doğal ışık, yansıtıcı su yüzeyleri",
    },
    origin: {
      en: "Studio practice rooted in observational painting",
      tr: "Gözleme dayalı resim pratiğine kök salmış bir atölye yaklaşımı",
    },
  },
  {
    id: "layla-nassar",
    name: {
      en: "Mahmut Şahin",
      tr: "Mahmut Şahin",
    },
    role: {
      en: "Portrait and Interior Artist",
      tr: "Portre ve İç Mekan Sanatçısı",
    },
    biography: {
      en: "Mahmut Şahin creates intimate scenes shaped by human presence, interior stillness, and rich tonal structure. Her paintings often explore memory, character, and the emotional life of domestic spaces.",
      tr: "Mahmut Şahin, insan varlığı, iç mekan sessizliği ve zengin tonal yapı etrafında şekillenen samimi sahneler üretir. Resimleri çoğu zaman hafızayı, karakteri ve ev içi mekanların duygusal yaşamını araştırır.",
    },
    focus: {
      en: "Portraiture, tonal realism, domestic interiors",
      tr: "Portre, tonal gerçekçilik, ev içi mekanlar",
    },
    origin: {
      en: "Figurative studies and layered studio compositions",
      tr: "Figüratif çalışmalar ve katmanlı atölye kompozisyonları",
    },
  },
  {
    id: "yousef-kareem",
    name: {
      en: "Yousef Kareem",
      tr: "Yousef Kareem",
    },
    role: {
      en: "Landscape Painter",
      tr: "Peyzaj Ressamı",
    },
    biography: {
      en: "Yousef Kareem paints open land, weather systems, and the quiet structure of distant horizons. His landscapes favor atmosphere and restraint over spectacle, inviting slow looking.",
      tr: "Yousef Kareem, açık arazileri, hava olaylarını ve uzak ufukların sessiz yapısını resmeder. Peyzajları gösterişten çok atmosfere ve ölçülülüğe yönelir; izleyiciyi yavaş bakmaya davet eder.",
    },
    focus: {
      en: "Wide landscapes, atmosphere, muted earth palettes",
      tr: "Geniş peyzajlar, atmosfer, yumuşatılmış toprak paletleri",
    },
    origin: {
      en: "Plein air studies translated into refined studio works",
      tr: "Açık havada yapılan etütlerin rafine atölye işlerine dönüşmesi",
    },
  },
  {
    id: "mariam-haddad",
    name: {
      en: "Mariam Haddad",
      tr: "Mariam Haddad",
    },
    role: {
      en: "Still Life and Interior Painter",
      tr: "Natürmort ve İç Mekan Ressamı",
    },
    biography: {
      en: "Mariam Haddad builds paintings from quiet objects, filtered light, and the tactile warmth of inhabited rooms. Her approach balances realism with a gentle editorial sense of composition.",
      tr: "Mariam Haddad, resimlerini sessiz nesnelerden, süzülen ışıktan ve yaşanmış odaların dokunsal sıcaklığından kurar. Yaklaşımı gerçekçiliği yumuşak bir editöryal kompozisyon duygusuyla dengeler.",
    },
    focus: {
      en: "Still life, interior mood, material texture",
      tr: "Natürmort, iç mekan atmosferi, malzeme dokusu",
    },
    origin: {
      en: "Mixed-media practice informed by classical arrangement",
      tr: "Klasik düzen anlayışından beslenen karışık teknik pratiği",
    },
  },
];

function getArtistById(id) {
  return artists.find((artist) => artist.id === id);
}

function getPaintingsByArtistId(artistId) {
  return paintings.filter((painting) => painting.artistId === artistId);
}

function getArtistUrl(artistId, language) {
  return `./artist.html?id=${encodeURIComponent(artistId)}&lang=${encodeURIComponent(language)}`;
}
