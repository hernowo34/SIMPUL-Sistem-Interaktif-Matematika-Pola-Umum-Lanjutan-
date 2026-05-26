# Walkthrough: Aplikasi Edukasi Matematika (Collatz & Kuis Pola)

Seluruh permintaan Anda telah berhasil diimplementasikan! Berikut adalah ringkasan hasil kerja dan fitur yang telah ditambahkan sesuai dengan spesifikasi dan *feedback* yang diberikan.

## 1. Struktur Folder & Kode

Semua kode telah diletakkan dalam direktori `d:/Skripsi/Pola/` dengan struktur modular standar Flask:
- [app.py](file:///d:/Skripsi/Pola/app.py): Backend Flask yang memuat *endpoint* generator pola dan Collatz. Konfigurasi `app.run(host='0.0.0.0', ...)` sudah disertakan agar bisa diakses oleh IFP/perangkat di jaringan lokal yang sama.
- [style.css](file:///d:/Skripsi/Pola/static/css/style.css): *Stylesheet* yang menggunakan tema gelap dengan nuansa identitas **Universitas Negeri Malang (UM)** yaitu Biru Gelap (*Dark Blue*) dan Kuning Emas (*Gold*).
- **Templates**: [layout.html](file:///d:/Skripsi/Pola/templates/layout.html) (kerangka web), [index.html](file:///d:/Skripsi/Pola/templates/index.html) (halaman utama kalkulator), dan [quiz.html](file:///d:/Skripsi/Pola/templates/quiz.html) (halaman latihan soal).
- **Scripts**: [collatz.js](file:///d:/Skripsi/Pola/static/js/collatz.js) untuk menghubungkan Kalkulator ke *Chart.js*, dan [quiz.js](file:///d:/Skripsi/Pola/static/js/quiz.js) untuk mengelola state kuis dan interaksi UI secara langsung (*Local Storage*).

## 2. Kalkulator Collatz (Halaman 1)
- Input divalidasi dan dikirim ke backend via metode `POST /api/collatz`.
- Hasil dari *stopping time*, *peak value*, serta seluruh rangkaian angkanya kemudian dikembalikan ke *frontend* dan dirender secara instan menjadi **Line Chart interaktif** menggunakan library Chart.js (dengan titik dan garis berwarna tema UM).
- Terdapat tombol ke Halaman Latihan SMP di navigasi bagian atas.

## 3. Latihan Kuis Pola (Halaman 2)
- State (Level) dikelola melalui JavaScript `localStorage` di sisi *client* sehingga lebih responsif tanpa _page reload_.
- Logika **soal generatif** dikendalikan Python Flask `POST /api/quiz/generate`:
  - **Level awal (1-3)**: Generasi pola sehari-hari acak secara visual maupun kata-kata.
  - **Level lanjutan**: Generator *array* berbasis Aritmatika, Geometri, serta pola-pola khusus yang semakin kompleks.
  - **Kelipatan 10 (Level 10, 20, dll)**: Soal khusus pola emoji berurutan dan *Caesar Cipher* (geser Alfabet) tingkat tinggi.
- Jika siswa menjawab salah, input akan diberi efek getar merah (*shake animation*) agar mereka dapat langsung mencoba kembali pertanyaan yang sama. Jika 3 soal benar, progres otomatis lanjut ke level berikutnya.

## 4. Pop-up Materi Bilangan
Sesuai permintaan Anda, area teks (*Lorem Ipsum*) tidak lagi menggunakan desain *sidebar split-screen*, namun diubah menjadi tombol _floating button_ 📖 **Materi** berwarna *gold* di sisi kanan bawah. Jika tombol ditekan, maka pop-up materi akan muncul secara elegan melayang (*overlay*) di atas antarmuka kuis.

---

> [!TIP]
> **Cara Menjalankan**
> Anda bisa membuka *terminal* atau *Command Prompt* Anda, kemudian navigasikan ke direktori dengan menjalankan:
> ```cmd
> cd d:\Skripsi\Pola
> python app.py
> ```
> 
> Atau, jika Anda belum menginstal dependensi Flask:
> ```cmd
> pip install -r requirements.txt
> python app.py
> ```
> Setelah itu, buka alamat IP lokal komputer Anda di browser (misal: `http://localhost:5000` atau `http://192.168.x.x:5000`) dari layar proyektor interaktif atau *smartphone* di kelas.
