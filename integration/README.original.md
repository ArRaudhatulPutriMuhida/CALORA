# CALORA — Smart Nutrition Management

Aplikasi manajemen gizi terpadu berbasis **React + Vite** yang dirancang untuk mempermudah perencanaan nutrisi klinis rumah sakit dan program pemenuhan gizi sekolah secara cepat dan presisi.

## Fitur Utama
- **Landing Page & Quick Calculator**: Estimasi energi dan makronutrien langsung di beranda serta dashboard statistik terintegrasi.
- **Dashboard**: Statistik dinamis real-time (pasien, bahan makanan, resep, rencana MBG), grafik sebaran diet pasien, dan log aktivitas perencanaan terbaru.
- **Hospital Nutrition**: Manajemen menu diet pasien berdasarkan kategori klinis (Diabetes Melitus, Rendah Garam, Pascaoperasi, Diet Umum), filter kategori, dan pemantauan distribusi makanan.
- **MBG Nutrition Planner**: Perhitungan target AKG kelompok usia (PAUD/SD/SMP/SMA), budgeting per porsi, pemilihan bahan & menu resep, serta **Smart Meal Recommendation** otomatis.
- **Recipe Management**: Pengelolaan komposisi menu resep, takaran bahan, dan kalkulasi otomatis nilai nutrisi serta harga per porsi.
- **Food Management**: Pengelolaan katalog bahan makanan, pencarian, filter kategori, validasi nutrisi makro, dan harga porsi.

## Menjalankan lokal

Persyaratan: Node.js 20.19+ atau 22.12+ (disarankan Node.js 22).

```bash
npm install
npm run dev
```

Buka http://localhost:5173

```bash
npm run build
npm run preview
```

## Docker

```bash
docker build -t USERNAME/calora:v1-UTS .
docker run --rm -p 8080:80 USERNAME/calora:v1-UTS
docker login
docker push USERNAME/calora:v1-UTS
```

Ganti `USERNAME` dengan username Docker Hub. Buka http://localhost:8080.

## Git dan pembagian tim

- `feat_dashboard/11-10-2026`: layout, dashboard, landing page
- `feat_hospital/11-10-2026`: modul rumah sakit
- `feat_mbg/11-10-2026`: MBG dan katalog makanan

Setiap anggota membuat commit dengan awalan `feat:`, `fix:`, `style:`, atau `chore:`, push branch, lalu Pull Request ke `main`. Untuk penilaian UTS, riwayat kontribusi anggota harus benar-benar dikerjakan oleh masing-masing anggota, bukan hanya berasal dari ZIP.

## Struktur folder

```
src/
├── main.jsx
├── App.jsx                  # root: routing, layout, state global
├── style.css
├── components/              # UI reusable: Card, Tag, Heading, Stat, Sidebar
├── pages/                   # Landing, Dashboard, Hospital, MBG, Recipes, Foods
├── hooks/useLocalStorage.js # custom hook state persisten
├── utils/                   # format.js (rupiah), nutrition.js (sum, getRecipeNutrition, generateMealRecommendation)
└── data/                    # foods, recipes, patients, nutrition (data awal fiktif)
```

## Design pattern

- **Component-Based Architecture**: `Card`, `Stat`, `Heading`, `Tag`, `Sidebar` di `components/` dipakai ulang di banyak halaman.
- **Custom Hooks Pattern**: `hooks/useLocalStorage.js` membungkus `useState` + `useEffect` agar state tersimpan di browser. Dipakai di `App.jsx` untuk data makanan, resep, pasien, dan rencana.
- **Container-Presenter (ringan)**: `App.jsx` memegang state (container), halaman di `pages/` menerima data lewat props dan fokus menampilkan UI.
- **Utility functions**: `utils/nutrition.js` memisahkan logika hitung nutrisi, biaya, dan rekomendasi menu dari tampilan; `utils/format.js` untuk format rupiah.

## Batasan

- Tidak ada login, backend, sinkronisasi lintas perangkat, maupun database server.
- Semua informasi pasien bersifat fiktif.
- Nilai nutrisi dan target per kelompok usia merupakan angka ilustratif.
- Hapus data browser/localStorage akan menghapus data yang disimpan.
