const express = require('express');
const router = express.Router();
const verifikasiToken = require('../middleware/auth');
const cekRole = require('../middleware/cekRole');
const {
  daftarProduk, tambahProduk, updateProduk, nonaktifkanProduk,
  daftarKategori, tambahKategori
} = require('../controllers/produkController');

// kategori
router.get('/kategori', verifikasiToken, cekRole('pemilik', 'kasir'), daftarKategori);
router.post('/kategori', verifikasiToken, cekRole('pemilik'), tambahKategori);

// produk
router.get('/', verifikasiToken, cekRole('pemilik', 'kasir'), daftarProduk);
router.post('/', verifikasiToken, cekRole('pemilik'), tambahProduk);
router.put('/:id', verifikasiToken, cekRole('pemilik'), updateProduk);
router.delete('/:id', verifikasiToken, cekRole('pemilik'), nonaktifkanProduk);

module.exports = router;
