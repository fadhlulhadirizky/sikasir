CREATE TABLE IF NOT EXISTS toko (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_toko VARCHAR(200) NOT NULL,
  alamat TEXT,
  no_telepon VARCHAR(20),
  logo_url TEXT,
  pemilik_id UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_lengkap VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'pemilik', 'kasir')),
  toko_id UUID REFERENCES toko(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE toko
  ADD CONSTRAINT fk_toko_pemilik
  FOREIGN KEY (pemilik_id) REFERENCES profiles(id)
  ON DELETE CASCADE;
CREATE TABLE IF NOT EXISTS kategori (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  toko_id UUID NOT NULL REFERENCES toko(id) ON DELETE CASCADE,
  nama_kategori VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS produk (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  toko_id UUID NOT NULL REFERENCES toko(id) ON DELETE CASCADE,
  kategori_id UUID REFERENCES kategori(id) ON DELETE SET NULL,
  nama_produk VARCHAR(200) NOT NULL,
  harga_beli NUMERIC(15,2) NOT NULL DEFAULT 0,
  harga_jual NUMERIC(15,2) NOT NULL DEFAULT 0,
  stok INTEGER NOT NULL DEFAULT 0,
  stok_minimum INTEGER NOT NULL DEFAULT 5,
  satuan VARCHAR(20) DEFAULT 'pcs',
  gambar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS riwayat_stok (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  toko_id UUID NOT NULL REFERENCES toko(id) ON DELETE CASCADE,
  produk_id UUID NOT NULL REFERENCES produk(id) ON DELETE CASCADE,
  tipe VARCHAR(10) NOT NULL CHECK (tipe IN ('masuk', 'keluar')),
  jumlah INTEGER NOT NULL,
  stok_sebelum INTEGER NOT NULL,
  stok_sesudah INTEGER NOT NULL,
  keterangan TEXT,
  dicatat_oleh UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS transaksi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  toko_id UUID NOT NULL REFERENCES toko(id) ON DELETE CASCADE,
  nomor_transaksi VARCHAR(50) NOT NULL UNIQUE,
  kasir_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  nama_kasir VARCHAR(100) NOT NULL,
  total_harga NUMERIC(15,2) NOT NULL DEFAULT 0,
  uang_bayar NUMERIC(15,2) NOT NULL DEFAULT 0,
  kembalian NUMERIC(15,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'selesai' CHECK (status IN ('selesai', 'batal')),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS detail_transaksi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaksi_id UUID NOT NULL REFERENCES transaksi(id) ON DELETE CASCADE,
  produk_id UUID REFERENCES produk(id) ON DELETE SET NULL,
  nama_produk VARCHAR(200) NOT NULL,
  harga_satuan NUMERIC(15,2) NOT NULL,
  jumlah INTEGER NOT NULL,
  subtotal NUMERIC(15,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_profiles_toko ON profiles(toko_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_produk_toko ON produk(toko_id);
CREATE INDEX IF NOT EXISTS idx_produk_kategori ON produk(kategori_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_toko ON transaksi(toko_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_kasir ON transaksi(kasir_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON transaksi(created_at);
CREATE INDEX IF NOT EXISTS idx_detail_transaksi ON detail_transaksi(transaksi_id);
CREATE INDEX IF NOT EXISTS idx_riwayat_stok_produk ON riwayat_stok(produk_id);
CREATE INDEX IF NOT EXISTS idx_kategori_toko ON kategori(toko_id);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE toko ENABLE ROW LEVEL SECURITY;
ALTER TABLE kategori ENABLE ROW LEVEL SECURITY;
ALTER TABLE produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE riwayat_stok ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_transaksi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User bisa lihat profil sendiri"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Service role full access profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access toko"
  ON toko FOR ALL
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access produk"
  ON produk FOR ALL
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access kategori"
  ON kategori FOR ALL
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access riwayat_stok"
  ON riwayat_stok FOR ALL
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access transaksi"
  ON transaksi FOR ALL
  USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access detail_transaksi"
  ON detail_transaksi FOR ALL
  USING (auth.role() = 'service_role');
