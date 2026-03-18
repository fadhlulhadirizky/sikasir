const { supabaseAdmin } = require('../config/supabase');

const tokoSaya = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum punya toko.' });
    }

    const { data, error } = await supabaseAdmin
      .from('toko')
      .select('*')
      .eq('id', tokoId)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Toko tidak ditemukan.' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error ambil data toko:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data toko.' });
  }
};

const updateToko = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { nama_toko, alamat, no_telepon, logo_url } = req.body;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum punya toko.' });
    }

    const updateData = {};
    if (nama_toko !== undefined) updateData.nama_toko = nama_toko;
    if (alamat !== undefined) updateData.alamat = alamat;
    if (no_telepon !== undefined) updateData.no_telepon = no_telepon;
    if (logo_url !== undefined) updateData.logo_url = logo_url;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data yang diupdate.' });
    }

    const { data, error } = await supabaseAdmin
      .from('toko')
      .update(updateData)
      .eq('id', tokoId)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Data toko berhasil diupdate.',
      data
    });
  } catch (error) {
    console.error('Error update toko:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengupdate data toko.' });
  }
};

module.exports = { tokoSaya, updateToko };
