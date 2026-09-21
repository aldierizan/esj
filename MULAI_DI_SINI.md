# Cara memakai versi revisi ini

## 1. Buka website

Ekstrak ZIP, lalu buka folder Website di VS Code seperti biasa. Jalankan melalui
Live Server yang sudah kamu gunakan. File gallery.js dan favicon.ico harus ikut
berada di folder yang sama dengan index.html.

## 2. Cek perubahan

- Enam ikon industri memakai SVG dari ZIP yang kamu kirim.
- Gallery berisi 9 foto dengan proporsi asli, tanpa ruang kosong di samping foto portrait.
- Klik foto untuk membuka tampilan besar. Panah, Escape, swipe, dan tombol tutup tersedia.
- Semua 9 kolom selain Pertanyaan wajib diisi. Pengalaman kerja boleh diisi
  "Belum ada pengalaman" jika pelamar belum pernah bekerja.
- Favicon memakai logo dari base Website.zip pada homepage dan halaman signup.

## 3. Update Apps Script sebelum memakai form

Backend juga berubah, bukan hanya HTML. Buka Google Sheet > Extensions > Apps Script,
ganti kode dengan isi google-apps-script.gs dari ZIP ini, lalu simpan.
Jalankan setup() bila belum pernah dilakukan; fungsi ini tidak menghapus data lama.
Lakukan Deploy > Manage deployments > Edit > New version > Deploy pada deployment
web app yang sudah ada. Mengedit deployment yang sama mempertahankan URL-nya.

Di signup.html, ganti data-endpoint yang masih berisi
PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE dengan URL /exec yang aktif.
Jangan menggunakan URL /dev. Jangan menghapus deployment lama sebelum memastikan
URL yang dipakai website sesuai.

Saat URL /exec dibuka, respons status harus menunjukkan schemaVersion 2 dan
validationVersion 3. Form tidak menganggap respons backend versi sebelumnya
sebagai konfirmasi sukses.

Lengkapi 9 kolom wajib, kosongkan Pertanyaan, dan kirim satu data uji berlabel TEST.
Pastikan baris benar-benar muncul di Sheet. Setelah itu hapus baris uji tersebut.
Panduan lengkap ada di GOOGLE_SHEETS_SETUP.md.

## 4. Upload ke repo yang sama

Salin ISI folder Website ke folder publikasi website yang sudah ada, bukan
membuat folder Website tambahan di dalamnya. Upload index.html, signup.html,
style.css, main.js, gallery.js, signup.js, favicon.ico dan seluruh folder assets.
Pertahankan file CNAME/konfigurasi domain yang mungkin sudah ada di repo live.
ZIP base yang kamu kirim tidak berisi CNAME.

Kode Apps Script tetap harus dipasang di editor Apps Script. Meng-upload file .gs
ke GitHub saja tidak akan mengubah backend form.

Versi ini tidak otomatis mengubah repo GitHub atau deployment Google Apps Script.
Pengujian tampilan dan logika dilakukan secara lokal/offline serta menggunakan
respons backend simulasi. Uji penyimpanan ke Google Sheet asli tetap diperlukan.

Referensi update deployment:
https://developers.google.com/apps-script/concepts/deployments
