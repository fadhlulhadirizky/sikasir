const { supabaseAdmin } = require('../config/supabase');

const daftarProduk = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { search, kategori_id, is_active } = req.query;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    let query = supabaseAdmin
      .from('produk')
      .select('*, kategori:kategori_id(id, nama_kategori)')
      .eq('toko_id', tokoId)
      .order('created_at', { ascending: false });

    if (search) query = query.ilike('nama_produk', `%${search}%`);
    if (kategori_id) query = query.eq('kategori_id', kategori_id);
    if (is_active !== undefined) query = query.eq('is_active', is_active === 'true');

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error ambil daftar produk:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar produk.' });
  }
};

const tambahProduk = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { nama_produk, kategori_id, harga_beli, harga_jual, stok, stok_minimum, satuan, gambar_url } = req.body;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum punya toko.' });
    }

    if (!nama_produk || harga_jual === undefined || stok === undefined) {
      return res.status(400).json({ success: false, message: 'Nama produk, harga jual, dan stok harus diisi.' });
    }

    if (harga_jual < 0) {
      return res.status(400).json({ success: false, message: 'Harga jual tidak boleh negatif.' });
    }

    if (stok < 0) {
      return res.status(400).json({ success: false, message: 'Stok tidak boleh negatif.' });
    }

    const { data, error } = await supabaseAdmin
      .from('produk')
      .insert({
        toko_id: tokoId,
        nama_produk,
        kategori_id: kategori_id || null,
        harga_beli: harga_beli || 0,
        harga_jual,
        stok,
        stok_minimum: stok_minimum || 5,
        satuan: satuan || 'pcs',
        gambar_url: gambar_url || null
      })
      .select('*, kategori:kategori_id(id, nama_kategori)')
      .single();

    if (error) throw error;

    // catat riwayat stok awal
    if (stok > 0) {
      await supabaseAdmin.from('riwayat_stok').insert({
        toko_id: tokoId,
        produk_id: data.id,
        tipe: 'masuk',
        jumlah: stok,
        stok_sebelum: 0,
        stok_sesudah: stok,
        keterangan: 'Stok awal produk baru',
        dicatat_oleh: req.user.id
      });
    }

    return res.status(201).json({
      success: true,
      message: `Produk "${nama_produk}" berhasil ditambahkan!`,
      data
    });
  } catch (error) {
    console.error('Error tambah produk:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan produk.' });
  }
};

const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const tokoId = req.user.toko_id;
    const { nama_produk, kategori_id, harga_beli, harga_jual, stok_minimum, satuan, gambar_url, is_active } = req.body;

    const updateData = { updated_at: new Date().toISOString() };
    if (nama_produk !== undefined) updateData.nama_produk = nama_produk;
    if (kategori_id !== undefined) updateData.kategori_id = kategori_id;
    if (harga_beli !== undefined) updateData.harga_beli = harga_beli;
    if (harga_jual !== undefined) updateData.harga_jual = harga_jual;
    if (stok_minimum !== undefined) updateData.stok_minimum = stok_minimum;
    if (satuan !== undefined) updateData.satuan = satuan;
    if (gambar_url !== undefined) updateData.gambar_url = gambar_url;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from('produk')
      .update(updateData)
      .eq('id', id)
      .eq('toko_id', tokoId)
      .select('*, kategori:kategori_id(id, nama_kategori)')
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan di toko kamu.' });
    }

    return res.status(200).json({ success: true, message: 'Produk berhasil diupdate.', data });
  } catch (error) {
    console.error('Error update produk:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengupdate produk.' });
  }
};

const nonaktifkanProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const tokoId = req.user.toko_id;

    const { data, error } = await supabaseAdmin
      .from('produk')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('toko_id', tokoId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan di toko kamu.' });
    }

    return res.status(200).json({ success: true, message: 'Produk berhasil dinonaktifkan.' });
  } catch (error) {
    console.error('Error nonaktifkan produk:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal menonaktifkan produk.' });
  }
};

// kategori produk

const daftarKategori = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    const { data, error } = await supabaseAdmin
      .from('kategori')
      .select('*')
      .eq('toko_id', tokoId)
      .order('nama_kategori', { ascending: true });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error ambil kategori:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar kategori.' });
  }
};

const tambahKategori = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { nama_kategori } = req.body;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum punya toko.' });
    }

    if (!nama_kategori) {
      return res.status(400).json({ success: false, message: 'Nama kategori harus diisi.' });
    }

    const { data, error } = await supabaseAdmin
      .from('kategori')
      .insert({ toko_id: tokoId, nama_kategori })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: `Kategori "${nama_kategori}" berhasil ditambahkan!`,
      data
    });
  } catch (error) {
    console.error('Error tambah kategori:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan kategori.' });
  }
};

module.exports = {
  daftarProduk,
  tambahProduk,
  updateProduk,
  nonaktifkanProduk,
  daftarKategori,
  tambahKategori
};
