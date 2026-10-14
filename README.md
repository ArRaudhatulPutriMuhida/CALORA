# CALORA — Smart Nutrition Management Platform

**Platform Web Manajemen Gizi Terintegrasi untuk Layanan Kesehatan dan Program Makan Bergizi Gratis (MBG)**

CALORA merupakan aplikasi berbasis web yang dikembangkan menggunakan React dan Vite untuk membantu simulasi perencanaan menu makanan, pengelolaan data nutrisi, serta perhitungan anggaran makanan.

Aplikasi ini mengintegrasikan kebutuhan perencanaan makanan pasien rumah sakit dengan penyusunan menu program Makan Bergizi Gratis (MBG) melalui antarmuka yang interaktif dan mudah digunakan.

Project ini dikembangkan untuk memenuhi Ujian Tengah Semester (UTS) Praktikum Pengembangan Operasional Perangkat Lunak (POPL).

---

## 1. Latar Belakang

Pengelolaan makanan bergizi membutuhkan perencanaan yang mempertimbangkan kandungan nutrisi, kebutuhan pengguna, serta biaya penyediaan makanan.

Dalam layanan rumah sakit, penyusunan menu perlu memperhatikan kategori diet yang ditetapkan untuk pasien. Sementara itu, program Makan Bergizi Gratis (MBG) memerlukan perencanaan menu berdasarkan kelompok usia dan batas anggaran.

CALORA dikembangkan untuk membantu proses tersebut melalui sebuah platform web yang menggabungkan pengelolaan bahan makanan, resep, perhitungan nutrisi, dan simulasi perencanaan menu.

## 2. Tujuan Pengembangan

## 2. Tujuan Pengembangan

Tujuan pengembangan CALORA adalah:

1. Mempermudah simulasi perencanaan menu berdasarkan kategori diet pasien.
2. Membantu penyusunan menu MBG berdasarkan kelompok usia (PAUD, SD, SMP, SMA).
3. Menghitung kandungan nutrisi (kalori, protein, lemak, karbohidrat) dan estimasi biaya makanan secara otomatis.
4. Memfasilitasi pengelolaan bahan makanan dan resep.
5. Memberikan rekomendasi kombinasi menu berdasarkan target nutrisi dan anggaran.
6. Menyediakan penyimpanan data lokal menggunakan `LocalStorage` tanpa ketergantungan backend server pada tahap prototype.
   
## 3. Fitur Utama

### 3.1 Dashboard

Dashboard menjadi pusat informasi CALORA dengan menampilkan ringkasan data serta visualisasi statistik untuk memudahkan pengguna memantau informasi aplikasi.

### 3.2 Hospital Nutrition Management

Modul ini mendukung simulasi pengelolaan menu makanan pasien rumah sakit, meliputi:

- Menampilkan daftar pasien fiktif.
- Menampilkan informasi dan kategori diet pasien.
- Menyediakan pilihan menu sesuai kategori diet.
- Membantu penyusunan rencana makanan pasien.
- Menampilkan informasi nutrisi menu.

### 3.3 Food Management

Modul ini menyediakan pengelolaan data bahan makanan menggunakan operasi CRUD (*Create, Read, Update, Delete*).

Data bahan makanan mencakup nama, kategori, harga, dan komposisi nutrisi.

### 3.4 MBG Nutrition Planner

Modul MBG membantu pengguna merencanakan menu berdasarkan kelompok usia PAUD, SD, SMP, dan SMA.

Fungsionalitas utama:

- Memilih kelompok usia.
- Menyusun kombinasi makanan.
- Menghitung energi, protein, karbohidrat, dan lemak.
- Menghitung estimasi biaya menu.
- Menentukan dan mengevaluasi batas anggaran.
- Menampilkan perbandingan hasil perhitungan terhadap target nutrisi simulasi.

### 3.5 Recipe Management

Modul ini digunakan untuk mengelola resep makanan, termasuk bahan penyusun, komposisi, serta estimasi kandungan nutrisi dan biaya resep.

### 3.6 Smart Meal Recommendation

Fitur ini memberikan rekomendasi kombinasi menu berdasarkan data makanan, target nutrisi, dan batas anggaran yang ditentukan pengguna.

Rekomendasi menggunakan algoritma perhitungan berbasis JavaScript, bukan AI generatif.

**Catatan:** CALORA merupakan prototype untuk simulasi. Target nutrisi dan kategori diet yang digunakan tidak menggantikan standar gizi resmi atau keputusan tenaga kesehatan.

## 4. Teknologi yang Digunakan

| Teknologi | Fungsi |
|---|---|
| React | Pengembangan antarmuka berbasis komponen |
| Vite | Development server dan build tool |
| JavaScript | Logika aplikasi dan perhitungan |
| React Router | Navigasi antarmodul |
| CSS | Styling dan tampilan responsif |
| Lucide React | Ikon antarmuka |
| Recharts | Visualisasi data |
| LocalStorage | Penyimpanan data pada browser |
| Git & GitHub | Version control dan kolaborasi |
| Docker | Kontainerisasi aplikasi |
| Nginx | Web server untuk hasil build React |

## 5. Arsitektur Aplikasi

