const { supabaseAdmin } = require('../config/supabase');

const daftarStok = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    const { data, error } = await supabaseAdmin
      .from('produk')
      .select('id, nama_produk, stok, stok_minimum, satuan, is_active, kategori:kategori_id(id, nama_kategori)')
      .eq('toko_id', tokoId)
      .eq('is_active', true)
      .order('nama_produk', { ascending: true });

    if (error) throw error;

    // kasih status stok biar gampang dibaca
    const dataWithStatus = data.map(produk => ({
      ...produk,
      status_stok: produk.stok <= 0 ? 'habis' : produk.stok <= produk.stok_minimum ? 'menipis' : 'aman'
    }));

    return res.status(200).json({ success: true, data: dataWithStatus });
  } catch (error) {
    console.error('Error ambil stok:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data stok.' });
  }
};

const tambahStok = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { produk_id, jumlah, keterangan } = req.body;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum punya toko.' });
    }

    if (!produk_id || !jumlah) {
      return res.status(400).json({ success: false, message: 'Produk dan jumlah stok harus diisi.' });
    }

    if (jumlah <= 0) {
      return res.status(400).json({ success: false, message: 'Jumlah stok harus lebih dari 0.' });
    }

    const { data: produk, error: produkError } = await supabaseAdmin
      .from('produk')
      .select('id, nama_produk, stok')
      .eq('id', produk_id)
      .eq('toko_id', tokoId)
      .single();

    if (produkError || !produk) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan di toko kamu.' });
    }

    const stokSebelum = produk.stok;
    const stokSesudah = stokSebelum + jumlah;

    // update stok
    const { error: updateError } = await supabaseAdmin
      .from('produk')
      .update({ stok: stokSesudah, updated_at: new Date().toISOString() })
      .eq('id', produk_id);

    if (updateError) throw updateError;

    // catat riwayat
    const { data: riwayat, error: riwayatError } = await supabaseAdmin
      .from('riwayat_stok')
      .insert({
        toko_id: tokoId,
        produk_id,
        tipe: 'masuk',
        jumlah,
        stok_sebelum: stokSebelum,
        stok_sesudah: stokSesudah,
        keterangan: keterangan || 'Restock produk',
        dicatat_oleh: req.user.id
      })
      .select()
      .single();

    if (riwayatError) throw riwayatError;

    return res.status(201).json({
      success: true,
      message: `Stok "${produk.nama_produk}" berhasil ditambah ${jumlah}. Stok sekarang: ${stokSesudah}.`,
      data: {
        produk_id,
        nama_produk: produk.nama_produk,
        stok_sebelum: stokSebelum,
        stok_sesudah: stokSesudah,
        riwayat
      }
    });
  } catch (error) {
    console.error('Error tambah stok:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal menambah stok produk.' });
  }
};

const riwayatStok = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { produk_id, tipe } = req.query;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    let query = supabaseAdmin
      .from('riwayat_stok')
      .select('*, produk:produk_id(id, nama_produk), pencatat:dicatat_oleh(id, nama_lengkap)')
      .eq('toko_id', tokoId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (produk_id) query = query.eq('produk_id', produk_id);
    if (tipe) query = query.eq('tipe', tipe);

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error ambil riwayat stok:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil riwayat stok.' });
  }
};

module.exports = { daftarStok, tambahStok, riwayatStok };
