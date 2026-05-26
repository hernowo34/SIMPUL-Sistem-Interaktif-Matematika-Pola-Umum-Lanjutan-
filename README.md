# 🧮 Edukasi Matematika: Pola Umum & Lanjutan

Aplikasi Web Edukasi Matematika interaktif yang dibangun menggunakan **Python Flask** dan **Vanilla JavaScript**. Aplikasi ini didesain secara khusus untuk pembelajaran siswa Sekolah Menengah Pertama (SMP) ataupun untuk eksplorasi konseptual oleh guru dan peneliti, dengan mengusung antarmuka pengguna bertema gelap (*Dark Theme*) khas *branding* Universitas Negeri Malang (UM).

## ✨ Fitur Utama

Aplikasi ini dibagi menjadi dua fokus instrumen pembelajaran:

### 1. 📈 Kalkulator & Visualizer *Collatz Conjecture*
- Menghitung rentetan pola langkah yang ditempuh dari sembarang bilangan bulat positif hingga mencapai siklus akhir 4-2-1 (*3n+1 problem*).
- Visualisasi grafik *real-time* yang responsif dan interaktif menggunakan **Chart.js** untuk menunjukkan fluktuasi naik-turun angka.
- Menyajikan ringkasan statistik: total langkah, nilai tertinggi (puncak), serta deret angka yang dilalui.

### 2. 🧩 Kuis Latihan Pola Generatif (Sistem Leveling)
- **Generasi Soal Otomatis (*Stateless*)**: Server Python menghasilkan set kuis secara tak terbatas sehingga siswa tidak akan pernah mengulang pertanyaan yang sama.
- **Tingkat Kesulitan Terstruktur (*Scaffolding*)**: 
  - **Level 1-3 (Pemula)**: Menggunakan pendekatan logika gambar dan kata-kata sehari-hari (pola berulang, selang-seling). Dilengkapi dengan fitur antarmuka **Drag & Drop** (seret dan taruh) untuk menebak.
  - **Level 4-6 (Aritmatika Dasar)**: Transisi mulus ke angka dengan deret angka yang naik (seperti 1, 2, 3) dan selisih angka yang positif (Level 5) lalu campuran positif-negatif (Level 6).
  - **Level 7-9 (Menengah)**: Deret geometri ringan dan pola campuran 2-fase (seperti: 1, 4, 7, 2, 5, 8).
  - **Level 11+ (Tinggi)**: Meliputi pola Fibonacci berulang, *Alternate series*, pola 2-fase berjumlah panjang, hingga selipan pertanyaan khusus *Caesar Cipher* / geser alfabet dan pola emotikon pada kelipatan 10.
- **Sistem Penyimpanan Progres Lokal**: Otomatis menyimpan progres Level secara lokal (*localStorage*) tanpa memerlukan akun login (sangat ramah dipakai di kelas/laboratorium).
- **Materi Referensi (*Pop-up*)**: Fitur *overlay popup* melayang di pojok layar berisikan rangkuman bacaan bagi murid yang butuh panduan cepat.

## 🛠️ Tech Stack

- **Backend:** Python 3, Flask, Werkzeug
- **Frontend:** HTML5, CSS3 (*Vanilla Custom CSS*), Vanilla JavaScript (ES6)
- **Library Tambahan:** [Chart.js](https://www.chartjs.org/) (via CDN)

## 🚀 Cara Menjalankan Aplikasi Secara Lokal (LAN)

Aplikasi ini sudah diprogram agar dapat di-*host* pada jaringan lokal sehingga perangkat lain (seperti laptop siswa, ponsel, atau *Interactive Flat Panel*) dapat mengaksesnya melalui browser dalam satu jaringan WiFi yang sama.

### Prasyarat
- [Python 3.8+](https://www.python.org/downloads/) telah terpasang di komputer utama (Host).
- Pastikan terkoneksi dengan WiFi/Jaringan lokal (LAN).

### Langkah Instalasi
1. *Clone* repositori ini ke dalam komputer Anda.
   ```bash
   git clone https://github.com/username/Pola-Matematika-UM.git
   cd Pola-Matematika-UM
   ```

2. Sangat disarankan menggunakan *Virtual Environment*.
   ```bash
   # (Opsional) Buat & Aktifkan virtual environment
   python -m venv venv
   # Di Windows
   venv\Scripts\activate
   # Di Mac/Linux
   source venv/bin/activate
   ```

3. Instal semua dependensi yang diperlukan.
   ```bash
   pip install -r requirements.txt
   ```

4. Jalankan Server Flask.
   ```bash
   python app.py
   ```

5. Buka Command Prompt/Terminal, jalankan `ipconfig` (Windows) atau `ifconfig` (Mac/Linux) untuk mengetahui Alamat IPv4 lokal Anda. 
6. Buka Browser di perangkat mana pun yang terhubung dengan jaringan yang sama, dan masukkan URL dengan port `5000`:
   ```
   http://<Alamat-IP-Anda>:5000
   ```
   *(Contoh: `http://192.168.1.15:5000`)*

## 📸 Tampilan (*Screenshots*)

> *(Gantikan bagian ini dengan tangkapan layar antarmuka program Anda sebelum dipublikasikan ke publik)*
> 
> ![Kalkulator Collatz](link_gambar_1)
> ![Halaman Kuis Drag & Drop](link_gambar_2)
> ![Halaman Kuis Level Tinggi](link_gambar_3)

## 📝 Lisensi
Bebas untuk digunakan dan dimodifikasi untuk tujuan penelitian dan pendidikan.

---
*Dibuat untuk mempermudah eksplorasi keajaiban pola angka dalam matematika.* 🎓
