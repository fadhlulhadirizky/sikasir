import React from 'react';
import { formatRupiah } from '../lib/utils';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface KeranjangItemProps {
  item: any;
  onTambah: (id: string) => void;
  onKurang: (id: string) => void;
  onHapus: (id: string) => void;
}

export default function KeranjangItem({ item, onTambah, onKurang, onHapus }: KeranjangItemProps) {
  return (
    <div className="flex gap-3 items-center py-3 border-b border-gray-50 last:border-0 group animate-in slide-in-from-left-2 duration-200">
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-gray-800 truncate">{item.nama_produk}</h4>
        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{formatRupiah(item.harga_jual)}</p>
      </div>
      
      {/* Kontrol Qty */}
      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5 shadow-sm">
        <button onClick={() => onKurang(item.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white rounded-md transition-colors">
          <Minus size={12} strokeWidth={3} />
        </button>
        <span className="w-6 text-center text-xs font-bold text-gray-800">{item.qty}</span>
        <button onClick={() => onTambah(item.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white rounded-md transition-colors">
          <Plus size={12} strokeWidth={3} />
        </button>
      </div>

      <div className="text-right w-20">
        <p className="text-xs font-bold text-gray-900">{formatRupiah(item.harga_jual * item.qty)}</p>
      </div>

      <button onClick={() => onHapus(item.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1">
        <Trash2 size={14} />
      </button>
    </div>
  );
}