const { supabaseAdmin } = require('../config/supabase');

// admin kelola pemilik

const daftarPemilik = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*, toko:toko_id(id, nama_toko, alamat, no_telepon, logo_url, is_active)')
      .eq('role', 'pemilik')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error ambil daftar pemilik:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar pemilik toko.' });
  }
};

const tambahPemilik = async (req, res) => {
  let createdUserId = null;
  let createdProfileId = null;
  let createdTokoId = null;

  try {
    const { nama_lengkap, email, password, nama_toko, alamat, no_telepon, logo_url } = req.body;

    if (!nama_lengkap || !email || !password || !nama_toko) {
      return res.status(400).json({
        success: false,
        message: 'Nama lengkap, email, password, dan nama toko harus diisi.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    // buat user di supabas
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar. Gunakan email lain.' });
      }
      throw authError;
    }

    const userId = authData.user.id;
    createdUserId = userId;

    const { data: profilData, error: profilError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        nama_lengkap,
        email,
        role: 'pemilik',
        toko_id: null,
        created_by: req.user.id
      })
      .select()
      .single();

    if (profilError) throw profilError;
    createdProfileId = profilData.id;

    const { data: tokoData, error: tokoError } = await supabaseAdmin
      .from('toko')
      .insert({ 
        nama_toko, 
        alamat: alamat || null,
        no_telepon: no_telepon || null,
        logo_url: logo_url || null,
        pemilik_id: userId 
      })
      .select()
      .single();

    if (tokoError) throw tokoError;
    createdTokoId = tokoData.id;

    const { data: profilFinal, error: profilUpdateError } = await supabaseAdmin
      .from('profiles')
      .update({ toko_id: tokoData.id, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (profilUpdateError) throw profilUpdateError;

    return res.status(201).json({
      success: true,
      message: `Pemilik toko "${nama_toko}" berhasil didaftarkan!`,
      data: { user: profilFinal, toko: tokoData }
    });
  } catch (error) {
    console.error('Error tambah pemilik:', error.message);

    if (createdTokoId) {
      await supabaseAdmin.from('toko').delete().eq('id', createdTokoId);
    }

    if (createdProfileId) {
      await supabaseAdmin.from('profiles').delete().eq('id', createdProfileId);
    }

    if (createdUserId) {
      await supabaseAdmin.auth.admin.deleteUser(createdUserId);
    }

    return res.status(500).json({ success: false, message: 'Gagal membuat akun pemilik toko.' });
  }
};

const updatePemilik = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_lengkap, is_active } = req.body;

    const updateData = { updated_at: new Date().toISOString() };
    if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .eq('role', 'pemilik')
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Pemilik toko tidak ditemukan.' });
    }

    // sinkro status toko
    if (is_active === false && data.toko_id) {
      await supabaseAdmin.from('toko').update({ is_active: false }).eq('id', data.toko_id);
    }
    if (is_active === true && data.toko_id) {
      await supabaseAdmin.from('toko').update({ is_active: true }).eq('id', data.toko_id);
    }

    return res.status(200).json({
      success: true,
      message: 'Data pemilik toko berhasil diupdate.',
      data
    });
  } catch (error) {
    console.error('Error update pemilik:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengupdate data pemilik toko.' });
  }
};

const nonaktifkanPemilik = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('role', 'pemilik')
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Pemilik toko tidak ditemukan.' });
    }

    // nonaktifkan toko
    if (data.toko_id) {
      await supabaseAdmin.from('toko').update({ is_active: false }).eq('id', data.toko_id);
    }

    return res.status(200).json({ success: true, message: 'Pemilik toko berhasil dinonaktifkan.' });
  } catch (error) {
    console.error('Error nonaktifkan pemilik:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal menonaktifkan pemilik toko.' });
  }
};

// pemilik kelola kasir

const daftarKasir = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum punya toko.' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('toko_id', tokoId)
      .eq('role', 'kasir')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error ambil daftar kasir:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar kasir.' });
  }
};

const tambahKasir = async (req, res) => {
  try {
    const tokoId = req.user.toko_id;
    const { nama_lengkap, username, email, password } = req.body;

    if (!nama_lengkap || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama lengkap, email, dan password harus diisi.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    if (!tokoId) {
      return res.status(400).json({ success: false, message: 'Kamu belum punya toko.' });
    }

    // cek username udah dipake atau belum
    if (username) {
      const { data: cekUsername } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (cekUsername) {
        return res.status(400).json({ success: false, message: 'Username sudah dipakai. Pilih username lain.' });
      }
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar. Gunakan email lain.' });
      }
      throw authError;
    }

    const { data: profilData, error: profilError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        nama_lengkap,
        username: username || null,
        email,
        role: 'kasir',
        toko_id: tokoId,
        created_by: req.user.id
      })
      .select()
      .single();

    if (profilError) throw profilError;

    return res.status(201).json({
      success: true,
      message: `Kasir "${nama_lengkap}" berhasil ditambahkan!`,
      data: profilData
    });
  } catch (error) {
    console.error('Error tambah kasir:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal membuat akun kasir.' });
  }
};

const updateKasir = async (req, res) => {
  try {
    const { id } = req.params;
    const tokoId = req.user.toko_id;
    const { nama_lengkap, username, is_active } = req.body;

    const updateData = { updated_at: new Date().toISOString() };
    if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
    if (username !== undefined) updateData.username = username;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .eq('toko_id', tokoId)
      .eq('role', 'kasir')
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Kasir tidak ditemukan di toko kamu.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Data kasir berhasil diupdate.',
      data
    });
  } catch (error) {
    console.error('Error update kasir:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengupdate data kasir.' });
  }
};

const nonaktifkanKasir = async (req, res) => {
  try {
    const { id } = req.params;
    const tokoId = req.user.toko_id;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('toko_id', tokoId)
      .eq('role', 'kasir')
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: 'Kasir tidak ditemukan di toko kamu.' });
    }

    return res.status(200).json({ success: true, message: 'Kasir berhasil dinonaktifkan.' });
  } catch (error) {
    console.error('Error nonaktifkan kasir:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal menonaktifkan kasir.' });
  }
};

// statistik admin

const statistikPlatform = async (req, res) => {
  try {
    const { count: totalPemilik } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'pemilik')
      .eq('is_active', true);

    const { count: totalToko } = await supabaseAdmin
      .from('toko')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: totalKasir } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'kasir')
      .eq('is_active', true);

    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    const { count: totalTransaksiHariIni } = await supabaseAdmin
      .from('transaksi')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', hariIni.toISOString())
      .eq('status', 'selesai');

    return res.status(200).json({
      success: true,
      data: {
        total_pemilik_aktif: totalPemilik || 0,
        total_toko_aktif: totalToko || 0,
        total_kasir_aktif: totalKasir || 0,
        total_transaksi_hari_ini: totalTransaksiHariIni || 0
      }
    });
  } catch (error) {
    console.error('Error statistik platform:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil statistik platform.' });
  }
};

// admin kelola kasir (semua toko)

const daftarKasirAdmin = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*, toko:toko_id(id, nama_toko)')
      .eq('role', 'kasir')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error ambil daftar kasir admin:', error.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar kasir.' });
  }
};

module.exports = {
  daftarPemilik,
  tambahPemilik,
  updatePemilik,
  nonaktifkanPemilik,
  daftarKasir,
  tambahKasir,
  updateKasir,
  nonaktifkanKasir,
  statistikPlatform,
  daftarKasirAdmin
};

