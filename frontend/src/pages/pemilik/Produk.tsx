// frontend\src\pages\pemilik\Produk.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import { formatRupiah } from '../../lib/utils';
import StokBadge from '../../components/StokBadge';
import { 
  Plus, Search, Pencil, Trash2, Loader2, AlertTriangle, 
  ChevronLeft, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import ToastNotif from '../../components/ToastNotif';

const ITEMS_PER_PAGE = 10;

// Helper untuk format tanggal
const formatTanggal = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export default function Produk() {
  const navigate = useNavigate();
  
  const [produk, setProduk] = useState<any[]>([]);
  const [kategori, setKategori] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search
  const [search, setSearch] = useState('');
  const [filterKat, setFilterKat] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); 
  const [page, setPage] = useState(1);
  
  // Notifikasi & Delete
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (filterKat) params.kategori_id = filterKat;
      if (filterStatus !== '') params.is_active = filterStatus;

      const [pRes, kRes] = await Promise.all([api.getProduk(params), api.getKategori()]);
      setProduk(pRes.data || []);
      setKategori(kRes.data || []);
    } catch (e: any) { 
      setError(e.message); 
    } finally { 
      setLoading(false); 
    }
  }, [search, filterKat, filterStatus]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [search, filterKat, filterStatus]);

  const belowMin = produk.filter(p => p.stok < p.stok_minimum && p.is_active);
  const totalPages = Math.ceil(produk.length / ITEMS_PER_PAGE);
  const paginated = produk.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async () => {
    if (!deleteId) return;
    try { 
      await api.hapusProduk(deleteId);
      setSuccess('Produk berhasil dinonaktifkan'); 
      fetchData(); 
      setTimeout(() => setSuccess(''), 3000); 
    } catch (e: any) { 
      setError(e.message); 
    } finally { 
      setDeleteId(null); 
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {belowMin.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2 text-amber-700 text-sm">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
          <span><strong>{belowMin.length} produk</strong> memiliki stok di bawah batas minimum!</span>
        </div>
      )}
      
      <ToastNotif message={success} type="success" onClose={() => setSuccess('')} />
      <ToastNotif message={error} type="error" onClose={() => setError('')} />

      {/* Action & Filter Bar - Sangat responsif untuk semua device */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col xl:flex-row justify-between gap-4">
          
          <button 
            onClick={() => navigate('/pemilik/produk/tambah')} 
            className="w-full xl:w-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shrink-0 whitespace-nowrap"
          >
            <Plus size={16} /> Tambah Produk
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full xl:w-3/4">
            <select value={filterKat} onChange={e => setFilterKat(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white">
              <option value="">Semua Kategori</option>
              {kategori.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
            </select>
            
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white">
              <option value="">Semua Status</option>
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
            
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama produk..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
          </div>

        </div>
      </div>

      {/* Tabel Produk */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left whitespace-nowrap min-w-max">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Foto</th>
                {/* Kolom Nama Produk dibekukan di kiri */}
                <th className="px-4 py-3 font-semibold text-gray-600 min-w-[180px] sticky left-0 bg-gray-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Nama Produk</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Kategori</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Harga Beli</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Harga Jual</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Stok</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Min. Stok</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600 min-w-[150px]">Log Waktu</th>
                {/* Kolom Aksi dibekukan di kanan */}
                <th className="px-4 py-3 font-semibold text-gray-600 text-center sticky right-0 bg-gray-50 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={10} className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-red-400" size={28} /></td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={10} className="py-12 text-center text-gray-400">Tidak ada data produk</td></tr>
              ) : (
                paginated.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        {p.gambar_url ? <img src={p.gambar_url} alt="Foto" className="w-full h-full object-cover rounded-lg" /> : <ImageIcon size={18} />}
                      </div>
                    </td>
                    <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-gray-50 transition-colors z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <p className="font-bold text-gray-900 truncate max-w-[180px]">{p.nama_produk}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.kategori?.nama_kategori || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 font-medium">{formatRupiah(p.harga_beli)}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{formatRupiah(p.harga_jual)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-bold text-gray-800">{p.stok} {p.satuan}</span>
                        <StokBadge stok={p.stok} stokMinimum={p.stok_minimum} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.stok_minimum} {p.satuan}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-gray-500 leading-relaxed">
                      <p><span className="font-medium">Dibuat:</span><br/>{formatTanggal(p.created_at)}</p>
                      <p className="mt-1"><span className="font-medium">Diubah:</span><br/>{formatTanggal(p.updated_at)}</p>
                    </td>
                    <td className="px-4 py-3 sticky right-0 bg-white group-hover:bg-gray-50 transition-colors z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => navigate(`/pemilik/produk/edit/${p.id}`)} className="p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors" title="Edit"><Pencil size={16} /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Nonaktifkan"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!loading && produk.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">Menampilkan {paginated.length} dari {produk.length} produk</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={18} /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <AlertTriangle size={32} className="text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Nonaktifkan Produk?</h3>
            <p className="text-sm text-gray-500 mb-6">Produk ini tidak akan bisa dijual lagi di kasir.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-bold hover:bg-gray-50">Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-bold">Nonaktifkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}