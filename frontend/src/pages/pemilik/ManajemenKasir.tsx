import { useState, useEffect, useCallback } from 'react';
import * as api from '../../services/api';
import { getInitials } from '../../utils/format';
import { Plus, Search, Pencil, Trash2, Loader2, X, Save, RotateCcw, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import ToastNotif from '../../components/ToastNotif';

// Backend tambahKasir: nama_lengkap, email, password (wajib), username (opsional)
// Role kasir otomatis di backend — tidak perlu dikirim dari frontend
// updateKasir: nama_lengkap, username, is_active

interface Kasir {
  id: string;
  nama_lengkap: string;
  username?: string;
  email?: string;
  is_active: boolean;
}

const ITEMS_PER_PAGE = 10;
const emptyForm = { nama_lengkap: '', username: '', email: '', password: '', is_active: true };
const lbl = "block text-sm font-medium text-gray-700 mb-1";
const inp = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white";

function KasirChart({ data }: { data: Kasir[] }) {
  const total = data.length;
  const aktif = data.filter(k => k.is_active).length;
  const nonaktif = total - aktif;
  const max = Math.max(aktif, nonaktif, 1);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-1">
        <Users size={16} className="text-red-500" />
        <span className="font-semibold text-gray-800 text-sm">Ringkasan Akun Kasir</span>
      </div>
      <p className="text-xs text-gray-400 mb-4">Total {total} akun kasir terdaftar</p>
      <div className="space-y-3">
        {[{ label: 'Kasir Aktif', value: aktif, color: '#ef4444' }, { label: 'Nonaktif', value: nonaktif, color: '#d1d5db' }].map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{b.label}</span>
              <span className="font-semibold" style={{ color: b.color }}>{b.value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(b.value / max) * 100}%`, backgroundColor: b.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ManajemenKasir() {
  const [kasirList, setKasirList] = useState<Kasir[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchKasir = useCallback(async () => {
    setLoading(true);
    try { const res = await api.getKasir(); setKasirList(res.data || []); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchKasir(); }, [fetchKasir]);

  const filtered = kasirList.filter(k =>
    k.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
    (k.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.email || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const validate = () => {
    if (!form.nama_lengkap.trim()) return 'Nama lengkap wajib diisi';
    if (!form.email.trim()) return 'Email wajib diisi';
    if (!editId && !form.password) return 'Password wajib diisi untuk kasir baru';
    if (!editId && form.password.length < 6) return 'Password minimal 6 karakter';
    return null;
  };

  const handleSave = async () => {
    const err = validate(); if (err) { setError(err); return; }
    setSaving(true); setError('');
    try {
      if (editId) {
        // updateKasir hanya terima: nama_lengkap, username, is_active
        const body: any = { nama_lengkap: form.nama_lengkap, is_active: form.is_active };
        if (form.username) body.username = form.username;
        await api.updateKasir(editId, body);
        setSuccess('Data kasir berhasil diperbarui');
      } else {
        // tambahKasir: nama_lengkap, email, password (wajib), username (opsional)
        // Role kasir otomatis di backend
        const body: any = { nama_lengkap: form.nama_lengkap, email: form.email, password: form.password };
        if (form.username) body.username = form.username;
        await api.tambahKasir(body);
        setSuccess('Kasir berhasil ditambahkan');
      }
      resetForm(); fetchKasir(); setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (k: Kasir) => {
    setForm({ nama_lengkap: k.nama_lengkap, username: k.username || '', email: k.email || '', password: '', is_active: k.is_active });
    setEditId(k.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await api.hapusKasir(deleteId); setSuccess('Kasir berhasil dinonaktifkan'); fetchKasir(); setTimeout(() => setSuccess(''), 3000); }
    catch (e: any) { setError(e.message); }
    finally { setDeleteId(null); }
  };

  const resetForm = () => { setForm(emptyForm); setEditId(null); setShowForm(false); setError(''); };

  return (
    <div className="space-y-4">
      <ToastNotif message={success} type="success" onClose={() => setSuccess('')} />
      <ToastNotif message={error} type="error" onClose={() => setError('')} />

      <KasirChart data={kasirList} />

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">{editId ? 'Edit Kasir' : 'Tambah Akun Kasir'}</h2>
            {!editId && <p className="text-xs text-gray-400 mt-0.5">Akun akan otomatis memiliki role <span className="font-semibold text-red-500">Kasir</span></p>}
          </div>
          {!showForm
            ? <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                <Plus size={16} /> Tambah Akun
              </button>
            : <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
          }
        </div>

        {showForm && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Lengkap — wajib selalu */}
              <div>
                <label className={lbl}>Nama Lengkap *</label>
                <input value={form.nama_lengkap} onChange={e => setForm({...form, nama_lengkap: e.target.value})}
                  placeholder="Masukkan nama lengkap" className={inp} />
              </div>

              {/* Username — opsional, bisa diisi atau tidak */}
              <div>
                <label className={lbl}>Username <span className="text-gray-400 font-normal">(opsional)</span></label>
                <input value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                  placeholder="Masukkan username" className={inp} />
              </div>

              {/* Email — wajib, hanya untuk tambah baru */}
              {!editId && (
                <div>
                  <label className={lbl}>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="Masukkan email" className={inp} />
                  <p className="text-xs text-gray-400 mt-1">Email digunakan untuk login ke sistem kasir</p>
                </div>
              )}

              {/* Password — wajib untuk tambah baru, tidak ada saat edit */}
              {!editId && (
                <div>
                  <label className={lbl}>Password * <span className="text-gray-400 font-normal">(min. 6 karakter)</span></label>
                  <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    placeholder="Masukkan password" className={inp} />
                </div>
              )}
            </div>

            {editId && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
                💡 Saat edit, hanya nama lengkap, username, dan status yang bisa diubah.
              </div>
            )}

            {/* Status — hanya tampil saat edit */}
            {editId && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Status Akun</label>
                  <select value={form.is_active ? 'aktif' : 'nonaktif'}
                    onChange={e => setForm({...form, is_active: e.target.value === 'aktif'})}
                    className={inp}>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button onClick={resetForm}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari nama, username, email..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 w-56" />
          </div>
          <span className="text-sm text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">{filtered.length} Kasir</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Nama Kasir', 'Username', 'Email', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-red-400" size={28} /></td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400">Belum ada kasir terdaftar</td></tr>
              ) : (
                paginated.map(k => (
                  <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold flex-shrink-0">
                          {getInitials(k.nama_lengkap)}
                        </div>
                        <span className="font-medium text-gray-800">{k.nama_lengkap}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{k.username || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{k.email || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${k.is_active ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${k.is_active ? 'bg-red-500' : 'bg-gray-400'}`} />
                        {k.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleEdit(k)} className="text-gray-400 hover:text-blue-500 transition-colors p-1"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteId(k.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm text-gray-500">{(page-1)*ITEMS_PER_PAGE+1}–{Math.min(page*ITEMS_PER_PAGE, filtered.length)} dari {filtered.length} kasir</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={18} /></button>
              {Array.from({length: Math.min(totalPages,5)}, (_,i) => i+1).map(pg => (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`w-8 h-8 rounded-full text-sm font-medium ${page===pg ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{pg}</button>
              ))}
              {totalPages > 5 && <span className="text-gray-400">...</span>}
              {totalPages > 5 && <button onClick={() => setPage(totalPages)} className={`w-8 h-8 rounded-full text-sm ${page===totalPages ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{totalPages}</button>}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><Trash2 size={20} className="text-red-500" /></div>
              <div>
                <h3 className="font-semibold text-gray-900">Nonaktifkan Kasir?</h3>
                <p className="text-sm text-gray-500">Kasir tidak akan bisa login ke sistem</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium">Nonaktifkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}