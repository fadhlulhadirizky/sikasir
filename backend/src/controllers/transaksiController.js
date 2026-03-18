const { supabaseAdmin } = require('../config/supabase');

const daftarTransaksi = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { tanggal, status } = req.query;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    let query = supabaseAdmin
      .from('transaksi')
      .select('*')
      .eq('toko_id', tokoId)
      .order('created_at', { ascending: false });

    if (req.user.role === 'kasir') {
      query = query.eq('kasir_id', req.user.id);
    }

    if (tanggal) {
      const mulai = new Date(tanggal);
      mulai.setHours(0, 0, 0, 0);
      const selesai = new Date(tanggal);
      selesai.setHours(23, 59, 59, 999);
      query = query.gte('created_at', mulai.toISOString()).lte('created_at', selesai.toISOString());
    }

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error ambil transaksi:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar transaksi.' });
  }
};

const detailTransaksi = async (req, res) => {
  try {
    const { id } = req.params;
    const tokoId = req.user.toko_id;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    const { data: transaksi, error: trxError } = await supabaseAdmin
      .from('transaksi')
      .select('*')
      .eq('id', id)
      .eq('toko_id', tokoId)
      .single();

    if (trxError || !transaksi) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }

    const { data: items, error: itemError } = await supabaseAdmin
      .from('detail_transaksi')
      .select('*')
      .eq('transaksi_id', id)
      .order('id', { ascending: true });

    if (itemError) throw itemError;

    return res.status(200).json({
      success: true,
      data: { ...transaksi, items }
    });
  } catch (error) {
    console.error('Error detail transaksi:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail transaksi.' });
  }
};

const buatTransaksi = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const kasirId = req.user.id;
    const namaKasir = req.user.nama_lengkap;
    const { items, uang_bayar } = req.body;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang belanja tidak boleh kosong.' });
    }

    if (!uang_bayar || uang_bayar <= 0) {
      return res.status(400).json({ success: false, message: 'Jumlah uang bayar harus diisi.' });
    }

    // ambil data produk
    const produkIds = items.map(item => item.produk_id);
    const { data: produkList, error: produkError } = await supabaseAdmin
      .from('produk')
      .select('id, nama_produk, harga_jual, stok')
      .eq('toko_id', tokoId)
      .eq('is_active', true)
      .in('id', produkIds);

    if (produkError) throw produkError;

    // validasi prodk & hitung total
    const detailItems = [];
    let totalHarga = 0;

    for (const item of items) {
      const produk = produkList.find(p => p.id === item.produk_id);

      if (!produk) {
        return res.status(400).json({
          success: false,
          message: `Produk dengan ID ${item.produk_id} tidak ditemukan atau sudah nonaktif.`
        });
      }

      if (item.jumlah <= 0) {
        return res.status(400).json({
          success: false,
          message: `Jumlah untuk "${produk.nama_produk}" harus lebih dari 0.`
        });
      }

      if (produk.stok < item.jumlah) {
        return res.status(400).json({
          success: false,
          message: `Stok "${produk.nama_produk}" tidak cukup. Tersisa ${produk.stok}.`
        });
      }

      const subtotal = produk.harga_jual * item.jumlah;
      totalHarga += subtotal;

      detailItems.push({
        produk_id: produk.id,
        nama_produk: produk.nama_produk,
        harga_satuan: produk.harga_jual,
        jumlah: item.jumlah,
        subtotal
      });
    }

    if (uang_bayar < totalHarga) {
      return res.status(400).json({
        success: false,
        message: `Uang bayar (Rp ${uang_bayar.toLocaleString('id-ID')}) kurang dari total belanja (Rp ${totalHarga.toLocaleString('id-ID')}).`
      });
    }

    const kembalian = uang_bayar - totalHarga;

    // generate trx
    const sekarang = new Date();
    const tgl = sekarang.toISOString().slice(0, 10).replace(/-/g, '');
    const hariIniMulai = new Date(sekarang);
    hariIniMulai.setHours(0, 0, 0, 0);

    const { count: jumlahHariIni } = await supabaseAdmin
      .from('transaksi')
      .select('*', { count: 'exact', head: true })
      .eq('toko_id', tokoId)
      .gte('created_at', hariIniMulai.toISOString());

    const nomorUrut = String((jumlahHariIni || 0) + 1).padStart(4, '0');
    const nomorTransaksi = `TRX-${tgl}-${nomorUrut}`;

    // simpan transaksi
    const { data: transaksi, error: trxError } = await supabaseAdmin
      .from('transaksi')
      .insert({
        toko_id: tokoId,
        nomor_transaksi: nomorTransaksi,
        kasir_id: kasirId,
        nama_kasir: namaKasir,
        total_harga: totalHarga,
        uang_bayar,
        kembalian,
        status: 'selesai'
      })
      .select()
      .single();

    if (trxError) throw trxError;

    const detailInsert = detailItems.map(item => ({
      transaksi_id: transaksi.id,
      ...item
    }));

    const { error: detailError } = await supabaseAdmin
      .from('detail_transaksi')
      .insert(detailInsert);

    if (detailError) throw detailError;

    // kurangi stok + catat riwayat
    for (const item of items) {
      const produk = produkList.find(p => p.id === item.produk_id);
      const stokSebelum = produk.stok;
      const stokSesudah = stokSebelum - item.jumlah;

      await supabaseAdmin
        .from('produk')
        .update({ stok: stokSesudah, updated_at: new Date().toISOString() })
        .eq('id', item.produk_id);

      await supabaseAdmin.from('riwayat_stok').insert({
        toko_id: tokoId,
        produk_id: item.produk_id,
        tipe: 'keluar',
        jumlah: item.jumlah,
        stok_sebelum: stokSebelum,
        stok_sesudah: stokSesudah,
        keterangan: `Penjualan - ${nomorTransaksi}`,
        dicatat_oleh: kasirId
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Transaksi berhasil disimpan!',
      data: { ...transaksi, items: detailItems, kembalian }
    });
  } catch (error) {
    console.error('Error buat transaksi:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan transaksi.' });
  }
};

module.exports = { daftarTransaksi, detailTransaksi, buatTransaksi };
