/**
 * FK Yapı — proje tarayıcı / manifest üreticisi
 * -------------------------------------------------
 * `public/projects/` altındaki klasörleri tarar ve `public/data/projects.json`
 * dosyasını üretir. Hiçbir metin dosyası düzenlemeye gerek yoktur: tüm bilgiler
 * KLASÖR ve DOSYA İSİMLERİNDEN okunur.
 *
 * İSİMLENDİRME ŞEMASI
 * ===================
 * Proje klasörü:
 *   <kategori>__<konum>__<yil>__<baslik>__<alan>
 *   alanlar "__" (çift alt çizgi) ile ayrılır, alan içindeki "-" boşluğa döner.
 *   örn:  villa__Marmaris,-Muğla__2025__FK-Marmaris-Bay-Villası__720
 *
 *   kategori:  villa | konut | ticari | ic-mimari
 *   alan (m²): opsiyonel, sadece sayı yazılır (720 -> "720 m²")
 *
 * Kapak görseli:  klasör kökünde  cover.* ya da kapak.*  (yoksa ilk görsel)
 *
 * Zaman çizelgesi (ilerleme) — proje klasörü içindeki alt klasörler:
 *   <sira>__<YYYY-MM>__<asama-basligi>
 *   örn:  01__2024-03__Temel-ve-Kazı-Çalışmaları
 *   içindeki tüm görseller o aşamaya ait olur.
 *
 * Galeri:  proje kökündeki (kapak hariç) görseller.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PROJECTS_DIR = path.join(ROOT, "projects");
const OUT_FILE = path.join(ROOT, "data", "projects.json");

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
const PHASE_RE = /^(\d+)__(\d{4}-\d{2})__(.+)$/;
const COVER_RE = /^(cover|kapak)\./i;

const CATEGORIES = {
  villa: { label: "Villa", group: "Lüks Villalar" },
  konut: { label: "Konut", group: "Konut" },
  ticari: { label: "Ticari", group: "Ticari" },
  "ic-mimari": { label: "İç Mimari", group: "İç Mimari" },
};

const TR_MAP = { ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i", ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u" };

function slugify(str) {
  return String(str)
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => TR_MAP[c] ?? c)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Alan içindeki tireleri boşluğa çevirir, kenar boşluklarını temizler. */
function unslug(field) {
  return String(field ?? "").replace(/-/g, " ").trim();
}

const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function formatDate(ym) {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return ym;
  const year = m[1];
  const monthIdx = parseInt(m[2], 10) - 1;
  return `${MONTHS_TR[monthIdx] ?? m[2]} ${year}`;
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && IMAGE_RE.test(d.name))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, "tr"));
}

function toWebPath(...parts) {
  // İşletim sistemi ayıracını web ("/") ayıracına çevir.
  return parts.join("/").replace(/\\/g, "/");
}

function parseProject(folderName) {
  const parts = folderName.split("__");
  const [rawCat = "", rawLoc = "", rawYear = "", rawTitle = "", rawArea = ""] = parts;

  const catKey = slugify(rawCat);
  const category = CATEGORIES[catKey] ?? { label: unslug(rawCat) || "Proje", group: "Diğer" };

  const title = unslug(rawTitle) || unslug(folderName);
  const location = unslug(rawLoc);
  const year = rawYear.trim();
  const areaNum = String(rawArea).replace(/[^\d]/g, "");
  const area = areaNum ? `${Number(areaNum).toLocaleString("tr-TR")} m²` : "";

  return {
    slug: slugify(title) || slugify(folderName),
    folder: folderName,
    title,
    categoryKey: catKey in CATEGORIES ? catKey : "diger",
    category: category.label,
    categoryGroup: category.group,
    location,
    year,
    area,
  };
}

function buildTimeline(projectDir, folderName) {
  const base = toWebPath("projects", folderName);
  const phases = fs
    .readdirSync(projectDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && PHASE_RE.test(d.name))
    .map((d) => {
      const [, order, ym, rawTitle] = PHASE_RE.exec(d.name);
      const images = listImages(path.join(projectDir, d.name)).map((img) =>
        toWebPath(base, d.name, img)
      );
      return {
        order: parseInt(order, 10),
        date: ym,
        dateLabel: formatDate(ym),
        title: unslug(rawTitle),
        images,
      };
    })
    .sort((a, b) => a.order - b.order || a.date.localeCompare(b.date));
  return phases;
}

function scan() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.error(`✗ Proje klasörü bulunamadı: ${PROJECTS_DIR}`);
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
    console.log("  (boş 'public/projects' klasörü oluşturuldu)");
  }

  const folders = fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith(".") && !d.name.startsWith("_"))
    .map((d) => d.name);

  const seenSlugs = new Map();
  const projects = folders
    .map((folderName) => {
      const projectDir = path.join(PROJECTS_DIR, folderName);
      const meta = parseProject(folderName);
      const base = toWebPath("projects", folderName);

      const rootImages = listImages(projectDir);
      const coverName = rootImages.find((n) => COVER_RE.test(n));
      const gallery = rootImages.filter((n) => n !== coverName).map((n) => toWebPath(base, n));
      const timeline = buildTimeline(projectDir, folderName);

      // Kapak yoksa: ilk galeri görseli, o da yoksa ilk zaman çizelgesi görseli.
      let cover = coverName ? toWebPath(base, coverName) : gallery[0] ?? timeline[0]?.images[0] ?? null;

      // Slug çakışmasını yıl ekleyerek çöz.
      let slug = meta.slug;
      if (seenSlugs.has(slug)) {
        slug = `${slug}-${meta.year || seenSlugs.get(slug) + 1}`;
      }
      seenSlugs.set(meta.slug, (seenSlugs.get(meta.slug) ?? 0) + 1);

      const imageCount =
        gallery.length + (cover ? 1 : 0) + timeline.reduce((n, p) => n + p.images.length, 0);

      return { ...meta, slug, cover, gallery, timeline, imageCount };
    })
    .sort((a, b) => (b.year || "").localeCompare(a.year || "") || a.title.localeCompare(b.title, "tr"));

  return projects;
}

function main() {
  const projects = scan();
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    count: projects.length,
    projects,
  };
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), "utf8");

  console.log(`✓ ${projects.length} proje tarandı → ${path.relative(ROOT, OUT_FILE)}`);
  for (const p of projects) {
    const warn = p.cover ? "" : "  ⚠ görsel yok";
    console.log(`   • ${p.title}  [${p.category}${p.year ? ", " + p.year : ""}]  ` +
      `${p.timeline.length} aşama, ${p.imageCount} görsel${warn}`);
  }
}

main();
