import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import {
  Users, Store, ShoppingCart, CreditCard,
  Loader2, ArrowRight, Building2, TrendingUp,
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

interface Statistik {
  total_pemilik_aktif: number;
  total_toko_aktif: number;
  total_kasir_aktif: number;
  total_transaksi_hari_ini: number;
}

// ============================================================
// Helper
// ============================================================

const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

const formatTanggal = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

// ============================================================
// Sub-Komponen: Kartu Statistik
// ============================================================

interface PropsKartuStatistik {
  label: string;
  nilai: number;
  icon: React.ElementType;
  bg: string;
  iconBg: string;
}

const KartuStatistik = ({ label, nilai, icon: Icon, bg, iconBg }: PropsKartuStatistik) => (
  <div
    className={`${bg} rounded-2xl p-5 md:p-6 flex items-center gap-4 shadow-sm
      border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
      relative overflow-hidden group cursor-default select-none`}
  >
    <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/5 rounded-full transition-all duration-500 group-hover:scale-125" />
    <div className="absolute -right-2 -top-4 w-16 h-16 bg-white/5 rounded-full" />

    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 z-10`}>
      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
    </div>

    <div className="z-10 flex-1 min-w-0">
      <p className="text-[26px] md:text-[30px] font-black text-white tracking-tight leading-none">
        {nilai.toLocaleString('id-ID')}
      </p>
      <p className="text-[11px] md:text-[12px] text-white/70 font-semibold tracking-wider mt-1 truncate">
        {label}
      </p>
    </div>

    <TrendingUp className="w-5 h-5 text-white/20 flex-shrink-0 z-10" strokeWidth={2} />
  </div>
);

// ============================================================
// Sub-Komponen: Baris Tabel
//
// SATU komponen, SATU tampilan untuk semua ukuran layar.
// Di HP/tablet: tabel di-scroll horizontal, tidak collapse ke kartu.
// Ini jauh lebih maintainable dan konsisten secara UX.
// ============================================================

const BarisTabel = ({ pemilik }: { pemilik: Pemilik }) => {
  const tanggal = formatTanggal(pemilik.created_at);

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-red-50/40 transition-colors duration-150">

      {/* Kolom 1: Pemilik */}
      <td className="px-5 py-3.5 align-middle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center
            text-[#DC2626] text-[11px] font-bold flex-shrink-0 select-none">
            {getInitials(pemilik.nama_lengkap)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-[13px] leading-tight truncate">
              {pemilik.nama_lengkap}
            </p>
            <p className="text-[11.5px] text-slate-400 mt-0.5 truncate">
              {pemilik.email}
            </p>
          </div>
        </div>
      </td>

      {/* Kolom 2: Toko */}
      <td className="px-5 py-3.5 align-middle">
        <div className="flex items-center gap-2.5">
          {pemilik.toko?.logo_url ? (
            <img
              src={pemilik.toko.logo_url}
              alt="Logo"
              className="w-7 h-7 rounded-md object-cover border border-slate-200 flex-shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center
              flex-shrink-0 border border-slate-200">
              <Building2 size={13} className="text-slate-400" strokeWidth={2} />
            </div>
          )}
          <div className="min-w-0">
            {pemilik.toko?.nama_toko ? (
              <>
                <p className="font-semibold text-slate-800 text-[13px] leading-tight truncate">
                  {pemilik.toko.nama_toko}
                </p>
                <p className="text-[11.5px] text-slate-400 mt-0.5 truncate">
                  {pemilik.toko.no_telepon || 'No. telpon blm terdaftar'}
                </p>
              </>
            ) : (
              <p className="text-[12.5px] text-slate-400 italic">Belum ada toko</p>
            )}
          </div>
        </div>
      </td>

      {/* Kolom 3: Bergabung */}
      <td className="px-5 py-3.5 align-middle whitespace-nowrap">
        <p className="text-[12.5px] text-slate-600 font-medium">{tanggal}</p>
      </td>

      {/* Kolom 4: Status */}
      <td className="px-5 py-3.5 align-middle">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
          text-[10.5px] font-bold uppercase tracking-wide whitespace-nowrap
          ${pemilik.is_active
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
            ${pemilik.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
          />
          {pemilik.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      </td>
    </tr>
  );
};

// ============================================================
// Komponen Utama
// ============================================================

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const [statistik, setStatistik] = useState<Statistik | null>(null);
  const [daftarPemilik, setDaftarPemilik] = useState<Pemilik[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);

  useEffect(() => {
    const ambilData = async () => {
      setSedangMemuat(true);
      try {
        const [hasilStatistik, hasilPemilik] = await Promise.all([
          api.getStatistikPlatform(),
          api.getDaftarPemilik(),
        ]);
        setStatistik(hasilStatistik.data);
        setDaftarPemilik(hasilPemilik.data || []);
      } catch (error) {
        console.error('Gagal memuat data dashboard:', error);
      } finally {
        setSedangMemuat(false);
      }
    };
    ambilData();
  }, []);

  const kartuData = [
    {
      label: 'Pemilik Aktif',
      nilai: statistik?.total_pemilik_aktif ?? 0,
      icon: Users,
      bg: 'bg-gradient-to-br from-[#DC2626] to-[#b91c1c]',
      iconBg: 'bg-white/15',
    },
    {
      label: 'Toko Terdaftar',
      nilai: statistik?.total_toko_aktif ?? 0,
      icon: Store,
      bg: 'bg-gradient-to-br from-[#1e293b] to-[#0f172a]',
      iconBg: 'bg-white/15',
    },
    {
      label: 'Trx. Hari Ini',
      nilai: statistik?.total_transaksi_hari_ini ?? 0,
      icon: ShoppingCart,
      bg: 'bg-gradient-to-br from-[#059669] to-[#047857]',
      iconBg: 'bg-white/15',
    },
    {
      label: 'Total Kasir',
      nilai: statistik?.total_kasir_aktif ?? 0,
      icon: CreditCard,
      bg: 'bg-gradient-to-br from-[#d97706] to-[#b45309]',
      iconBg: 'bg-white/15',
    },
  ];

  return (
    <div
      className="space-y-6 md:space-y-8 animate-in fade-in duration-500"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
    >

      {/* ── KARTU STATISTIK ── */}
      {sedangMemuat ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3
          bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Loader2 className="animate-spin text-[#DC2626]" size={36} />
          <p className="text-[13.5px] text-slate-500 font-medium">Memuat data sistem…</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {kartuData.map((k, i) => (
            <KartuStatistik key={i} {...k} />
          ))}
        </div>
      )}

      {/* ── TABEL MITRA TERBARU ── */}
      {!sedangMemuat && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Header panel */}
          <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100
            flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-[15px] md:text-[17px]">
                Daftar mitra terbaru
              </h3>
              <p className="text-[12px] text-slate-400 mt-0.5">
                {daftarPemilik.length} pemilik toko terdaftar
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/pemilik')}
              className="flex items-center gap-1.5 text-[12.5px] md:text-[13px] font-semibold
                text-[#DC2626] bg-red-50 hover:bg-[#DC2626] hover:text-white
                px-3.5 md:px-4 py-2 rounded-xl transition-all duration-200
                active:scale-95 border border-red-100 hover:border-[#DC2626]
                whitespace-nowrap flex-shrink-0"
            >
              Kelola Semua
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/*
            ── SCROLL WRAPPER ──
            overflow-x-auto  → scroll horizontal saat konten lebih lebar dari container
            scrollbar styling → scrollbar tipis & elegan, muncul saat di-hover
            min-w pada <table> → tabel punya lebar minimum 620px, tidak gepeng di HP kecil
          */}
          <div
            className="overflow-x-auto w-full
              [&::-webkit-scrollbar]:h-[3px]
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-slate-200
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-slate-300"
          >
            <table className="w-full min-w-[620px]">
              {/*
                colgroup: distribusi lebar kolom yang seimbang dan eksplisit.
                Pemilik 36% | Toko 36% | Bergabung 16% | Status 12%
                Total 100%. Tidak ada kolom yang melar tak terkontrol.
              */}
              <colgroup>
                <col style={{ width: '36%' }} />
                <col style={{ width: '36%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '12%' }} />
              </colgroup>

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {[
                    'Pemilik',
                    'Toko',
                    'Bergabung',
                    'Status',
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-left text-[10.5px] font-bold
                        text-slate-400 uppercase tracking-widest whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {daftarPemilik.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2.5">
                        <div className="w-12 h-12 rounded-full bg-slate-100
                          flex items-center justify-center">
                          <Users size={20} className="text-slate-300" />
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium">
                          Belum ada pemilik toko terdaftar
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  daftarPemilik.slice(0, 5).map((p) => (
                    <BarisTabel key={p.id} pemilik={p} />
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}