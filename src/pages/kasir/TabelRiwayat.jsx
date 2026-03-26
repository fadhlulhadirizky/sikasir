import React from 'react';
import { History } from 'lucide-react';

const TabelRiwayat = () => {
    // Data kosong sesuai permintaan (tidak diada-adain)
    const transactions = [];

    return (
        <div className="border border-slate-100 rounded-lg overflow-hidden">
            <table className="w-full text-[13px] text-left border-collapse">
                <thead className="text-[11px] font-bold text-slate-500 uppercase bg-[#eff3f6] sticky top-0">
                    <tr>
                        <th className="px-6 py-4">No. Transaksi</th>
                        <th className="px-6 py-4">Tanggal</th>
                        <th className="px-6 py-4">Kasir</th>
                        <th className="px-6 py-4 text-center">Total Item</th>
                        <th className="px-6 py-4 text-right">Total Pembayaran</th>
                        <th className="px-6 py-4 text-center">Metode Bayar</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((trx, i) => (
                            <tr key={i} className="border-b border-slate-50">
                                {/* Baris data kosong */}
                            </tr>
                        ))
                    ) : (
                        /* Empty State Layout */
                        <tr>
                            <td colSpan="6" className="py-24 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-300">
                                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                        <History size={28} strokeWidth={1.5} />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-400">Belum Ada Riwayat Transaksi</p>
                                    <p className="text-[11px] text-slate-400/80 mt-1">Data transaksi yang selesai akan otomatis muncul di sini</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TabelRiwayat;