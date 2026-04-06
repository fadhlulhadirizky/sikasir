const { supabaseAdmin, supabaseAnon } = require('../config/supabase');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi.'
      });
    }

    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password
    });

if (error) {
      // 1. Log error aslinya ke terminal backend agar kamu bisa melihatnya
      console.error('Supabase Auth Error:', error.message); 

      return res.status(401).json({
        success: false,
        // 2. Berikan pesan error yang lebih spesifik ke frontend
        message: error.message === 'Invalid login credentials' 
          ? 'Email atau password salah.' 
          : `Gagal login: ${error.message}`
      });
    }

    const { data: profil, error: profilError } = await supabaseAdmin
      .from('profiles')
      .select('*, toko:toko_id(*)')
      .eq('id', data.user.id)
      .single();

    if (profilError || !profil) {
      return res.status(404).json({
        success: false,
        message: 'Profil pengguna tidak ditemukan di database.'
      });
    }

    if (!profil.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Akun kamu sudah dinonaktifkan. Hubungi admin.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      data: {
        token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
          id: profil.id,
          nama_lengkap: profil.nama_lengkap,
          username: profil.username,
          email: profil.email || data.user.email,
          role: profil.role,
          toko_id: profil.toko_id,
          toko: profil.toko
        }
      }
    });
  } catch (error) {
    console.error('Error login:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat login.'
    });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logout berhasil. Silakan hapus token di sisi client.'
    });
  } catch (error) {
    console.error('Error logout:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat logout.'
    });
  }
};

const me = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
};

module.exports = { login, logout, me };
