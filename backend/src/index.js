const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const tokoRoutes = require('./routes/toko');
const produkRoutes = require('./routes/produk');
const stokRoutes = require('./routes/stok');
const transaksiRoutes = require('./routes/transaksi');
const laporanRoutes = require('./routes/laporan');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SiKasir API berjalan!',
    version: '1.0.0'
  });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/toko', tokoRoutes);
app.use('/api/produk', produkRoutes);
app.use('/api/stok', stokRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/uploadthing', uploadRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.` });
});

// error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan internal server.' });
});

app.listen(PORT, () => {
  console.log(`SiKasir API jalan di port ${PORT}`);
});

module.exports = app;
