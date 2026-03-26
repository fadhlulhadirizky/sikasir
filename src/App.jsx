import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import halaman-halaman kamu
import LoginPage from './pages/login/LoginPage'; // Sesuaikan path login kamu
import KasirPage from './pages/kasir/KasirPage';
import RiwayatPage from './pages/kasir/RiwayatPage'; // INI YANG KURANG

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KasirPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/kasir" element={<KasirPage />} />

        {/* Route untuk Riwayat */}
        <Route path="/riwayat" element={<RiwayatPage />} />
      </Routes>
    </Router>
  );
}

export default App;