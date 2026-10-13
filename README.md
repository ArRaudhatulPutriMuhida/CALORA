# CALORA — Template React (Anggota 1)

Ini adalah **fondasi awal CALORA** dari `CALORA FIX.zip` yang dipisahkan untuk proses kontribusi kelompok UTS POPL. Modul fitur sengaja tidak disertakan pada commit template.

## Menjalankan

```bash
npm install
npm run dev
npm run build
```

## Pembagian kerja

- Anggota 1: React + Vite, komponen umum, routing dasar (`App.jsx`), state hook, styling global, integrasi final, Docker.
- Anggota 2: Landing + Dashboard, Hospital Nutrition, Food Management.
- Anggota 3: MBG Planner, Recipe Management, Smart Meal Recommendation.

## Integrasi setelah fitur merge

Setelah PR Anggota 3 dan PR Anggota 2 masuk ke `main`, salin `integration/App.final.jsx` ke `src/App.jsx`, lalu jalankan `npm install`, `npm run dev`, dan `npm run build`.

File `integration/README.original.md` adalah README asli dari `CALORA FIX.zip`; tinjau dan update informasinya sebelum laporan final. File dalam `integration/` tidak diperlukan oleh runtime.

## Docker (setelah aplikasi lengkap)

`Dockerfile` dan `nginx.conf` berasal dari CALORA FIX. Jalankan Docker dari project lengkap yang telah digabung, bukan saat masih template.
