# 📷 Panduan Mengatasi Masalah Kamera

## ✅ Masalah Kamera Telah Diperbaiki!

Saya telah menambah penambahbaikan berikut untuk mengatasi masalah kamera:

### 🔧 Penambahbaikan Yang Dibuat:
- ✅ **Deteksi kamera yang lebih baik** - Cuba kamera belakang, hadapan, dan mana-mana kamera
- ✅ **Mesej ralat yang lebih jelas** - Tunjuk sebab sebenar kamera tidak berfungsi
- ✅ **Input manual sebagai alternatif** - Jika kamera gagal, boleh masukkan ID pelajar secara manual
- ✅ **Pengesahan HTTPS/localhost** - Amaran jika protocol tidak selamat

## 🚨 Sebab Utama Kamera Tidak Berfungsi:

### 1. **Protocol Tidak Selamat (Paling Biasa)**
- **Masalah:** Menggunakan `file://` atau `http://` tanpa localhost
- **Penyelesaian:** Guna salah satu cara ini:

```powershell
# Cara 1: Python Server (Disyorkan)
cd "d:\PBL SUCCESS\SAD"
python -m http.server 8000 --bind 0.0.0.0

# Cara 2: Node.js Live Server
npx live-server --host=0.0.0.0 --port=3000

# Cara 3: XAMPP
# Copy folder ke C:\xampp\htdocs\ dan start Apache
```

**Kemudian akses:** `http://localhost:8000` atau `http://192.168.0.140:8000`

### 2. **Permission Ditolak**
- **Masalah:** User klik "Block" pada popup kamera
- **Penyelesaian:** 
  1. Klik ikon kamera di address bar browser
  2. Pilih "Allow" untuk camera access
  3. Refresh halaman dan cuba lagi

### 3. **Kamera Digunakan Aplikasi Lain**
- **Masalah:** Zoom, Teams, atau app lain guna kamera
- **Penyelesaian:** Tutup semua aplikasi yang guna kamera

### 4. **Browser Tidak Menyokong**
- **Masalah:** Browser lama atau tidak compatible
- **Penyelesaian:** Guna browser moden:
  - ✅ Chrome (terbaik)
  - ✅ Firefox
  - ✅ Edge
  - ✅ Safari (mobile)

## 📱 Alternatif: Input Manual

Jika kamera masih tidak berfungsi, sistem akan automatik tunjuk **Input Manual**:

1. **Masukkan ID Pelajar** dalam kotak input
2. **Atau masukkan nama** pelajar (sebahagian pun boleh)
3. Klik **"Cari Pelajar"**
4. Pilih status kehadiran seperti biasa

## 🔧 Langkah Troubleshooting:

### Step 1: Check Protocol
```
❌ Salah: file:///d:/PBL%20SUCCESS/SAD/index.html
❌ Salah: http://192.168.0.140:8000 (tanpa server)
✅ Betul: http://localhost:8000
✅ Betul: http://192.168.0.140:8000 (dengan server)
```

### Step 2: Check Browser Console
1. Tekan **F12** untuk buka Developer Tools
2. Pergi ke **Console** tab
3. Cuba start kamera dan lihat error message
4. Cari error seperti:
   - `NotAllowedError` = Permission ditolak
   - `NotFoundError` = Tiada kamera
   - `NotSupportedError` = Browser tidak support

### Step 3: Test Different Browsers
- Cuba Chrome, Firefox, Edge
- Mobile browser biasanya lebih baik untuk kamera

### Step 4: Check Windows Camera Settings
1. Buka **Settings** → **Privacy & Security**
2. Pilih **Camera**
3. Pastikan "Allow apps to access your camera" = **ON**
4. Pastikan browser anda dalam senarai allowed apps

## 🌐 Untuk Network Access:

### Allow Firewall (Run as Administrator):
```powershell
netsh advfirewall firewall add rule name="Python Server" dir=in action=allow protocol=TCP localport=8000
```

### Alternative Ports:
```powershell
# Jika port 8000 blocked
python -m http.server 3000 --bind 0.0.0.0
python -m http.server 8080 --bind 0.0.0.0
```

## 📋 Quick Test Checklist:

- [ ] ✅ Guna `http://localhost:8000` (bukan file://)
- [ ] ✅ Allow camera permission dalam browser
- [ ] ✅ Tutup aplikasi lain yang guna kamera
- [ ] ✅ Guna browser moden (Chrome/Firefox)
- [ ] ✅ Check Windows camera privacy settings
- [ ] ✅ Cuba mobile browser jika desktop gagal

## 🆘 Jika Masih Gagal:

### Guna Input Manual:
1. Sistem akan automatik tunjuk input manual
2. Masukkan ID atau nama pelajar
3. Klik "Cari Pelajar"
4. Berfungsi sama seperti QR scanner!

### Mobile Alternative:
- Mobile browser biasanya lebih baik untuk kamera
- Akses `http://192.168.0.140:8000` dari phone
- Camera permission lebih mudah di mobile

Sistem kini ada **backup plan** jika kamera tidak berfungsi! 🎉
