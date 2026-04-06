import React, { useState, useEffect } from 'react';
import { formatRupiah } from '../lib/utils';
import { X, Loader2, Wallet } from 'lucide-react';

interface ModalBayarProps {
  total: number;
  itemsCount: number;
  onClose: () => void;
  onConfirm: (uangBayar: number) => void;
  isLoading: boolean;
}

export default function ModalBayar({ total, itemsCount, onClose, onConfirm, isLoading }: ModalBayarProps) {
  const [uangBayar, setUangBayar] = useState<string>('');
  const nominalUang = Number(uangBayar) || 0;
  const kembalian = nominalUang - total;
  const isUangCukup = nominalUang >= total;

  // Fokuskan input saat modal terbuka
  useEffect(() => {
    const input = document.getElementById('input-uang');
    if (input) input.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="text-red-500" size={20} />
            <h2 className="font-bold text-gray-800 text-lg">Pembayaran</h2>
          </div>
          <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm"><X size={18} /></button>
        </div>

        {/* Body Modal */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-500 font-medium">Total Tagihan ({itemsCount} item)</p>
            <p className="text-4xl font-black text-gray-900 tracking-tight">{formatRupiah(total)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Uang Diterima (Rp)</label>
              <input 
                id="input-uang"
                type="number" 
                min="0"
                value={uangBayar} 
                onChange={(e) => setUangBayar(e.target.value)}
                placeholder="Masukkan nominal uang"
                className="w-full text-2xl font-bold text-center border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all"
              />
            </div>

            <div className={`p-4 rounded-xl border flex justify-between items-center transition-colors ${
              !uangBayar ? 'bg-gray-50 border-gray-100' :
              isUangCukup ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <span className={`text-sm font-bold ${
                !uangBayar ? 'text-gray-500' : isUangCukup ? 'text-green-700' : 'text-red-600'
              }`}>Kembalian</span>
              <span className={`text-xl font-black ${
                !uangBayar ? 'text-gray-900' : isUangCukup ? 'text-green-600' : 'text-red-600'
              }`}>
                {uangBayar ? formatRupiah(kembalian) : 'Rp 0'}
              </span>
            </div>
            {uangBayar && !isUangCukup && (
              <p className="text-xs text-red-500 text-center font-medium animate-pulse">Uang pembayaran kurang!</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100">
          <button onClick={onClose} disabled={isLoading} className="flex-1 py-3 text-gray-600 font-bold bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">Batal</button>
          <button 
            onClick={() => onConfirm(nominalUang)} 
            disabled={!isUangCukup || isLoading} 
            className="flex-[2] py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 shadow-lg shadow-red-200"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
            {isLoading ? 'Memproses...' : 'Konfirmasi Transaksi'}
          </button>
        </div>
      </div>
    </div>
  );
}