import fs from "node:fs/promises";
import path from "node:path";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const artifactsDir = path.join(rootDir, "artifacts");
const outputPath = path.join(rootDir, "gallery-data.js");
const artistsFolderName = "artists";
const eventsFolderName = "events";
const rawAssetBaseUrl = process.env.ASSET_BASE_URL?.trim() ?? "";
const assetBaseUrl = rawAssetBaseUrl.replace(/\/+$/, "");

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

const artistMetadata = {
  "Mehmet Ozdemir": {
    id: "mehmet-ozdemir",
    folder: "Mehmet Ozdemir",
    name: { en: "Mehmet Özdemir", tr: "Mehmet Özdemir" },
    role: { en: "Realist Painter", tr: "Gerçekçi Ressam" },
    portrait: artistAssetPath("mehmetozdemir.jpg"),
    biography: {
      en: "He was born in 1954 in Reyhanli, Hatay. He began his art education in the Painting Department of the Ataturk Teacher Training Institute. He later studied in the Architecture Department of the Istanbul State Academy of Applied Fine Arts. After graduation, he worked for a period in interior architecture while focusing his artistic production on painting.\n\nThe artist has taken part in various exhibitions and workshops in Antakya. After the Hatay earthquake in 2023, he continued his work in Ankara, opened a solo exhibition at ARTSAN Art Gallery, and participated in group exhibitions.",
      tr: "1954 yılında Hatay'ın Reyhanlı ilçesinde doğdu. Sanat eğitimine Atatürk Öğretmen Enstitüsü Resim Bölümü'nde başladı. Daha sonra İstanbul Tatbiki Güzel Sanatlar Yüksekokulu Mimarlık Bölümü'nde eğitim aldı. Mezuniyetinin ardından bir süre iç mimarlık alanında çalıştı ve üretimlerini resim sanatı üzerine yoğunlaştırdı.\n\nSanatçı, Antakya'da çeşitli sergi ve çalıştaylara katılmıştır. 2023 Hatay depremi sonrasında çalışmalarını Ankara'da sürdürmüş, ARTSAN Sanat Galerisi'nde kişisel sergi açmış ve karma sergilerde yer almıştır.",
    },
    focus: {
      en: "Coastal realism, natural light, reflective water",
      tr: "Kıyı gerçekçiliği, doğal ışık, yansıtıcı su yüzeyleri",
    },
    origin: {
      en: "Studio practice rooted in observational painting",
      tr: "Gözleme dayalı resim pratiğine kök salmış bir atölye yaklaşımı",
    },
    description: {
      en: "From the Mehmet Özdemir archive, this work reflects the painter's calm realism, careful light handling, and patient surface observation.",
      tr: "Mehmet Özdemir arşivinden alınan bu eser, sanatçının dingin gerçekçiliğini, dikkatli ışık kullanımını ve sabırlı yüzey gözlemini yansıtır.",
    },
  },
  "Mahmut Sahin": {
    id: "mahmut-sahin",
    folder: "Mahmut Sahin",
    name: { en: "Mahmut Şahin", tr: "Mahmut Şahin" },
    role: { en: "Portrait and Interior Artist", tr: "Portre ve İç Mekan Sanatçısı" },
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
    description: {
      en: "From the Mahmut Şahin archive, this work highlights portrait structure, tonal depth, and the intimate stillness of domestic interiors.",
      tr: "Mahmut Şahin arşivinden alınan bu eser, portre yapısını, tonal derinliği ve ev içi mekanların samimi sessizliğini öne çıkarır.",
    },
  },
};

const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const turkishMonthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function artifactPath(artistFolder, fileName) {
  return joinAssetPath(artistsFolderName, artistFolder, fileName);
}

function artistAssetPath(fileName) {
  return joinAssetPath(artistsFolderName, fileName);
}

function eventPath(fileName) {
  return joinAssetPath(eventsFolderName, fileName);
}

