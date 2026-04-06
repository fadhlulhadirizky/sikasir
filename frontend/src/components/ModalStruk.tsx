import React from 'react';
import { formatRupiah } from '../lib/utils';
import { CheckCircle2, Printer, Plus } from 'lucide-react';

interface ModalStrukProps {
  transaksi: any;
  onClose: () => void;
}

export default function ModalStruk({ transaksi, onClose }: ModalStrukProps) {
  const handlePrint = () => {
    window.print();
  };

  const time = new Date(transaksi.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const date = new Date(transaksi.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm flex flex-col gap-4 animate-in slide-in-from-bottom-10 duration-300">
        
        <div className="flex items-center justify-center gap-2 text-white mb-2">
          <CheckCircle2 className="text-green-400" size={28} />
          <h2 className="text-xl font-bold text-shadow-sm">Transaksi Berhasil!</h2>
        </div>

        {/* Kertas Struk (Area Print) */}
        <div id="area-struk" className="bg-white p-6 rounded-t-sm rounded-b-xl shadow-2xl font-mono text-xs text-gray-800 relative">
          {/* Efek gerigi bawah struk */}
          <div className="absolute -bottom-2 left-0 right-0 h-4 bg-repeat-x" style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, transparent 4px, white 5px)', backgroundSize: '12px 10px' }}></div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-black uppercase mb-1">SiKasir Store</h1>
            <p className="text-[10px] text-gray-500">Sistem Kasir Digital UMKM</p>
          </div>

          <div className="border-b border-dashed border-gray-300 pb-3 mb-3 space-y-1">
            <div className="flex justify-between"><span className="text-gray-500">No. Trx</span><span className="font-bold">{transaksi.nomor_transaksi}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tanggal</span><span>{date} {time}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Kasir</span><span>{transaksi.nama_kasir}</span></div>
          </div>

          <div className="border-b border-dashed border-gray-300 pb-3 mb-3">
            <table className="w-full">
              <tbody>
                {transaksi.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-1">
                      <div className="font-bold truncate max-w-[140px]">{item.nama_produk}</div>
                      <div className="text-[10px] text-gray-500">{item.jumlah} x {formatRupiah(item.harga_satuan)}</div>
                    </td>
                    <td className="py-1 text-right align-bottom font-bold">{formatRupiah(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-lg">{formatRupiah(transaksi.total_harga)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tunai</span><span>{formatRupiah(transaksi.uang_bayar)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Kembali</span><span className="font-bold">{formatRupiah(transaksi.kembalian)}</span></div>
          </div>

          <div className="text-center mt-8 pt-4 border-t border-dashed border-gray-300">
            <p className="font-bold">TERIMA KASIH</p>
            <p className="text-[10px] text-gray-500 mt-1">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
          </div>
        </div>

        {/* Aksi Print (Tidak ikut tercetak) */}
        <div className="flex gap-3 print:hidden mt-2">
          <button onClick={handlePrint} className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors">
            <Printer size={18} /> Cetak Struk
          </button>
          <button onClick={onClose} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors">
            <Plus size={18} /> Transaksi Baru
          </button>
        </div>
      </div>

      {/* Style khusus print */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #area-struk, #area-struk * { visibility: visible; }
          #area-struk { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}