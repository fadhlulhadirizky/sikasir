import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { formatRupiah } from '../../lib/utils';
import { Loader2, Search, RotateCcw, Clock, AlertTriangle } from 'lucide-react';

export default function RiwayatTransaksi() {
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState('');

  const fetchRiwayat = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getTransaksi({ tanggal });
      setRiwayat(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat riwayat transaksi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, [tanggal]);

  const filteredRiwayat = riwayat.filter(trx => 
    trx.nomor_transaksi.toLowerCase().includes(search.toLowerCase()) ||
    trx.nama_kasir.toLowerCase().includes(search.toLowerCase())
  );

  const totalPendapatan = filteredRiwayat.reduce((sum, trx) => sum + Number(trx.total_harga), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input 
            type="date" 
            value={tanggal} 
            onChange={e => setTanggal(e.target.value)}
            className="flex-1 md:flex-none border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
          />
          <button onClick={fetchRiwayat} className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            value={search} onChange={e => setSearch(e.target.value)} 
            placeholder="Cari no struk atau nama kasir..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400" 
          />
        </div>
      </div>

      {/* Ringkasan Header */}
      <div className="flex gap-4">
        <div className="bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><Clock className="text-red-500" size={18} /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Transaksi</p>
            <p className="text-lg font-black text-gray-800">{filteredRiwayat.length}</p>
          </div>
        </div>
        <div className="bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><span className="text-green-600 font-black">Rp</span></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Pendapatan</p>
            <p className="text-lg font-black text-gray-800">{formatRupiah(totalPendapatan)}</p>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">No. Transaksi</th>
                <th className="px-6 py-4 font-semibold">Waktu</th>
                <th className="px-6 py-4 font-semibold">Nama Kasir</th>
                <th className="px-6 py-4 font-semibold text-right">Total Pembayaran</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-16 text-center"><Loader2 className="animate-spin mx-auto text-red-400 mb-2" size={32} />Memuat Data...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="py-16 text-center text-red-500"><AlertTriangle className="mx-auto mb-2" size={32} />{error}</td></tr>
              ) : filteredRiwayat.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-gray-400">Tidak ada riwayat transaksi pada tanggal ini.</td></tr>
              ) : (
                filteredRiwayat.map(trx => (
                  <tr key={trx.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{trx.nomor_transaksi}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(trx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{trx.nama_kasir}</td>
                    <td className="px-6 py-4 text-right font-black text-gray-900">{formatRupiah(trx.total_harga)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Selesai
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}