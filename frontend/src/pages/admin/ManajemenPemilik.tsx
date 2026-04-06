import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { UploadButton } from '../../lib/uploadthing';
import ToastNotif from '../../components/ToastNotif'; // Import Toast
import {
  Plus, Search, Pencil, Trash2, Loader2, X, Save,
  RotateCcw, ChevronLeft, ChevronRight, Store, MapPin, Phone
} from 'lucide-react';

// ============================================================
// Tipe Data
// ============================================================

interface Pemilik {
  id: string;
  nama_lengkap: string;
  email: string;
  is_active: boolean;
  created_at: string;
  toko?: {
    id: string;
    nama_toko: string;
    alamat?: string;
    no_telepon?: string;
    logo_url?: string;
    is_active: boolean;
  } | null;
}

interface FormTambahPemilik {
  nama_lengkap: string;
  email: string;
  password: string;
  nama_toko: string;
  alamat: string;
  no_telepon: string;
  logo_url: string;
}

// ============================================================
// Konstanta
// ============================================================

const JUMLAH_PER_HALAMAN = 10;

const formKosong: FormTambahPemilik = {
  nama_lengkap: '',
  email: '',
  password: '',
  nama_toko: '',
  alamat: '',
  no_telepon: '',
  logo_url: '',
};

// Kelas CSS Form
const kelasLabel = 'block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5';
const kelasInput = `
  w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
  focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
  bg-gray-50/50 hover:bg-white focus:bg-white placeholder:text-gray-400 transition-all
`;

// ============================================================
// Sub-Komponen: Badge Status
// ============================================================

