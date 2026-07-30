/* ============================================================
   FK YAPI — Ön yüz mantığı
   - projects.json'u yükler, portföyü doldurur, filtreler
   - hash yönlendirme ile proje detay "sayfası" (#/proje/<slug>)
   - zaman çizelgesi + galeri + lightbox
   ============================================================ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const state = { projects: [], bySlug: new Map(), lightbox: { images: [], index: 0 } };

/* ---------- Yardımcılar ---------- */
function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- Veri yükleme ---------- */
async function loadProjects() {
  try {
    const res = await fetch("data/projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    state.projects = data.projects || [];
  } catch (err) {
    console.warn("projects.json yüklenemedi:", err);
    state.projects = [];
  }
  state.bySlug = new Map(state.projects.map((p) => [p.slug, p]));
}

/* ---------- Portföy ---------- */
function renderGrid() {
  const grid = $("#projectsGrid");
  const empty = $("#projectsEmpty");
  grid.innerHTML = "";

  if (!state.projects.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  for (const p of state.projects) {
    const card = el("article", "project-card");
    card.dataset.category = p.categoryKey;
    card.dataset.slug = p.slug;
    const cover = p.cover || "assets/img/placeholder.svg";
    card.innerHTML = `
      <img class="project-card__img" src="${esc(cover)}" alt="${esc(p.title)}" loading="lazy" />
      <span class="project-card__arrow">→</span>
      <div class="project-card__overlay">
        <span class="project-card__cat">${esc(p.category)}${p.location ? " · " + esc(p.location) : ""}</span>
        <h3 class="project-card__title">${esc(p.title)}</h3>
        <div class="project-card__meta">
          ${p.year ? `<span>${esc(p.year)}</span>` : ""}
          ${p.area ? `<span>${esc(p.area)}</span>` : ""}
          ${p.timeline.length ? `<span>${p.timeline.length} aşama</span>` : ""}
        </div>
      </div>`;
    card.addEventListener("click", () => { location.hash = `#/proje/${p.slug}`; });
    grid.appendChild(card);
  }
  observeCards();
}

function setupFilters() {
  const filters = $("#filters");
  if (!filters) return;
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    $$(".filter", filters).forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const cat = btn.dataset.filter;
    $$(".project-card").forEach((card) => {
      const show = cat === "all" || card.dataset.category === cat;
      card.classList.toggle("is-hidden", !show);
    });
  });
}

/* Kartların görünürce belirmesi */
function observeCards() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-in"), i * 90);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$(".project-card:not(.is-in)").forEach((c) => io.observe(c));
}

/* ---------- Proje detay "sayfası" ---------- */
function renderProjectPage(slug) {
  const p = state.bySlug.get(slug);
  const page = $("#projectPage");
  if (!p) { location.hash = ""; return; }

  const cover = p.cover || "assets/img/placeholder.svg";
  const meta = [
    p.location && { label: "Konum", value: p.location },
    p.year && { label: "Yıl", value: p.year },
    p.area && { label: "Alan", value: p.area },
    { label: "Kategori", value: p.category },
  ].filter(Boolean);

  const timelineHtml = p.timeline.length
    ? `<div class="timeline">${p.timeline
        .map(
          (ph) => `
        <div class="tl-phase">
          <div class="tl-date">${esc(ph.dateLabel)}</div>
          <h3 class="tl-title">${esc(ph.title)}</h3>
          ${
            ph.images.length
              ? `<div class="tl-images">${ph.images
                  .map((src) => `<img class="tl-img" src="${esc(src)}" alt="${esc(ph.title)}" loading="lazy" data-zoom="${esc(src)}" />`)
                  .join("")}</div>`
              : ""
          }
        </div>`
        )
        .join("")}</div>`
    : `<p class="pp__empty">Bu proje için henüz ilerleme aşaması eklenmemiş.</p>`;

  const galleryHtml = p.gallery.length
    ? `<div class="gallery">${p.gallery
        .map((src) => `<div class="gallery-item"><img class="gallery-img" src="${esc(src)}" alt="${esc(p.title)}" loading="lazy" data-zoom="${esc(src)}" /></div>`)
        .join("")}</div>`
    : "";

  page.innerHTML = `
    <a class="pp__back" href="#projeler" data-back>← Projelere Dön</a>
    <div class="pp__hero">
      <img class="pp__hero-img" src="${esc(cover)}" alt="${esc(p.title)}" />
      <div class="pp__hero-shade"></div>
      <div class="pp__hero-inner">
        <div class="pp__cat">${esc(p.category)}</div>
        <h1 class="pp__title">${esc(p.title)}</h1>
      </div>
    </div>

    <div class="pp__meta">
      ${meta
        .map((m) => `<div class="pp__meta-item"><div class="pp__meta-label">${esc(m.label)}</div><div class="pp__meta-value">${esc(m.value)}</div></div>`)
        .join("")}
    </div>

    <section class="pp__section">
      <div class="pp__section-head">
        <p class="eyebrow">İlerleme Süreci</p>
        <h2 class="pp__section-title">Projenin Zaman Çizelgesi</h2>
      </div>
      ${timelineHtml}
    </section>

    ${
      galleryHtml
        ? `<section class="pp__section" style="padding-top:0">
            <div class="pp__section-head">
              <p class="eyebrow">Galeri</p>
              <h2 class="pp__section-title">Proje Görselleri</h2>
            </div>
            ${galleryHtml}
          </section>`
        : ""
    }

    <div class="pp__cta">
      <h3>Benzer bir proje mi düşünüyorsunuz?</h3>
      <a class="btn btn--solid" href="#iletisim" data-back>Bize Ulaşın</a>
    </div>`;

  // Lightbox için tüm görselleri topla
  const zoomables = $$("[data-zoom]", page).map((n) => n.dataset.zoom);
  $$("[data-zoom]", page).forEach((img, i) => {
    img.addEventListener("click", () => openLightbox(zoomables, i));
  });

  page.hidden = false;
  page.classList.add("is-open");
  document.body.classList.add("no-scroll");
  page.scrollTop = 0;
  document.title = `${p.title} | FK Yapı`;
}

