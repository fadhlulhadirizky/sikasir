import React, { ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';

import DashboardAdmin from './pages/admin/DashboardAdmin';
import ManajemenPemilik from './pages/admin/ManajemenPemilik';

import DashboardPemilik from './pages/pemilik/DashboardPemilik';
import Produk from './pages/pemilik/Produk';
import TambahProduk from './pages/pemilik/TambahProduk';
import EditProduk from './pages/pemilik/EditProduk';
import Stok from './pages/pemilik/Stok';
import Laporan from './pages/pemilik/Laporan';
import ProdukTerlaris from './pages/pemilik/ProdukTerlaris';
import ManajemenKasir from './pages/pemilik/ManajemenKasir';
import PengaturanToko from './pages/pemilik/PengaturanToko';

import Kasir from './pages/kasir/Kasir';
import RiwayatTransaksi from './pages/kasir/RiwayatTransaksi';

const globalStyles = `
  body, html, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: #F8FAFC;
  }
`;

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full h-screen bg-[#F8FAFC] font-['Poppins'] overflow-hidden">
      <TrackLastRoute />
      <style>{globalStyles}</style>
      <Sidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <Header />
        <main className="flex-grow p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function RequireAuth({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: string[];
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = (user?.role || '').toLowerCase().trim();

  if (roles && !roles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function TrackLastRoute() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const role = (user?.role || '').toLowerCase().trim();
    if (!role) return;

    const allowedPrefixes: Record<string, string[]> = {
      admin: ['/admin'],
      pemilik: ['/pemilik'],
      kasir: ['/kasir'],
    };

    const isValidForRole = allowedPrefixes[role]?.some(prefix =>
      location.pathname === prefix || location.pathname.startsWith(prefix + '/')
    );

    if (isValidForRole) {
      localStorage.setItem(`lastRoute_${role}`, location.pathname);
    }
  }, [location.pathname, user]);

  return null;
}

function getLastRoute(role: string, fallback: string) {
  const saved = localStorage.getItem(`lastRoute_${role}`);
  return saved || fallback;
}

function RoleFallback({ role, fallback }: { role: string; fallback: string }) {
  const target = getLastRoute(role, fallback);
  return <Navigate to={target} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <RequireAuth roles={['admin']}>
                <Navigate to="/admin/dashboard" replace />
              </RequireAuth>
            }
          />
          <Route
            path="/pemilik"
            element={
              <RequireAuth roles={['pemilik']}>
                <Navigate to="/pemilik/dashboard" replace />
              </RequireAuth>
            }
          />
          <Route
            path="/kasir"
            element={
              <RequireAuth roles={['kasir']}>
                <Navigate to="/kasir/dashboard" replace />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth roles={['admin']}>
                <DashboardLayout>
                  <DashboardAdmin />
                </DashboardLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/admin/pemilik"
            element={
              <RequireAuth roles={['admin']}>
                <DashboardLayout>
                  <ManajemenPemilik />
                </DashboardLayout>
              </RequireAuth>
            }
          />

          <Route
            path="/pemilik/dashboard"
            element={
              <RequireAuth roles={['pemilik']}>
                <DashboardLayout>
                  <DashboardPemilik />
                </DashboardLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/pemilik/produk"
            element={
              <RequireAuth roles={['pemilik']}>
                <DashboardLayout>
                  <Produk />
                </DashboardLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/pemilik/produk/tambah"
            element={
              <RequireAuth roles={['pemilik']}>
                <DashboardLayout>
                  <TambahProduk />
                </DashboardLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/pemilik/produk/edit/:id"
            element={
              <RequireAuth roles={['pemilik']}>
                <DashboardLayout>
                  <EditProduk />
                </DashboardLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/pemilik/stok"
            element={
              <RequireAuth roles={['pemilik']}>
                <DashboardLayout>
                  <Stok />
                </DashboardLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/pemilik/laporan"
            element={
              <RequireAuth roles={['pemilik']}>
                <DashboardLayout>
                  <Laporan />
                </DashboardLayout>
              </RequireAuth>
            }
          />
          <Route 
            path="/pemilik/produk-terlaris" 
            element={
              <RequireAuth roles={['pemilik']}>
                <DashboardLayout>
                  <ProdukTerlaris />
                </DashboardLayout>
              </RequireAuth>
            } 
          />
          <Route
            path="/pemilik/kasir"
            element={
              <RequireAuth roles={['pemilik']}>
                <DashboardLayout>
                  <ManajemenKasir />
                </DashboardLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/pemilik/pengaturan-toko"
            element={
              <RequireAuth roles={['pemilik']}>
                <DashboardLayout>
                  <PengaturanToko />
                </DashboardLayout>
              </RequireAuth>
            }
          />

          <Route
            path="/kasir/dashboard"
            element={
              <RequireAuth roles={['kasir']}>
                <DashboardLayout>
                  <Kasir />
                </DashboardLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/kasir/riwayat-transaksi"
            element={
              <RequireAuth roles={['kasir']}>
                <DashboardLayout>
                  <RiwayatTransaksi />
                </DashboardLayout>
              </RequireAuth>
            }
          />

          <Route
            path="/admin/*"
            element={
              <RequireAuth roles={['admin']}>
                <RoleFallback role="admin" fallback="/admin/dashboard" />
              </RequireAuth>
            }
          />

          <Route
            path="/pemilik/*"
            element={
              <RequireAuth roles={['pemilik']}>
                <RoleFallback role="pemilik" fallback="/pemilik/dashboard" />
              </RequireAuth>
            }
          />

          <Route
            path="/kasir/*"
            element={
              <RequireAuth roles={['kasir']}>
                <RoleFallback role="kasir" fallback="/kasir/dashboard" />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}