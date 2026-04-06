import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import { formatRupiah } from '../../lib/utils';
import { Save, Loader2, ArrowLeft, Tag, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import ToastNotif from '../../components/ToastNotif';
import { UploadButton } from '../../lib/uploadthing'; // Import UploadThing

const SATUAN_OPTIONS = ['pcs','kg','liter','lusin','botol','cup','pack','karton','gram','ml'];

export default function TambahProduk() {
  const navigate = useNavigate();
  const [kategori, setKategori] = useState<any[]>([]);
  const [showKatBaru, setShowKatBaru] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State Notifikasi
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tambahkan gambar_url pada state form awal
  const [form, setForm] = useState({
    nama_produk: '', kategori_id: '', kategori_baru: '', satuan: 'pcs',
    harga_beli: '', harga_jual: '', stok: '', stok_minimum: '5', gambar_url: ''
  });

  useEffect(() => {
    api.getKategori().then(res => setKategori(res.data || [])).catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validasi Sesuai PRD
    if (!form.nama_produk.trim()) return setError('Nama produk wajib diisi.');
    if (!form.harga_beli || !form.harga_jual) return setError('Harga beli dan harga jual wajib diisi.');
    if (Number(form.harga_jual) <= Number(form.harga_beli)) return setError('Harga jual harus lebih besar dari harga beli.');
    if (!form.stok || !form.stok_minimum) return setError('Stok awal dan batas minimum wajib diisi.');

    setSaving(true);
    try {
      let kategori_id = form.kategori_id || null;
      if (showKatBaru && form.kategori_baru.trim()) {
        const r = await api.tambahKategori({ nama_kategori: form.kategori_baru.trim() });
        kategori_id = r.data?.id || null;
      }

      await api.tambahProduk({
        nama_produk: form.nama_produk,
        kategori_id,
        satuan: form.satuan,
        harga_beli: Number(form.harga_beli),
        harga_jual: Number(form.harga_jual),
        stok: Number(form.stok),
        stok_minimum: Number(form.stok_minimum),
        gambar_url: form.gambar_url || undefined, // Kirim gambar_url ke backend
      });

      // Redirect akan diatur setelah notifikasi sukses (opsional, atau langsung redirect)
      navigate('/pemilik/produk'); 
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan produk.');
      setSaving(false);
    }
  };

  const lbl = "block text-sm font-bold text-gray-700 mb-1.5";
  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white transition-shadow";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header Halaman */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/pemilik/produk')} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tambah Produk Baru</h2>
          <p className="text-sm text-gray-500">Lengkapi informasi dan foto barang untuk katalog kasir</p>
        </div>
      </div>

      <ToastNotif message={error} type="error" onClose={() => setError('')} />
      <ToastNotif message={success} type="success" onClose={() => setSuccess('')} />
        
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 md:p-8 space-y-8 flex-1">
          
          {/* Section 1: Identitas Produk & Foto */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider border-b border-red-100 pb-2">1. Identitas & Foto Produk</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Area Upload Foto (Kiri) */}
              <div className="lg:col-span-1 space-y-2">
                <label className={lbl}>Foto Produk</label>
                <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors relative group flex flex-col items-center justify-center">
                  
                  {form.gambar_url ? (
                    <>
                      <img src={form.gambar_url} alt="Preview Produk" className="w-full h-full object-contain p-2" />
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
                            setSuccess("Foto produk berhasil diunggah!");
                          }
                        }}
                        onUploadError={(err: Error) => {
                          setError(`Gagal mengunggah foto: ${err.message}`);
                        }}
                        appearance={{
                          button: "w-full h-full absolute inset-0 opacity-0 cursor-pointer z-10", 
                          allowedContent: "hidden"
                        }}
                        content={{ button: "" }}
                      />
                      <ImageIcon size={40} className="text-gray-300 mb-3" />
                      <span className="text-sm font-bold text-gray-500">Pilih Foto Produk</span>
                      <span className="text-[10px] text-gray-400 mt-1">Maks. 4MB (JPG/PNG)</span>
                    </div>
                  )}

                </div>
              </div>

              {/* Area Input Identitas (Kanan) */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={lbl}>Nama Produk *</label>
                  <input autoFocus value={form.nama_produk} onChange={e => setForm({...form, nama_produk: e.target.value})} placeholder="Contoh: Indomie Goreng Spesial" className={inp} />
                </div>
                
                <div>
                  <label className={lbl}>Kategori</label>
                  {!showKatBaru ? (
                    <div className="flex gap-2">
                      <select value={form.kategori_id} onChange={e => setForm({...form, kategori_id: e.target.value})} className={inp}>
                        <option value="">-- Tanpa Kategori --</option>
                        {kategori.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                      </select>
                      <button type="button" onClick={() => setShowKatBaru(true)} className="px-4 border border-gray-200 rounded-xl text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors bg-gray-50" title="Kategori Baru"><Tag size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={form.kategori_baru} onChange={e => setForm({...form, kategori_baru: e.target.value})} placeholder="Ketik kategori baru..." className={inp} />
                      <button type="button" onClick={() => { setShowKatBaru(false); setForm({...form, kategori_baru: ''}); }} className="px-4 border border-gray-200 rounded-xl text-gray-500 hover:text-red-500 transition-colors bg-gray-50"><X size={18} /></button>
                    </div>
                  )}
                </div>

                <div>
                  <label className={lbl}>Satuan Jual</label>
                  <select value={form.satuan} onChange={e => setForm({...form, satuan: e.target.value})} className={inp}>
                    {SATUAN_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Harga */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider border-b border-red-100 pb-2">2. Pengaturan Harga</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              <div>
                <label className={lbl}>Harga Modal / Beli (Rp) *</label>
                <input type="number" min="0" value={form.harga_beli} onChange={e => setForm({...form, harga_beli: e.target.value})} placeholder="0" className={inp} />
              </div>
              <div>
                <label className={lbl}>Harga Jual Kasir (Rp) *</label>
                <input type="number" min="0" value={form.harga_jual} onChange={e => setForm({...form, harga_jual: e.target.value})} placeholder="0" className={inp} />
                {form.harga_beli && form.harga_jual && Number(form.harga_jual) > Number(form.harga_beli) && (
                  <p className="text-xs text-green-600 mt-2 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 
                    Keuntungan: {formatRupiah(Number(form.harga_jual) - Number(form.harga_beli))} / item
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Stok */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider border-b border-red-100 pb-2">3. Manajemen Stok</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={lbl}>Stok Awal Saat Ini *</label>
                <input type="number" min="0" value={form.stok} onChange={e => setForm({...form, stok: e.target.value})} placeholder="0" className={inp} />
              </div>
              <div>
                <label className={lbl}>Batas Minimum Peringatan *</label>
                <input type="number" min="0" value={form.stok_minimum} onChange={e => setForm({...form, stok_minimum: e.target.value})} placeholder="Contoh: 5" className={inp} />
                <p className="text-[11px] text-gray-500 mt-1.5 font-medium leading-relaxed">
                  Aplikasi akan memberi peringatan jika sisa stok menyentuh angka ini.
                </p>
              </div>
            </div>
          </div>

        </div>
        
        {/* Footer Actions */}
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
          <button type="button" onClick={() => navigate('/pemilik/produk')} className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-white hover:shadow-sm transition-all w-full sm:w-auto text-center">
            Batal
          </button>
          <button type="submit" disabled={saving} className="px-8 py-3 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-70 text-white font-bold rounded-xl shadow-lg shadow-red-200 flex justify-center items-center gap-2 transition-all w-full sm:w-auto">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </div>
      </form>
    </div>
  );
}

