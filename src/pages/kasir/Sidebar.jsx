import React from 'react';
import { LayoutGrid, History, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoSikasir from '../../assets/logo-sikasir.svg';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Untuk mendeteksi path yang sedang aktif

    // Fungsi untuk cek apakah menu sedang aktif
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-white p-6 flex flex-col border-r border-slate-100 h-screen sticky top-0">
            {/* Logo + Teks */}
            <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={() => navigate('/kasir')}>
                <img src={logoSikasir} alt="Logo" className="h-8 w-auto" />
                <span className="text-2xl font-black text-[#e63946] tracking-tight text-nowrap">
                    SiKasir
                </span>
            </div>

            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Menu Utama
            </div>

            <nav className="space-y-2 flex-1">
                {/* Tombol Kasir / Pos */}
                <button
                    onClick={() => navigate('/kasir')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${isActive('/kasir') || isActive('/')
                            ? "bg-[#fde9eb] text-[#e63946]"
                            : "text-slate-600 hover:bg-[#eff3f6]"
                        }`}
                >
                    <LayoutGrid size={20} />
                    Kasir / Pos
                </button>

                {/* Tombol Riwayat Transaksi */}
                <button
                    onClick={() => navigate('/riwayat')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${isActive('/riwayat')
                            ? "bg-[#fde9eb] text-[#e63946]"
                            : "text-slate-600 hover:bg-[#eff3f6]"
                        }`}
                >
                    <History size={20} />
                    Riwayat Transaksi
                </button>
            </nav>

            {/* Tombol Log Out */}
            <button
                onClick={() => navigate('/login')}
                className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 bg-[#e63946] hover:bg-[#d62828] text-white rounded-lg font-bold text-sm shadow-md shadow-red-100 transition-all active:scale-[0.98]"
            >
                <LogOut size={18} />
                Log Out
            </button>
        </aside>
    );
};

export default Sidebar;