const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (_) {
    throw new Error('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Server mengembalikan respons tidak valid (status ${res.status}). Cek apakah backend sudah berjalan.`);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request gagal');
  return data;
}

// Auth
export const login = (email: string, password: string) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const logout = () =>
  request('/auth/logout', { method: 'POST' });

// Produk (Pemilik)
export const getProduk = (params?: { search?: string; kategori_id?: string; is_active?: string }) => {
  const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
  return request(`/produk${q}`);
};
export const getKategori = () => request('/produk/kategori');
export const tambahProduk = (body: object) => request('/produk', { method: 'POST', body: JSON.stringify(body) });
export const updateProduk = (id: string, body: object) => request(`/produk/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const hapusProduk = (id: string) => request(`/produk/${id}`, { method: 'DELETE' });
export const tambahKategori = (body: object) => request('/produk/kategori', { method: 'POST', body: JSON.stringify(body) });

// Kasir (Pemilik)
export const getKasir = () => request('/users/kasir');
export const tambahKasir = (body: object) => request('/users/kasir', { method: 'POST', body: JSON.stringify(body) });
export const updateKasir = (id: string, body: object) => request(`/users/kasir/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const hapusKasir = (id: string) => request(`/users/kasir/${id}`, { method: 'DELETE' });

// Laporan (Pemilik)
export const getLaporanHarian = (tanggal?: string) =>
  request(`/laporan/harian${tanggal ? `?tanggal=${tanggal}` : ''}`);
export const getLaporanMingguan = () => request('/laporan/mingguan');
export const getLaporanBulanan = (params?: { bulan?: string; tahun?: string }) => {
  const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
  return request(`/laporan/bulanan${q}`);
};
export const getRekapKasir = (tanggal?: string) =>
  request(`/laporan/kasir${tanggal ? `?tanggal=${tanggal}` : ''}`);
export const getProdukTerlaris = (limit?: number) =>
  request(`/laporan/terlaris${limit ? `?limit=${limit}` : ''}`);

// Toko (Pemilik)
export const getTokoSaya = () => request('/toko/saya');
export const updateTokoSaya = (body: object) => request('/toko/saya', { method: 'PUT', body: JSON.stringify(body) });

// Admin - Users
export const getStatistikPlatform = () => request('/users/statistik');
export const getDaftarPemilik = () => request('/users/pemilik');
export const tambahPemilik = (body: object) => request('/users/pemilik', { method: 'POST', body: JSON.stringify(body) });
export const updatePemilik = (id: string, body: object) => request(`/users/pemilik/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const hapusPemilik = (id: string) => request(`/users/pemilik/${id}`, { method: 'DELETE' });

// Admin - Kasir (endpoint baru, dibutuhkan dari backend)
export const getDaftarKasirAdmin = () => request('/users/admin/kasir');
export const tambahKasirAdmin = (body: object) => request('/users/admin/kasir', { method: 'POST', body: JSON.stringify(body) });
export const updateKasirAdmin = (id: string, body: object) => request(`/users/admin/kasir/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const hapusKasirAdmin = (id: string) => request(`/users/admin/kasir/${id}`, { method: 'DELETE' });
// Tambahkan ini di baris paling bawah api.ts
export const getTransaksi = (params?: { tanggal?: string; status?: string }) => {
  const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
  return request(`/transaksi${q}`);
};
export const buatTransaksi = (body: object) => request('/transaksi', { method: 'POST', body: JSON.stringify(body) });

// Stok (Pemilik)
export const getStok = () => request('/stok');
export const tambahStok = (body: object) => request('/stok/tambah', { method: 'POST', body: JSON.stringify(body) });
export const getRiwayatStok = (params?: { produk_id?: string; tipe?: string }) => {
  const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
  return request(`/stok/riwayat${q}`);
};
// Toko - semua toko (untuk dropdown admin)
export const getDaftarToko = () => request('/toko');

export const getMe = () => request('/auth/me', { method: 'GET' });