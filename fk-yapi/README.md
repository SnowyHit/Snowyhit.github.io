# FK Yapı — Web Sitesi

Tek sayfalık tanıtım sitesi + klasör isimlerinden **otomatik** okunan proje portföyü.
Yeni proje eklemek için tek yapmanız gereken: doğru isimde bir klasör açıp içine görselleri koymak ve `npm run build` çalıştırmak. Hiçbir kod/metin dosyası düzenlemenize gerek yok.

Site tamamen **statiktir** — `index.html` kök dizindedir, doğrudan GitHub Pages'e konabilir.

## Hızlı başlangıç

```bash
npm run seed     # (opsiyonel) örnek projeleri yer tutucu görsellerle oluşturur
npm run build    # klasörleri tarar, data/projects.json üretir
npm start        # http://localhost:4173 adresinde önizleme
```

`npm run dev` = build + start (tek komut).

## Yeni proje nasıl eklenir?

`projects/` klasörüne şu isimde bir klasör açın:

```
<kategori>__<konum>__<yıl>__<başlık>__<alan>
```

- Alanlar **`__` (çift alt çizgi)** ile ayrılır.
- Alan içindeki **`-` (tire)** ekranda **boşluğa** dönüşür.
- Türkçe karakter kullanabilirsiniz.

**Kategori** şunlardan biri olmalı: `villa` · `konut` · `ticari` · `ic-mimari`
**Alan** sadece sayı (m²); yazmazsanız gösterilmez.

Örnek:
```
projects/villa__Marmaris,-Muğla__2025__FK-Marmaris-Bay-Villası__720/
```
→ *Villa · Marmaris, Muğla · 2025 · "FK Marmaris Bay Villası" · 720 m²*

### Görseller

Proje klasörünün içine:

- **Kapak:** `cover.jpg` (veya `kapak.jpg`). Yazmazsanız ilk görsel kapak olur.
- **Galeri:** klasör kökündeki diğer tüm görseller galeriye girer.
- **İlerleme (zaman çizelgesi):** proje klasörü içinde alt klasörler açın:

```
<sıra>__<YYYY-MM>__<aşama-başlığı>/
```

Örnek bir proje klasörünün içi:
```
FK-Marmaris-Bay-Villası klasörü/
├── cover.jpg
├── galeri-01.jpg
├── galeri-02.jpg
├── 01__2024-03__Zemin-Etüdü-ve-Temel/
│   ├── foto1.jpg
│   └── foto2.jpg
├── 02__2024-08__Kaba-İnşaat-ve-Brüt-Beton/
│   └── ...
└── 03__2025-01__İnce-İşler-ve-Cephe/
    └── ...
```

Aşamalar `sıra` numarasına göre sıralanır ve proje sayfasında tarihli bir zaman
çizelgesi olarak gösterilir.

Desteklenen görsel türleri: `.jpg .jpeg .png .webp .avif .gif .svg`

## GitHub Pages'e yükleme

1. Yeni bir proje eklediyseniz önce `npm run build` çalıştırın (yeni
   `data/projects.json` üretilir) ve değişiklikleri commit'leyin.
2. Bu klasörü bir GitHub deposuna gönderin (kök dizinde `index.html` olmalı):
   ```bash
   git init
   git add .
   git commit -m "FK Yapı sitesi"
   git branch -M main
   git remote add origin https://github.com/<kullanıcı>/<depo>.git
   git push -u origin main
   ```
3. GitHub'da: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch**, branch **main** ve klasör **/(root)** seçin, **Save**.
4. Site birkaç dakika içinde şu adreste yayında olur:
   `https://<kullanıcı>.github.io/<depo>/`

Notlar:
- Tüm yollar **görelidir**, bu yüzden site alt dizinde (`/<depo>/`) sorunsuz çalışır.
- `.nojekyll` dosyası, GitHub Pages'in dosyaları olduğu gibi sunması için gereklidir — silmeyin.
- Yönlendirme hash tabanlıdır (`#/proje/...`), sunucu ayarı gerektirmez.

> Statik olduğu için Netlify, Cloudflare Pages, Nginx ya da mevcut Cloud Run
> kurulumunuza da aynı dosyalarla yüklenebilir.

## Klasör yapısı

```
fk-yapi/                  ← depo kökü = yayına alınan klasör
├── index.html
├── assets/{css,js,img}
├── data/projects.json    (üretilir — npm run build)
├── projects/             ← projelerinizi buraya koyun
├── .nojekyll             ← GitHub Pages için gerekli
├── build/
│   ├── generate.js       # klasörleri tarar → data/projects.json
│   ├── seed-samples.js   # örnek projeler üretir
│   └── organize-photos.js
├── server.js             # yerel önizleme sunucusu
└── package.json
```
