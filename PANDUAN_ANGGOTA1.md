# Anggota 1 — Setup React, Integrasi, dan Docker

**Bukan ZIP aplikasi final.** Isinya template React + Vite dan komponen umum; halaman 6 fitur sengaja belum ada.

1. Pemilik repository undang kedua anggota melalui Settings > Collaborators.
2. `git clone https://github.com/ArRaudhatulPutriMuhida/CALORA.git CALORA-GITHUB` (repository masih kosong).
3. Salin **isi folder CALORA pada ZIP ini** ke dalam folder hasil clone `CALORA-GITHUB/` (jangan mengganti folder `.git`).
4. Di folder hasil clone: `npm install`, `npm run dev`, `npm run build`.
5. Commit template dengan identitas Git Anda sendiri:
   `git add .`
   `git commit -m "chore: initialize CALORA React Vite template"`
   `git branch -M main`
   `git push -u origin main`
6. Anggota 3 dan 2 bekerja di branch masing-masing dengan kode ZIP masing-masing dan buat Pull Request ke main.
7. **Setelah kedua PR merge**, perbarui main: `git switch main && git pull origin main`.
8. Salin `integration/App.final.jsx` menjadi `src/App.jsx` (overwrite placeholder), lalu `npm install` dan uji seluruh fitur, `npm run build`.
9. Buat branch integrasi: `git switch -c feat_integrasi/13-10-2026`, `git add src/App.jsx`, commit dan push; buat PR dan merge.
10. Dari main final, `docker build -t calora:local-test .` lalu `docker run --rm -p 8080:80 calora:local-test`.
11. Setelah test Docker berhasil, tag `USERNAME_DOCKER/calora:v1-UTS` dan push ke Docker Hub. Update README final.

**Penting:** Source awal sudah tersedia dalam CALORA FIX, sehingga commit anggota sebaiknya secara transparan mencerminkan pekerjaan integrasi/pemeriksaan/perbaikan nyata yang dilakukan.
