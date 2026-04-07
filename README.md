# SiKasir - Sistem Digital UMKM

> **Coding Camp 2026 powered by DBS Foundation**  
> **Tim:** CC26-PS120  
> **Tema:** Revolusi Teknologi Keuangan untuk Generasi Muda

SiKasir adalah aplikasi **Point of Sale (POS)** berbasis web yang dirancang untuk membantu toko kelontong dan UMKM dalam mengelola transaksi, stok barang, laporan penjualan, serta operasional toko secara digital dan terpusat.

Aplikasi ini dibangun untuk menggantikan pencatatan manual agar proses operasional menjadi lebih cepat, akurat, dan aman. Dengan sistem **Role-Based Access Control (RBAC)**, setiap pengguna hanya dapat mengakses fitur sesuai perannya.

---

## Fitur Utama

### Super Admin (Platform)
- Dashboard analitik platform
- Monitoring total toko, pemilik, kasir, dan transaksi harian
- Manajemen akun pemilik toko
- Pembuatan entitas toko baru untuk mitra
- Menonaktifkan akun mitra jika diperlukan

### Pemilik Toko (Owner)
- Dashboard terpusat dengan ringkasan performa toko
- Grafik tren pendapatan harian, mingguan, dan bulanan
- Manajemen produk secara lengkap (CRUD)
- Manajemen kategori produk
- Pengaturan harga modal, harga jual, dan stok minimum
- Upload foto produk
- Restock dan monitoring riwayat stok secara real-time
- Laporan penjualan dan kinerja kasir
- Daftar produk terlaris
- Manajemen akun kasir
- Pengaturan profil toko dan logo toko

### Kasir (POS)
- Antarmuka transaksi yang cepat dan interaktif
- Pemilihan produk dalam bentuk grid
- Keranjang belanja otomatis
- Perhitungan subtotal, PPN, dan kembalian
- Cetak struk digital
- Riwayat transaksi harian

---

## Tech Stack

### Frontend
- [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Lucide React](https://lucide.dev/)
- [React Router DOM](https://reactrouter.com/)

### Backend
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [Supabase](https://supabase.com/)
- [UploadThing](https://uploadthing.com/)

---

## Cara Menjalankan Proyek

### Prasyarat
Pastikan sudah menginstal:
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- Akun [Supabase](https://supabase.com/)
- Akun [UploadThing](https://uploadthing.com/)

---

### 1. Setup Backend

Masuk ke folder `backend` lalu install dependency:

```bash
cd backend
npm install
````

Buat file `.env` di dalam folder `backend`, lalu isi dengan konfigurasi berikut:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

# UploadThing
UPLOADTHING_SECRET=[YOUR_UPLOADTHING_SECRET]
UPLOADTHING_APP_ID=[YOUR_UPLOADTHING_APP_ID]
```

Jalankan backend:

```bash
npm run dev
```

Backend akan berjalan di:

```bash
http://localhost:3000
```

---

### 2. Setup Frontend

Masuk ke folder `frontend` lalu install dependency:

```bash
cd frontend
npm install
```

Jalankan frontend:

```bash
npm run dev
```

Frontend akan berjalan di:

```bash
http://localhost:5173
```

---

## Skema Database Utama

Aplikasi ini menggunakan database PostgreSQL yang dikelola melalui Supabase. Tabel utama yang digunakan antara lain:

* `profiles` — data pengguna dan autentikasi
* `toko` — data entitas bisnis UMKM
* `kategori` — data kategori produk
* `produk` — data produk yang dijual
* `riwayat_stok` — log perubahan stok masuk dan keluar
* `transaksi` — data transaksi penjualan
* `detail_transaksi` — detail item pada setiap transaksi

Seluruh tabel telah dilengkapi dengan **Row Level Security (RLS)** untuk menjaga keamanan data multi-tenant.

---

## Struktur Proyek

```bash
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── services/

backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   └── utils/
```

---

## Tim Pengembang (CC26-PS120)

1. **Fadhlul Hadi Rizky** — Full-Stack Web Developer (Ketua/PM)
2. **Al Arif Ramadan Marpaung** — Full-Stack Web Developer
3. **Sabrina Alma** — Full-Stack Web Developer
4. **Deni Ardiansyah** — Full-Stack Web Developer
5. **Ricky Isnandar** — Full-Stack Web Developer

---

## Catatan

Proyek ini dikembangkan sebagai solusi digital untuk membantu UMKM mengelola transaksi dan operasional toko secara lebih efisien, modern, dan terintegrasi.

> **"Kasir Pintar untuk Toko Maju"** 