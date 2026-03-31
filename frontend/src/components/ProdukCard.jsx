import React from 'react';
import { Plus } from 'lucide-react';

// Nama komponen disesuaikan dengan nama file: ProdukCard
const ProdukCard = ({ index, name, price, stock, category, onTambah }) => {

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        /* Menggunakan grid-cols-12 agar sejajar dengan header di Kasir.jsx */
        <tr className="grid grid-cols-12 items-center border-b border-gray-100 hover:bg-gray-50/50 transition-colors group font-['Poppins']">
            
            {/* Kolom No - col-span-1 */}
            <td className="col-span-1 py-4 text-[11px] font-bold text-gray-800 text-center">
                {index + 1}
            </td>

            {/* Kolom Nama Barang - col-span-5 */}
            <td className="col-span-5 px-4 py-4">
                <div className="flex flex-col">
                    <span className="text-[13px] font-black text-gray-800 line-clamp-1 leading-tight">
                        {name}
                    </span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">
                        {category}
                    </span>
                </div>
            </td>

            {/* Kolom Harga - col-span-3 */}
            <td className="col-span-3 py-4 text-sm font-black text-[#DC2626]">
                {formatRupiah(price)}
            </td>

            {/* Kolom Stok - col-span-1 */}
            <td className="col-span-1 py-4 text-xs font-bold text-gray-800 text-center">
                {stock}
            </td>

            {/* Kolom Aksi - col-span-2 */}
            <td className="col-span-2 py-4 pr-4 flex justify-center">
                <button 
                    onClick={onTambah} // Memicu fungsi tambah ke keranjang di Kasir.jsx
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#DC2626] text-white rounded-xl font-bold text-[10px] shadow-md shadow-red-50 hover:bg-red-700 active:scale-[0.95] transition-all"
                >
                    <Plus size={14} strokeWidth={4} />
                    <span>TAMBAH</span>
                </button>
            </td>
        </tr>
    );
};

export default ProdukCard;