# Shade-OS.github.io

[shade-os.com](https://shade-os.com) — ShadeOS organizasyonunun sitesi.

Vite + React + TypeScript. Sosyal medya kazıyıcıları ve JS çalıştırmayan
istemciler sayfayı boş görmesin diye derleme sırasında **ön-render** yapılır
(`scripts/prerender.mjs`, SSR çıktısını `dist/index.html` içine gömer).

## Geliştirme

```
npm install
npm run dev        # http://localhost:5173
```

## Yayın

`main` dalına her push, `.github/workflows/deploy.yml` ile derlenip GitHub
Pages'e gider. Elle bir şey yapmaya gerek yok.

Özel alan adı `public/CNAME` dosyasından gelir; Vite `public/` altını
olduğu gibi `dist/` içine kopyaladığı için her yayımda yerinde kalır.