const { supabaseAdmin } = require('../config/supabase');

// tanggal
const getHariIni = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getAwalMinggu = () => {
  const d = new Date();
  const hari = d.getDay();
  const selisih = hari === 0 ? 6 : hari - 1; // senin = awal minggu
  d.setDate(d.getDate() - selisih);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getAwalBulan = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const laporanHarian = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { tanggal } = req.query;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    let mulai, selesai;
    if (tanggal) {
      mulai = new Date(tanggal);
      mulai.setHours(0, 0, 0, 0);
      selesai = new Date(tanggal);
      selesai.setHours(23, 59, 59, 999);
    } else {
      mulai = getHariIni();
      selesai = new Date();
      selesai.setHours(23, 59, 59, 999);
    }

    const { data: transaksi, error } = await supabaseAdmin
      .from('transaksi')
      .select('*')
      .eq('toko_id', tokoId)
      .eq('status', 'selesai')
      .gte('created_at', mulai.toISOString())
      .lte('created_at', selesai.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalTransaksi = transaksi.length;
    const totalPendapatan = transaksi.reduce((sum, t) => sum + parseFloat(t.total_harga), 0);

    return res.status(200).json({
      success: true,
      data: {
        tanggal: mulai.toISOString().slice(0, 10),
        ringkasan: { total_transaksi: totalTransaksi, total_pendapatan: totalPendapatan },
        transaksi
      }
    });
  } catch (error) {
    console.error('Error laporan harian:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil laporan harian.' });
  }
};

const laporanMingguan = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    const awalMinggu = getAwalMinggu();
    const sekarang = new Date();
    sekarang.setHours(23, 59, 59, 999);

    const { data: transaksi, error } = await supabaseAdmin
      .from('transaksi')
      .select('*')
      .eq('toko_id', tokoId)
      .eq('status', 'selesai')
      .gte('created_at', awalMinggu.toISOString())
      .lte('created_at', sekarang.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalTransaksi = transaksi.length;
    const totalPendapatan = transaksi.reduce((sum, t) => sum + parseFloat(t.total_harga), 0);

    // kelompok kan per hari
    const perHari = {};
    transaksi.forEach(t => {
      const tgl = new Date(t.created_at).toISOString().slice(0, 10);
      if (!perHari[tgl]) perHari[tgl] = { tanggal: tgl, jumlah_transaksi: 0, pendapatan: 0 };
      perHari[tgl].jumlah_transaksi++;
      perHari[tgl].pendapatan += parseFloat(t.total_harga);
    });

    return res.status(200).json({
      success: true,
      data: {
        periode: { dari: awalMinggu.toISOString().slice(0, 10), sampai: sekarang.toISOString().slice(0, 10) },
        ringkasan: { total_transaksi: totalTransaksi, total_pendapatan: totalPendapatan },
        per_hari: Object.values(perHari).sort((a, b) => a.tanggal.localeCompare(b.tanggal))
      }
    });
  } catch (error) {
    console.error('Error laporan mingguan:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil laporan mingguan.' });
  }
};

const laporanBulanan = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { bulan, tahun } = req.query;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    let awal, akhir;
    if (bulan && tahun) {
      awal = new Date(parseInt(tahun), parseInt(bulan) - 1, 1);
      akhir = new Date(parseInt(tahun), parseInt(bulan), 0, 23, 59, 59, 999);
    } else {
      awal = getAwalBulan();
      const sekarang = new Date();
      akhir = new Date(sekarang.getFullYear(), sekarang.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const { data: transaksi, error } = await supabaseAdmin
      .from('transaksi')
      .select('*')
      .eq('toko_id', tokoId)
      .eq('status', 'selesai')
      .gte('created_at', awal.toISOString())
      .lte('created_at', akhir.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalTransaksi = transaksi.length;
    const totalPendapatan = transaksi.reduce((sum, t) => sum + parseFloat(t.total_harga), 0);

    const perHari = {};
    transaksi.forEach(t => {
      const tgl = new Date(t.created_at).toISOString().slice(0, 10);
      if (!perHari[tgl]) perHari[tgl] = { tanggal: tgl, jumlah_transaksi: 0, pendapatan: 0 };
      perHari[tgl].jumlah_transaksi++;
      perHari[tgl].pendapatan += parseFloat(t.total_harga);
    });

    return res.status(200).json({
      success: true,
      data: {
        periode: {
          bulan: awal.getMonth() + 1,
          tahun: awal.getFullYear(),
          dari: awal.toISOString().slice(0, 10),
          sampai: akhir.toISOString().slice(0, 10)
        },
        ringkasan: { total_transaksi: totalTransaksi, total_pendapatan: totalPendapatan },
        per_hari: Object.values(perHari).sort((a, b) => a.tanggal.localeCompare(b.tanggal))
      }
    });
  } catch (error) {
    console.error('Error laporan bulanan:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil laporan bulanan.' });
  }
};

