# little archive

Album foto statis yang siap dipublikasikan lewat GitHub Pages. Tidak perlu build step atau backend.
Pemutar musik menggunakan audio lokal di `assets/album-soundtrack.mp3` dan tidak memulai musik secara otomatis.
Volume bisa diatur melalui slider; kontrol mute dan efek visual pemutar juga tersedia.

## Jalankan lokal

Buka `index.html` di browser, atau jalankan server lokal:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Publikasikan dengan GitHub Pages

1. Unggah seluruh isi folder ini ke repository `TNzRexzy/album-foto` pada branch `main`.
2. Buka [Settings → Pages](https://github.com/TNzRexzy/album-foto/settings/pages).
3. Pada **Build and deployment → Source**, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/ (root)`, lalu tekan **Save**.
5. Tunggu workflow **pages build and deployment** selesai pada tab **Actions**.
6. Situs akan tersedia di `https://tnzrexzy.github.io/album-foto/`.

Pastikan repository dapat diakses publik jika ingin menggunakan GitHub Pages tanpa paket berbayar. Unggah foto dan lagu bersama semua berkas situs di folder `assets/`.

Foto dan lagu tersimpan lokal di `assets/`. Pastikan folder ini ikut diunggah bersama file situs. Pastikan izin distribusi audio tetap berlaku untuk publikasi GitHub Pages. Font memakai Google Fonts; jika font eksternal tidak tersedia, browser akan memakai font cadangan.
