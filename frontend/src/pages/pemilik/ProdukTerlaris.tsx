import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { formatRupiah } from '../../lib/utils';
import { TrendingUp, Loader2, AlertTriangle, Calendar, Award } from 'lucide-react';

export default function ProdukTerlaris() {
  const [data, setData] = useState<any[]>([]);
  const [periode, setPeriode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [limit, setLimit] = useState(10); // Sesuai PRD: 10 produk

  const fetchProdukTerlaris = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getProdukTerlaris(limit);
      setData(res.data?.produk_terlaris || []);
      setPeriode(res.data?.periode);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data produk terlaris.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdukTerlaris();
  }, [limit]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Data */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Top {limit} Produk Terlaris</h2>
            <p className="text-xs text-gray-500">
              {periode ? `Periode: ${formatDate(periode.dari)} s/d ${formatDate(periode.sampai)}` : 'Memuat periode...'}
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Note: Backend saat ini mengambil default bulan berjalan. */}
          <select 
            disabled
            className="w-full md:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-gray-50 text-gray-500 cursor-not-allowed"
            title="Filter periode (Akan datang)"
          >
            <option value="bulan_ini">Bulan Ini</option>
            <option value="minggu_ini">Minggu Ini</option>
            <option value="semua">Semua Waktu</option>
          </select>

          <select 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full md:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          >
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
          </select>
        </div>
      </div>

      {/* Area Tabel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold w-16 text-center">Peringkat</th>
                <th className="px-6 py-4 font-bold">Nama Produk</th>
                <th className="px-6 py-4 font-bold">Kategori</th>
                <th className="px-6 py-4 font-bold text-center">Qty Terjual</th>
                <th className="px-6 py-4 font-bold text-right">Total Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Loader2 className="animate-spin mx-auto text-red-400 mb-2" size={32} />
                    <p className="text-gray-500">Mengkalkulasi data penjualan...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-red-500">
                    <AlertTriangle className="mx-auto mb-2" size={32} />
                    {error}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400 font-medium">
                    Belum ada transaksi pada periode ini.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => {
                  const isTop3 = index < 3;
                  const medalColors = ['text-yellow-400', 'text-gray-400', 'text-amber-600']; // Emas, Perak, Perunggu
                  
                  return (
                    <tr key={item.produk_id || index} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4 text-center">
                        {isTop3 ? (
                          <div className="flex justify-center">
                            <Award size={28} className={medalColors[index]} />
                          </div>
                        ) : (
                          <span className="text-gray-500 font-bold text-base">{index + 1}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${isTop3 ? 'text-gray-900 text-base' : 'text-gray-800'}`}>
                          {item.nama_produk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {/* Note: Backend detail_transaksi saat ini tidak menyimpan kategori, sehingga kita tampilkan '-' */}
                        {item.kategori || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-sm border border-blue-100">
                          {item.total_terjual}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-black ${isTop3 ? 'text-green-600 text-base' : 'text-gray-800'}`}>
                          {formatRupiah(item.total_pendapatan)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}