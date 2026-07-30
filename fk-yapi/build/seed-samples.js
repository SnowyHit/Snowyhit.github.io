/**
 * Örnek projeler üretir (yer tutucu SVG görsellerle) — sistemi denemek için.
 * Çalıştır:  npm run seed
 * Kardeşiniz bu klasörleri silip kendi projelerini aynı isim şemasıyla ekleyebilir.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PROJECTS_DIR = path.join(ROOT, "public", "projects");
const IMG_DIR = path.join(ROOT, "public", "assets", "img");

/* Mimari hisli yer tutucu SVG üretici */
function svg({ w = 1600, h = 1200, top, bottom, accent, title, sub }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h * 0.6}" fill="url(#sky)"/>
  <!-- soyut mimari kütleler -->
  <g fill="#000" fill-opacity="0.14">
    <rect x="${w * 0.08}" y="${h * 0.52}" width="${w * 0.26}" height="${h * 0.48}"/>
    <rect x="${w * 0.36}" y="${h * 0.4}" width="${w * 0.22}" height="${h * 0.6}"/>
    <rect x="${w * 0.6}" y="${h * 0.58}" width="${w * 0.32}" height="${h * 0.42}"/>
  </g>
  <g fill="#fff" fill-opacity="0.05">
    <rect x="${w * 0.36}" y="${h * 0.4}" width="${w * 0.22}" height="${h * 0.05}"/>
    <rect x="${w * 0.6}" y="${h * 0.58}" width="${w * 0.32}" height="${h * 0.04}"/>
  </g>
  <line x1="0" y1="${h * 0.58}" x2="${w}" y2="${h * 0.58}" stroke="${accent}" stroke-opacity="0.5" stroke-width="2"/>
  <text x="${w / 2}" y="${h / 2 - 10}" text-anchor="middle" fill="#fff" fill-opacity="0.92"
    font-family="Georgia, serif" font-size="${w * 0.045}" font-style="italic">${escapeXml(title)}</text>
  ${sub ? `<text x="${w / 2}" y="${h / 2 + w * 0.04}" text-anchor="middle" fill="#fff" fill-opacity="0.55"
    font-family="Arial, sans-serif" font-size="${w * 0.02}" letter-spacing="6">${escapeXml(sub.toUpperCase())}</text>` : ""}
  <text x="${w / 2}" y="${h - 40}" text-anchor="middle" fill="#fff" fill-opacity="0.3"
    font-family="Arial, sans-serif" font-size="${w * 0.015}" letter-spacing="4">FK YAPI · YER TUTUCU GÖRSEL</text>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

/* Paletler (mimari, sıcak) */
const PAL = {
  dusk: { top: "#3b352b", bottom: "#171410", accent: "#c39a5f" },
  stone: { top: "#5a5348", bottom: "#2a2620", accent: "#b8b0a0" },
  clay: { top: "#5e4636", bottom: "#241a14", accent: "#c8875a" },
  sea: { top: "#2f4a4d", bottom: "#141e1f", accent: "#7fb0ab" },
  sand: { top: "#6b5f48", bottom: "#2b2519", accent: "#d8bd85" },
};

/* Örnek projeler */
const SAMPLES = [
  {
    folder: "villa__Marmaris,-Muğla__2025__FK-Marmaris-Bay-Villası__720",
    pal: PAL.dusk,
    phases: [
      { dir: "01__2024-03__Zemin-Etüdü-ve-Temel", n: 2 },
      { dir: "02__2024-08__Kaba-İnşaat-ve-Brüt-Beton", n: 3 },
      { dir: "03__2025-01__İnce-İşler-ve-Cephe", n: 2 },
      { dir: "04__2025-06__Peyzaj-ve-Anahtar-Teslim", n: 2 },
    ],
    gallery: 3,
  },
  {
    folder: "konut__Bodrum,-Muğla__2024__FK-Panorama-Rezidansları__4200",
    pal: PAL.stone,
    phases: [
      { dir: "01__2023-05__Hafriyat-ve-Fore-Kazık", n: 2 },
      { dir: "02__2023-11__Karkas-ve-Kat-İmalatları", n: 3 },
      { dir: "03__2024-07__Cephe-ve-Ortak-Alanlar", n: 2 },
    ],
    gallery: 2,
  },
  {
    folder: "ic-mimari__Göcek,-Muğla__2024__Oasis-Loft-İç-Mekan-Tasarımı__280",
    pal: PAL.sea,
    phases: [
      { dir: "01__2024-02__Konsept-ve-Malzeme-Seçimi", n: 2 },
      { dir: "02__2024-05__Uygulama-ve-Mobilya", n: 3 },
    ],
    gallery: 3,
  },
  {
    folder: "ticari__Ataşehir,-İstanbul__2023__Zenith-İş-ve-Sanat-Merkezi__14500",
    pal: PAL.sand,
    phases: [
      { dir: "01__2021-09__Temel-ve-Bodrum-Katları", n: 2 },
      { dir: "02__2022-06__Çelik-Konstrüksiyon", n: 2 },
      { dir: "03__2023-03__Giydirme-Cephe-ve-Teslim", n: 2 },
    ],
    gallery: 2,
  },
  {
    folder: "villa__Fethiye,-Muğla__2025__FK-Cliffside-Malikanesi__950",
    pal: PAL.clay,
    phases: [
      { dir: "01__2024-04__Kayalık-Zemin-Hazırlığı", n: 2 },
      { dir: "02__2024-10__Kademeli-Betonarme", n: 3 },
      { dir: "03__2025-05__Doğal-Taş-Cephe-ve-Havuz", n: 2 },
    ],
    gallery: 3,
  },
];

function titleFromFolder(folder) {
  return folder.split("__")[3].replace(/-/g, " ");
}
function phaseTitle(dir) {
  return dir.split("__")[2].replace(/-/g, " ");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function seed() {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });

  for (const s of SAMPLES) {
    const dir = path.join(PROJECTS_DIR, s.folder);
    const title = titleFromFolder(s.folder);

    // Kapak
    write(path.join(dir, "cover.svg"), svg({ ...s.pal, title, sub: "FK Yapı" }));

    // Galeri
    for (let i = 1; i <= s.gallery; i++) {
      write(
        path.join(dir, `galeri-${String(i).padStart(2, "0")}.svg`),
        svg({ ...s.pal, title, sub: `Görsel ${i}`, h: i % 2 ? 1200 : 1500 })
      );
    }

    // Aşamalar
    for (const ph of s.phases) {
      const pt = phaseTitle(ph.dir);
      for (let i = 1; i <= ph.n; i++) {
        write(
          path.join(dir, ph.dir, `asama-${String(i).padStart(2, "0")}.svg`),
          svg({ ...s.pal, title: pt, sub: title })
        );
      }
    }
    console.log(`  + ${s.folder}`);
  }

  // Genel yer tutucu (kapağı olmayan projeler için)
  write(
    path.join(IMG_DIR, "placeholder.svg"),
    svg({ ...PAL.stone, title: "Görsel bekleniyor", sub: "FK Yapı" })
  );

  console.log(`✓ ${SAMPLES.length} örnek proje oluşturuldu → public/projects/`);
  console.log("  Şimdi:  npm run build   (ardından npm start)");
}

seed();
