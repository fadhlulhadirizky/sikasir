import React from 'react';
import { formatRupiah } from '../lib/utils';
import { Image as ImageIcon } from 'lucide-react';

interface ProdukCardProps {
  produk: any;
  onTambah: (produk: any) => void;
}

export default function ProdukCard({ produk, onTambah }: ProdukCardProps) {
  const isHabis = produk.stok <= 0;

  return (
    <div 
      onClick={() => !isHabis && onTambah(produk)}
      className={`relative bg-white border rounded-2xl overflow-hidden transition-all duration-200 
        ${isHabis ? 'border-red-200 opacity-70 cursor-not-allowed grayscale-[0.5]' : 'border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer group'}
      `}
    >
      {/* Foto Produk */}
      <div className="w-full h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
        {produk.gambar_url ? (
          <img src={produk.gambar_url} alt={produk.nama_produk} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <ImageIcon size={32} className="text-gray-300" />
        )}
      </div>

      {/* Detail Produk */}
      <div className="p-3 pb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{produk.kategori?.nama_kategori || 'UMUM'}</p>
        <h3 className="font-bold text-gray-800 text-sm leading-tight mb-2 line-clamp-2 h-10">{produk.nama_produk}</h3>
        <div className="flex items-end justify-between">
          <p className="font-black text-red-600">{formatRupiah(produk.harga_jual)}</p>
        </div>
      </div>

      {/* Badge Stok Habis / Tersedia */}
      <div className="absolute top-2 right-2">
        {isHabis ? (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">Habis</span>
        ) : (
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-gray-100">
            Sisa: {produk.stok}
          </span>
        )}
      </div>
    </div>
  );
}