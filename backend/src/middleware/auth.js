const { supabaseAdmin } = require('../config/supabase');

const verifikasiToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan. Silakan login terlebih dahulu.'
      });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid atau sudah kadaluarsa. Silakan login ulang.'
      });
    }

    // ambil profil + data toko
    const { data: profil, error: profilError } = await supabaseAdmin
      .from('profiles')
      .select('*, toko:toko_id(*)')
      .eq('id', data.user.id)
      .single();

    if (profilError || !profil) {
      return res.status(401).json({
        success: false,
        message: 'Profil pengguna tidak ditemukan.'
      });
    }

    if (!profil.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Akun kamu sudah dinonaktifkan. Hubungi admin.'
      });
    }

    req.user = {
      id: profil.id,
      nama_lengkap: profil.nama_lengkap,
      username: profil.username,
      email: profil.email || data.user.email,
      role: profil.role,
      toko_id: profil.toko_id,
      toko: profil.toko,
      is_active: profil.is_active
    };

    next();
  } catch (error) {
    console.error('Error verifikasi token:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat verifikasi token.'
    });
  }
};

module.exports = verifikasiToken;
