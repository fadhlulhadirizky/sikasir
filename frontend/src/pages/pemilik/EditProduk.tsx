import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../../services/api';
import { formatRupiah } from '../../lib/utils';
import { Save, Loader2, ArrowLeft, X, Image as ImageIcon } from 'lucide-react';
import ToastNotif from '../../components/ToastNotif';
import { UploadButton } from '../../lib/uploadthing';

const SATUAN_OPTIONS = ['pcs','kg','liter','lusin','botol','cup','pack','karton','gram','ml'];

export default function EditProduk() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [kategori, setKategori] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    nama_produk: '', kategori_id: '', satuan: 'pcs',
    harga_beli: '', harga_jual: '', stok_minimum: '5', is_active: true, gambar_url: ''
  });

  useEffect(() => {
    const fetchAwal = async () => {
      try {
        const kRes = await api.getKategori();
        setKategori(kRes.data || []);

        const pRes = await api.getProduk(); 
        const target = pRes.data?.find((p: any) => p.id === id);
        
        if (target) {
          setForm({
            nama_produk: target.nama_produk,
            kategori_id: target.kategori?.id || '',
            satuan: target.satuan,
            harga_beli: String(target.harga_beli),
            harga_jual: String(target.harga_jual),
            stok_minimum: String(target.stok_minimum),
            is_active: target.is_active,
            gambar_url: target.gambar_url || '' // Ambil gambar yang sudah ada
          });
        } else {
          setError('Data produk tidak ditemukan.');
        }
      } catch (err) {
        setError('Gagal memuat data produk.');
      } finally {
        setLoading(false);
      }
    };
    fetchAwal();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!form.nama_produk.trim()) return setError('Nama produk wajib diisi.');
    if (!form.harga_beli || !form.harga_jual) return setError('Harga beli dan harga jual wajib diisi.');
    if (Number(form.harga_jual) <= Number(form.harga_beli)) return setError('Harga jual harus lebih besar dari harga beli.');

    setSaving(true);
    try {
      await api.updateProduk(id!, {
        nama_produk: form.nama_produk,
        kategori_id: form.kategori_id || null,
        satuan: form.satuan,
        harga_beli: Number(form.harga_beli),
        harga_jual: Number(form.harga_jual),
        stok_minimum: Number(form.stok_minimum),
        is_active: form.is_active,
        gambar_url: form.gambar_url || null // Update gambar ke backend
      });

      setSuccess('Produk berhasil diperbarui!');
      setTimeout(() => navigate('/pemilik/produk'), 1500);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan perubahan.');
      setSaving(false);
    }
  };

  const lbl = "block text-sm font-bold text-gray-700 mb-1.5";
  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white";

  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-red-500 mb-2" size={32} />Memuat Data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/pemilik/produk')} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Edit Data Produk</h2>
          <p className="text-sm text-gray-500">Ubah foto, detail harga, atau status barang</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 md:p-8 space-y-8 flex-1">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Area Upload Foto (Kiri) */}
            <div className="lg:col-span-1 space-y-2">
              <label className={lbl}>Foto Produk</label>
              <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors relative group flex flex-col items-center justify-center">
                {form.gambar_url ? (
                  <>
                    <img src={form.gambar_url} alt="Preview Produk" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setForm({...form, gambar_url: ''})}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={32} className="mb-2 text-red-400" />
                      <span className="font-bold text-sm tracking-widest uppercase">Hapus Foto</span>
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                          setForm({ ...form, gambar_url: res[0].url });
                          setSuccess("Foto produk berhasil diubah!");
                        }
                      }}
                      onUploadError={(err: Error) => setError(`Gagal mengunggah foto: ${err.message}`)}
                      appearance={{
                        button: "w-full h-full absolute inset-0 opacity-0 cursor-pointer z-10", 
                        allowedContent: "hidden"
                      }}
                      content={{ button: "" }}
                    />
                    <ImageIcon size={40} className="text-gray-300 mb-3" />
                    <span className="text-sm font-bold text-gray-500">Pilih Foto Produk</span>
                  </div>
                )}
              </div>
            </div>

            {/* Area Input Data (Kanan) */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={lbl}>Nama Produk *</label>
                <input value={form.nama_produk} onChange={e => setForm({...form, nama_produk: e.target.value})} className={inp} />
              </div>
              <div>
                <label className={lbl}>Kategori</label>
                <select value={form.kategori_id} onChange={e => setForm({...form, kategori_id: e.target.value})} className={inp}>
                  <option value="">-- Tanpa Kategori --</option>
                  {kategori.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Satuan Jual</label>
                <select value={form.satuan} onChange={e => setForm({...form, satuan: e.target.value})} className={inp}>
                  {SATUAN_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Harga Modal / Beli (Rp) *</label>
                <input type="number" min="0" value={form.harga_beli} onChange={e => setForm({...form, harga_beli: e.target.value})} className={inp} />
              </div>
              <div>
                <label className={lbl}>Harga Jual Kasir (Rp) *</label>
                <input type="number" min="0" value={form.harga_jual} onChange={e => setForm({...form, harga_jual: e.target.value})} className={inp} />
              </div>
              <div>
                <label className={lbl}>Batas Minimum Stok *</label>
                <input type="number" min="0" value={form.stok_minimum} onChange={e => setForm({...form, stok_minimum: e.target.value})} className={inp} />
                <p className="text-[10px] text-gray-500 mt-1">Stok saat ini tidak bisa diedit di sini (Gunakan menu Manajemen Stok).</p>
              </div>
              <div>
                <label className={lbl}>Status Produk</label>
                <select value={form.is_active ? 'aktif' : 'nonaktif'} onChange={e => setForm({...form, is_active: e.target.value === 'aktif'})} className={inp}>
                  <option value="aktif">Aktif (Tampil di Kasir)</option>
                  <option value="nonaktif">Nonaktif (Disembunyikan)</option>
                </select>
              </div>
            </div>
          </div>

        </div>
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
          <button type="button" onClick={() => navigate('/pemilik/produk')} className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-white w-full sm:w-auto">Batal</button>
          <button type="submit" disabled={saving} className="px-8 py-3 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-70 text-white font-bold rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Perubahan
          </button>
        </div>
      </form>

      <ToastNotif message={error} type="error" onClose={() => setError('')} />
      <ToastNotif message={success} type="success" onClose={() => setSuccess('')} />
    </div>
  );
}