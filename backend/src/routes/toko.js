const express = require('express');
const router = express.Router();
const verifikasiToken = require('../middleware/auth');
const cekRole = require('../middleware/cekRole');
const { tokoSaya, updateToko } = require('../controllers/tokoController');

router.get('/saya', verifikasiToken, cekRole('pemilik'), tokoSaya);
router.put('/saya', verifikasiToken, cekRole('pemilik'), updateToko);

module.exports = router;
