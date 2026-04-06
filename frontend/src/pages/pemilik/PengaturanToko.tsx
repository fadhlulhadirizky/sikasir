// frontend\src\pages\pemilik\PengaturanToko.tsx
import React, { useState, useEffect, useRef } from 'react';
import * as api from '../../services/api';
import { useUploadThing } from '../../lib/uploadthing'; // Import hooks UploadThing
import { 
  Save, Loader2, Store, Image as ImageIcon, 
  Calendar, ShieldCheck, AlertCircle, Upload
} from 'lucide-react';
import ToastNotif from '../../components/ToastNotif';

// Helper untuk format tanggal
const formatTanggal = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

export default function PengaturanToko() {
  const [form, setForm] = useState({ 
    nama_toko: '', 
    alamat: '', 
    no_telepon: '', 
    logo_url: '' 
  });
  
  // State terpisah untuk data read-only dari database
  const [info, setInfo] = useState({
    is_active: true,
    created_at: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inisialisasi UploadThing hooks (sesuaikan nama 'imageUploader' dengan router di backend)
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.getTokoSaya();
        const t = res.data;
        if (t) {
          setForm({ 
            nama_toko: t.nama_toko || '', 
            alamat: t.alamat || '', 
            no_telepon: t.no_telepon || '',
            logo_url: t.logo_url || ''
          });
          setInfo({
            is_active: t.is_active,
            created_at: t.created_at
          });
        }
      } catch (e: any) { 
        setError(e.message); 
      } finally { 
        setLoading(false); 
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!form.nama_toko.trim()) { 
      setError('Nama toko wajib diisi'); 
      return; 
    }
    setSaving(true); 
    setError('');
    
    try {
      await api.updateTokoSaya({ 
        nama_toko: form.nama_toko, 
        alamat: form.alamat, 
        no_telepon: form.no_telepon,
        logo_url: form.logo_url
      });
      setSuccess('Pengaturan toko berhasil diperbarui!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) { 
      setError(e.message); 
    } finally { 
      setSaving(false); 
    }
  };

  // Fungsi handle upload terintegrasi SDK UploadThing
  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe & ukuran (Maks 4MB sesuai konfigurasi backend)
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG/PNG/WEBP)');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 4MB');
      return;
    }

    setError('');

    try {
      // Menjalankan proses upload bawaan UploadThing
      const res = await startUpload([file]);
      
      // Jika berhasil, res akan berisi array file yang di-upload
      if (res && res[0]) {
        setForm(prev => ({ ...prev, logo_url: res[0].url }));
        setSuccess('Logo berhasil diupload! Jangan lupa klik Simpan.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat upload gambar');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''; // reset input
    }
  };

  const inpClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50/50 focus:bg-white transition-colors";
  const lblClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <ToastNotif message={success} type="success" onClose={() => setSuccess('')} />
      <ToastNotif message={error} type="error" onClose={() => setError('')} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-sm">
          <Store size={24} />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 text-xl">Profil Toko</h1>
          <p className="text-sm text-gray-500">Kelola identitas dan informasi kontak toko kamu</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-red-400 mb-2" size={32} />
          <p className="text-sm text-gray-500">Memuat data toko...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Visual Logo & Status */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center flex flex-col items-center">
              <h3 className="font-semibold text-gray-800 mb-6 w-full text-left">Logo Toko</h3>
              
              {/* Input File Hidden */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleUploadLogo} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
              />

              {/* Area Upload Avatar Interaktif */}
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`w-40 h-40 rounded-full border-4 border-gray-50 bg-gray-100 shadow-md relative flex items-center justify-center overflow-hidden group cursor-pointer transition-transform hover:scale-105 ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
              >
                {form.logo_url ? (
                  <img 
                    src={form.logo_url} 
                    alt="Logo Toko" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                    }}
                  />
                ) : (
                  <ImageIcon size={40} className="text-gray-300" />
                )}

                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <Upload size={24} className="mb-1" />
                  <span className="text-xs font-medium">Ganti Logo</span>
                </div>

                {/* Overlay Loading */}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                    <Loader2 size={28} className="animate-spin text-red-500 mb-2" />
                    <span className="text-xs font-bold text-gray-700">Mengunggah...</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center max-w-[200px]">
                Format yang direkomendasikan: <br/> JPG, PNG, WEBP (Maks 4MB)
              </p>
            </div>

            {/* Read-Only Info Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div>
                <span className="text-xs font-medium text-gray-500 block mb-1">Status Operasional</span>
                {info.is_active ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    <ShieldCheck size={16} /> Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                    <AlertCircle size={16} /> Nonaktif
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 block mb-1">Terdaftar Sejak</span>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <Calendar size={16} className="text-gray-400" />
                  {formatTanggal(info.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Input Detail */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 md:p-8 space-y-6 flex-1">
              
              <div>
                <label className={lblClass}>Nama Toko <span className="text-red-500">*</span></label>
                <input 
                  value={form.nama_toko} 
                  onChange={e => setForm({...form, nama_toko: e.target.value})}
                  placeholder="Masukkan nama toko yang menarik" 
                  className={inpClass} 
                />
              </div>

              <div>
                <label className={lblClass}>Nomor Telepon</label>
                <input 
                  value={form.no_telepon} 
                  onChange={e => setForm({...form, no_telepon: e.target.value})}
                  placeholder="cth: 081234567890" 
                  className={inpClass} 
                />
              </div>

              <div>
                <label className={lblClass}>Alamat Lengkap</label>
                <textarea 
                  value={form.alamat} 
                  onChange={e => setForm({...form, alamat: e.target.value})}
                  placeholder="Tuliskan alamat lengkap beserta patokan jalan..." 
                  rows={5}
                  className={`${inpClass} resize-none`} 
                />
              </div>

            </div>

            {/* Footer Action */}
            <div className="bg-gray-50 px-6 md:px-8 py-5 border-t border-gray-100 flex items-center justify-end">
              <button 
                onClick={handleSave} 
                disabled={saving || !form.nama_toko.trim() || isUploading}
                className="flex items-center justify-center gap-2 w-full md:w-auto bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-sm font-bold px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}