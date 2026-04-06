import React, { useState, useEffect } from 'react';
import { Menu, Clock, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom'; 

const Header = () => {
  const [waktuSekarang, setWaktuSekarang] = useState('');
  const { user } = useAuth();
  const location = useLocation(); 

  useEffect(() => {
    const updateWaktu = () => {
      const sekarang = new Date();
      const jam = sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
      setWaktuSekarang(jam + ' WIB');
    };

    updateWaktu();
    const intervalId = setInterval(updateWaktu, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const getInisialNama = (namaLengkap: string | undefined) => {
    if (!namaLengkap) return 'U';
    const kata = namaLengkap.trim().split(' ');
    if (kata.length >= 2) return (kata[0][0] + kata[1][0]).toUpperCase();
    return namaLengkap.substring(0, 2).toUpperCase();
  };

  const handleToggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggleMobileSidebar'));
  };

  const rawRole = (user?.role || '').toLowerCase().trim();
  const formatRoleText = (r: string) => {
    if (r === 'admin') return 'Super Admin';
    if (r === 'pemilik') return 'Pemilik Toko';
    if (r === 'kasir') return 'Kasir / POS';
    return 'Guest';
  };

  const getPageInfo = (path: string) => {

    if (path.includes('/produk/tambah')) return { title: 'Tambah Produk', desc: 'Tambahkan barang baru ke dalam katalog toko.' };
    if (path.includes('/produk/edit')) return { title: 'Edit Produk', desc: 'Ubah detail informasi dan harga barang.' };
    if (path.includes('/admin/pemilik')) return { title: 'Manajemen Pemilik', desc: 'Kelola akun mitra dan status toko terdaftar.' };
    if (path.includes('/pemilik/produk-terlaris')) return { title: 'Produk Terlaris', desc: 'Pantau barang dengan penjualan tertinggi.' };

    const routeMap: Record<string, { title: string, desc: string }> = {
      '/admin/dashboard': { title: 'Dashboard', desc: 'Pantau seluruh aktivitas platform dan mitra.' },
      '/pemilik/dashboard': { title: 'Dashboard', desc: 'Ringkasan performa dan metrik utama toko.' },
      '/pemilik/produk': { title: 'Manajemen Produk', desc: 'Kelola daftar barang, harga, dan varian.' },
      '/pemilik/stok': { title: 'Manajemen Stok', desc: 'Pantau dan kelola riwayat persediaan barang.' },
      '/pemilik/laporan': { title: 'Laporan Penjualan', desc: 'Lihat statistik dan rekapitulasi transaksi.' },
      '/pemilik/kasir': { title: 'Manajemen Kasir', desc: 'Kelola akun karyawan kasir toko Anda.' },
      '/pemilik/pengaturan-toko': { title: 'Pengaturan Toko', desc: 'Atur profil dan informasi dasar toko.' },
      '/kasir/dashboard': { title: 'Kasir / POS', desc: 'Sistem Point of Sale untuk melayani transaksi.' },
      '/kasir/riwayat-transaksi': { title: 'Riwayat Transaksi', desc: 'Daftar struk dan transaksi yang sudah selesai.' },
    };

    return routeMap[path] || { title: 'Sistem Digital UMKM', desc: 'Sistem manajemen kasir dan toko pintar.' };
  };

  const pageInfo = getPageInfo(location.pathname);

  return (
    <header className="sticky top-0 z-30 w-full flex-shrink-0 font-['Poppins'] bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] max-w-[1600px] mx-auto">
        
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={handleToggleSidebar}
            aria-label="Buka menu navigasi"
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#DC2626] transition-colors active:scale-95"
          >
            <Menu size={22} strokeWidth={2.5} />
          </button>

          <div className="flex flex-col justify-center">
            <h1 className="text-[15px] md:text-[18px] font-bold text-slate-800 leading-none tracking-tight capitalize">
              {pageInfo.title}
            </h1>
            <p className="hidden sm:block text-[11.5px] font-medium text-slate-500 mt-1 font-['Inter']">
              {pageInfo.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5">
            <Clock size={12} className="text-emerald-500" />
            <span className="text-[11px] font-bold text-slate-700 font-mono tracking-wide pt-0.5">
              {waktuSekarang}
            </span>
          </div>

          <div className="hidden md:block w-[1px] h-6 bg-slate-200" />

          <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
            <Bell size={18} strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full border border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-1 sm:pl-2">
            <div className="hidden lg:flex flex-col items-end justify-center">
              <p className="text-[13px] font-bold text-slate-800 leading-tight">
                {user?.nama_lengkap || 'Pengguna'}
              </p>
              <p className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider mt-0.5">
                {formatRoleText(rawRole)}
              </p>
            </div>

            <button className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#DC2626] to-[#991b1b] text-white rounded-full font-bold text-[12px] md:text-[14px] shadow-sm shadow-red-200/50 ring-2 ring-white hover:ring-red-100 transition-all active:scale-95">
              {getInisialNama(user?.nama_lengkap)}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;