function joinAssetPath(...segments) {
  const encodedPath = segments.map((segment) => encodeURIComponent(segment)).join("/");

  if (assetBaseUrl) {
    return `${assetBaseUrl}/${encodedPath}`;
  }

  return `./artifacts/${encodedPath}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleFromFileName(fileName, language) {
  const stem = fileName.replace(/\.[^.]+$/, "");
  const match = stem.match(/^resim(\d+)$/i);

  if (match) {
    return language === "tr" ? `Resim ${match[1]}` : `Painting ${match[1]}`;
  }

  return stem;
}

function naturalSort(values) {
  return [...values].sort((left, right) =>
    left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" })
  );
}

function titleCase(value) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function titleFromStem(stem, language) {
  const spaced = stem
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d+)/g, "$1 $2")
    .trim();

  if (!spaced) {
    return language === "tr" ? "Yeni Duyuru" : "New Announcement";
  }

  if (language === "tr") {
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  return titleCase(spaced.toLowerCase());
}

function formatNewsDate(date) {
  return {
    en: new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(date),
    tr: `${date.getUTCDate()} ${turkishMonthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}`,
  };
}

function toLocalizedText(value, fallback) {
  if (value && typeof value === "object" && typeof value.en === "string" && typeof value.tr === "string") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return { en: value.trim(), tr: value.trim() };
  }

  return fallback;
}

async function readOptionalJson(pathName) {
  try {
    const source = await fs.readFile(pathName, "utf8");
    return JSON.parse(source);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function loadArtistsAndPaintings() {
  const artistsDir = path.join(artifactsDir, artistsFolderName);
  const artistEntries = await fs.readdir(artistsDir, { withFileTypes: true });
  const folders = naturalSort(
    artistEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  );

  const artists = [];
  const paintings = [];

  for (const folderName of folders) {
    const metadata = artistMetadata[folderName] ?? {
      id: slugify(folderName),
      folder: folderName,
      name: { en: folderName, tr: folderName },
      role: { en: "Artist", tr: "Sanatçı" },
      biography: {
        en: `${folderName} is featured in the studio archive.`,
        tr: `${folderName} stüdyo arşivinde yer almaktadır.`,
      },
      focus: { en: "Studio archive", tr: "Stüdyo arşivi" },
      origin: { en: "Shared collection archive", tr: "Ortak koleksiyon arşivi" },
      description: {
        en: `From the ${folderName} archive.`,
        tr: `${folderName} arşivinden.`,
      },
    };

    artists.push({
      id: metadata.id,
      folder: metadata.folder,
      name: metadata.name,
      role: metadata.role,
      portrait: metadata.portrait ?? null,
      biography: metadata.biography,
      focus: metadata.focus,
      origin: metadata.origin,
    });

    const fileEntries = await fs.readdir(path.join(artistsDir, folderName), {
      withFileTypes: true,
    });
    const files = naturalSort(
      fileEntries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
    );

    files.forEach((fileName, index) => {
      paintings.push({
        id: `${metadata.id}-${String(index + 1).padStart(2, "0")}`,
        artistId: metadata.id,
        title: {
          en: titleFromFileName(fileName, "en"),
          tr: titleFromFileName(fileName, "tr"),
        },
        artist: metadata.name,
        year: "2026",
        medium: { en: "Original artwork", tr: "Özgün eser" },
        dimensions: "Details on request",
        description: metadata.description,
        image: artifactPath(folderName, fileName),
      });
    });
  }

  return { artists, paintings };
}

async function loadNewsItems() {
  const eventsDir = path.join(artifactsDir, eventsFolderName);

  try {
    await fs.access(eventsDir);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const eventEntries = await fs.readdir(eventsDir, { withFileTypes: true });
  const files = naturalSort(
    eventEntries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
  );

  const items = [];

  for (const fileName of files) {
    const filePath = path.join(eventsDir, fileName);
    const stats = await fs.stat(filePath);
    const stem = fileName.replace(/\.[^.]+$/, "");
    const metadata = await readOptionalJson(path.join(eventsDir, `${stem}.json`));

    items.push({
      type: toLocalizedText(metadata?.type, {
        en: "Announcement",
        tr: "Duyuru",
      }),
      date: toLocalizedText(metadata?.date, formatNewsDate(stats.mtime)),
      title: toLocalizedText(metadata?.title, {
        en: titleFromStem(stem, "en"),
        tr: titleFromStem(stem, "tr"),
      }),
      body: toLocalizedText(metadata?.body, {
        en: "Published from the studio events archive.",
        tr: "Stüdyonun etkinlik arşivinden yayımlandı.",
      }),
      image: eventPath(fileName),
      alt: toLocalizedText(metadata?.alt, {
        en: `${titleFromStem(stem, "en")} announcement image`,
        tr: `${titleFromStem(stem, "tr")} duyuru görseli`,
      }),
    });
  }

  return items.reverse();
}

async function main() {
  const { artists, paintings } = await loadArtistsAndPaintings();
  const newsItems = await loadNewsItems();
  const siteConfig = {
    assetBaseUrl,
    heroImages: {
      featured: artifactPath("Mehmet Ozdemir", "resim26.png"),
      accent: artifactPath("Mahmut Sahin", "resim17.png"),
    },
  };

  const source = `const translations = ${JSON.stringify(translations, null, 2)};

const siteConfig = ${JSON.stringify(siteConfig, null, 2)};

const artists = ${JSON.stringify(artists, null, 2)};

const paintings = ${JSON.stringify(paintings, null, 2)};

const newsItems = ${JSON.stringify(newsItems, null, 2)};

function getArtistById(id) {
  return artists.find((artist) => artist.id === id);
}

function getPaintingsByArtistId(artistId) {
  return paintings.filter((painting) => painting.artistId === artistId);
}

function getArtistUrl(artistId, language) {
  return \`./artist.html?id=\${encodeURIComponent(artistId)}&lang=\${encodeURIComponent(language)}\`;
}
`;

  await fs.writeFile(outputPath, source, "utf8");
  process.stdout.write(
    `Generated ${path.relative(rootDir, outputPath)} from artifacts/${artistsFolderName} and artifacts/${eventsFolderName}${assetBaseUrl ? ` using ASSET_BASE_URL=${assetBaseUrl}` : ""}\\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
