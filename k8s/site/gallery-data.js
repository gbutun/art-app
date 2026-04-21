const translations = {
  en: {
    pageTitle: "Modern Heritage Gallery",
    artistPageTitleSuffix: "Artist Profile",
    headerEyebrow: "Private Collection",
    siteTitle: "Modern Heritage Gallery",
    navGallery: "Gallery",
    navNews: "News & Events",
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
    galleryText: "",
    galleryMore: "More",
    newsEyebrow: "Studio Journal",
    newsTitle: "News & events",
    newsText:
      "Keep visitors up to date with current exhibitions, studio milestones, and upcoming gatherings around the collection.",
    artistsEyebrow: "Artist Profiles",
    artistsTitle: "Meet the artists",
    artistsText:
      "Browse the collection by artist and explore each painter's available works from the shared studio archive.",
    aboutEyebrow: "Commission a Painting",
    aboutTitle: "You like what you see?",
    aboutText:
      "Have a reproduction with the finest touch.\nHave a photograph turned into a real painting by our artists.\nHave your precious moments and family pictures immortalized.\n\nPlease reach us under gbutun@ankacoresystems.com.",
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
    navNews: "Haberler ve Etkinlikler",
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
    galleryText: "",
    galleryMore: "Daha Fazla",
    newsEyebrow: "Stüdyo Günlüğü",
    newsTitle: "Haberler ve etkinlikler",
    newsText:
      "Ziyaretçileri güncel sergiler, atölye gelişmeleri ve koleksiyon çevresindeki yaklaşan buluşmalar hakkında bilgilendirin.",
    artistsEyebrow: "Sanatçı Profilleri",
    artistsTitle: "Sanatçılarla tanışın",
    artistsText:
      "Koleksiyonu sanatçıya göre inceleyin ve her ressamın ortak arşivde yer alan eserlerini keşfedin.",
    aboutEyebrow: "Tablo Siparişi",
    aboutTitle: "Gördüklerinizi beğendiniz mi?",
    aboutText:
      "En zarif dokunuşla bir reprodüksiyon yaptırın.\nFotoğraflarınızı sanatçılarımız tarafından gerçek bir tabloya dönüştürün.\nDeğerli anılarınızı ve aile fotoğraflarınızı ölümsüzleştirin.\n\nBizimle gbutun@ankacoresystems.com üzerinden iletişime geçin.",
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

function artifactPath(artistFolder, fileName) {
  return `./artifacts/${encodeURIComponent(artistFolder)}/${encodeURIComponent(fileName)}`;
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function titleFromFileName(fileName, language) {
  const stem = fileName.replace(/\.[^.]+$/, "");
  const match = stem.match(/^resim(\d+)$/i);

  if (match) {
    return language === "tr" ? `Resim ${match[1]}` : `Painting ${match[1]}`;
  }

  return stem;
}

const artists = [
  {
    id: "mehmet-ozdemir",
    folder: "Mehmet Ozdemir",
    name: {
      en: "Mehmet Özdemir",
      tr: "Mehmet Özdemir",
    },
    role: {
      en: "Realist Painter",
      tr: "Gerçekçi Ressam",
    },
    biography: {
      en: "Mehmet Özdemir focuses on coastal scenes, quiet labor, and the changing color of early light. His work combines careful observation with a calm, almost meditative atmosphere.",
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
    id: "mahmut-sahin",
    folder: "Mahmut Sahin",
    name: {
      en: "Mahmut Şahin",
      tr: "Mahmut Şahin",
    },
    role: {
      en: "Portrait and Interior Artist",
      tr: "Portre ve İç Mekan Sanatçısı",
    },
    biography: {
      en: "Mahmut Şahin creates intimate scenes shaped by human presence, interior stillness, and rich tonal structure. His paintings often explore memory, character, and the emotional life of domestic spaces.",
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
];

const artistLookup = Object.fromEntries(artists.map((artist) => [artist.id, artist]));

const artifactCollections = [
  {
    artistId: "mehmet-ozdemir",
    year: "2026",
    medium: {
      en: "Original artwork",
      tr: "Özgün eser",
    },
    dimensions: "Details on request",
    description: {
      en: "From the Mehmet Özdemir archive, this work reflects the painter's calm realism, careful light handling, and patient surface observation.",
      tr: "Mehmet Özdemir arşivinden alınan bu eser, sanatçının dingin gerçekçiliğini, dikkatli ışık kullanımını ve sabırlı yüzey gözlemini yansıtır.",
    },
    files: [
      "resim1.png",
      "resim2.png",
      "resim3.png",
      "resim4.png",
      "resim5.png",
      "resim6.png",
      "resim7.png",
      "resim8.png",
      "resim9.PNG",
      "resim10.png",
      "resim11.png",
      "resim12.png",
      "resim13.png",
      "resim14.png",
      "resim15.png",
      "resim16.png",
      "resim17.png",
      "resim18.png",
      "resim19.png",
      "resim20.png",
      "resim21.png",
      "resim22.png",
      "resim23.png",
      "resim24.png",
      "resim25.png",
      "resim26.png",
      "resim27.png",
      "resim28.PNG",
      "resim29.png",
    ],
  },
  {
    artistId: "mahmut-sahin",
    year: "2026",
    medium: {
      en: "Original artwork",
      tr: "Özgün eser",
    },
    dimensions: "Details on request",
    description: {
      en: "From the Mahmut Şahin archive, this work highlights portrait structure, tonal depth, and the intimate stillness of domestic interiors.",
      tr: "Mahmut Şahin arşivinden alınan bu eser, portre yapısını, tonal derinliği ve ev içi mekanların samimi sessizliğini öne çıkarır.",
    },
    files: [
      "resim1.png",
      "resim2.png",
      "resim3.png",
      "resim4.png",
      "resim5.png",
      "resim6.png",
      "resim7.png",
      "resim8.png",
      "resim9.png",
      "resim11.png",
      "resim12.png",
      "resim13.png",
      "resim14.png",
      "resim15.png",
      "resim16.PNG",
      "resim17.png",
    ],
  },
];

const paintings = artifactCollections.flatMap((collection) => {
  const artist = artistLookup[collection.artistId];

  return collection.files.map((fileName, index) => ({
    id: `${collection.artistId}-${padNumber(index + 1)}`,
    artistId: collection.artistId,
    title: {
      en: titleFromFileName(fileName, "en"),
      tr: titleFromFileName(fileName, "tr"),
    },
    artist: artist.name,
    year: collection.year,
    medium: collection.medium,
    dimensions: collection.dimensions,
    description: collection.description,
    image: artifactPath(artist.folder, fileName),
  }));
});

const newsItems = [
  {
    type: {
      en: "Upcoming Event",
      tr: "Yaklaşan Etkinlik",
    },
    date: {
      en: "May 18, 2026",
      tr: "18 Mayıs 2026",
    },
    title: {
      en: "Private salon evening at the studio",
      tr: "Atölyede özel salon akşamı",
    },
    body: {
      en: "Collectors and invited guests will gather for a small evening viewing focused on newly added works by Mehmet Özdemir and Mahmut Şahin.",
      tr: "Koleksiyonerler ve davetli konuklar, Mehmet Özdemir ve Mahmut Şahin'in yeni eklenen eserlerine odaklanan küçük bir akşam gösteriminde bir araya gelecek.",
    },
  },
  {
    type: {
      en: "Collection Update",
      tr: "Koleksiyon Güncellemesi",
    },
    date: {
      en: "April 21, 2026",
      tr: "21 Nisan 2026",
    },
    title: {
      en: "Artist archives added to the online gallery",
      tr: "Sanatçı arşivleri çevrimiçi galeriye eklendi",
    },
    body: {
      en: "The website now features image archives from the studio artifacts folders, making each artist page feel closer to the real working collection.",
      tr: "Web sitesi artık stüdyo artifact klasörlerindeki görsel arşivleri içeriyor; böylece her sanatçı sayfası gerçek çalışma koleksiyonuna daha yakın hissediliyor.",
    },
  },
  {
    type: {
      en: "Studio News",
      tr: "Stüdyo Haberi",
    },
    date: {
      en: "June 2026",
      tr: "Haziran 2026",
    },
    title: {
      en: "Summer commissions calendar opening soon",
      tr: "Yaz dönemi sipariş takvimi yakında açılıyor",
    },
    body: {
      en: "Portrait and reproduction commission requests for the summer season will open soon, with limited studio capacity reserved for family and heritage subjects.",
      tr: "Yaz dönemi için portre ve reprodüksiyon sipariş talepleri yakında açılacak; sınırlı atölye kapasitesi aile ve miras konularına ayrılacak.",
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
