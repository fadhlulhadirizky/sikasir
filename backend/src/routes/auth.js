const express = require('express');
const router = express.Router();
const verifikasiToken = require('../middleware/auth');
const { login, logout, me } = require('../controllers/authController');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifikasiToken, me);

module.exports = router;
