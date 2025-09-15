# Panduan Deploy Sistem Kehadiran Asrama

## Cara 1: Deploy menggunakan Netlify (Disyorkan)

### Langkah 1: Pergi ke Netlify
1. Buka https://www.netlify.com
2. Klik "Sign up" atau "Log in"
3. Daftar menggunakan email atau GitHub

### Langkah 2: Deploy Manual
1. Klik "Add new site" > "Deploy manually"
2. Drag dan drop folder `SAD` ke dalam kotak upload
3. Tunggu proses upload selesai
4. Website anda akan dapat URL seperti: `https://random-name.netlify.app`

### Langkah 3: Tukar Nama Domain (Pilihan)
1. Pergi ke "Site settings" > "Change site name"
2. Tukar kepada nama yang anda mahu, contoh: `sistem-kehadiran-asrama`
3. URL akan menjadi: `https://sistem-kehadiran-asrama.netlify.app`

## Cara 2: Deploy menggunakan Vercel

### Langkah 1: Pergi ke Vercel
1. Buka https://vercel.com
2. Klik "Sign up" atau "Log in"
3. Daftar menggunakan email atau GitHub

### Langkah 2: Deploy
1. Klik "Add New" > "Project"
2. Upload folder atau connect dengan GitHub
3. Klik "Deploy"
4. Website akan dapat URL seperti: `https://project-name.vercel.app`

## Cara 3: Deploy menggunakan GitHub Pages

### Langkah 1: Upload ke GitHub
1. Buka https://github.com
2. Buat repository baru dengan nama `sistem-kehadiran-asrama`
3. Upload semua fail dalam folder `SAD`

### Langkah 2: Aktifkan GitHub Pages
1. Pergi ke "Settings" > "Pages"
2. Pilih "Deploy from a branch"
3. Pilih "main" branch dan "/ (root)"
4. Klik "Save"
5. Website akan dapat URL: `https://username.github.io/sistem-kehadiran-asrama`

## Fail-fail yang Diperlukan untuk Deploy

Pastikan folder anda mengandungi fail-fail berikut:
- `index.html` (fail utama)
- `styles.css` (styling)
- `script.js` (functionality)
- `package.json` (dependencies info)
- `netlify.toml` (konfigurasi Netlify)
- `.gitignore` (fail yang tidak perlu diupload)
- `README.md` (dokumentasi)

## Selepas Deploy

### Test Website
1. Buka URL yang diberikan
2. Test semua fungsi:
   - Login dengan `admin`/`admin123` atau `guru`/`guru123`
   - Test QR scanner (perlu HTTPS untuk kamera)
   - Test import/export Excel
   - Test semua tab (Pengimbas, Pelajar, Laporan, Pentadbiran)

### Domain Custom (Pilihan)
Jika anda mahu domain sendiri seperti `kehadiran.sekolah.edu.my`:
1. Beli domain dari provider seperti Namecheap, GoDaddy
2. Dalam Netlify/Vercel, pergi ke "Domain settings"
3. Tambah custom domain
4. Update DNS records mengikut arahan

## Perkara Penting

⚠️ **HTTPS Diperlukan**: Untuk QR scanner berfungsi, website mesti menggunakan HTTPS (semua platform di atas provide HTTPS secara automatik)

⚠️ **Data Storage**: Website ini menggunakan browser localStorage, jadi data akan hilang jika browser cache dibersihkan. Untuk production, pertimbangkan database sebenar.

⚠️ **Login Security**: Tukar password default dalam production untuk keselamatan.

## Sokongan

Jika ada masalah:
1. Semak console browser untuk error
2. Pastikan semua fail diupload dengan betul
3. Test pada browser yang berbeza
4. Pastikan internet connection stabil untuk QR scanner
