import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const artifactsDir = path.join(rootDir, "artifacts");
const outputPath = path.join(rootDir, "gallery-data.js");
const artistsFolderName = "artists";
const newsEventsFolderName = "News Events";
const nonArtistFolders = new Set(["misc", newsEventsFolderName]);
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
    portrait: artistAssetPath("mahmutsahin.jpg"),
    biography: {
      en: "Mahmut Şahin was born on August 1, 1962, in the Mucur district of Kırşehir. After completing his primary, middle, and high school education in Mucur, he entered the Turkish Military Academy in 1979 and graduated as an infantry lieutenant in 1983. He served in various posts within the Land Forces before retiring by his own request in 2003.\n\nFollowing his retirement, he founded his own companies in the construction and insurance sectors and remained actively involved in business life until the pandemic. With the onset of the pandemic, he stepped away from business life and devoted himself to painting, an interest that had begun as a hobby, making significant progress in the field. He continues to paint actively today.\n\nMahmut Şahin is married and the father of two children, a daughter and a son.",
      tr: "Mahmut Şahin, 01.08.1962 tarihinde Kırşehir'in Mucur ilçesinde dünyaya gelmiştir. İlk, orta ve lise öğrenimini Mucur'da tamamladıktan sonra 1979 yılında Kara Harp Okulu'na girmiş ve 1983 yılında Piyade Teğmen olarak mezun olmuştur. Kara Kuvvetleri bünyesinde çeşitli görevlerde bulunmuş, 2003 yılında ise kendi isteğiyle emekliye ayrılmıştır.\n\nEmekliliğinin ardından inşaat ve sigorta alanlarında faaliyet göstermek üzere kendi şirketlerini kurmuş ve pandemi dönemine kadar aktif olarak iş hayatının içinde yer almıştır. Pandemiyle birlikte iş yaşamını sonlandırarak başlangıçta hobi olarak başladığı resim çalışmalarına ağırlık vermiş, bu alanda önemli ilerleme kaydetmiştir. Hâlen aktif olarak resim yapmaya devam etmektedir.\n\nEvli olan Mahmut Şahin, bir kız ve bir erkek olmak üzere iki çocuk babasıdır.",
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

function findEndOfCentralDirectory(buffer) {
  const eocdSignature = 0x06054b50;
  for (let offset = buffer.length - 22; offset >= 0; offset--) {
    if (buffer.readUInt32LE(offset) === eocdSignature) {
      return offset;
    }
  }
  throw new Error("Not a valid zip file: end of central directory not found");
}

function readZipEntry(buffer, entryName) {
  const eocdOffset = findEndOfCentralDirectory(buffer);
  const centralDirOffset = buffer.readUInt32LE(eocdOffset + 16);
  const centralDirCount = buffer.readUInt16LE(eocdOffset + 10);

  let offset = centralDirOffset;
  for (let i = 0; i < centralDirCount; i++) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error("Not a valid zip file: bad central directory entry");
    }
    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraFieldLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const fileName = buffer.toString("utf8", offset + 46, offset + 46 + fileNameLength);

    if (fileName === entryName) {
      return extractLocalFileData(buffer, localHeaderOffset, compressionMethod, compressedSize);
    }

    offset += 46 + fileNameLength + extraFieldLength + commentLength;
  }

  return null;
}

function extractLocalFileData(buffer, localHeaderOffset, compressionMethod, compressedSize) {
  if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
    throw new Error("Not a valid zip file: bad local file header");
  }
  const fileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
  const extraFieldLength = buffer.readUInt16LE(localHeaderOffset + 28);
  const dataStart = localHeaderOffset + 30 + fileNameLength + extraFieldLength;
  const compressedData = buffer.subarray(dataStart, dataStart + compressedSize);

  if (compressionMethod === 0) return compressedData;
  if (compressionMethod === 8) return zlib.inflateRawSync(compressedData);
  throw new Error(`Unsupported zip compression method: ${compressionMethod}`);
}

