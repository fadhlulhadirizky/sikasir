import React from 'react';
import { Search, RotateCcw, ChevronDown, ShoppingCart, Banknote } from 'lucide-react';
import TabelRiwayat from './TabelRiwayat';

const KontenRiwayat = ({ selectedDate, setSelectedDate, onReset }) => {
    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari Riwayat (F2)..."
                        className="w-full h-12 pl-12 pr-6 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#a8dadc] text-sm"
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
                <div className="flex gap-3 items-center">
                    {/* Input Tanggal Fungsional */}
                    <div className="relative group">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-[#a8dadc] cursor-pointer"
                        />
                    </div>

                    {/* Tombol Reset ke Hari Ini */}
                    <button
                        onClick={onReset}
                        className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-[#457b9d] transition-all active:scale-95"
                        title="Reset ke hari ini"
                    >
                        <RotateCcw size={18} />
                    </button>

                    <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                        <ChevronDown size={18} />
                    </button>
                </div>

                {/* Grid Statistik - Nanti angkanya bisa difilter berdasarkan selectedDate */}
                <div className="grid grid-cols-2 gap-6">
                    {/* ... (Stat Cards tetap sama seperti sebelumnya) ... */}
                </div>

                <TabelRiwayat selectedDate={selectedDate} />
            </div>
        </div>
    );
};

export default KontenRiwayat;