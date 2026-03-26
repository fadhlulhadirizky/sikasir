import React from 'react';
import { Search } from 'lucide-react';

const TabelProduk = () => {
    const items = [];

    return (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col overflow-hidden">
            {/* Area Pencarian - Dikecilkan sedikit h-nya */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Cari produk (F2)..."
                    className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#a8dadc] text-sm text-slate-700"
                />
            </div>

            {/* Tabel Produk - Dikecilkan padding dan font-nya */}
            <div className="flex-1 border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-[13px] text-left border-collapse">
                    <thead className="text-[11px] font-bold text-slate-500 uppercase bg-[#eff3f6] sticky top-0 z-10">
                        <tr>
                            <th className="px-3 py-3 text-center w-12">No</th>
                            <th className="px-3 py-3 w-40">Nama Barang</th>
                            <th className="px-3 py-3">Varian</th>
                            <th className="px-3 py-3 text-right">Harga</th>
                            <th className="px-3 py-3 text-center">Stok</th>
                            <th className="px-3 py-3 text-center w-24">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item, i) => (
                                <tr key={i} className="border-b border-slate-50 transition-colors">
                                    {/* Data asli di sini nanti */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-20">
                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                            <Search size={24} strokeWidth={1.5} />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-400">Tabel Produk Siap Diisi...</p>
                                        <p className="text-[11px] text-slate-400/80 mt-1">Data akan otomatis tersinkron dari manajemen produk</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TabelProduk;