function extractDocxText(buffer) {
  const xmlBuffer = readZipEntry(buffer, "word/document.xml");
  if (!xmlBuffer) return "";

  const xml = xmlBuffer.toString("utf8");
  return xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

const docxFieldPattern =
  /(Artist(?:['’]s Note)?|Title|Painting Technique|Dimensions|Availability|Price|Category|Description):/;

function parsePaintingDocx(buffer) {
  const text = extractDocxText(buffer);
  const parts = text.split(docxFieldPattern);
  const fields = {};

  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i].trim();
    const value = (parts[i + 1] ?? "").replace(/\n{3,}/g, "\n\n").trim();
    fields[key] = value;
  }

  return fields;
}

function normalizeDimensions(value) {
  const match = value?.match(/(\d+)\s*cm\s*[xX]\s*(\d+)\s*cm/);
  return match ? `${match[1]} x ${match[2]} cm` : value?.trim() || null;
}

const techniqueTranslations = {
  "Oil Painting": "Yağlı Boya",
};

function translateTechnique(technique) {
  if (!technique) return null;
  const tr = techniqueTranslations[technique];
  if (!tr) {
    console.warn(
      `No Turkish translation known for painting technique "${technique}" — add one to techniqueTranslations.`
    );
  }
  return { en: technique, tr: tr ?? technique };
}

function normalizeStem(stem) {
  return stem.trim().toLowerCase().replace(/\s+/g, " ");
}

function alnumOnly(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Manual Turkish translations of painting descriptions (English text is auto-extracted
// from matching .docx files at generation time; see parsePaintingDocx). Keyed by artist
// folder and normalizeStem(filename-without-extension). Add an entry here whenever a new
// painting docx is added, until the description has been translated.
const paintingDescriptionTranslations = {
  "Mahmut Sahin": {
    "a morning that asked nothing": "Hiçbir şey talep etmeyen sabahlar vardır. Sadece gelirler — yumuşak ve parıltılı — ve tek istedikleri, fark edecek kadar orada olmanızdır. Bu da onlardan biri.\n\nİki kayık, neredeyse ikinci bir gökyüzüne dönüşmüş dupduru bir suyun üzerinde dinleniyor; okra rengi duvarları ve koyu selvi kulelerini bozulması neredeyse imkânsız bir yansımada tutuyor. Pruvalardan birinin üzerinde katlanmış bir bez duruyor — geri dönecek, ya da belki dönmeyecek ve bununla da barışmış birinin bıraktığı. İskeledeki yelkenli sessizce duruyor, direği aceleci olmayan bulutlarla dolu bir gökyüzüne uzanıyor.\n\nHer şeyin arkasında köy, yüzyıllardır bunu sürdüren ve durmak için hiçbir sebep görmeyen bir Akdeniz sabahının sıcak altınında parlıyor. Kapalı panjurlar. Kiremit çatılar. Çatı hattının üzerinde kollarını açmış, sanki bütün dünyaya gölge sunan bir çam ağacı.\n\nSu neredeyse hiç kımıldamıyor. Kayıklar yerinde duruyor. Işık tam olması gereken yere düşüyor. Bazı sabahlar hiçbir şey istemeden size her şeyi verir.\n\nBu tablo, İzlenimci gözlem ile Dışavurumcu özgürlüğün dengeli bir buluşması — akademik disiplin hiç kaybolmuyor, ama fırça da özgürlüğünden asla vazgeçmiyor.",
    "a storm she chose to wear": "Çoğu insan fırtınalardan kaçar. O ise bir tanesini başına doladı ve buna aksesuar dedi.\n\nKobalt, kırmızı, zümrüt, altın — renkler, başlığının içinde tam bir fırtına gibi kükrüyor ve kıvrılıyor; omuzlarına dökülüyor, çevresindeki havada eriyor. Ama yüzü tümüyle, neredeyse meydan okurcasına sakin kalıyor. Bütün o güzel kaosun tam ortasında sabit bir nokta.\n\nBu, yoğunluğa yalnızca katlanan değil, onunla süslenen bir kadın. Alnındaki mücevherli süs, ateş gibi parlayan tavus kuşu küpe, aynı anda hem zırh hem kutlama gibi taşınan renk katmanları — hiçbiri tesadüf değil, her biri bir seçim.\n\nİzleyicinin ötesine, çoktan kim olduğuna karar vermiş birinin o kendine has bakışıyla bakıyor. Ressam bize fırtınayı veriyor. O ise bize fırtınanın içindeki dinginliği veriyor.",
    "a turkish summer in two acts": "Çay ve karpuz. Bir Türk yaz öğleden sonrasının bundan daha dürüst bir portresi henüz resmedilmedi.\n\nÇaydanlık sahneye sessiz bir otoriteyle hükmediyor — altın yaldızlı, koyu kobalt mavisi, yuvarlak ve kendinden memnun; kendi öneminin farkında olan bir nesnenin gururuyla parlıyor. Etrafında, karpuz dilimleri adaklar gibi saçılmış; kızıl özleri neredeyse duyulur derecede soğuk, sıcaktan kurtuluş vaadiyle neredeyse damlıyor.\n\nBu bir natürmort, evet — ama hiçbir şeyi durgun hissettirmiyor. Az önce toplanmış bir masanın, geri dönecek ellerin, sadece duraklamış bir sohbetin izleri var. Çay sıcak. Karpuz soğuk. Yakınlarda birileri, öğleden sonraları hakkında oldukça isabetli kararlar almış.\n\nBasit, parıltılı ve temmuzda bir bahçede oturup, söylemeye gerek duymadan bunun yeterli olduğunu anlamış herkese derinden tanıdık.",
    "born from light": "Güneş bu atın arkasında doğmuyor. Patlıyor — sahneyi bir kutsama gibi taçlandıran, göklerin bu varışı ilan ettiğini düşündüren, ham bir altın patlaması.\n\nBeyaz at, mutlak bir kararlılıkla nehirden geçiyor. Toynaklarının etrafında su, köpük köpük fışkırıyor; yelesi, kendine has bir rüzgârda yakalanmış eğrilmiş ipek gibi dalgalanıyor. Kıyı boyunca kır çiçekleri. Orman nefesini tutmuş. Bu tablodaki her şey, bu tek muhteşem anı çerçevelemek için var.\n\nBurada mitik bir şey var — hayvandan çok simge, attan çok ete kemiğe bürünüp koşmaya başlamış saf bir özgürlük ve zarafet fikri.\n\nTeknik olarak atın postu, tonal karmaşıklıkta bir ustalık dersi — asla sadece beyaz değil, hayvana gerçek bir hacim kazandıran sıcak kremler ve soğuk grilerden oluşan canlı bir yüzey. Bu tablo bir gerçekçinin kesinliğiyle görüyor, bir şairin coşkusuyla hissediyor. Burada ise sadece koşuyor.",
    "fractured, not broken": "Yüz kaostan doğuyor — ve onun içinde kaybolmayı reddediyor. Yatay şeritler tuvali bir parazit gibi, hafızanın bir insanı bize bazen parça parça, sırasız ve hiçbir zaman tam olarak bütün geri getirdiği o dağınık biçim gibi kesiyor. Ama bütün bunların içinde, o gözler direniyor. Canlı, buz mavisi, tamamen orada.\n\nBu, baskı altındaki bir kimliğin portresi. Kesintiye uğratmakta, parçalara ayırmakta, kategorize etmekte ısrar eden bir dünyanın gürültüsü içinde direnen bir benliğin portresi. Soyut müdahaleler onu gizlemiyor. Onun bağlamı, tarihi, iklimi haline geliyor.\n\nTeknik olarak bu eser, ressamın pratiğinde cesur bir kopuşu işaret ediyor — figüratif gerçekçilikteki ustalığı ile soyutlamanın diliyle bilinçli bir çarpışma. Bu, Mahmut Şahin'in yeni bir bölgeye adım atışı — ve tüm gücüyle varışı.",
    "no reason to leave": "Yukarıda gökyüzü kendini topluyor — derinleşen mor-mavi bir zeminde kabaran devasa bulutlar, henüz gelmeye tam karar vermemiş bir yaz fırtınasının o kendine has gerilimini taşıyor. Aşağıda ise dünya, ışıkla yıkanmış uzak tepelere doğru tembel tembel uzanan nehirle birlikte, parlak yeşil ve deniz mavisi tonlarında nefesini tutuyor.\n\nAhşap bir kürek kayığı yarı kıyıda duruyor, halatı suya doğru sürükleniyor; sanki onu son kullanan kişi ayrılmayı bitirmeyi unutmuş gibi. Kalan ışığı yakalayan beyaz kabuklu bir huş ağacının yanında, dayanıklı olmak için inşa edilmiş bir şeyin sağlam huzuruyla bir kütük kulübe duruyor.\n\nTeknik olarak ressam, tuvale kendinden emin, katmanlı fırça darbeleriyle hükmediyor — bulutlar, onlara gerçek bir hacim ve dram kazandıran kalın, heykelsi bir empasto ile inşa edilirken, nehir yüzeyi yansıyan ışıkla parıldayan pürüzsüz, akışkan darbelerle işleniyor. Bu tablo bir gerçekçinin kesinliğiyle görüyor, bir şairin coşkusuyla hissediyor.",
    "porcelain dreams": "İlk bakışta yalnızca bir sürahi ve birkaç kiraz. Daha uzun bakınca, tamamen başka bir şeye dönüşüyor.\n\nPorselen sürahi, kompozisyondan neredeyse mimari bir zarafetle yükseliyor — ince boynu kıvrımlı Art Nouveau süslemeleriyle bezeli, yuvarlak gövdesi narin turuncu çiçekler ve yeşil yapraklarla resmedilmiş. Tabanının etrafında, tam olgunlaşmış şeylerin derin, cilalı kırmızısıyla parlayan bolca kiraz saçılmış.\n\nHer şeyin arkasında, fon görmezden gelinmeyi reddediyor. Deniz mavisi, mor, kehribar ve sarı, gevşek, atmosferik fırça darbeleriyle çarpışıyor — ne bir duvar, ne bir gökyüzü, sadece bir ruh hali.\n\nTeknik olarak ressam, çarpıcı bir yaklaşım karşıtlığı sergiliyor. Kiraz'lar neredeyse dokunsal bir gerçekçilikle işlenirken, fon enerjiyle nabız gibi atan cesur, özgür bir empasto ile resmedilmiş. Bu tablo bir gerçekçinin kesinliğiyle görüyor, bir şairin coşkusuyla hissediyor.",
    "sovereign": "Bakılmayı istemiyor. Sadece var oluyor — ve bakmak kaçınılmaz hâle geliyor. Bakışı doğrudan, aceleci olmayan ve tümüyle özürsüz. Şekillendirilmiş kaşların altındaki koyu gözler, kim olduğu sorusunu çoktan çözmüş birinin sakin otoritesiyle izleyiciyi tutuyor.\n\nÇevresinde dünya, sıcak kehribar ve gül altını tonlarında çiçek açıyor; dışarıdan düşmek yerine içeriden ışıldıyormuş gibi görünen parıltılı bir fon. Bu sıcaklığa karşı, sarılı başlığının lavanta ve moru, çıplak bir omzunun üzerinden dramatik biçimde dökülüyor.\n\nBu, artık kanıtlayacak hiçbir şeyi kalmamış ve bunun farkında olan bir kadının o kendine has güzelliği üzerine bir tablo. Işık kaynağı önden ve hafifçe yukarıdan geliyor, yüzü kesinlikle şekillendirirken fon bağımsız biçimde parlıyor — portreyi gerçekçiliğin ötesine, ikonaya yaklaşan bir şeye taşıyan parıltılı bir hale etkisi yaratıyor.",
    "stillness as a form of power": "Öne eğilmiyor. Uzanmıyor. Sadece oturuyor — ve dünya kendini onun etrafında yeniden düzenliyor. Elleri alışkanlıkla kolay bir biçimde kavuşturulmuş, bakışı sabit ve hiçbir şey ele vermeyen; koltuğunu bir kraliçenin tahtını işgal ettiği gibi işgal ediyor: güçle değil, yerinin mutlak kesinliğiyle.\n\nArkasında rotonda bir bildiri gibi duruyor. Bahçe tam çiçek açmış hâlde parlıyor. Çok ötede ise deniz ufukta nefesini tutuyor, sabırla, o hazır olduğunda fark edilmeyi bekliyor.\n\nElbisesi kendi başına bir dünya — kucağına dökülen, kadınla bahçe arasındaki sınırı bulanıklaştıran, boyanmış çiçeklerden bir çayır.\n\nBu, sakinlikte yaşayan güç üzerine bir portre — kendini ilan etmeyen, kendini açıklamayan ve kendisi için asla özür dilemeyen türden bir güç.",
    "the book can wait": "Kitap açık ama unutulmuş duruyor. Çenesi eline yaslanmış, bakışı çerçevenin ötesinde bir yere sürükleniyor. Hayal kurmuyor. Düşünüyor. Aralarında bir fark var ve ressam bunu biliyor.\n\nKırmızı şapka, koyu saçlarının üzerinde küçük bir ateş gibi parlıyor — cesur, özürsüz, fikirleri olan bir kadının seçimi. Kırmızı güller, ne zaman duracağını bilmeyen bir bahçenin cömert bolluğuyla çerçevenin solunu dolduruyor.\n\nTeknik olarak tablo, kesinlik ile özgürlük arasında kendinden emin bir akıcılıkla hareket ediyor. Yüz, pürüzsüz ve parıltılı fırça darbeleriyle işlenmiş; etrafında ressam muhteşem biçimde gevşiyor — şapka, kırmızı, turuncu ve altının cesur, mozaik benzeri darbelerinden inşa edilmiş. Bu tablo bir gerçekçinin kesinliğiyle görüyor, bir şairin coşkusuyla hissediyor.",
    "the city that burns on water": "Yüzüyor. Parlıyor. Çok uzun süredir güzel olduğu için artık bunun farkında bile olmayan bir kentin altın ateşiyle yanıyor. Tuvalin kalbinde, muhteşem bir cami sudan yarı hatırlanan bir görüntü gibi yükseliyor — kubbeler mor renkte taçlanmış, minareler her türlü sükunet iddiasından vazgeçmiş bir gökyüzüne uzanıyor.\n\nGeri kalan her yerde — gökyüzünde, suda, gölgede — ressam yeni bir şeyi serbest bırakıyor. Deniz mavisi ve koyu morun cesur, süpürücü darbeleri, zapt edilmesi güç bir enerjiyle çerçeveyi kaplıyor.\n\nTeknik olarak bu eser, ressamın 2026 üretiminde görülen evrimi sürdürüyor — figüratifin duygusal çıpasından vazgeçmeden soyutlamaya korkusuzca açılım. Bu, Mahmut Şahin'in en özgür ve en parıltılı hâli.",
    "the company of simple objects": "Üç nesne. Bir raf. Ve bir şekilde, ihtiyacınız olan her şey. Mavi seramik bir fincan, her sabah kullanılan bir şeyin rahat özgüveniyle duruyor. Arkasında, koyu yeşil bir vazo sessiz bir zarafetle yükseliyor. Sağda, altın rengi bir armut hafifçe eğilmiş, kabuğu öğleden sonranın sıcak kehribarıyla parlıyor.\n\nOlağanüstü hiçbir şey yok. Yine de ressam bu üç mütevazı nesneyi öyle bir özenle düzenlemiş ve öyle bir adanmışlıkla aydınlatmış ki, gözünüzü ayırmanız imkânsız hâle geliyor.\n\nTeknik olarak bu, görme sanatı üzerine bir çalışma. Gölgeler uzun ve amaçlı, her nesneyi rafa sağlamca bağlıyor ve kompozisyona büyük Avrupa natürmort geleneğini anımsatan zamansız, atölye kalitesinde bir hava kazandırıyor.",
    "the moment before she disappears": "Dans etmiyor. Dönüşüyor. Figür, soğuk mor-mavi bir gökyüzünde sıçrıyor, kolları iki yana açılmış, saçları dağınık; bedeni insan formunun saf harekete teslim olduğu tam o ana yakalanmış. Belinden aşağısı eriyor — teni dökülen ateşe yerini bırakıyor, kızıl ve altın bir kuyrukluyıldızın kuyruğu gibi arkasında akıyor.\n\nO yarı kadın, yarı alev. Ve muhteşem. Bu, her şeyi vermenin bedeli ve zaferi üzerine bir tablo.\n\nTeknik olarak bu eser, Mahmut Şahin'i en cesur, en deneysel hâliyle temsil ediyor. Üst gövde narin, neredeyse klasik bir kesinlikle işlenmiş; ardından, nefes kesici tek bir geçişte fırça formdan tamamen vazgeçiyor.",
    "the ships and the soul": "Sıvı altından bir gölün içinde tek başına yürüyor; arkasında kent kehribar rengiyle parlıyor, solunda uzun gemiler mavi bir gölgede dinleniyor. Adı yok. İhtiyacı da yok. O, geceleyin bir suyun kıyısında durmuş ve aynı anda hem çok küçük hem çok canlı hissetmiş herkes.\n\nSolda soğuk mavi. Sağda yanan kehribar. Yalnız figür, tam olarak ikisinin arasındaki sınırda duruyor.\n\nTeknik olarak bu eser, ressamın fırçanın yanı sıra palet bıçağındaki ustalığını sergiliyor. Sağdaki şehir binaları, cesur, kübist esintili empasto bloklarından inşa edilmiş — pencereleri ve cepheleri tarif etmeden çağrıştıran kalın, mimari darbeler.",
    "the weight of simple things": "Onların yanından her gün aceleyle geçiyoruz — raftaki bir testi, bir kâse üzüm, hafifçe elin uzağına yuvarlanmış bir elma, masanın kendi köşesini seçmiş bir erik. Durmuyoruz. Bakmıyoruz.\n\nRessam durdu. Ressam baktı. Ve bakarken, Hollandalı ustaların üç yüzyıl önce bildiği ve bizim sürekli unuttuğumuz şeyi buldu: sıradan olan, gerçekten görüldüğünde neredeyse dayanılmaz bir güzellik taşır.\n\nBu, dikkat üzerine bir tablo. Her gün elimizi uzattığımız şeylerin — meyve, kap, ahşap bir masanın sessiz köşesi — izin verirsek yeterli olduğunu fark edecek kadar durabilmenin radikal eylemi üzerine.",
    "the whole summer in one laugh": "Başını geriye atmış, ağzı ardına kadar açık, üzümler tepesinde küçük, özel bir mucize gibi sallanıyor. O ise yukarıda, yalınayak ve sırıtarak oturuyor, bunun ne kadar komik olduğunu tam olarak bilen birinin keyfiyle onu izliyor.\n\nBu, çocukluğun en savunmasız hâli — iki çocuk, biraz çalıntı meyve ve başka hiçbir şeye ihtiyaç duymayan tam bir mutluluk.\n\nRessam bu sahneyi Barok ustaların geleneğine sağlamca yerleştiriyor. Derin, kadifemsi bir karanlık fonu yutuyor; öyle ki figürler sanki tek bir mumla aydınlatılmış gibi gölgeden ortaya çıkıyor — Caravaggio'nun hayaleti burada hazır.",
    "toward the burning horizon": "Bu tabloda güneş batmıyor — patlıyor. Bütün gökyüzü alev alev, turuncu ve altın kenarlarda mora eriyor; sanki dünyanın kendisi yavaş ve muhteşem bir ateşle tüketiliyor.\n\nBütün bunların içinden gemi ileri doğru ilerliyor. Rüzgârla şişmiş yelkenler — kobalt, kızıl, beyaz — günün son ışığını yakalayıp gökyüzüne geri fırlatıyor. Gövde, pruvada beyaz köpüren karanlık, çalkantılı dalgaların içinden kesip geçiyor.\n\nOrtada liman yok. Belirtilmiş bir varış noktası yok. Sadece açık deniz, yanan gökyüzü ve ileri gitmenin bilinmeye değer tek yön olduğuna açıkça karar vermiş bir tekne.",
    "two wild things that found each other": "Birlikte sana bakıyorlar — ve birlikte, etkileyicilar. Kadın, dizgini kontrolden değil güvenden söz eden bir elle tutuyor. Koyu gözleri düz, kırpılmadan; toprağa yakın yaşamış ve kim olduğunu tam olarak bilen birinin sessiz yoğunluğunu taşıyor. Yanındaki at da aynı ölçüde sakin, aynı ölçüde tetikte.\n\nSiyah saçlar kızıl işlemeli kumaşın üzerine dökülüyor. Arkalarında çam ormanı ve açık gökyüzü — herkesten çok onlara ait bir dünya.\n\nBu, aidiyet üzerine bir portre. Birbirlerine değil, daha büyük bir şeye — toprağa, içgüdüye, özür dilemeden yaşanan bir hayatın acelesiz ritmine aidiyet.",
    "walked through the rain": "Yağmur yağdı ve sokak bir aynaya dönüştü — kehribar, mor, altın — her lamba ışığı ıslak arnavut kaldırımlarında ikiye katlanmış, ıslanmış olmaktan dolayı bütün dünya birden daha güzel.\n\nGül rengi şemsiyesiyle geceye sahipmiş gibi yürüyor. Aceleci değil. Rahatsız olmamış. İlerideki bir yerde, yalnız bir figür bir kapı eşiğinde duruyor, sıcak ışıkla yarı yarıya yutulmuş; belki bekliyor, belki sadece yağmurun yağışını izliyor.\n\nRessam bu sahneyi saf duygudan inşa etmiş — ışığı neredeyse yenilebilir, karanlığı neredeyse şefkatli kılan kalın, dışavurumcu darbeler. Bu, yağmur üzerine bir tablo değil. Yağmurun içinden yürümenin tuhaf sevinci üzerine bir tablo."
  },
  "Mehmet Ozdemir": {
    "echoes beneath the stone arch": "Taş Kemerin Altındaki Yankılar, Hatay'ın tarihi mahallelerini bir zamanlar tanımlayan sıcaklığı, karakteri ve kültürel zenginliği yakalayan, kentin zamansız sokaklarına bir saygı duruşudur. Kadim bir taş kemerle çerçevelenen sahne, izleyiciyi altın güneş ışığıyla yıkanmış sessiz bir sokağa davet eder. Canlı turuncu cepheler, aşınmış taş duvarlar ve geleneksel mimari, Hatay'ı Türkiye'nin en değerli kültürel hazinelerinden biri yapan eşsiz kimliği yansıtır.\n\n2023 Hatay depreminde yıkıma uğrayan sokakların anısına resmedilen eser, sıradan bir geçidi hafıza ve dirençlilik simgesine dönüştürür. Yumuşak ışıkla aydınlanan boş sokak, bir yokluk içinde varlık hissi uyandırır — bir zamanlar bu mekânları dolduran yaşamların, sohbetlerin ve geleneklerin bir yankısı.\n\nBir mimari tasvirin ötesinde, bu tablo bir kentin mirasına görsel bir anıt niteliği taşır. Hatay'ın yılmaz ruhunu onurlandırır ve artık ayakta olmayabilecek ama kolektif hafızada yaşamaya devam eden sokakların güzelliğini sanat yoluyla korur."
  }
};

// Manual Turkish translations of painting titles, keyed by artist folder and
// normalizeStem(filename-without-extension). Titles come from image filenames, which are
// always in English, so there's no source text to auto-derive a Turkish title from — add an
// entry here whenever a new painting image is added, or the English filename is used as-is.
const titleTranslations = {
  "Mahmut Sahin": {
    "a morning that asked nothing": "Hiçbir Şey İstemeyen Bir Sabah",
    "a storm she chose to wear": "Giymeyi Seçtiği Bir Fırtına",
    "a turkish summer in two acts": "İki Perdede Bir Türk Yazı",
    "born from light": "Işıktan Doğan",
    "fractured, not broken": "Kırılmış, Ama Kırık Değil",
    "no reason to leave": "Ayrılmak İçin Hiçbir Sebep Yok",
    "porcelain dreams": "Porselen Düşler",
    sovereign: "Hükümdar",
    "stillness as a form of power": "Güç Biçimi Olarak Durgunluk",
    "the book can wait": "Kitap Bekleyebilir",
    "the city that burns on water": "Suyun Üzerinde Yanan Şehir",
    "the company of simple objects": "Sade Nesnelerin Eşliği",
    "the moment before she disappears": "Kaybolmadan Önceki An",
    "the ships and the soul": "Gemiler ve Ruh",
    "the weight of simple things": "Sade Şeylerin Ağırlığı",
    "the whole summer in one laugh": "Bir Kahkahada Bütün Bir Yaz",
    "toward the burning horizon": "Yanan Ufka Doğru",
    "two wild things that found each other": "Birbirini Bulan İki Vahşi Şey",
    "walked through the rain": "Yağmurun İçinden Yürüdü",
  },
  "Mehmet Ozdemir": {
    "alpine stream": "Alp Deresi",
    "anatolian summer": "Anadolu Yazı",
    "autumn’s gift": "Sonbaharın Armağanı",
    "autumn's gift": "Sonbaharın Armağanı",
    "beyond the white horizon i. the first passage": "Beyaz Ufkun Ötesinde I. İlk Geçiş",
    "beyond the white horizon ii. the call of wings": "Beyaz Ufkun Ötesinde II. Kanatların Çağrısı",
    "beyond the white horizon iii. the keeper of winter": "Beyaz Ufkun Ötesinde III. Kışın Bekçisi",
    "beyond the white horizon iv. across the frozen plain": "Beyaz Ufkun Ötesinde IV. Donmuş Ovanın Öte Yakası",
    "beyond the white horizon v. the shepherd’s return": "Beyaz Ufkun Ötesinde V. Çobanın Dönüşü",
    "beyond the white horizon v. the shepherd's return": "Beyaz Ufkun Ötesinde V. Çobanın Dönüşü",
    "beyond the white horizon vi. horse’s winter": "Beyaz Ufkun Ötesinde VI. Atın Kışı",
    "beyond the white horizon vi. horse's winter": "Beyaz Ufkun Ötesinde VI. Atın Kışı",
    "crimson rhythm": "Kızıl Ritim",
    "dance of the wind": "Rüzgârın Dansı",
    "daughter of the vine": "Asmanın Kızı",
    "echoes beneath the stone arch": "Taş Kemerin Altındaki Yankılar",
    "grain market at the foot of the minaret": "Minarenin Dibindeki Tahıl Pazarı",
    "guardians of the mountain light": "Dağ Işığının Bekçileri",
    "keeper of forgotten cities": "Unutulmuş Şehirlerin Bekçisi",
    "keeper of forgotten cities photo 2": "Unutulmuş Şehirlerin Bekçisi - Fotoğraf 2",
    "keeper of forgotten cities video": "Unutulmuş Şehirlerin Bekçisi - Video",
    "midnight majesty": "Gece Yarısı Haşmeti",
    "morning bloom": "Sabah Çiçeği",
    "silent reverie": "Sessiz Hayal",
    "sovereign grace": "Hükümdar Zarafeti",
    "ten thousand times": "On Bin Kez",
    "the bosphorus never tires of being beautiful": "Boğaz Güzel Olmaktan Hiç Yorulmaz",
    "the faithful": "Sadık Olan",
    "the gleaners – a faithful reproduction of a timeless masterpiece": "Başak Toplayıcılar – Zamansız Bir Başyapıtın Sadık Bir Yeniden Üretimi",
    "the gleaners - a faithful reproduction of a timeless masterpiece": "Başak Toplayıcılar – Zamansız Bir Başyapıtın Sadık Bir Yeniden Üretimi",
    "the gleaners – a faithful reproduction of a timeless masterpiece 2": "Başak Toplayıcılar – Zamansız Bir Başyapıtın Sadık Bir Yeniden Üretimi 2",
    "the gleaners - a faithful reproduction of a timeless masterpiece 2": "Başak Toplayıcılar – Zamansız Bir Başyapıtın Sadık Bir Yeniden Üretimi 2",
    "the many lives of her i. the keeper of memories": "Onun Pek Çok Hayatı I. Anıların Bekçisi",
    "the many lives of her ii. whispers of antiquity": "Onun Pek Çok Hayatı II. Antik Çağın Fısıltıları",
    "the many lives of her iii. daughter of the mediterranean": "Onun Pek Çok Hayatı III. Akdeniz'in Kızı",
    "the many lives of her iv. the crimson blossom": "Onun Pek Çok Hayatı IV. Kızıl Çiçek",
    "the many lives of her v. inner garden": "Onun Pek Çok Hayatı V. İç Bahçe",
    "the market at first light": "İlk Işıkta Pazar",
    "the poppies blaze": "Gelincikler Alev Alev",
    "the quiet morning": "Sessiz Sabah",
    "the scooter and the century": "Skuter ve Yüzyıl",
    "these cobblestones": "Bu Arnavut Kaldırımları",
    "the stone lane": "Taş Sokak",
    "the tortoise trainer – a masterful reproduction of an ottoman icon": "Kaplumbağa Terbiyecisi – Bir Osmanlı İkonunun Ustaca Yeniden Üretimi",
    "the tortoise trainer - a masterful reproduction of an ottoman icon": "Kaplumbağa Terbiyecisi – Bir Osmanlı İkonunun Ustaca Yeniden Üretimi",
    "trinity of freedom": "Özgürlüğün Üçlemesi",
    "under the same sky": "Aynı Gökyüzü Altında",
    "untamed harmony in freedom river": "Özgürlük Nehri'nde Evcilleşmemiş Uyum",
    "vanished street": "Kaybolan Sokak",
    "velvet thunder": "Kadife Gürleme",
    "where fire becomes art": "Ateşin Sanata Dönüştüğü Yer",
    "where the palm still remembers - the last summer of old hatay": "Palmiyenin Hâlâ Hatırladığı Yer - Eski Hatay'ın Son Yazı",
    "where the river bends to let them pass": "Nehrin Onları Geçirmek İçin Kıvrıldığı Yer",
    "woman of the golden threshold": "Altın Eşiğin Kadını",
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
  return joinAssetPath(artistsFolderName, newsEventsFolderName, fileName);
}

function joinAssetPath(...segments) {
  const encodedPath = segments.map((segment) => encodeURIComponent(segment)).join("/");

  if (assetBaseUrl) {
    return `${assetBaseUrl}/${encodedPath}`;
  }

  return `./artifacts/${encodedPath}`;
}

function withAssetVersion(assetUrl, versionTag) {
  if (!versionTag) {
    return assetUrl;
  }

  const separator = assetUrl.includes("?") ? "&" : "?";
  return `${assetUrl}${separator}v=${encodeURIComponent(versionTag)}`;
}

function assetVersionTag(stats) {
  if (!stats?.mtimeMs) {
    return "";
  }

  return String(Math.trunc(stats.mtimeMs));
}

async function versionedAssetPath(filePath, ...segments) {
  const stats = await fs.stat(filePath);
  return withAssetVersion(joinAssetPath(...segments), assetVersionTag(stats));
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

function titleFromFileName(fileName, language, folderName) {
  const stem = fileName.replace(/\.[^.]+$/, "");
  const match = stem.match(/^resim(\d+)$/i);

  if (match) {
    return language === "tr" ? `Resim ${match[1]}` : `Painting ${match[1]}`;
  }

  if (language === "tr") {
    const trTitle = titleTranslations[folderName]?.[normalizeStem(stem)];
    if (trTitle) return trTitle;
    console.warn(
      `No Turkish translation available for painting title "${stem}" (${folderName}) — add one to titleTranslations. Using the English title for now.`
    );
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
  const paintingVersions = new Map();
  const portraitVersions = new Map();

  for (const folderName of folders) {
    if (nonArtistFolders.has(folderName)) continue;
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

    if (metadata.portrait) {
      const portraitFileName = path.basename(metadata.portrait);
      const portraitPath = path.join(artistsDir, portraitFileName);

      try {
        const portraitStats = await fs.stat(portraitPath);
        portraitVersions.set(metadata.id, assetVersionTag(portraitStats));
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }
    }

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
        .filter((name) => {
          const stem = name.replace(/\.[^.]+$/, "");
          const isPortraitFile = alnumOnly(stem) === alnumOnly(folderName);
          if (isPortraitFile) {
            console.warn(`Excluding "${name}" from paintings in "${folderName}" — matches the artist portrait filename.`);
          }
          return !isPortraitFile;
        })
    );

    const docxByNormalizedStem = new Map();
    for (const entry of fileEntries) {
      if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".docx") continue;
      const stem = entry.name.replace(/\.[^.]+$/, "");
      const key = normalizeStem(stem);
      if (docxByNormalizedStem.has(key)) {
        console.warn(
          `Multiple .docx files match "${stem}" in "${folderName}" — using "${docxByNormalizedStem.get(key)}", ignoring "${entry.name}".`
        );
        continue;
      }
      docxByNormalizedStem.set(key, entry.name);
    }

    for (const [index, fileName] of files.entries()) {
      const fileStats = await fs.stat(path.join(artistsDir, folderName, fileName));
      const paintingId = `${metadata.id}-${String(index + 1).padStart(2, "0")}`;
      paintingVersions.set(paintingId, assetVersionTag(fileStats));

      const fileStem = fileName.replace(/\.[^.]+$/, "");
      const matchingDocxName = docxByNormalizedStem.get(normalizeStem(fileStem));

      let paintingDetails = null;
      if (matchingDocxName) {
        const docxPath = path.join(artistsDir, folderName, matchingDocxName);
        const docxStats = await fs.stat(docxPath);
        if (docxStats.size === 0) {
          console.warn(`"${matchingDocxName}" in "${folderName}" is empty — skipping.`);
        } else {
          const fields = parsePaintingDocx(await fs.readFile(docxPath));
          if (fields.Description) {
            const trOverride =
              paintingDescriptionTranslations[folderName]?.[normalizeStem(fileStem)];
            if (!trOverride) {
              console.warn(
                `No Turkish translation available for "${fileStem}" (${folderName}) — add one to paintingDescriptionTranslations. Falling back to the artist's default Turkish description for now.`
              );
            }
            paintingDetails = {
              medium: translateTechnique(fields["Painting Technique"]),
              dimensions: normalizeDimensions(fields.Dimensions),
              description: {
                en: fields.Description,
                tr: trOverride ?? metadata.description.tr,
              },
            };
          }
        }
      }

      paintings.push({
        id: paintingId,
        artistId: metadata.id,
        title: {
          en: titleFromFileName(fileName, "en", folderName),
          tr: titleFromFileName(fileName, "tr", folderName),
        },
        artist: metadata.name,
        year: "2026",
        medium: paintingDetails?.medium ?? { en: "Original artwork", tr: "Özgün eser" },
        dimensions: paintingDetails?.dimensions ?? "Details on request",
        description: paintingDetails?.description ?? metadata.description,
        image: artifactPath(folderName, fileName),
      });
    }
  }

  const versionedArtists = artists.map((artist) => ({
    ...artist,
    portrait: artist.portrait ? withAssetVersion(artist.portrait, portraitVersions.get(artist.id)) : null,
  }));

  const versionedPaintings = paintings.map((painting) => ({
    ...painting,
    image: withAssetVersion(painting.image, paintingVersions.get(painting.id)),
  }));

  return { artists: versionedArtists, paintings: versionedPaintings };
}

async function loadNewsItems() {
  const eventsDir = path.join(artifactsDir, artistsFolderName, newsEventsFolderName);

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
      image: withAssetVersion(eventPath(fileName), assetVersionTag(stats)),
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
  const mehmetPaintings = paintings.filter((p) => p.artistId === "mehmet-ozdemir");
  const mahmutPaintings = paintings.filter((p) => p.artistId === "mahmut-sahin");

  const siteConfig = {
    assetBaseUrl,
    heroImages: {
      featured: mehmetPaintings.at(-1)?.image ?? null,
      accent: mahmutPaintings.at(-1)?.image ?? null,
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
    `Generated ${path.relative(rootDir, outputPath)} from artifacts/${artistsFolderName}${assetBaseUrl ? ` using ASSET_BASE_URL=${assetBaseUrl}` : ""}\\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
