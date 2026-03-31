import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import ProdukCard from '../../components/ProdukCard';

const Kasir = () => {
    const [cart, setCart] = useState([]);

    const dummyProducts = [
        { id: 1, name: 'Mie Goreng Spesial', price: 15000, stock: 25, category: 'MAKANAN' },
        { id: 2, name: 'Es Teh Manis', price: 5000, stock: 50, category: 'MINUMAN' },
        { id: 3, name: 'Ayam Geprek', price: 20000, stock: 15, category: 'MAKANAN' },
    ];

    const tambahKeKeranjang = (produk) => {
        setCart((prevCart) => {
            const itemAda = prevCart.find((item) => item.id === produk.id);
            if (itemAda) {
                return prevCart.map((item) =>
                    item.id === produk.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prevCart, { ...produk, qty: 1 }];
        });
    };

    const kurangiQty = (id) => {
        setCart((prevCart) => {
            const item = prevCart.find((i) => i.id === id);
            if (item.qty > 1) {
                return prevCart.map((i) =>
                    i.id === id ? { ...i, qty: i.qty - 1 } : i
                );
            }
            return prevCart.filter((i) => i.id !== id);
        });
    };

    const hapusDariKeranjang = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    // Perhitungan Biaya
    const subTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const ppn = subTotal * 0.1;
    const totalBayar = subTotal + ppn;

    return (
        <div className="flex gap-4 items-start w-full font-['Poppins']">
            {/* KOLOM KIRI: Tabel Produk */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="grid grid-cols-12 bg-gray-50/50 border-b-2 border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <th className="col-span-1 py-4 text-center">No</th>
                            <th className="col-span-5 py-4 pl-4 text-left">Nama Barang</th>
                            <th className="col-span-3 py-4 text-left">Harga</th>
                            <th className="col-span-1 py-4 text-center">Stok</th>
                            <th className="col-span-2 py-4 text-center">Aksi</th>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {dummyProducts.map((product, index) => (
                                <ProdukCard
                                    key={product.id}
                                    index={index}
                                    {...product}
                                    onTambah={() => tambahKeKeranjang(product)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* KOLOM KANAN: Ringkasan Pembayaran */}
            <div className="w-[300px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 sticky top-4">
                <h2 style={{fontSize: '4vh', color: '#0F172A' }} className="font-['Poppins'] tracking-widest">Ringkasan Pembayaran</h2>

                {/* List Item di Keranjang */}
                <div className="flex flex-col min-h-[120px] max-h-[300px] overflow-y-auto gap-4 pr-1">
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <div key={item.id} className="flex flex-col gap-2 group/item">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-[11px] font-black text-gray-700 truncate leading-tight">
                                            {item.name}
                                        </span>
                                        <span className="text-[10px] font-bold text-red-500 mt-0.5">
                                            Rp {(item.price * item.qty).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => hapusDariKeranjang(item.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <X size={12} strokeWidth={3} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 w-24">
                                    <button
                                        onClick={() => kurangiQty(item.id)}
                                        className="p-1 hover:bg-white rounded-md transition-all text-gray-500 shadow-sm"
                                    >
                                        <Minus size={12} strokeWidth={3} />
                                    </button>
                                    <span className="text-[11px] font-black text-gray-800">{item.qty}</span>
                                    <button
                                        onClick={() => tambahKeKeranjang(item)}
                                        className="p-1 hover:bg-white rounded-md transition-all text-gray-500 shadow-sm"
                                    >
                                        <Plus size={12} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 my-auto opacity-20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-center">Keranjang Kosong</p>
                        </div>
                    )}
                </div>

                {/* Bagian Rincian Biaya (YANG TADI HILANG) */}
                <div className="border-t border-dashed border-gray-200 pt-4 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-gray-400">Sub total</span>
                        <span className="font-black text-gray-700 font-mono">Rp {subTotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-gray-400">PPN (10%)</span>
                        <span className="font-black text-gray-700 font-mono">Rp {ppn.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] font-black text-gray-800 uppercase tracking-tight">Total Bayar</span>
                        <span className="text-xl font-black text-red-500 font-mono">
                            Rp {totalBayar.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <button
                    disabled={cart.length === 0}
                    className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.1em] transition-all duration-300 ${cart.length > 0
                            ? 'bg-red-500 text-white shadow-lg shadow-red-100 hover:bg-red-600 active:scale-[0.98]'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                >
                    Bayar (F9)
                </button>

                {cart.length > 0 && (
                    <button
                        onClick={() => setCart([])}
                        className="text-[9px] font-black text-gray-300 hover:text-red-400 uppercase tracking-widest transition-colors mx-auto"
                    >
                        Kosongkan Keranjang
                    </button>
                )}
            </div>
        </div>
    );
};

export default Kasir;