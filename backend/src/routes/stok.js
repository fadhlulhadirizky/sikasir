const express = require('express');
const router = express.Router();
const verifikasiToken = require('../middleware/auth');
const cekRole = require('../middleware/cekRole');
const { daftarStok, tambahStok, riwayatStok } = require('../controllers/stokController');

router.get('/', verifikasiToken, cekRole('pemilik'), daftarStok);
router.post('/tambah', verifikasiToken, cekRole('pemilik'), tambahStok);
router.get('/riwayat', verifikasiToken, cekRole('pemilik'), riwayatStok);

module.exports = router;
