import React, { useState, useEffect } from 'react';
import { Wallet, ShoppingCart, Package, AlertTriangle, Loader2, ArrowRight, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip as PieTooltip } from 'recharts';
import * as api from '../../services/api';
import { formatRupiah } from '../../lib/utils';
import GrafikPenjualan from '../../components/GrafikPenjualan'; // Import komponen baru

const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

export default function DashboardPemilik() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>({
    ringkasan: { total_pendapatan: 0, total_transaksi: 0, produk_aktif: 0, stok_menipis: 0 },
    grafik_batang: [],
    grafik_donat: [],
    transaksi_terbaru: [],
    stok_menipis: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        // Tarik data dari beberapa endpoint sekaligus secara paralel agar lebih cepat
        const [resHarian, resMingguan, resProduk, resTerlaris] = await Promise.all([
          api.getLaporanHarian(), // default hari ini
          api.getLaporanMingguan(),
          api.getProduk(),
          api.getProdukTerlaris(4) // Ambil top 4 kategori/produk
        ]);

        const hariIni = resHarian.data?.ringkasan || { total_pendapatan: 0, total_transaksi: 0 };
        const transaksiHariIni = resHarian.data?.transaksi || [];
        const semuaProduk = resProduk.data || [];
        const produkTerlaris = resTerlaris.data?.produk_terlaris || [];

        // Hitung produk aktif & menipis
        const produkAktif = semuaProduk.filter((p: any) => p.is_active);
        const stokMenipis = produkAktif.filter((p: any) => p.stok < p.stok_minimum);

        // Format data untuk grafik donat
        const donatData = produkTerlaris.map((p: any) => ({
          nama: p.nama_produk.substring(0, 15) + (p.nama_produk.length > 15 ? '...' : ''),
          value: p.total_terjual
        }));

        setData({
          ringkasan: {
            total_pendapatan: hariIni.total_pendapatan,
            total_transaksi: hariIni.total_transaksi,
            produk_aktif: produkAktif.length,
            stok_menipis: stokMenipis.length
          },
          grafik_batang: resMingguan.data?.per_hari || [],
          grafik_donat: donatData.length > 0 ? donatData : [{ nama: 'Belum ada data', value: 1 }],
          transaksi_terbaru: transaksiHariIni.slice(0, 5), // Ambil 5 teratas
          stok_menipis: stokMenipis
        });
      } catch (err: any) {
        console.error("Error Dashboard:", err);
        setError('Gagal memuat data dari server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-red-500 mb-4" size={40} />
        <p className="text-gray-500 font-medium animate-pulse">Menarik data dari database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <AlertTriangle className="text-red-500 mb-4" size={40} />
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg">Coba Lagi</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. KARTU RINGKASAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Penjualan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wallet size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Penjualan Hari Ini</p>
            <p className="text-xl font-bold text-gray-900">{formatRupiah(data.ringkasan.total_pendapatan)}</p>
          </div>
        </div>

        {/* Jumlah Transaksi */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Transaksi Hari Ini</p>
            <p className="text-xl font-bold text-gray-900">{data.ringkasan.total_transaksi} <span className="text-sm font-medium text-gray-400">struk</span></p>
          </div>
        </div>

        {/* Total Produk */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Total Produk Aktif</p>
            <p className="text-xl font-bold text-gray-900">{data.ringkasan.produk_aktif} <span className="text-sm font-medium text-gray-400">item</span></p>
          </div>
        </div>

        {/* Stok Menipis */}
        <div className={`bg-white rounded-2xl border ${data.ringkasan.stok_menipis > 0 ? 'border-red-200' : 'border-gray-100'} shadow-sm p-5 flex items-center gap-4 relative overflow-hidden`}>
          <div className={`w-12 h-12 ${data.ringkasan.stok_menipis > 0 ? 'bg-red-100' : 'bg-gray-100'} rounded-xl flex items-center justify-center flex-shrink-0 relative z-10`}>
            <AlertTriangle size={24} className={data.ringkasan.stok_menipis > 0 ? "text-red-600" : "text-gray-400"} />
          </div>
          <div className="relative z-10">
            <p className="text-xs text-gray-500 font-medium mb-1">Stok Menipis</p>
            <p className={`text-xl font-bold ${data.ringkasan.stok_menipis > 0 ? 'text-red-600' : 'text-gray-900'}`}>{data.ringkasan.stok_menipis} <span className={`text-sm font-medium ${data.ringkasan.stok_menipis > 0 ? 'text-red-400' : 'text-gray-400'}`}>peringatan</span></p>
          </div>
          {data.ringkasan.stok_menipis > 0 && <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-red-50 rounded-full blur-xl"></div>}
        </div>
      </div>

      {/* 2. AREA GRAFIK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grafik Batang (Komponen Terpisah) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900">Penjualan 7 Hari Terakhir</h3>
            <p className="text-xs text-gray-500">Pantau tren omzet toko selama seminggu ke belakang.</p>
          </div>
          <GrafikPenjualan data={data.grafik_batang} />
        </div>

        {/* Grafik Donat (Produk Terlaris) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-4 text-center">
            <h3 className="font-bold text-gray-900">Top 4 Produk Terlaris</h3>
            <p className="text-xs text-gray-500">Berdasarkan total produk terjual bulan ini</p>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.grafik_donat}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.grafik_donat.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <PieTooltip 
                  formatter={(value: number) => [`${value} terjual`, 'Kuantitas']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. AREA TABEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 5 Transaksi Terbaru */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-gray-900">Transaksi Hari Ini</h3>
              <p className="text-xs text-gray-500">5 transaksi terakhir dari kasir</p>
            </div>
            <a href="/pemilik/laporan" className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
              Lihat Semua <ArrowRight size={14} />
            </a>
          </div>
          <div className="p-0 flex-grow">
            {data.transaksi_terbaru.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">Belum ada transaksi hari ini.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Nomor / Kasir</th>
                    <th className="px-6 py-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.transaksi_terbaru.map((trx: any) => {
                    const time = new Date(trx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={trx.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="px-6 py-3">
                          <div className="font-mono text-xs text-gray-900 font-semibold">{trx.nomor_transaksi}</div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Clock size={12}/> {time}</span>
                            <span>•</span>
                            <span>{trx.nama_kasir}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right font-bold text-gray-900">
                          {formatRupiah(trx.total_harga)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Daftar Produk Stok Menipis */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" /> Perhatian Stok!
              </h3>
              <p className="text-xs text-gray-500">Produk yang hampir atau sudah habis</p>
            </div>
          </div>
          <div className="p-0 flex-grow">
            {data.stok_menipis.length === 0 ? (
               <div className="p-8 text-center text-sm text-gray-400">Semua stok produk dalam kondisi aman.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {data.stok_menipis.map((item: any) => (
                  <li key={item.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.nama_produk}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Batas minimum: {item.stok_minimum} {item.satuan}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                        Sisa: {item.stok}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}