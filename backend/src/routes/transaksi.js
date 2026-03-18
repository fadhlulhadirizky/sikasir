const express = require('express');
const router = express.Router();
const verifikasiToken = require('../middleware/auth');
const cekRole = require('../middleware/cekRole');
const { daftarTransaksi, detailTransaksi, buatTransaksi } = require('../controllers/transaksiController');

router.get('/', verifikasiToken, cekRole('pemilik', 'kasir'), daftarTransaksi);
router.get('/:id', verifikasiToken, cekRole('pemilik', 'kasir'), detailTransaksi);
router.post('/', verifikasiToken, cekRole('kasir'), buatTransaksi);

module.exports = router;