const BadgeStatus = ({ aktif }: { aktif: boolean }) => (
  <span
    className={`
      inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold
      ${aktif
        ? 'bg-green-50 text-green-700 border border-green-200'
        : 'bg-gray-100 text-gray-500 border border-gray-200'
      }
    `}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${aktif ? 'bg-green-500' : 'bg-gray-400'}`} />
    {aktif ? 'Aktif' : 'Nonaktif'}
  </span>
);

// ============================================================
// Sub-Komponen: Kartu Pemilik (Mobile)
// ============================================================

interface PropsKartuPemilik {
  pemilik: Pemilik;
  onEdit: (pemilik: Pemilik) => void;
  onHapus: (id: string) => void;
}

const KartuPemilikMobile = ({ pemilik, onEdit, onHapus }: PropsKartuPemilik) => {
  const inisialNama = pemilik.nama_lengkap.substring(0, 2).toUpperCase();
  const inisialToko = pemilik.toko?.nama_toko ? pemilik.toko.nama_toko.substring(0, 2).toUpperCase() : 'TK';

  return (
    <div className="p-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[#DC2626] text-sm font-bold flex-shrink-0 mt-0.5">
            {inisialNama}
          </div>
          <div>
            <p className="font-bold text-gray-900">{pemilik.nama_lengkap}</p>
            <p className="text-xs text-gray-500">{pemilik.email}</p>
          </div>
        </div>
        <BadgeStatus aktif={pemilik.is_active} />
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-start gap-3 shadow-sm mb-4">
        {pemilik.toko?.logo_url ? (
          <img src={pemilik.toko.logo_url} alt="Logo" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 text-sm font-bold flex-shrink-0 border border-slate-200">
            {inisialToko}
          </div>
        )}
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-bold text-gray-800 truncate">{pemilik.toko?.nama_toko || 'Belum ada toko'}</p>
          <div className="flex items-start gap-1 text-[10px] text-gray-500">
            <MapPin size={10} className="mt-0.5 flex-shrink-0" />
            <p className="truncate">{pemilik.toko?.alamat || 'Belum ada alamat'}</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-600">
            <Phone size={10} className="flex-shrink-0" /> 
            <p>{pemilik.toko?.no_telepon || '-'}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => onEdit(pemilik)} className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1">
          <Pencil size={12} /> Edit
        </button>
        <button onClick={() => onHapus(pemilik.id)} className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1">
          <Trash2 size={12} /> Nonaktifkan
        </button>
      </div>
    </div>
  );
};

// ============================================================
// Komponen Utama: ManajemenPemilik
// ============================================================

export default function ManajemenPemilik() {
  const [daftarPemilik, setDaftarPemilik] = useState<Pemilik[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [kataCari, setKataCari] = useState('');
  const [halamanAktif, setHalamanAktif] = useState(1);

  // State Form Modal
  const [tampilkanForm, setTampilkanForm] = useState(false);
  const [dataForm, setDataForm] = useState<FormTambahPemilik>(formKosong);
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);

  const [idDiedit, setIdDiedit] = useState<string | null>(null);
  const [dataEdit, setDataEdit] = useState({ nama_lengkap: '', is_active: true });
  const [idDihapus, setIdDihapus] = useState<string | null>(null);

  // Toast
  const [pesanSukses, setPesanSukses] = useState('');
  const [pesanError, setPesanError] = useState('');

  const ambilDataPemilik = async () => {
    setSedangMemuat(true);
    try {
      const hasil = await api.getDaftarPemilik();
      setDaftarPemilik(hasil.data || []);
    } catch (error: any) {
      setPesanError(error.message || 'Gagal memuat data pemilik');
    } finally {
      setSedangMemuat(false);
    }
  };

  useEffect(() => { ambilDataPemilik(); }, []);

  const pemilikTerfilter = daftarPemilik.filter((p) => {
    const kata = kataCari.toLowerCase();
    return (
      p.nama_lengkap.toLowerCase().includes(kata) ||
      p.email.toLowerCase().includes(kata) ||
      (p.toko?.nama_toko || '').toLowerCase().includes(kata)
    );
  });

  const totalHalaman = Math.ceil(pemilikTerfilter.length / JUMLAH_PER_HALAMAN);
  const pemilikDitampilkan = pemilikTerfilter.slice(
    (halamanAktif - 1) * JUMLAH_PER_HALAMAN,
    halamanAktif * JUMLAH_PER_HALAMAN
  );

  const handleTambahPemilik = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataForm.nama_lengkap.trim() || !dataForm.email.trim() || !dataForm.password || !dataForm.nama_toko.trim()) {
      setPesanError('Nama lengkap, email, password, dan nama toko wajib diisi!');
      return;
    }
    if (dataForm.password.length < 6) {
      setPesanError('Password minimal 6 karakter!');
      return;
    }

    setSedangMenyimpan(true);
    try {
      await api.tambahPemilik({
        nama_lengkap: dataForm.nama_lengkap,
        email: dataForm.email,
        password: dataForm.password,
        nama_toko: dataForm.nama_toko,
        alamat: dataForm.alamat || undefined,
        no_telepon: dataForm.no_telepon || undefined,
        logo_url: dataForm.logo_url || undefined,
      });
      setPesanSukses('Akun pemilik dan toko berhasil dibuat!');
      setDataForm(formKosong);
      setTampilkanForm(false);
      ambilDataPemilik();
    } catch (error: any) {
      setPesanError(error.message || 'Gagal menambahkan pemilik');
    } finally {
      setSedangMenyimpan(false);
    }
  };

  const handleBukaEdit = (pemilik: Pemilik) => {
    setIdDiedit(pemilik.id);
    setDataEdit({ nama_lengkap: pemilik.nama_lengkap, is_active: pemilik.is_active });
  };

  const handleSimpanEdit = async () => {
    if (!idDiedit) return;
    if (!dataEdit.nama_lengkap.trim()) {
      setPesanError('Nama lengkap tidak boleh kosong');
      return;
    }

    setSedangMenyimpan(true);
    try {
      await api.updatePemilik(idDiedit, {
        nama_lengkap: dataEdit.nama_lengkap,
        is_active: dataEdit.is_active,
      });
      setPesanSukses('Data pemilik berhasil diperbarui');
      setIdDiedit(null);
      ambilDataPemilik();
    } catch (error: any) {
      setPesanError(error.message || 'Gagal memperbarui data');
    } finally {
      setSedangMenyimpan(false);
    }
  };

  const handleKonfirmasiHapus = async () => {
    if (!idDihapus) return;
    setSedangMenyimpan(true);
    try {
      await api.hapusPemilik(idDihapus);
      setPesanSukses('Pemilik berhasil dinonaktifkan');
      ambilDataPemilik();
    } catch (error: any) {
      setPesanError(error.message || 'Gagal menonaktifkan pemilik');
    } finally {
      setIdDihapus(null);
      setSedangMenyimpan(false);
    }
  };

  const formatTanggal = (tanggalString: string) => {
    return new Date(tanggalString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Tombol Tambah & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          onClick={() => setTampilkanForm(true)}
          className="flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-200"
        >
          <Plus size={18} /> Tambah Mitra Pemilik
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={ambilDataPemilik} title="Muat ulang data" className="p-3 border border-gray-200 bg-white rounded-xl text-gray-500 hover:text-[#DC2626] transition-colors">
            <RotateCcw size={16} />
          </button>
          <div className="relative flex-1 sm:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={kataCari}
              onChange={(e) => { setKataCari(e.target.value); setHalamanAktif(1); }}
              placeholder="Cari nama, email, atau toko..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Tabel Data Pemilik */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Desktop / Tablet View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                {['Profil Pemilik', 'Profil Toko', 'Bergabung', 'Status', 'Aksi'].map((judul) => (
                  <th key={judul} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {judul}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sedangMemuat ? (
                <tr><td colSpan={5} className="py-16 text-center"><Loader2 className="animate-spin mx-auto text-red-400 mb-2" size={28} /></td></tr>
              ) : pemilikDitampilkan.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-gray-400">Belum ada data.</td></tr>
              ) : (
                pemilikDitampilkan.map((pemilik) => {
                  const inisialToko = pemilik.toko?.nama_toko ? pemilik.toko.nama_toko.substring(0, 2).toUpperCase() : 'TK';
                  return (
                    <tr key={pemilik.id} className="hover:bg-red-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[#DC2626] text-sm font-bold flex-shrink-0">
                            {pemilik.nama_lengkap.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{pemilik.nama_lengkap}</span>
                            <span className="text-xs text-gray-500">{pemilik.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {pemilik.toko?.logo_url ? (
                            <img src={pemilik.toko.logo_url} alt="Logo" className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0 border border-slate-200">
                              {inisialToko}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-800">{pemilik.toko?.nama_toko || <span className="italic text-gray-400 font-normal">Belum ada toko</span>}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{pemilik.toko?.alamat || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatTanggal(pemilik.created_at)}</td>
                      <td className="px-6 py-4"><BadgeStatus aktif={pemilik.is_active} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleBukaEdit(pemilik)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Pencil size={16} /></button>
                          <button onClick={() => setIdDihapus(pemilik.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Nonaktifkan"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {sedangMemuat ? (
             <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-red-400 mb-2" size={24} /></div>
          ) : pemilikDitampilkan.length === 0 ? (
             <p className="py-12 text-center text-sm text-gray-400">Belum ada data.</p>
          ) : (
            pemilikDitampilkan.map((pemilik) => (
              <KartuPemilikMobile key={pemilik.id} pemilik={pemilik} onEdit={handleBukaEdit} onHapus={setIdDihapus} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!sedangMemuat && pemilikTerfilter.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Hal. <strong className="text-gray-900">{halamanAktif}</strong> dari {totalHalaman} ({pemilikTerfilter.length} data)
            </span>
            <div className="flex gap-1">
              <button onClick={() => setHalamanAktif((h) => Math.max(1, h - 1))} disabled={halamanAktif === 1} className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:shadow-sm disabled:opacity-30"><ChevronLeft size={18} /></button>
              <button onClick={() => setHalamanAktif((h) => Math.min(totalHalaman, h + 1))} disabled={halamanAktif === totalHalaman} className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:shadow-sm disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════
          Modal Tambah Pemilik
      ════════════════════════════════════════════════ */}
      {tampilkanForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Tambah Mitra Pemilik</h3>
                <p className="text-xs text-gray-500">Akun login & entitas toko akan dibuat bersamaan.</p>
              </div>
              <button onClick={() => setTampilkanForm(false)} className="p-2 text-gray-400 hover:bg-white hover:shadow-sm rounded-full"><X size={20} /></button>
            </div>

            <form onSubmit={handleTambahPemilik} className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Bagian Kiri: Akun */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-red-600 border-b border-red-100 pb-2 flex items-center gap-2">1. Data Akses Login</h4>
                  <div>
                    <label className={kelasLabel}>Nama Lengkap Pemilik *</label>
                    <input value={dataForm.nama_lengkap} onChange={e => setDataForm({...dataForm, nama_lengkap: e.target.value})} className={kelasInput} placeholder="Sesuai KTP" />
                  </div>
                  <div>
                    <label className={kelasLabel}>Email Login *</label>
                    <input type="email" value={dataForm.email} onChange={e => setDataForm({...dataForm, email: e.target.value})} className={kelasInput} placeholder="email@contoh.com" />
                  </div>
                  <div>
                    <label className={kelasLabel}>Password Default *</label>
                    <input type="password" value={dataForm.password} onChange={e => setDataForm({...dataForm, password: e.target.value})} className={kelasInput} placeholder="Minimal 6 karakter" />
                  </div>
                </div>

                {/* Bagian Kanan: Toko */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-red-600 border-b border-red-100 pb-2 flex items-center gap-2">2. Profil Usaha / Toko</h4>
                  <div>
                    <label className={kelasLabel}>Nama Toko / Usaha *</label>
                    <input value={dataForm.nama_toko} onChange={e => setDataForm({...dataForm, nama_toko: e.target.value})} className={kelasInput} placeholder="Contoh: Toko Maju Jaya" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={kelasLabel}>No. Telepon</label>
                      <input value={dataForm.no_telepon} onChange={e => setDataForm({...dataForm, no_telepon: e.target.value})} className={kelasInput} placeholder="Opsional" />
                    </div>
<div>
                      <label className={kelasLabel}>Logo Toko (Opsional)</label>
                      
                      {/* LOGIKA UPLOAD THING */}
                      {dataForm.logo_url ? (
                        <div className="relative w-full h-[42px] border border-gray-200 rounded-xl overflow-hidden group">
                          <img src={dataForm.logo_url} alt="Logo Preview" className="w-full h-full object-cover opacity-60" />
                          <button 
                            type="button"
                            onClick={() => setDataForm({...dataForm, logo_url: ''})}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Hapus Logo
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-[42px] flex items-center justify-center border border-dashed border-gray-300 rounded-xl overflow-hidden hover:bg-gray-50 transition-colors">
                           {/* Panggil komponen UploadButton dari uploadthing */}
                           <UploadButton
                             endpoint="imageUploader"
                             onClientUploadComplete={(res) => {
                               // res mengembalikan array objek, ambil url dari item pertama
                               if (res && res.length > 0) {
                                 setDataForm({ ...dataForm, logo_url: res[0].url });
                                 setPesanSukses("Logo berhasil diunggah!");
                               }
                             }}
                             onUploadError={(error: Error) => {
                               setPesanError(`Gagal upload: ${error.message}`);
                             }}
                             appearance={{
                               button: "bg-transparent text-gray-500 font-medium text-xs h-full w-full outline-none",
                               allowedContent: "hidden" // Sembunyikan teks "image (4MB)" agar muat
                             }}
                             content={{
                               button: "Pilih Gambar"
                             }}
                           />
                        </div>
                      )}

                    </div>
                    </div>

                  <div>
                    <label className={kelasLabel}>Alamat Lengkap</label>
                    <textarea value={dataForm.alamat} onChange={e => setDataForm({...dataForm, alamat: e.target.value})} className={`${kelasInput} resize-none h-20`} placeholder="Alamat fisik toko (opsional)" />
                  </div>
                </div>

              </div>
            </form>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => setTampilkanForm(false)} className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={handleTambahPemilik} disabled={sedangMenyimpan} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-200 transition-all flex items-center gap-2 disabled:opacity-50">
                {sedangMenyimpan ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan & Daftarkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit & Hapus (Sama seperti sebelumnya) */}
      {idDiedit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-lg">Edit Pemilik</h3>
              <button onClick={() => setIdDiedit(null)} className="text-gray-400 hover:text-gray-900 bg-white p-1 rounded-full"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={kelasLabel}>Nama Lengkap Pemilik</label>
                <input value={dataEdit.nama_lengkap} onChange={e => setDataEdit({...dataEdit, nama_lengkap: e.target.value})} className={kelasInput} />
              </div>
              <div>
                <label className={kelasLabel}>Akses Akun</label>
                <select value={dataEdit.is_active ? 'aktif' : 'nonaktif'} onChange={e => setDataEdit({...dataEdit, is_active: e.target.value === 'aktif'})} className={kelasInput}>
                  <option value="aktif">Aktif (Dapat Login & Berjualan)</option>
                  <option value="nonaktif">Nonaktif (Akses Diblokir)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-2">
              <button onClick={() => setIdDiedit(null)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={handleSimpanEdit} disabled={sedangMenyimpan} className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors">
                {sedangMenyimpan ? <Loader2 size={16} className="animate-spin" /> : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {idDihapus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm text-center">
            <div className="p-6 pb-2">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={28} className="text-red-500" /></div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">Nonaktifkan Mitra?</h3>
              <p className="text-sm text-gray-500">Tindakan ini akan mengunci akses login pemilik dan seluruh kasir di toko tersebut.</p>
            </div>
            <div className="flex gap-3 p-6">
              <button onClick={() => setIdDihapus(null)} className="flex-1 border border-gray-200 bg-gray-50 text-gray-600 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">Batalkan</button>
              <button onClick={handleKonfirmasiHapus} disabled={sedangMenyimpan} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-colors">
                {sedangMenyimpan ? <Loader2 size={16} className="animate-spin" /> : 'Nonaktifkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Komponen Toast Notifikasi Global */}
      <ToastNotif message={pesanSukses} type="success" onClose={() => setPesanSukses('')} />
      <ToastNotif message={pesanError} type="error" onClose={() => setPesanError('')} />

    </div>
  );
}