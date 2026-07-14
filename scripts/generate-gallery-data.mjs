import fs from "node:fs/promises";
import path from "node:path";

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

const oilPaintingMedium = { en: "Oil Painting", tr: "Yağlı Boya" };

const paintingMetadata = {
  "Mahmut Sahin": {
    "A Morning That Asked Nothing": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "There are mornings that make no demands. They simply arrive — soft and luminous — and ask only that you be present enough to notice. This is one of them.\n\nTwo boats rest on water so still it has become a second sky, holding the ochre walls and dark cypress spires in a reflection almost too perfect to disturb. A folded cloth lies across one bow, left there by someone who will return — or perhaps won't, and has made his peace with that too. The sailboat at the dock stands quietly, mast raised toward a sky full of unhurried clouds, in no particular rush to become a voyage.\n\nBehind it all, the village glows in the warm gold of a Mediterranean morning that has been doing this for centuries and sees no reason to stop. Shuttered windows. Terracotta rooftops. A pine tree spreading its arms above the roofline as if offering shade to the whole world.\n\nThe water barely moves. The boats stay. The light falls exactly where it wants to. Some mornings give you everything by asking nothing at all.\n\nThis painting is a balanced meeting of Impressionist observation and Expressionist freedom — academic discipline never disappears, yet the brush never surrenders its liberty.",
        tr: "Hiçbir şey talep etmeyen sabahlar vardır. Sadece gelirler — yumuşak ve parıltılı — ve tek istedikleri, fark edecek kadar orada olmanızdır. Bu da onlardan biri.\n\nİki kayık, neredeyse ikinci bir gökyüzüne dönüşmüş dupduru bir suyun üzerinde dinleniyor; okra rengi duvarları ve koyu selvi kulelerini bozulması neredeyse imkânsız bir yansımada tutuyor. Pruvalardan birinin üzerinde katlanmış bir bez duruyor — geri dönecek, ya da belki dönmeyecek ve bununla da barışmış birinin bıraktığı. İskeledeki yelkenli sessizce duruyor, direği aceleci olmayan bulutlarla dolu bir gökyüzüne uzanıyor.\n\nHer şeyin arkasında köy, yüzyıllardır bunu sürdüren ve durmak için hiçbir sebep görmeyen bir Akdeniz sabahının sıcak altınında parlıyor. Kapalı panjurlar. Kiremit çatılar. Çatı hattının üzerinde kollarını açmış, sanki bütün dünyaya gölge sunan bir çam ağacı.\n\nSu neredeyse hiç kımıldamıyor. Kayıklar yerinde duruyor. Işık tam olması gereken yere düşüyor. Bazı sabahlar hiçbir şey istemeden size her şeyi verir.\n\nBu tablo, İzlenimci gözlem ile Dışavurumcu özgürlüğün dengeli bir buluşması — akademik disiplin hiç kaybolmuyor, ama fırça da özgürlüğünden asla vazgeçmiyor.",
      },
    },
    "A Storm She Chose to Wear": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "Most people run from storms. She wrapped one around her head and called it an accessory.\n\nCobalt, crimson, emerald, gold — the colors rage and swirl through her headdress like a tempest in full fury, cascading across her shoulders, dissolving into the air around her. And yet her face remains utterly, almost defiantly, calm. A still point at the center of all that beautiful chaos.\n\nThis is a woman who does not merely endure intensity — she adorns herself with it. The jeweled ornament at her brow, the peacock earring catching fire, the layers of color worn like armor and celebration at once — nothing is accidental, everything is chosen.\n\nShe glances past the viewer with the particular look of someone who has already decided, long ago, exactly who she is. The painter gives us the storm. She gives us the stillness inside it.",
        tr: "Çoğu insan fırtınalardan kaçar. O ise bir tanesini başına doladı ve buna aksesuar dedi.\n\nKobalt, kırmızı, zümrüt, altın — renkler, başlığının içinde tam bir fırtına gibi kükrüyor ve kıvrılıyor; omuzlarına dökülüyor, çevresindeki havada eriyor. Ama yüzü tümüyle, neredeyse meydan okurcasına sakin kalıyor. Bütün o güzel kaosun tam ortasında sabit bir nokta.\n\nBu, yoğunluğa yalnızca katlanan değil, onunla süslenen bir kadın. Alnındaki mücevherli süs, ateş gibi parlayan tavus kuşu küpe, aynı anda hem zırh hem kutlama gibi taşınan renk katmanları — hiçbiri tesadüf değil, her biri bir seçim.\n\nİzleyicinin ötesine, çoktan kim olduğuna karar vermiş birinin o kendine has bakışıyla bakıyor. Ressam bize fırtınayı veriyor. O ise bize fırtınanın içindeki dinginliği veriyor.",
      },
    },
    "A Turkish Summer in Two Acts": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "Tea and watermelon. If there is a more honest portrait of a Turkish summer afternoon, it has not yet been painted.\n\nThe teapot presides over the scene with quiet authority — deep cobalt blue trimmed in gold, round and self-satisfied, glowing with the particular pride of an object that knows its own importance. Around it, slices of watermelon lay scattered like offerings, their crimson flesh almost audibly cold, almost dripping with the promise of relief from the heat.\n\nThis is a still life, yes — but nothing about it feels still. There is the suggestion of a table just cleared, of hands that will return, of a conversation that has merely paused. The tea is hot. The watermelon is cold. Someone, somewhere nearby, has made very good decisions about their afternoon.\n\nSimple, luminous, and deeply familiar to anyone who has ever sat in a garden in July and understood, without needing to say so, that this is enough.",
        tr: "Çay ve karpuz. Bir Türk yaz öğleden sonrasının bundan daha dürüst bir portresi henüz resmedilmedi.\n\nÇaydanlık sahneye sessiz bir otoriteyle hükmediyor — altın yaldızlı, koyu kobalt mavisi, yuvarlak ve kendinden memnun; kendi öneminin farkında olan bir nesnenin gururuyla parlıyor. Etrafında, karpuz dilimleri adaklar gibi saçılmış; kızıl özleri neredeyse duyulur derecede soğuk, sıcaktan kurtuluş vaadiyle neredeyse damlıyor.\n\nBu bir natürmort, evet — ama hiçbir şeyi durgun hissettirmiyor. Az önce toplanmış bir masanın, geri dönecek ellerin, sadece duraklamış bir sohbetin izleri var. Çay sıcak. Karpuz soğuk. Yakınlarda birileri, öğleden sonraları hakkında oldukça isabetli kararlar almış.\n\nBasit, parıltılı ve temmuzda bir bahçede oturup, söylemeye gerek duymadan bunun yeterli olduğunu anlamış herkese derinden tanıdık.",
      },
    },
    "Born from Light": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "The sun does not rise behind this horse. It explodes — a burst of raw gold that crowns the scene like a benediction, as if the heavens have announced this arrival.\n\nThe white horse surges through the river with absolute certainty. Water erupts around its hooves in cascading foam, mane streaming like spun silk caught in a private wind. Wildflowers line the banks. The forest holds its breath. Everything in this painting exists to frame this single, glorious moment.\n\nThere is something mythic here — less animal than symbol, less horse than pure idea of freedom and grace made flesh and set running.\n\nTechnically, the horse's coat is a masterclass in tonal complexity — never simply white, but a living surface of warm creams and cool greys that give the animal genuine volume. This painting sees with the precision of a realist and feels with the abandon of a poet. Here, it simply runs.",
        tr: "Güneş bu atın arkasında doğmuyor. Patlıyor — sahneyi bir kutsama gibi taçlandıran, göklerin bu varışı ilan ettiğini düşündüren, ham bir altın patlaması.\n\nBeyaz at, mutlak bir kararlılıkla nehirden geçiyor. Toynaklarının etrafında su, köpük köpük fışkırıyor; yelesi, kendine has bir rüzgârda yakalanmış eğrilmiş ipek gibi dalgalanıyor. Kıyı boyunca kır çiçekleri. Orman nefesini tutmuş. Bu tablodaki her şey, bu tek muhteşem anı çerçevelemek için var.\n\nBurada mitik bir şey var — hayvandan çok simge, attan çok ete kemiğe bürünüp koşmaya başlamış saf bir özgürlük ve zarafet fikri.\n\nTeknik olarak atın postu, tonal karmaşıklıkta bir ustalık dersi — asla sadece beyaz değil, hayvana gerçek bir hacim kazandıran sıcak kremler ve soğuk grilerden oluşan canlı bir yüzey. Bu tablo bir gerçekçinin kesinliğiyle görüyor, bir şairin coşkusuyla hissediyor. Burada ise sadece koşuyor.",
      },
    },
    "Fractured, Not Broken": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "The face emerges from chaos — and refuses to disappear into it. Horizontal bands slice across the canvas like interference, like the fragmented way memory sometimes returns a person to us — in pieces, out of sequence, never quite whole. And yet through all of it, those eyes hold. Vivid, ice-blue, utterly present.\n\nThis is a portrait of identity under pressure. Of a self that persists through fracture — through the noise of a world that insists on interrupting, segmenting, categorizing. The abstract intrusions do not obscure her. They become her context, her history, her weather.\n\nTechnically, this work marks a bold departure in the painter's practice — a deliberate collision between his mastery of figurative realism and the language of abstraction. This is Mahmut Şahin stepping into new territory — and arriving with full force.",
        tr: "Yüz kaostan doğuyor — ve onun içinde kaybolmayı reddediyor. Yatay şeritler tuvali bir parazit gibi, hafızanın bir insanı bize bazen parça parça, sırasız ve hiçbir zaman tam olarak bütün geri getirdiği o dağınık biçim gibi kesiyor. Ama bütün bunların içinde, o gözler direniyor. Canlı, buz mavisi, tamamen orada.\n\nBu, baskı altındaki bir kimliğin portresi. Kesintiye uğratmakta, parçalara ayırmakta, kategorize etmekte ısrar eden bir dünyanın gürültüsü içinde direnen bir benliğin portresi. Soyut müdahaleler onu gizlemiyor. Onun bağlamı, tarihi, iklimi haline geliyor.\n\nTeknik olarak bu eser, ressamın pratiğinde cesur bir kopuşu işaret ediyor — figüratif gerçekçilikteki ustalığı ile soyutlamanın diliyle bilinçli bir çarpışma. Bu, Mahmut Şahin'in yeni bir bölgeye adım atışı — ve tüm gücüyle varışı.",
      },
    },
    "No Reason to Leave": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "Above, the sky is gathering itself — great billowing clouds tumbling across a deepening violet blue, carrying the particular electricity of a summer storm that hasn't quite decided to arrive. Below, the world holds its breath in luminous green and teal, the river stretching lazily toward distant hills still bathed in light.\n\nA wooden rowboat rests half on shore, its rope trailing into the water as if the last person to use it simply forgot to finish leaving. Beside a birch tree whose white bark catches whatever light remains, a log cabin sits with the solid contentment of a thing built to last.\n\nTechnically, the painter commands the canvas with confident, layered brushwork — the clouds built up in thick, sculptural impasto that gives them genuine volume and drama, while the river surface is rendered with smooth, flowing strokes that shimmer with reflected light. This painting sees with the precision of a realist and feels with the abandon of a poet.",
        tr: "Yukarıda gökyüzü kendini topluyor — derinleşen mor-mavi bir zeminde kabaran devasa bulutlar, henüz gelmeye tam karar vermemiş bir yaz fırtınasının o kendine has gerilimini taşıyor. Aşağıda ise dünya, ışıkla yıkanmış uzak tepelere doğru tembel tembel uzanan nehirle birlikte, parlak yeşil ve deniz mavisi tonlarında nefesini tutuyor.\n\nAhşap bir kürek kayığı yarı kıyıda duruyor, halatı suya doğru sürükleniyor; sanki onu son kullanan kişi ayrılmayı bitirmeyi unutmuş gibi. Kalan ışığı yakalayan beyaz kabuklu bir huş ağacının yanında, dayanıklı olmak için inşa edilmiş bir şeyin sağlam huzuruyla bir kütük kulübe duruyor.\n\nTeknik olarak ressam, tuvale kendinden emin, katmanlı fırça darbeleriyle hükmediyor — bulutlar, onlara gerçek bir hacim ve dram kazandıran kalın, heykelsi bir empasto ile inşa edilirken, nehir yüzeyi yansıyan ışıkla parıldayan pürüzsüz, akışkan darbelerle işleniyor. Bu tablo bir gerçekçinin kesinliğiyle görüyor, bir şairin coşkusuyla hissediyor.",
      },
    },
    "Porcelain Dreams": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "At first glance, it is simply a pitcher and some cherries. Look longer, and it becomes something else entirely.\n\nThe porcelain ewer rises from the composition with an almost architectural elegance — its slender neck adorned with sinuous Art Nouveau scrollwork, its rounded belly painted with delicate orange blossoms and green leaves. Around its base, a generous scatter of cherries glows with the deep, lacquered red of things perfectly ripe.\n\nBehind it all, the background refuses to be ignored. Teal, violet, amber and yellow collide in loose, atmospheric strokes — not a wall, not a sky, but a mood.\n\nTechnically, the painter deploys a striking contrast of approaches. The cherries are rendered with almost tactile realism, while the background is painted with bold, free impasto that pulsates with energy. This painting sees with the precision of a realist and feels with the abandon of a poet.",
        tr: "İlk bakışta yalnızca bir sürahi ve birkaç kiraz. Daha uzun bakınca, tamamen başka bir şeye dönüşüyor.\n\nPorselen sürahi, kompozisyondan neredeyse mimari bir zarafetle yükseliyor — ince boynu kıvrımlı Art Nouveau süslemeleriyle bezeli, yuvarlak gövdesi narin turuncu çiçekler ve yeşil yapraklarla resmedilmiş. Tabanının etrafında, tam olgunlaşmış şeylerin derin, cilalı kırmızısıyla parlayan bolca kiraz saçılmış.\n\nHer şeyin arkasında, fon görmezden gelinmeyi reddediyor. Deniz mavisi, mor, kehribar ve sarı, gevşek, atmosferik fırça darbeleriyle çarpışıyor — ne bir duvar, ne bir gökyüzü, sadece bir ruh hali.\n\nTeknik olarak ressam, çarpıcı bir yaklaşım karşıtlığı sergiliyor. Kiraz'lar neredeyse dokunsal bir gerçekçilikle işlenirken, fon enerjiyle nabız gibi atan cesur, özgür bir empasto ile resmedilmiş. Bu tablo bir gerçekçinin kesinliğiyle görüyor, bir şairin coşkusuyla hissediyor.",
      },
    },
    Sovereign: {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "She does not ask to be looked at. She simply is — and looking becomes inevitable. The gaze is direct, unhurried, and completely without apology. Dark eyes beneath sculpted brows hold the viewer with the calm authority of someone who has long since settled the question of who she is.\n\nAround her, the world blooms in warm amber and rose gold, a luminous background that seems to radiate from within rather than fall from without. Against this warmth, the lavender and violet of her wrapped headdress cascades dramatically over one bare shoulder.\n\nThis is a painting about the particular beauty of a woman who has nothing left to prove, and knows it. The light source is frontal and slightly elevated, sculpting the face with precision while the background glows independently — creating a luminous halo effect that elevates the portrait beyond realism into something closer to icon.",
        tr: "Bakılmayı istemiyor. Sadece var oluyor — ve bakmak kaçınılmaz hâle geliyor. Bakışı doğrudan, aceleci olmayan ve tümüyle özürsüz. Şekillendirilmiş kaşların altındaki koyu gözler, kim olduğu sorusunu çoktan çözmüş birinin sakin otoritesiyle izleyiciyi tutuyor.\n\nÇevresinde dünya, sıcak kehribar ve gül altını tonlarında çiçek açıyor; dışarıdan düşmek yerine içeriden ışıldıyormuş gibi görünen parıltılı bir fon. Bu sıcaklığa karşı, sarılı başlığının lavanta ve moru, çıplak bir omzunun üzerinden dramatik biçimde dökülüyor.\n\nBu, artık kanıtlayacak hiçbir şeyi kalmamış ve bunun farkında olan bir kadının o kendine has güzelliği üzerine bir tablo. Işık kaynağı önden ve hafifçe yukarıdan geliyor, yüzü kesinlikle şekillendirirken fon bağımsız biçimde parlıyor — portreyi gerçekçiliğin ötesine, ikonaya yaklaşan bir şeye taşıyan parıltılı bir hale etkisi yaratıyor.",
      },
    },
    "Stillness as a Form of Power": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "She does not lean forward. She does not reach. She simply sits — and the world rearranges itself around her. Hands folded with practiced ease, gaze steady and unrevealing, she occupies her chair the way a queen occupies a throne: not by force, but by absolute certainty of place.\n\nBehind her, the rotunda stands like a declaration. The garden blazes in full bloom. And far beyond, the sea holds its breath on the horizon, patient, waiting to be noticed when she is ready.\n\nHer dress is a world of its own — a meadow of painted flowers that spills across her lap, blurring the line between woman and garden.\n\nThis is a portrait about the power that lives in composure — the kind that doesn't announce itself, doesn't explain itself, and never, ever apologizes for itself.",
        tr: "Öne eğilmiyor. Uzanmıyor. Sadece oturuyor — ve dünya kendini onun etrafında yeniden düzenliyor. Elleri alışkanlıkla kolay bir biçimde kavuşturulmuş, bakışı sabit ve hiçbir şey ele vermeyen; koltuğunu bir kraliçenin tahtını işgal ettiği gibi işgal ediyor: güçle değil, yerinin mutlak kesinliğiyle.\n\nArkasında rotonda bir bildiri gibi duruyor. Bahçe tam çiçek açmış hâlde parlıyor. Çok ötede ise deniz ufukta nefesini tutuyor, sabırla, o hazır olduğunda fark edilmeyi bekliyor.\n\nElbisesi kendi başına bir dünya — kucağına dökülen, kadınla bahçe arasındaki sınırı bulanıklaştıran, boyanmış çiçeklerden bir çayır.\n\nBu, sakinlikte yaşayan güç üzerine bir portre — kendini ilan etmeyen, kendini açıklamayan ve kendisi için asla özür dilemeyen türden bir güç.",
      },
    },
    "The Book Can Wait": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "The book lies open but forgotten. Her chin rests on her hand, her gaze drifts somewhere beyond the frame. She is not daydreaming. She is thinking. There is a difference, and the painter knows it.\n\nThe red hat blazes above her dark hair like a small fire — bold, unapologetic, the choice of a woman with opinions. Red roses crowd the left of the frame with the generous abundance of a garden that didn't know when to stop.\n\nTechnically, the painting moves with confident fluidity between precision and freedom. The face is rendered with smooth, luminous brushwork; around her, the painter loosens magnificently — the hat built from bold, mosaic-like strokes of red, orange and gold. This painting sees with the precision of a realist and feels with the abandon of a poet.",
        tr: "Kitap açık ama unutulmuş duruyor. Çenesi eline yaslanmış, bakışı çerçevenin ötesinde bir yere sürükleniyor. Hayal kurmuyor. Düşünüyor. Aralarında bir fark var ve ressam bunu biliyor.\n\nKırmızı şapka, koyu saçlarının üzerinde küçük bir ateş gibi parlıyor — cesur, özürsüz, fikirleri olan bir kadının seçimi. Kırmızı güller, ne zaman duracağını bilmeyen bir bahçenin cömert bolluğuyla çerçevenin solunu dolduruyor.\n\nTeknik olarak tablo, kesinlik ile özgürlük arasında kendinden emin bir akıcılıkla hareket ediyor. Yüz, pürüzsüz ve parıltılı fırça darbeleriyle işlenmiş; etrafında ressam muhteşem biçimde gevşiyor — şapka, kırmızı, turuncu ve altının cesur, mozaik benzeri darbelerinden inşa edilmiş. Bu tablo bir gerçekçinin kesinliğiyle görüyor, bir şairin coşkusuyla hissediyor.",
      },
    },
    "The City That Burns on Water": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "It floats. It glows. It burns with the golden fever of a city that has been beautiful for so long it no longer notices. At the heart of the canvas, a magnificent mosque rises from the water like a vision half-remembered — domes crowned in violet, minarets reaching into a sky that has abandoned all pretense of calm.\n\nAnd everywhere else — sky, water, shadow — the painter unleashes something new. Bold, sweeping strokes of teal and deep violet consume the frame in barely contained energy.\n\nTechnically, this work continues the evolution visible in the painter's 2026 output — a fearless expansion into abstraction without surrendering the emotional anchor of the figurative. This is Mahmut Şahin at his most liberated — and his most luminous.",
        tr: "Yüzüyor. Parlıyor. Çok uzun süredir güzel olduğu için artık bunun farkında bile olmayan bir kentin altın ateşiyle yanıyor. Tuvalin kalbinde, muhteşem bir cami sudan yarı hatırlanan bir görüntü gibi yükseliyor — kubbeler mor renkte taçlanmış, minareler her türlü sükunet iddiasından vazgeçmiş bir gökyüzüne uzanıyor.\n\nGeri kalan her yerde — gökyüzünde, suda, gölgede — ressam yeni bir şeyi serbest bırakıyor. Deniz mavisi ve koyu morun cesur, süpürücü darbeleri, zapt edilmesi güç bir enerjiyle çerçeveyi kaplıyor.\n\nTeknik olarak bu eser, ressamın 2026 üretiminde görülen evrimi sürdürüyor — figüratifin duygusal çıpasından vazgeçmeden soyutlamaya korkusuzca açılım. Bu, Mahmut Şahin'in en özgür ve en parıltılı hâli.",
      },
    },
    "The Company of Simple Objects": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "Three objects. A shelf. And somehow, everything you need. A blue ceramic cup sits with the comfortable confidence of something used every morning. Behind it, a deep green vase rises with quiet elegance. To the right, a golden pear leans slightly, skin luminous with the warm amber of late afternoon sun.\n\nNothing extraordinary. And yet the painter has arranged these three humble things with such care, and lit them with such devotion, that they become impossible to look away from.\n\nTechnically, this is a study in the art of seeing. Shadows are long and purposeful, anchoring each object firmly to the shelf, giving the composition a timeless, studio quality reminiscent of the great European still life tradition.",
        tr: "Üç nesne. Bir raf. Ve bir şekilde, ihtiyacınız olan her şey. Mavi seramik bir fincan, her sabah kullanılan bir şeyin rahat özgüveniyle duruyor. Arkasında, koyu yeşil bir vazo sessiz bir zarafetle yükseliyor. Sağda, altın rengi bir armut hafifçe eğilmiş, kabuğu öğleden sonranın sıcak kehribarıyla parlıyor.\n\nOlağanüstü hiçbir şey yok. Yine de ressam bu üç mütevazı nesneyi öyle bir özenle düzenlemiş ve öyle bir adanmışlıkla aydınlatmış ki, gözünüzü ayırmanız imkânsız hâle geliyor.\n\nTeknik olarak bu, görme sanatı üzerine bir çalışma. Gölgeler uzun ve amaçlı, her nesneyi rafa sağlamca bağlıyor ve kompozisyona büyük Avrupa natürmort geleneğini anımsatan zamansız, atölye kalitesinde bir hava kazandırıyor.",
      },
    },
    "The Moment Before She Disappears": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "She is not dancing. She is becoming. The figure leaps across a cool violet-blue sky, arms flung wide, hair wild, her body caught in the precise instant where human form surrenders to pure motion. From her waist downward, she dissolves — flesh giving way to cascading fire, crimson and gold streaming behind her like a comet's tail.\n\nShe is half woman, half flame. And she is magnificent. This is a painting about the cost and the glory of giving everything.\n\nTechnically, this work represents Mahmut Şahin at his most boldly experimental. The upper body is rendered with delicate, almost classical precision, then, in a single breathtaking transition, the brush abandons form entirely.",
        tr: "Dans etmiyor. Dönüşüyor. Figür, soğuk mor-mavi bir gökyüzünde sıçrıyor, kolları iki yana açılmış, saçları dağınık; bedeni insan formunun saf harekete teslim olduğu tam o ana yakalanmış. Belinden aşağısı eriyor — teni dökülen ateşe yerini bırakıyor, kızıl ve altın bir kuyrukluyıldızın kuyruğu gibi arkasında akıyor.\n\nO yarı kadın, yarı alev. Ve muhteşem. Bu, her şeyi vermenin bedeli ve zaferi üzerine bir tablo.\n\nTeknik olarak bu eser, Mahmut Şahin'i en cesur, en deneysel hâliyle temsil ediyor. Üst gövde narin, neredeyse klasik bir kesinlikle işlenmiş; ardından, nefes kesici tek bir geçişte fırça formdan tamamen vazgeçiyor.",
      },
    },
    "The Ships and the Soul": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "He walks alone through a pool of liquid gold, the city glowing amber behind him, the tall ships resting in blue shadow to his left. He has no name. He needs none. He is every person who has ever stood at the edge of water at night and felt, simultaneously, very small and very alive.\n\nOn the left, cool blue. On the right, burning amber. The solitary figure stands precisely at the border between the two.\n\nTechnically, this work showcases the painter's mastery of the palette knife alongside the brush. The city buildings on the right are constructed in bold, cubist-inflected blocks of impasto — thick, architectural strokes that suggest windows and facades without describing them.",
        tr: "Sıvı altından bir gölün içinde tek başına yürüyor; arkasında kent kehribar rengiyle parlıyor, solunda uzun gemiler mavi bir gölgede dinleniyor. Adı yok. İhtiyacı da yok. O, geceleyin bir suyun kıyısında durmuş ve aynı anda hem çok küçük hem çok canlı hissetmiş herkes.\n\nSolda soğuk mavi. Sağda yanan kehribar. Yalnız figür, tam olarak ikisinin arasındaki sınırda duruyor.\n\nTeknik olarak bu eser, ressamın fırçanın yanı sıra palet bıçağındaki ustalığını sergiliyor. Sağdaki şehir binaları, cesur, kübist esintili empasto bloklarından inşa edilmiş — pencereleri ve cepheleri tarif etmeden çağrıştıran kalın, mimari darbeler.",
      },
    },
    "The Weight of Simple Things": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "We rush past them every day — a jug on a shelf, a bowl of grapes, an apple that has rolled slightly out of reach, a plum that chose its own corner of the table. We do not stop. We do not look.\n\nThe painter stopped. The painter looked. And in looking, found what the Dutch masters knew three centuries ago and what we keep forgetting: that the ordinary, when truly seen, carries an almost unbearable beauty.\n\nThis is a painting about attention. About the radical act of pausing long enough to notice that the things we reach for every day are, if we let them be, enough.",
        tr: "Onların yanından her gün aceleyle geçiyoruz — raftaki bir testi, bir kâse üzüm, hafifçe elin uzağına yuvarlanmış bir elma, masanın kendi köşesini seçmiş bir erik. Durmuyoruz. Bakmıyoruz.\n\nRessam durdu. Ressam baktı. Ve bakarken, Hollandalı ustaların üç yüzyıl önce bildiği ve bizim sürekli unuttuğumuz şeyi buldu: sıradan olan, gerçekten görüldüğünde neredeyse dayanılmaz bir güzellik taşır.\n\nBu, dikkat üzerine bir tablo. Her gün elimizi uzattığımız şeylerin — meyve, kap, ahşap bir masanın sessiz köşesi — izin verirsek yeterli olduğunu fark edecek kadar durabilmenin radikal eylemi üzerine.",
      },
    },
    "The Whole Summer in One Laugh": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "He throws his head back, mouth wide open, grapes dangling above him like a small private miracle. She sits above, barefoot and grinning, watching him with the delight of someone who knows exactly how funny this is.\n\nThis is childhood at its most unguarded — two children, some stolen fruit, and a happiness so complete it needs nothing else.\n\nThe painter places this scene firmly in the tradition of the Baroque masters. Deep, velvety darkness swallows the background so that the figures emerge from shadow as if lit by a single candle — Caravaggio's ghost is present here.",
        tr: "Başını geriye atmış, ağzı ardına kadar açık, üzümler tepesinde küçük, özel bir mucize gibi sallanıyor. O ise yukarıda, yalınayak ve sırıtarak oturuyor, bunun ne kadar komik olduğunu tam olarak bilen birinin keyfiyle onu izliyor.\n\nBu, çocukluğun en savunmasız hâli — iki çocuk, biraz çalıntı meyve ve başka hiçbir şeye ihtiyaç duymayan tam bir mutluluk.\n\nRessam bu sahneyi Barok ustaların geleneğine sağlamca yerleştiriyor. Derin, kadifemsi bir karanlık fonu yutuyor; öyle ki figürler sanki tek bir mumla aydınlatılmış gibi gölgeden ortaya çıkıyor — Caravaggio'nun hayaleti burada hazır.",
      },
    },
    "Toward the Burning Horizon": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "The sun does not set in this painting — it detonates. The whole sky is ablaze, orange and gold dissolving into violet at the edges, as if the world itself is being consumed by a slow and gorgeous fire.\n\nAnd through it all, the ship drives forward. Sails swollen with wind — cobalt, crimson, white — catching the last light of the day and throwing it back at the sky. The hull cuts through dark churning waves that froth white at the bow.\n\nThere is no harbor in sight. No destination named. Only the open sea, the burning sky, and a vessel that has clearly decided that forward is the only direction worth knowing.",
        tr: "Bu tabloda güneş batmıyor — patlıyor. Bütün gökyüzü alev alev, turuncu ve altın kenarlarda mora eriyor; sanki dünyanın kendisi yavaş ve muhteşem bir ateşle tüketiliyor.\n\nBütün bunların içinden gemi ileri doğru ilerliyor. Rüzgârla şişmiş yelkenler — kobalt, kızıl, beyaz — günün son ışığını yakalayıp gökyüzüne geri fırlatıyor. Gövde, pruvada beyaz köpüren karanlık, çalkantılı dalgaların içinden kesip geçiyor.\n\nOrtada liman yok. Belirtilmiş bir varış noktası yok. Sadece açık deniz, yanan gökyüzü ve ileri gitmenin bilinmeye değer tek yön olduğuna açıkça karar vermiş bir tekne.",
      },
    },
    "Two Wild Things That Found Each Other": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "They look at you together — and together, they are formidable. The woman holds the bridle with a hand that speaks not of control but of trust. Her dark eyes are level, unblinking, carrying the quiet intensity of someone who has lived close to the land and knows exactly who she is. The horse beside her is equally still, equally watchful.\n\nBlack hair cascades over crimson embroidered fabric. Behind them, pine forest and open sky — a world that belongs to them far more than to anyone else.\n\nThis is a portrait of belonging. Not to each other, but to something larger — to the land, to instinct, to the unhurried rhythms of a life lived without apology.",
        tr: "Birlikte sana bakıyorlar — ve birlikte, etkileyicilar. Kadın, dizgini kontrolden değil güvenden söz eden bir elle tutuyor. Koyu gözleri düz, kırpılmadan; toprağa yakın yaşamış ve kim olduğunu tam olarak bilen birinin sessiz yoğunluğunu taşıyor. Yanındaki at da aynı ölçüde sakin, aynı ölçüde tetikte.\n\nSiyah saçlar kızıl işlemeli kumaşın üzerine dökülüyor. Arkalarında çam ormanı ve açık gökyüzü — herkesten çok onlara ait bir dünya.\n\nBu, aidiyet üzerine bir portre. Birbirlerine değil, daha büyük bir şeye — toprağa, içgüdüye, özür dilemeden yaşanan bir hayatın acelesiz ritmine aidiyet.",
      },
    },
    "Walked Through the Rain": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "The rain came down and the street became a mirror — amber, violet, gold — each lamplight doubled in the wet cobblestones, the whole world suddenly more beautiful for being soaked.\n\nShe walks with her rose umbrella like she owns the night. Unhurried. Unbothered. Somewhere ahead, a lone figure stands in a doorway, half-swallowed by warm light, perhaps waiting, perhaps simply watching the rain fall.\n\nThe painter has built this scene from pure feeling — thick, expressive strokes that make the light almost edible, the darkness almost tender. This is not a painting about rain. It is a painting about the strange joy of walking through it.",
        tr: "Yağmur yağdı ve sokak bir aynaya dönüştü — kehribar, mor, altın — her lamba ışığı ıslak arnavut kaldırımlarında ikiye katlanmış, ıslanmış olmaktan dolayı bütün dünya birden daha güzel.\n\nGül rengi şemsiyesiyle geceye sahipmiş gibi yürüyor. Aceleci değil. Rahatsız olmamış. İlerideki bir yerde, yalnız bir figür bir kapı eşiğinde duruyor, sıcak ışıkla yarı yarıya yutulmuş; belki bekliyor, belki sadece yağmurun yağışını izliyor.\n\nRessam bu sahneyi saf duygudan inşa etmiş — ışığı neredeyse yenilebilir, karanlığı neredeyse şefkatli kılan kalın, dışavurumcu darbeler. Bu, yağmur üzerine bir tablo değil. Yağmurun içinden yürümenin tuhaf sevinci üzerine bir tablo.",
      },
    },
  },
  "Mehmet Ozdemir": {
    "Echoes Beneath the Stone Arch": {
      medium: oilPaintingMedium,
      dimensions: "40 x 60 cm",
      description: {
        en: "Echoes Beneath the Stone Arch is a tribute to the timeless streets of Hatay, capturing the warmth, character, and cultural richness that once defined its historic neighborhoods. Framed by an ancient stone archway, the scene invites the viewer into a quiet alley bathed in golden sunlight. The vibrant orange façades, weathered stone walls, and traditional architecture reflect the unique identity that made Hatay one of Türkiye's most cherished cultural treasures.\n\nPainted in remembrance of the streets that were devastated by the 2023 Hatay earthquake, the work transforms an ordinary passageway into a symbol of memory and resilience. The empty lane, illuminated by soft light, evokes a sense of presence in absence — an echo of the lives, conversations, and traditions that once filled these spaces.\n\nMore than a depiction of architecture, this painting serves as a visual memorial to a city's heritage. It honors the enduring spirit of Hatay and preserves, through art, the beauty of streets that may no longer stand but continue to live on in collective memory.",
        tr: "Taş Kemerin Altındaki Yankılar, Hatay'ın tarihi mahallelerini bir zamanlar tanımlayan sıcaklığı, karakteri ve kültürel zenginliği yakalayan, kentin zamansız sokaklarına bir saygı duruşudur. Kadim bir taş kemerle çerçevelenen sahne, izleyiciyi altın güneş ışığıyla yıkanmış sessiz bir sokağa davet eder. Canlı turuncu cepheler, aşınmış taş duvarlar ve geleneksel mimari, Hatay'ı Türkiye'nin en değerli kültürel hazinelerinden biri yapan eşsiz kimliği yansıtır.\n\n2023 Hatay depreminde yıkıma uğrayan sokakların anısına resmedilen eser, sıradan bir geçidi hafıza ve dirençlilik simgesine dönüştürür. Yumuşak ışıkla aydınlanan boş sokak, bir yokluk içinde varlık hissi uyandırır — bir zamanlar bu mekânları dolduran yaşamların, sohbetlerin ve geleneklerin bir yankısı.\n\nBir mimari tasvirin ötesinde, bu tablo bir kentin mirasına görsel bir anıt niteliği taşır. Hatay'ın yılmaz ruhunu onurlandırır ve artık ayakta olmayabilecek ama kolektif hafızada yaşamaya devam eden sokakların güzelliğini sanat yoluyla korur.",
      },
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
    );

    for (const [index, fileName] of files.entries()) {
      const fileStats = await fs.stat(path.join(artistsDir, folderName, fileName));
      const paintingId = `${metadata.id}-${String(index + 1).padStart(2, "0")}`;
      paintingVersions.set(paintingId, assetVersionTag(fileStats));

      const fileStem = fileName.replace(/\.[^.]+$/, "");
      const paintingDetails = paintingMetadata[folderName]?.[fileStem];

      paintings.push({
        id: paintingId,
        artistId: metadata.id,
        title: {
          en: titleFromFileName(fileName, "en"),
          tr: titleFromFileName(fileName, "tr"),
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
