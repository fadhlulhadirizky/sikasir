const express = require('express');
const router = express.Router();
const verifikasiToken = require('../middleware/auth');
const cekRole = require('../middleware/cekRole');
const {
  laporanHarian, laporanMingguan, laporanBulanan, rekapKasir, produkTerlaris
} = require('../controllers/laporanController');

router.get('/harian', verifikasiToken, cekRole('pemilik'), laporanHarian);
router.get('/mingguan', verifikasiToken, cekRole('pemilik'), laporanMingguan);
router.get('/bulanan', verifikasiToken, cekRole('pemilik'), laporanBulanan);
router.get('/kasir', verifikasiToken, cekRole('pemilik'), rekapKasir);
router.get('/terlaris', verifikasiToken, cekRole('pemilik'), produkTerlaris);

module.exports = router;
