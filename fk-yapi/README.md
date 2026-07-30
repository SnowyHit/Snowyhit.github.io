# FK Yapı — Web Sitesi

Tek sayfalık tanıtım sitesi + klasör isimlerinden **otomatik** okunan proje portföyü.
Yeni proje eklemek için tek yapmanız gereken: doğru isimde bir klasör açıp içine görselleri koymak ve `npm run build` çalıştırmak. Hiçbir kod/metin dosyası düzenlemenize gerek yok.

## Hızlı başlangıç

```bash
npm run seed     # (opsiyonel) örnek projeleri yer tutucu görsellerle oluşturur
npm run build    # klasörleri tarar, public/data/projects.json üretir
npm start        # http://localhost:4173 adresinde önizleme
```

`npm run dev` = build + start (tek komut).

## Yeni proje nasıl eklenir?

`public/projects/` klasörüne şu isimde bir klasör açın:

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
public/projects/villa__Marmaris,-Muğla__2025__FK-Marmaris-Bay-Villası__720/
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

## Yayına alma

Site tamamen **statiktir**. Deploy'dan önce `npm run build` çalıştırın ve
**`public/`** klasörünü herhangi bir statik sunucuya verin (Cloud Run, Netlify,
Nginx, GitHub Pages...). Mevcut sitenizdeki gibi Cloud Run için `public/` klasörünü
servis eden basit bir imaj yeterlidir.

## Klasör yapısı

```
fk-yapi/
├── build/
│   ├── generate.js      # klasörleri tarar → projects.json
│   └── seed-samples.js  # örnek projeler üretir
├── public/              # ← yayına alınan klasör
│   ├── index.html
│   ├── assets/{css,js,img}
│   ├── data/projects.json  (üretilir)
│   └── projects/           # ← projelerinizi buraya koyun
├── server.js            # yerel önizleme sunucusu
└── package.json
```
