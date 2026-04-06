import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../services/api';
import StokBadge from '../../components/StokBadge';
import { 
  PackagePlus, History, Search, Loader2, X, 
  Save, ChevronLeft, ChevronRight, Package, AlertTriangle 
} from 'lucide-react';
import ToastNotif from '../../components/ToastNotif';

const ITEMS_PER_PAGE = 10;

type TabType = 'stok' | 'riwayat';

export default function Stok() {
  const [activeTab, setActiveTab] = useState<TabType>('stok');
  
  // Data State
  const [stokData, setStokData] = useState<any[]>([]);
  const [riwayatData, setRiwayatData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [filterTipe, setFilterTipe] = useState('');
  const [page, setPage] = useState(1);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ produk_id: '', jumlah: '', keterangan: '' });

  // Notifications
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchStok = async () => {
    setLoading(true);
    try {
      const res = await api.getStok();
      setStokData(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data stok');
    } finally {
      setLoading(false);
    }
  };

  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterTipe) params.tipe = filterTipe;
      // Filter produk_id bisa ditambahkan jika backend mendukung, 
      // sementara kita filter via frontend untuk search text
      const res = await api.getRiwayatStok(params);
      setRiwayatData(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat riwayat stok');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearch('');
    setPage(1);
    if (activeTab === 'stok') fetchStok();
    else fetchRiwayat();
  }, [activeTab, filterTipe]);

  // Filtering Logic
  const getFilteredData = () => {
    if (activeTab === 'stok') {
      return stokData.filter(item => 
        item.nama_produk.toLowerCase().includes(search.toLowerCase()) ||
        item.kategori?.nama_kategori.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return riwayatData.filter(item => 
        item.produk?.nama_produk.toLowerCase().includes(search.toLowerCase()) ||
        item.keterangan?.toLowerCase().includes(search.toLowerCase())
      );
    }
  };

  const filtered = getFilteredData();
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Handlers
  const handleBukaForm = (produkId?: string) => {
    setForm({ produk_id: produkId || '', jumlah: '', keterangan: '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTambahStok = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.produk_id) return setError('Silakan pilih produk terlebih dahulu.');
    if (!form.jumlah || Number(form.jumlah) <= 0) return setError('Jumlah stok harus lebih dari 0.');

    setSaving(true);
    try {
      await api.tambahStok({
        produk_id: form.produk_id,
        jumlah: Number(form.jumlah),
        keterangan: form.keterangan || 'Restock mandiri'
      });
      
      setSuccess('Stok berhasil ditambahkan!');
      setShowForm(false);
      
      // Refresh data
      if (activeTab === 'stok') fetchStok();
      else fetchRiwayat();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan stok.');
    } finally {
      setSaving(false);
    }
  };

  const formatWaktu = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })} ${d.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}`;
  };

  const lbl = "block text-sm font-bold text-gray-700 mb-1.5";
  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Alert Messages */}
      <ToastNotif message={success} type="success" onClose={() => setSuccess('')} />
      <ToastNotif message={error} type="error" onClose={() => setError('')} />

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1 w-fit">
        <button onClick={() => setActiveTab('stok')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-colors ${activeTab === 'stok' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
          <Package size={16} /> Daftar Stok
        </button>
        <button onClick={() => setActiveTab('riwayat')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-colors ${activeTab === 'riwayat' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
          <History size={16} /> Riwayat Perubahan
        </button>
      </div>

      {/* Form Tambah Stok */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-top-4">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/30">
            <div className="flex items-center gap-2 text-red-600">
              <PackagePlus size={18} />
              <h2 className="font-bold text-gray-900">Form Tambah Stok (Restock)</h2>
            </div>
            <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:bg-white hover:text-gray-600 rounded-lg"><X size={18}/></button>
          </div>
          
          <form onSubmit={handleTambahStok} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={lbl}>Pilih Produk *</label>
                <select 
                  value={form.produk_id} 
                  onChange={e => setForm({...form, produk_id: e.target.value})} 
                  className={inp}
                  required
                >
                  <option value="">-- Pilih Produk yang akan ditambah stoknya --</option>
                  {stokData.map(p => (
                    <option key={p.id} value={p.id}>{p.nama_produk} (Sisa: {p.stok} {p.satuan})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Jumlah Masuk (Qty) *</label>
                <input 
                  type="number" min="1" 
                  value={form.jumlah} 
                  onChange={e => setForm({...form, jumlah: e.target.value})} 
                  placeholder="Contoh: 50" 
                  className={inp} 
                  required 
                />
              </div>
              <div>
                <label className={lbl}>Keterangan (Opsional)</label>
                <input 
                  value={form.keterangan} 
                  onChange={e => setForm({...form, keterangan: e.target.value})} 
                  placeholder="Contoh: Barang masuk dari supplier A" 
                  className={inp} 
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">Batal</button>
              <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 transition-all flex items-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Simpan Stok
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toolbar Data */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {activeTab === 'riwayat' && (
            <select 
              value={filterTipe} 
              onChange={e => setFilterTipe(e.target.value)} 
              className="w-full md:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50"
            >
              <option value="">Semua Tipe</option>
              <option value="masuk">Barang Masuk</option>
              <option value="keluar">Barang Keluar (Terjual)</option>
            </select>
          )}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              value={search} 
              onChange={e => { setSearch(e.target.value); setPage(1); }} 
              placeholder={activeTab === 'stok' ? "Cari nama produk..." : "Cari produk atau keterangan..."}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow" 
            />
          </div>
        </div>
        
        {activeTab === 'stok' && !showForm && (
          <button 
            onClick={() => handleBukaForm()} 
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-red-100"
          >
            <PackagePlus size={18} /> Tambah Stok Barang
          </button>
        )}
      </div>

      {/* Area Tabel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                {activeTab === 'stok' ? (
                  <>
                    <th className="px-6 py-4 font-bold">Nama Produk</th>
                    <th className="px-6 py-4 font-bold">Kategori</th>
                    <th className="px-6 py-4 font-bold">Sisa Stok</th>
                    <th className="px-6 py-4 font-bold">Batas Minimum</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-center">Aksi</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 font-bold">Waktu</th>
                    <th className="px-6 py-4 font-bold">Produk</th>
                    <th className="px-6 py-4 font-bold">Tipe</th>
                    <th className="px-6 py-4 font-bold">Perubahan</th>
                    <th className="px-6 py-4 font-bold">Keterangan</th>
                    <th className="px-6 py-4 font-bold">Pencatat</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="py-16 text-center"><Loader2 className="animate-spin mx-auto text-red-400 mb-2" size={32} />Memuat data...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-gray-400 font-medium">Tidak ada data yang ditemukan.</td></tr>
              ) : activeTab === 'stok' ? (
                paginated.map(item => (
                  <tr key={item.id} className="hover:bg-red-50/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.nama_produk}</td>
                    <td className="px-6 py-4 text-gray-500">{item.kategori?.nama_kategori || '-'}</td>
                    <td className="px-6 py-4 font-black text-gray-800 text-base">{item.stok} <span className="text-xs font-medium text-gray-400">{item.satuan}</span></td>
                    <td className="px-6 py-4 text-gray-500">{item.stok_minimum} {item.satuan}</td>
                    <td className="px-6 py-4"><StokBadge stok={item.stok} stokMinimum={item.stok_minimum} /></td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleBukaForm(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-bold text-xs rounded-lg transition-colors"
                      >
                        <PackagePlus size={14} /> Restock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                paginated.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">{formatWaktu(item.created_at)}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{item.produk?.nama_produk || 'Produk Dihapus'}</td>
                    <td className="px-6 py-4">
                      {item.tipe === 'masuk' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] uppercase rounded-md border border-blue-200"> Masuk</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-[10px] uppercase rounded-md border border-amber-200"> Keluar</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">{item.stok_sebelum}</span>
                        <span className={`font-bold ${item.tipe === 'masuk' ? 'text-blue-600' : 'text-amber-600'}`}>
                          {item.tipe === 'masuk' ? '+' : '-'}{item.jumlah}
                        </span>
                        <span className="text-gray-400 text-xs">➔</span>
                        <span className="font-bold text-gray-900">{item.stok_sesudah}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{item.keterangan || '-'}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{item.pencatat?.nama_lengkap || 'Sistem'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <span className="text-sm text-gray-500 font-medium">
              Menampilkan <span className="text-gray-900">{(page-1)*ITEMS_PER_PAGE+1}</span> - <span className="text-gray-900">{Math.min(page*ITEMS_PER_PAGE, filtered.length)}</span> dari <span className="text-gray-900">{filtered.length}</span> data
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"><ChevronLeft size={18} /></button>
              <div className="px-2 text-sm font-bold text-gray-700">{page} / {totalPages}</div>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}