CALORA menggunakan arsitektur frontend-only berbasis React.

Seluruh proses pengelolaan state, perhitungan nutrisi, dan interaksi pengguna dijalankan pada sisi browser menggunakan JavaScript.

Data awal berasal dari file lokal, sedangkan perubahan data pengguna dapat disimpan menggunakan LocalStorage.

Pada versi UTS, aplikasi tidak menggunakan backend atau database server terpisah.

## 6. Penerapan Design Pattern

CALORA menerapkan **Hooks Pattern** melalui penggunaan React Hooks dan custom hook.

React Hooks yang digunakan meliputi:

- `useState` untuk mengelola state.
- `useEffect` untuk menangani efek samping dan penyimpanan.
- `useMemo` untuk membantu optimalisasi perhitungan.
- `useLocalStorage` sebagai custom hook untuk pengelolaan data lokal.

Contoh implementasi custom hook dapat ditemukan pada:

`src/hooks/useLocalStorage.js`

Custom hook tersebut digunakan pada `src/App.jsx` untuk mengelola data bahan makanan, resep, pasien, dan rencana menu.

Penerapan Hooks Pattern membantu mengurangi pengulangan kode, meningkatkan penggunaan ulang logika, serta mempermudah pemeliharaan aplikasi.

## 7. Struktur Direktori

```text
CALORA/
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Hospital.jsx
│   │   ├── Foods.jsx
│   │   ├── MBG.jsx
│   │   └── Recipes.jsx
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
├── Dockerfile
├── nginx.conf
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 8. Instalasi dan Menjalankan Aplikasi

### Persyaratan

- Node.js
- npm
- Git
- Visual Studio Code atau editor lainnya

### Clone Repository

```bash
git clone https://github.com/ArRaudhatulPutriMuhida/CALORA.git
```

### Masuk ke Direktori Project

```bash
cd CALORA
```

### Instal Dependencies

```bash
npm install
```

### Jalankan Development Server

```bash
npm run dev
```

Akses aplikasi melalui alamat yang ditampilkan oleh Vite, biasanya:

http://localhost:5173

### Production Build

```bash
npm run build
```

Perintah tersebut menghasilkan folder `dist` yang berisi aplikasi untuk lingkungan production.

## 9. Penerapan Docker

CALORA menggunakan Docker dengan pendekatan **Multi-Stage Build**.

Proses kontainerisasi terdiri atas dua tahap:

1. **Build Stage:** Menggunakan Node.js 22 untuk menginstal dependencies dan menjalankan proses build React.
2. **Production Stage:** Menggunakan Nginx untuk menyajikan hasil build React melalui port 80.

Konfigurasi Docker terdapat pada file:

- `Dockerfile`
- `nginx.conf`
- `.dockerignore`

### Build Docker Image

```bash
docker build -t USERNAME_DOCKER/calora:v1-UTS .
```

### Menjalankan Docker Container

```bash
docker run --rm -p 8080:80 USERNAME_DOCKER/calora:v1-UTS
```

Akses aplikasi melalui:

http://localhost:8080

### Push ke Docker Hub

Login terlebih dahulu:

```bash
docker login
```

Kemudian jalankan:

```bash
docker push USERNAME_DOCKER/calora:v1-UTS
```

### Public Docker Hub Repository

**Repository:** https://hub.docker.com/r/USERNAME_DOCKER/calora

**Image:** `USERNAME_DOCKER/calora:v1-UTS`

**Catatan:** Ganti placeholder dengan informasi Docker Hub yang sebenarnya setelah image berhasil diunggah. Pastikan repository Docker Hub bersifat public.

## 10. Pembagian Tugas Anggota

| Anggota | Tanggung Jawab |
|---|---|
| Anggota 1 — [Roseline Balqist/2408107010079] | Setup React + Vite, konfigurasi project, komponen umum, integrasi aplikasi, pengujian akhir, dan Docker |
| Anggota 2 — [Silvia Putri/2408107010086] | Dashboard, Hospital Nutrition, Food Management, serta dokumentasi project |
| Anggota 3 — [Ar Raudhatul Putri Muhida/2408107010082] | MBG Nutrition Planner, Recipe Management, Smart Meal Recommendation, serta pemeliharaan repository |

Pengembangan dikelola menggunakan Git dan GitHub melalui branch, commit, dan Pull Request untuk mendokumentasikan kontribusi masing-masing anggota.

## 11. Rencana Pengembangan

Pengembangan CALORA selanjutnya direncanakan mencakup:

1. Integrasi backend dan database untuk penyimpanan data terpusat.
2. Sistem login dan pengelolaan hak akses pengguna.
3. Penyempurnaan algoritma rekomendasi menu.
4. Integrasi sumber data nutrisi yang tervalidasi.
5. Pengembangan laporan dan analitik gizi.
6. Pengembangan fitur monitoring perencanaan dan distribusi makanan.

## 12. Repository Project

**GitHub Repository:**

https://github.com/ArRaudhatulPutriMuhida/CALORA

---

**CALORA — Smart Nutrition Management Platform**

Dikembangkan untuk memenuhi UTS Praktikum Pengembangan Operasional Perangkat Lunak (POPL), 2026.
