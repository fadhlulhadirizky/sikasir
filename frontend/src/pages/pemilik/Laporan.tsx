import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { formatRupiah } from '../../lib/utils';
import GrafikPenjualan from '../../components/GrafikPenjualan';
import { 
  Calendar, ShoppingCart, Wallet, Users, Loader2, Search, RotateCcw
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

type TabType = 'harian' | 'mingguan' | 'bulanan' | 'kasir';

export default function Laporan() {
  const [tab, setTab] = useState<TabType>('harian');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data State
  const [dataHarian, setDataHarian] = useState<any>(null);
  const [dataMingguan, setDataMingguan] = useState<any>(null);
  const [dataBulanan, setDataBulanan] = useState<any>(null);
  const [dataKasir, setDataKasir] = useState<any>(null);
  
  // Filters
  const [tanggalPilih, setTanggalPilih] = useState(new Date().toISOString().slice(0, 10));
  const [searchKasir, setSearchKasir] = useState('');

  const fetchLaporan = async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'harian') {
        const res = await api.getLaporanHarian(tanggalPilih);
        setDataHarian(res.data);
      } else if (tab === 'mingguan') {
        const res = await api.getLaporanMingguan();
        setDataMingguan(res.data);
      } else if (tab === 'bulanan') {
        const res = await api.getLaporanBulanan();
        setDataBulanan(res.data);
      } else if (tab === 'kasir') {
        const res = await api.getRekapKasir(tanggalPilih);
        setDataKasir(res.data);
      }
    } catch (err: any) {
      console.error("Error Laporan:", err);
      setError('Gagal menarik data laporan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchLaporan(); 
  }, [tab, tanggalPilih]);

  // UI untuk Ringkasan Kotak (Total Transaksi & Pendapatan)
  const renderRingkasan = (ringkasan: any, labelPendapatan: string) => {
    if (!ringkasan) return null;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shadow-sm">
            <Wallet size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-red-600 font-medium">{labelPendapatan}</p>
            <p className="text-2xl font-bold text-gray-900">{formatRupiah(ringkasan.total_pendapatan || 0)}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
            <ShoppingCart size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">Total Transaksi</p>
            <p className="text-2xl font-bold text-gray-900">{ringkasan.total_transaksi || 0} <span className="text-sm font-medium text-gray-500">struk</span></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. TABS NAVIGATION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex overflow-x-auto hide-scrollbar">
        <button onClick={() => setTab('harian')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'harian' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
          <Calendar size={16} /> Laporan Harian
        </button>
        <button onClick={() => setTab('mingguan')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'mingguan' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
          <span className="text-lg leading-none tracking-tighter">📊</span> Laporan Mingguan
        </button>
        <button onClick={() => setTab('bulanan')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'bulanan' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
          <span className="text-lg leading-none tracking-tighter">📈</span> Laporan Bulanan
        </button>
        <button onClick={() => setTab('kasir')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'kasir' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
          <Users size={16} /> Rekap Kasir
        </button>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[500px]">
        
        {/* Toolbar (DatePicker / Refresh) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 capitalize">Detail Laporan {tab}</h2>
            <p className="text-sm text-gray-500">
              {tab === 'harian' && 'Pilih tanggal untuk melihat detail transaksi.'}
              {tab === 'mingguan' && 'Tren omzet toko minggu ini.'}
              {tab === 'bulanan' && 'Tren grafik omzet bulan berjalan.'}
              {tab === 'kasir' && 'Pilih tanggal untuk melihat kinerja harian kasir.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {(tab === 'harian' || tab === 'kasir') && (
              <input 
                type="date" 
                value={tanggalPilih} 
                onChange={e => setTanggalPilih(e.target.value)}
                className="flex-1 sm:flex-none border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
              />
            )}
            <button onClick={fetchLaporan} className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* State Loading / Error */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-red-500 mb-4" size={40} />
            <p className="text-gray-500">Mengkalkulasi laporan...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 font-medium">{error}</div>
        ) : (
          <>
            {/* --- TAB HARIAN --- */}
            {tab === 'harian' && dataHarian && (
              <div className="animate-in fade-in">
                {renderRingkasan(dataHarian.ringkasan, "Pendapatan Hari Ini")}
                
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Waktu</th>
                        <th className="px-6 py-3 font-semibold">Nomor Transaksi</th>
                        <th className="px-6 py-3 font-semibold">Kasir</th>
                        <th className="px-6 py-3 font-semibold text-right">Total Belanja</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dataHarian.transaksi.length === 0 ? (
                        <tr><td colSpan={4} className="py-8 text-center text-gray-400">Tidak ada transaksi di tanggal ini.</td></tr>
                      ) : (
                        dataHarian.transaksi.map((t: any) => (
                          <tr key={t.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3 text-gray-500">{new Date(t.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</td>
                            <td className="px-6 py-3 font-mono font-medium text-gray-900">{t.nomor_transaksi}</td>
                            <td className="px-6 py-3 text-gray-600">{t.nama_kasir}</td>
                            <td className="px-6 py-3 text-right font-bold text-gray-900">{formatRupiah(t.total_harga)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- TAB MINGGUAN --- */}
            {tab === 'mingguan' && dataMingguan && (
              <div className="animate-in fade-in">
                {renderRingkasan(dataMingguan.ringkasan, "Pendapatan Minggu Ini")}
                <div className="border border-gray-100 rounded-2xl p-4 sm:p-6 bg-gray-50/30">
                   <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <span className="text-xl">📊</span> Grafik Omzet Mingguan
                   </h3>
                   <GrafikPenjualan data={dataMingguan.per_hari || []} tinggi={300} />
                </div>
              </div>
            )}

            {/* --- TAB BULANAN --- */}
            {tab === 'bulanan' && dataBulanan && (
              <div className="animate-in fade-in">
                {renderRingkasan(dataBulanan.ringkasan, "Pendapatan Bulan Ini")}
                <div className="border border-gray-100 rounded-2xl p-4 sm:p-6 bg-gray-50/30">
                   <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <span className="text-xl">📈</span> Tren Omzet Bulanan
                   </h3>
                   <div className="w-full h-[300px]">
                      {dataBulanan.per_hari && dataBulanan.per_hari.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={dataBulanan.per_hari} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="tanggal" tickFormatter={(val) => val.split('-')[2]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `Rp${value / 1000}k`} />
                            <Tooltip 
                              cursor={{ stroke: '#DC2626', strokeWidth: 1, strokeDasharray: '3 3' }}
                              formatter={(value: number) => [formatRupiah(value), 'Penjualan']}
                              labelFormatter={(label) => `Tanggal: ${label}`}
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line type="monotone" dataKey="pendapatan" stroke="#DC2626" strokeWidth={3} dot={{ r: 4, fill: '#DC2626', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400">Belum ada data penjualan bulan ini.</div>
                      )}
                   </div>
                </div>
              </div>
            )}

            {/* --- TAB REKAP KASIR --- */}
            {tab === 'kasir' && dataKasir && (
              <div className="animate-in fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative w-full max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      value={searchKasir} onChange={e => setSearchKasir(e.target.value)} 
                      placeholder="Cari nama kasir..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataKasir.rekap.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                      Tidak ada transaksi kasir pada tanggal tersebut.
                    </div>
                  ) : (
                    dataKasir.rekap
                      .filter((k: any) => k.nama_kasir.toLowerCase().includes(searchKasir.toLowerCase()))
                      .map((kasir: any, idx: number) => (
                        <div key={idx} className="border border-gray-100 rounded-2xl p-5 hover:border-red-200 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-sm">
                              {kasir.nama_kasir.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{kasir.nama_kasir}</p>
                              <p className="text-xs text-gray-500">ID: {kasir.kasir_id.split('-')[0]}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><ShoppingCart size={14}/> Transaksi</span>
                              <span className="font-bold text-gray-900">{kasir.jumlah_transaksi}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Wallet size={14}/> Pendapatan</span>
                              <span className="font-bold text-green-600">{formatRupiah(kasir.total_penjualan)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}