function closeProjectPage() {
  const page = $("#projectPage");
  page.hidden = true;
  page.classList.remove("is-open");
  page.innerHTML = "";
  document.body.classList.remove("no-scroll");
  document.title = "FK Yapı | Mimarlık, İç Mimarlık ve İnşaat";
}

/* ---------- Yönlendirme ---------- */
function handleRoute() {
  const hash = location.hash;
  const match = /^#\/proje\/(.+)$/.exec(hash);
  if (match) {
    renderProjectPage(decodeURIComponent(match[1]));
  } else {
    closeProjectPage();
    // Ana sayfa içi çapaya kaydır
    if (hash && hash.length > 1 && $(hash)) {
      requestAnimationFrame(() => $(hash).scrollIntoView({ behavior: "smooth" }));
    }
  }
}

/* ---------- Lightbox ---------- */
function openLightbox(images, index) {
  state.lightbox = { images, index };
  const box = $("#lightbox");
  $("#lightboxImg").src = images[index];
  box.hidden = false;
  document.body.classList.add("no-scroll");
}
function moveLightbox(delta) {
  const { images, index } = state.lightbox;
  const next = (index + delta + images.length) % images.length;
  state.lightbox.index = next;
  $("#lightboxImg").src = images[next];
}
function closeLightbox() {
  $("#lightbox").hidden = true;
  if (location.hash.startsWith("#/proje/")) return; // detay açıkken scroll kilitli kalsın
  document.body.classList.remove("no-scroll");
}

/* ---------- Reveal + istatistik sayaç + menü ---------- */
function setupReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          if (entry.target.classList.contains("stats")) animateCounters(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((n) => io.observe(n));
}

function animateCounters(scope) {
  $$("[data-count]", scope).forEach((node) => {
    const target = parseFloat(node.dataset.count);
    const suffix = node.dataset.suffix || "";
    const dur = 1400;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      node.textContent = Math.round(target * eased).toLocaleString("tr-TR") + (prog === 1 ? suffix : "");
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function setupNav() {
  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = $("#navToggle");
  const links = $("#navLinks");
  const setMenu = (open) => {
    toggle.classList.toggle("is-open", open);
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
}

/* Kaydırınca aktif menü bağlantısını vurgula */
function setupScrollSpy() {
  const sections = ["hakkimizda", "hizmetler", "surec", "projeler", "iletisim"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const linkFor = (id) => $(`#navLinks a[href="#${id}"]`);
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $$("#navLinks a").forEach((a) => a.classList.remove("is-current"));
          linkFor(entry.target.id)?.classList.add("is-current");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => io.observe(s));
}

/* ---------- Başlat ---------- */
async function init() {
  $("#year").textContent = String(new Date().getFullYear());
  setupNav();
  setupScrollSpy();
  setupReveal();
  setupFilters();

  await loadProjects();
  renderGrid();

  window.addEventListener("hashchange", handleRoute);
  handleRoute();

  // Lightbox olayları
  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxPrev").addEventListener("click", () => moveLightbox(-1));
  $("#lightboxNext").addEventListener("click", () => moveLightbox(1));
  $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if ($("#lightbox").hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") moveLightbox(-1);
    if (e.key === "ArrowRight") moveLightbox(1);
  });
}

init();