const rekapKasir = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { tanggal } = req.query;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    let mulai, selesai;
    if (tanggal) {
      mulai = new Date(tanggal);
      mulai.setHours(0, 0, 0, 0);
      selesai = new Date(tanggal);
      selesai.setHours(23, 59, 59, 999);
    } else {
      mulai = getAwalBulan();
      selesai = new Date();
      selesai.setHours(23, 59, 59, 999);
    }

    const { data: transaksi, error } = await supabaseAdmin
      .from('transaksi')
      .select('*')
      .eq('toko_id', tokoId)
      .eq('status', 'selesai')
      .gte('created_at', mulai.toISOString())
      .lte('created_at', selesai.toISOString());

    if (error) throw error;

    const perKasir = {};
    transaksi.forEach(t => {
      const key = t.kasir_id;
      if (!perKasir[key]) {
        perKasir[key] = {
          kasir_id: t.kasir_id,
          nama_kasir: t.nama_kasir,
          jumlah_transaksi: 0,
          total_penjualan: 0
        };
      }
      perKasir[key].jumlah_transaksi++;
      perKasir[key].total_penjualan += parseFloat(t.total_harga);
    });

    const rekap = Object.values(perKasir).sort((a, b) => b.jumlah_transaksi - a.jumlah_transaksi);

    return res.status(200).json({
      success: true,
      data: {
        periode: { dari: mulai.toISOString().slice(0, 10), sampai: selesai.toISOString().slice(0, 10) },
        rekap
      }
    });
  } catch (error) {
    console.error('Error rekap kasir:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil rekap kasir.' });
  }
};

const produkTerlaris = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const limitCount = parseInt(req.query.limit) || 10;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum terhubung ke toko.' });
    }

    const awalBulan = getAwalBulan();
    const sekarang = new Date();
    sekarang.setHours(23, 59, 59, 999);

    const { data: transaksiIds, error: trxError } = await supabaseAdmin
      .from('transaksi')
      .select('id')
      .eq('toko_id', tokoId)
      .eq('status', 'selesai')
      .gte('created_at', awalBulan.toISOString())
      .lte('created_at', sekarang.toISOString());

    if (trxError) throw trxError;

    if (transaksiIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          periode: { dari: awalBulan.toISOString().slice(0, 10), sampai: sekarang.toISOString().slice(0, 10) },
          produk_terlaris: []
        }
      });
    }

    const ids = transaksiIds.map(t => t.id);
    const { data: details, error: detailError } = await supabaseAdmin
      .from('detail_transaksi')
      .select('produk_id, nama_produk, jumlah, subtotal')
      .in('transaksi_id', ids);

    if (detailError) throw detailError;

    const perProduk = {};
    details.forEach(d => {
      const key = d.produk_id || d.nama_produk;
      if (!perProduk[key]) {
        perProduk[key] = { produk_id: d.produk_id, nama_produk: d.nama_produk, total_terjual: 0, total_pendapatan: 0 };
      }
      perProduk[key].total_terjual += d.jumlah;
      perProduk[key].total_pendapatan += parseFloat(d.subtotal);
    });

    const terlaris = Object.values(perProduk)
      .sort((a, b) => b.total_terjual - a.total_terjual)
      .slice(0, limitCount);

    return res.status(200).json({
      success: true,
      data: {
        periode: { dari: awalBulan.toISOString().slice(0, 10), sampai: sekarang.toISOString().slice(0, 10) },
        produk_terlaris: terlaris
      }
    });
  } catch (error) {
    console.error('Error produk terlaris:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data produk terlaris.' });
  }
};

module.exports = { laporanHarian, laporanMingguan, laporanBulanan, rekapKasir, produkTerlaris };
