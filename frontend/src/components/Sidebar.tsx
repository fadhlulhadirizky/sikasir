import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, History, LogOut, ChevronLeft, Package,
  Users, BarChart2, Store, Settings, TrendingUp, X
} from 'lucide-react';
import logoSikasir from '../assets/logo-sikasir.svg';

const adminMenus = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/pemilik', label: 'Manajemen Pemilik', icon: Store },
];

const pemilikMenus = [
  { path: '/pemilik/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pemilik/produk', label: 'Manajemen Produk', icon: Package },
  { path: '/pemilik/stok', label: 'Manajemen Stok', icon: Store },
  { path: '/pemilik/laporan', label: 'Laporan Penjualan', icon: BarChart2 },
  { path: '/pemilik/produk-terlaris', label: 'Produk Terlaris', icon: TrendingUp },
  { path: '/pemilik/kasir', label: 'Manajemen Kasir', icon: Users },
  { path: '/pemilik/pengaturan-toko', label: 'Pengaturan Toko', icon: Settings },
];

const kasirMenus = [
  { path: '/kasir/dashboard', label: 'Kasir / POS', icon: Store },
  { path: '/kasir/riwayat-transaksi', label: 'Riwayat Transaksi', icon: History },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { user, logout, validateSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleToggleMobile = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener('toggleMobileSidebar', handleToggleMobile);
    return () => window.removeEventListener('toggleMobileSidebar', handleToggleMobile);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false); 
  }, [location.pathname]);

  const rawRole = (user?.role || '').toLowerCase().trim();
  const menus = rawRole === 'admin' ? adminMenus : rawRole === 'kasir' ? kasirMenus : pemilikMenus;

  const formatRoleText = (r: string) => {
    if (r === 'admin') return 'Super Admin';
    if (r === 'pemilik') return 'Pemilik Toko';
    if (r === 'kasir') return 'Kasir / POS';
    return 'Guest';
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleMenuClick = async (path: string) => {
    const sessionValid = await validateSession();
    if (!sessionValid) {
      navigate('/login', { replace: true });
      return;
    }
    navigate(path);
  };

  const getInisialNama = (namaLengkap: string | undefined) => {
    if (!namaLengkap) return 'U';
    const kata = namaLengkap.trim().split(' ');
    if (kata.length >= 2) return (kata[0][0] + kata[1][0]).toUpperCase();
    return namaLengkap.substring(0, 2).toUpperCase();
  };

  const desktopWidthClass = isCollapsed ? 'md:w-[88px]' : 'md:w-[280px]';

  return (
    <>
      <div className={`hidden md:block flex-shrink-0 transition-all duration-300 ease-out ${desktopWidthClass}`} />

      <div
        onClick={() => setIsMobileOpen(false)}
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ease-out ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 left-0 h-screen z-50 bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col font-['Poppins'] transition-all duration-300 ease-out w-[280px] ${desktopWidthClass} ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        
        <div className={`flex items-center h-[88px] relative transition-all duration-300 ease-out ${
          isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
        }`}>
          <div className="flex items-center overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-[0_2px_10px_rgba(220,38,38,0.1)] border border-red-100 flex items-center justify-center flex-shrink-0">
              <img src={logoSikasir} alt="Logo SiKasir" className="w-6 h-6 object-contain drop-shadow-sm" />
            </div>

            <div className={`flex flex-col justify-center whitespace-nowrap transition-all duration-300 ease-out overflow-hidden ${
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3.5"
            }`}>
              <h2 className="text-[22px] font-bold tracking-tight leading-none mb-1">
                <span className="text-[#DC2626]">SiKasir</span>
              </h2>
              <span className="text-[9.5px] font-bold text-slate-400 tracking-[0.2em] leading-none">
                Sistem Digital UMKM
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-7 right-4 md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-white text-slate-400 hover:text-[#DC2626] border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out absolute -right-3 top-[44px] -translate-y-1/2 z-10 hover:scale-110 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
        </button>

        <div className={`transition-all duration-300 ease-out overflow-hidden whitespace-nowrap flex items-center ${
          isCollapsed ? 'max-h-0 opacity-0 px-0' : 'max-h-[30px] opacity-100 px-6 pt-2 pb-3'
        }`}>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden pb-4">
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path || location.pathname.startsWith(menu.path + '/');
            const Icon = menu.icon;

            return (
              <button
                key={menu.path}
                onClick={() => handleMenuClick(menu.path)}
                title={isCollapsed ? menu.label : undefined}
                className={`w-full relative flex items-center rounded-xl font-medium text-[13.5px] transition-all duration-300 group overflow-hidden ${
                  isActive 
                    ? 'bg-red-50/60 text-[#DC2626]' 
                    : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-900'
                } ${isCollapsed ? 'justify-center px-0 py-3' : 'justify-start px-3.5 py-3'}`}
              >
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#DC2626] rounded-r-md transition-transform duration-300 ${
                  isActive ? 'scale-y-100' : 'scale-y-0'
                }`} />
                
                <div className={`flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#DC2626]' : 'text-slate-400 group-hover:text-slate-600'
                } ${isCollapsed ? 'w-6 h-6 mx-0' : 'w-6 h-6 mr-3.5'}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <span className={`whitespace-nowrap transition-all duration-300 ease-out overflow-hidden text-left ${
                  isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
                }`}>
                  {menu.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 flex-shrink-0 bg-white z-10">
          <div className={`flex items-center transition-all duration-300 ease-out ${
            isCollapsed ? 'flex-col gap-4' : 'justify-between gap-3'
          }`}>
            
            <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-tr from-[#DC2626] to-[#EF4444] rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm ring-1 ring-slate-100">
                <span className="text-white font-bold text-sm tracking-wider">
                  {getInisialNama(user?.nama_lengkap)}
                </span>
              </div>
              
              <div className={`flex flex-col justify-center whitespace-nowrap transition-all duration-300 ease-out overflow-hidden ${
                isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[140px] opacity-100 ml-3'
              }`}>
                <p className="text-[13px] font-bold text-slate-800 truncate leading-tight">
                  {user?.nama_lengkap || 'Pengguna'}
                </p>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                  {formatRoleText(rawRole)}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Keluar"
              className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-[#DC2626] hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-300 flex-shrink-0"
            >
              <LogOut size={18} strokeWidth={2.5} />
            </button>
            
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;