const express = require('express');
const router = express.Router();
const verifikasiToken = require('../middleware/auth');
const cekRole = require('../middleware/cekRole');
const {
  daftarPemilik, tambahPemilik, updatePemilik, nonaktifkanPemilik,
  daftarKasir, tambahKasir, updateKasir, nonaktifkanKasir,
  statistikPlatform,
  daftarKasirAdmin
} = require('../controllers/usersController');

// admin
router.get('/statistik', verifikasiToken, cekRole('admin'), statistikPlatform);
router.get('/pemilik', verifikasiToken, cekRole('admin'), daftarPemilik);
router.post('/pemilik', verifikasiToken, cekRole('admin'), tambahPemilik);
router.put('/pemilik/:id', verifikasiToken, cekRole('admin'), updatePemilik);
router.delete('/pemilik/:id', verifikasiToken, cekRole('admin'), nonaktifkanPemilik);

// admin - hanya bisa lihat kasir, tidak bisa tambah/edit/hapus
router.get('/admin/kasir', verifikasiToken, cekRole('admin'), daftarKasirAdmin);

// pemilik
router.get('/kasir', verifikasiToken, cekRole('pemilik'), daftarKasir);
router.post('/kasir', verifikasiToken, cekRole('pemilik'), tambahKasir);
router.put('/kasir/:id', verifikasiToken, cekRole('pemilik'), updateKasir);
router.delete('/kasir/:id', verifikasiToken, cekRole('pemilik'), nonaktifkanKasir);

module.exports = router;

