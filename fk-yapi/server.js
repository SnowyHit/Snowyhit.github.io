/**
 * Basit statik dosya sunucusu (bağımlılık gerektirmez).
 * Yerel önizleme için:  npm run dev   (önce build çalışır)  veya  npm start
 * Yayına alırken herhangi bir statik sunucu (nginx, Cloud Run, Netlify...) kullanılabilir;
 * yalnızca `public/` klasörünü servis etmeniz yeterlidir.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "public");
const PORT = process.env.PORT || 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (urlPath === "/") urlPath = "/index.html";

    let filePath = path.normalize(path.join(PUBLIC, urlPath));
    if (!filePath.startsWith(PUBLIC)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    // SPA yönlendirmesi: dosya yoksa ve uzantısı yoksa index.html'e düş.
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      if (!path.extname(filePath)) filePath = path.join(PUBLIC, "index.html");
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("404 — bulunamadı");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" }).end("500 — sunucu hatası");
  }
});

server.listen(PORT, () => {
  console.log(`▶ FK Yapı sitesi: http://localhost:${PORT}`);
});
