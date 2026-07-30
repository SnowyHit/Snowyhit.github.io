/**
 * Tek seferlik: public/projects köküne bırakılmış gerçek fotoğrafları
 * tek bir proje klasörüne (before -> during -> after zaman çizelgesi) taşır.
 * Çalıştır:  node build/organize-photos.js   (ardından npm run build)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECTS = path.resolve(__dirname, "..", "public", "projects");

// NOT: konum / yıl / alan / isim tahminidir — klasör adını dilediğiniz gibi değiştirin.
const PROJECT = "villa__Marmaris,-Muğla__2025__Bahçeli-Villa-Renovasyonu__160";
const dest = path.join(PROJECTS, PROJECT);

// [kaynak dosya, hedef göreli yol, işlem]  — işlem: "move" (varsayılan) | "copy"
const OPS = [
  // Kapak (0039'un kopyası; orijinali 4. fazda da kullanılır)
  ["IMG_0039.JPEG", "cover.jpg", "copy"],

  // Galeri (kök) — bitmiş iç mekânlar
  ["IMG_0053.JPEG", "galeri-01.jpg"],
  ["IMG_0054.JPEG", "galeri-02.jpg"],
  ["IMG_0055.JPEG", "galeri-03.jpg"],
  ["IMG_0056.JPEG", "galeri-04.jpg"],

  // 01 — Mevcut Durum (yenileme öncesi)
  ["IMG_9059.JPEG", "01__2024-09__Mevcut-Durum/01.jpg"],
  ["IMG_9063.JPEG", "01__2024-09__Mevcut-Durum/02.jpg"],
  ["IMG_9060.JPEG", "01__2024-09__Mevcut-Durum/03.jpg"],
  ["IMG_9067.JPEG", "01__2024-09__Mevcut-Durum/04.jpg"],
  ["IMG_9066.JPEG", "01__2024-09__Mevcut-Durum/05.jpg"],
  ["IMG_9064.JPEG", "01__2024-09__Mevcut-Durum/06.jpg"],

  // 02 — Yıkım ve Söküm
  ["IMG_9062.JPEG", "02__2024-11__Yıkım-ve-Söküm/01.jpg"],
  ["IMG_9061.JPEG", "02__2024-11__Yıkım-ve-Söküm/02.jpg"],
  ["IMG_9065.JPEG", "02__2024-11__Yıkım-ve-Söküm/03.jpg"],

  // 03 — Cephe, Mantolama ve Çatı
  ["98b73c89-4837-4c18-a03d-98a9ad1f86f9.jpg", "03__2025-02__Cephe-Mantolama-ve-Çatı/01.jpg"],
  ["7f4cd74b-b549-48ba-94fc-55f16df54745.jpg", "03__2025-02__Cephe-Mantolama-ve-Çatı/02.jpg"],
  ["6c0558f3-deae-4d9f-80da-18964d18f6eb.jpg", "03__2025-02__Cephe-Mantolama-ve-Çatı/03.jpg"],

  // 04 — Dış Cephe Tamamlandı
  ["IMG_0039.JPEG", "04__2025-04__Dış-Cephe-Tamamlandı/01.jpg", "move"],
  ["IMG_0040.JPEG", "04__2025-04__Dış-Cephe-Tamamlandı/02.jpg"],

  // 05 — İç Mekân ve Teslim
  ["IMG_0046.JPEG", "05__2025-06__İç-Mekan-ve-Teslim/01.jpg"],
  ["IMG_0047.JPEG", "05__2025-06__İç-Mekan-ve-Teslim/02.jpg"],
  ["IMG_0048.JPEG", "05__2025-06__İç-Mekan-ve-Teslim/03.jpg"],
  ["IMG_0049.JPEG", "05__2025-06__İç-Mekan-ve-Teslim/04.jpg"],
  ["IMG_0050.JPEG", "05__2025-06__İç-Mekan-ve-Teslim/05.jpg"],
  ["IMG_0051.JPEG", "05__2025-06__İç-Mekan-ve-Teslim/06.jpg"],
];

// Kullanılmayan kopyalar (scanner "_" ile başlayan klasörleri yok sayar)
const DUPES = ["IMG_9060 (1).JPEG", "IMG_9062 (1).JPEG"];

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

let done = 0, missing = 0;
for (const [src, rel, op = "move"] of OPS) {
  const from = path.join(PROJECTS, src);
  const to = path.join(dest, rel);
  if (!fs.existsSync(from)) {
    console.warn(`  ⚠ bulunamadı: ${src}`);
    missing++;
    continue;
  }
  ensureDir(path.dirname(to));
  if (op === "copy") fs.copyFileSync(from, to);
  else fs.renameSync(from, to);
  done++;
}

// Kopyaları kenara al
const dupeDir = path.join(PROJECTS, "_kullanilmayan-kopyalar");
for (const d of DUPES) {
  const from = path.join(PROJECTS, d);
  if (fs.existsSync(from)) {
    ensureDir(dupeDir);
    fs.renameSync(from, path.join(dupeDir, d));
  }
}

console.log(`✓ ${done} dosya yerleştirildi → ${PROJECT}`);
if (missing) console.log(`  (${missing} dosya atlandı)`);
console.log("  Şimdi:  npm run build");
