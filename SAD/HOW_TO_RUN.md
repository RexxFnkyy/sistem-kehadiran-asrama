# 🚀 Cara Menjalankan Sistem Kehadiran Asrama

## ✅ Semua Masalah Telah Diperbaiki!

### 🔧 Masalah yang Telah Diselesaikan:
- ✅ **Forgot Password** - Kini berfungsi dengan kod pemulihan
- ✅ **QR Code Generation** - QR kod akan dipaparkan dengan betul
- ✅ **QR Code Scanning** - Kamera berfungsi untuk imbas QR
- ✅ **Download & Print QR** - Boleh muat turun dan cetak QR kod

## 🖥️ Cara Menjalankan di Komputer Anda

### Pilihan 1: Buka Terus (Mudah)
1. **Double-click** pada fail `index.html`
2. Website akan terbuka di browser anda
3. Siap digunakan!

### Pilihan 2: Menggunakan Live Server (Disyorkan)
1. Buka **Command Prompt** atau **PowerShell**
2. Pergi ke folder projek:
   ```
   cd "d:\PBL SUCCESS\SAD"
   ```
3. Jalankan server:
   ```
   npx live-server --port=3000
   ```
4. Website akan terbuka di: `http://localhost:3000`

### Pilihan 3: Menggunakan Python Server
1. Buka **Command Prompt** di folder projek
2. Jalankan:
   ```
   python -m http.server 8000
   ```
3. Buka browser dan pergi ke: `http://localhost:8000`

## 🔑 Maklumat Login

### Akaun Admin
- **Username:** `admin`
- **Password:** `admin123`

### Akaun Guru  
- **Username:** `guru`
- **Password:** `guru123`

### Reset Password
- **Kod Pemulihan:** `RECOVERY123`
- Klik "Lupa Kata Laluan?" untuk test fungsi reset

## 📱 Cara Menggunakan Sistem

### 1. Login
- Masukkan username dan password
- Atau test "Lupa Kata Laluan?" dengan kod `RECOVERY123`

### 2. QR Scanner (Tab Pengimbas)
- Klik "Mula Imbas" untuk buka kamera
- Arahkan kamera ke QR kod pelajar
- Pilih status kehadiran (Hadir Asrama/Prep/Keluar/Lewat/Pulang Bermalam)

### 3. Pengurusan Pelajar (Tab Pelajar)
- **Tambah Pelajar:** Klik "Tambah Pelajar"
- **Import Excel:** Klik "Import Excel" (gunakan "Panduan Import" untuk bantuan)
- **Jana QR:** Klik butang QR pada kad pelajar untuk jana QR kod
- **Muat Turun QR:** QR kod boleh dimuat turun sebagai PNG
- **Cetak QR:** QR kod boleh dicetak terus

### 4. Laporan (Tab Laporan)
- Pilih tarikh mula dan tamat
- Klik "Jana Laporan" untuk lihat statistik
- Klik "Export ke Excel" untuk muat turun laporan lengkap

### 5. Pentadbiran (Tab Pentadbiran)
- Urus tetapan sistem
- Sandaran data
- Padam rekod lama

## 🔍 Test Semua Fungsi

### Test QR Code:
1. Pergi ke tab "Pelajar"
2. Klik butang QR pada mana-mana pelajar
3. QR kod akan dipaparkan dalam modal
4. Test "Muat Turun QR" dan "Cetak QR"

### Test Scanner:
1. Pergi ke tab "Pengimbas"
2. Klik "Mula Imbas"
3. Allow akses kamera
4. Arahkan ke QR kod yang dijana
5. Pilih status kehadiran

### Test Import/Export:
1. Klik "Panduan Import" untuk lihat format
2. Muat turun template Excel
3. Test import data pelajar
4. Test export laporan ke Excel

## ⚠️ Perkara Penting

### Untuk QR Scanner Berfungsi:
- **Kamera diperlukan** - Allow akses kamera
- **HTTPS diperlukan** untuk production (auto dapat bila deploy online)
- **Browser moden** - Chrome, Firefox, Safari, Edge

### Data Storage:
- Data disimpan dalam **browser localStorage**
- Data akan hilang jika clear browser cache
- Untuk production, guna database sebenar

### Sample Data:
- Sistem datang dengan 3 pelajar sample:
  - Ahmad Rahman (Dorm A)
  - Siti Nurhaliza (Dorm A) 
  - Muhammad Ali (Dorm B)

## 🌐 Deploy ke Website Sebenar

Selepas test local, ikut panduan dalam `deploy.md` untuk upload ke:
- **Netlify** (disyorkan)
- **Vercel**
- **GitHub Pages**

## 🆘 Jika Ada Masalah

### QR Scanner Tidak Berfungsi:
1. Pastikan allow akses kamera
2. Guna HTTPS (deploy online)
3. Test di browser lain

### QR Code Tidak Keluar:
1. Refresh browser
2. Check console untuk error
3. Pastikan internet connection untuk load library

### Import Excel Gagal:
1. Check format Excel mengikut panduan
2. Pastikan ada lajur Name dan ID
3. File size < 5MB

Sistem kini **100% berfungsi** dan siap untuk digunakan! 🎉
