import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { formatRupiah } from '../../lib/utils';
import { Search, ShoppingCart, Trash2, AlertCircle, Loader2, Package } from 'lucide-react';
import ProdukCard from '../../components/ProdukCard';
import KeranjangItem from '../../components/KeranjangItem';
import ModalBayar from '../../components/ModalBayar';
import ModalStruk from '../../components/ModalStruk';
import ToastNotif from '../../components/ToastNotif';

export default function Kasir() {
  const [produk, setProduk] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // State Keranjang & Transaksi
  const [cart, setCart] = useState<any[]>([]);
  const [showModalBayar, setShowModalBayar] = useState(false);
  const [showModalStruk, setShowModalStruk] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasilTransaksi, setHasilTransaksi] = useState<any>(null);
  const [error, setError] = useState('');
  const [toastError, setToastError] = useState(''); // Khusus untuk notif pop-up

  // Tarik data produk aktif
  useEffect(() => {
    const fetchProduk = async () => {
      setLoading(true);
      try {
        const res = await api.getProduk({ is_active: 'true' });
        setProduk(res.data || []);
      } catch (err) {
        setError('Gagal memuat katalog produk.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduk();
  }, []);

  const filteredProduk = produk.filter(p => p.nama_produk.toLowerCase().includes(search.toLowerCase()));

  // Logika Keranjang
  const handleTambahKeranjang = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.qty >= item.stok) return prev; // Cek max stok
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleKurangQty = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.qty > 1) {
        return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const handleHapusKeranjang = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  
  const totalItem = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalHarga = cart.reduce((sum, i) => sum + (i.harga_jual * i.qty), 0);

  // Submit Pembayaran
  const handleProsesBayar = async (uangBayar: number) => {
    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        uang_bayar: uangBayar,
        items: cart.map(item => ({ produk_id: item.id, jumlah: item.qty }))
      };
      
      const res = await api.buatTransaksi(payload);
      setHasilTransaksi(res.data);
      setShowModalBayar(false);
      setShowModalStruk(true); // Munculkan struk
    } catch (err: any) {
      setToastError(err.message || 'Gagal memproses transaksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset setelah cetak struk
  const handleTransaksiBaru = () => {
    setCart([]);
    setHasilTransaksi(null);
    setShowModalStruk(false);
    // Reload produk untuk update sisa stok
    api.getProduk({ is_active: 'true' }).then(res => setProduk(res.data || []));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] animate-in fade-in">
      
      {/* KIRI: PANEL PRODUK (60%) */}
      <div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header & Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              value={search} onChange={e => setSearch(e.target.value)} 
              placeholder="Cari nama produk (F2)..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 font-medium transition-shadow shadow-sm"
            />
          </div>
        </div>

        {/* Grid Produk */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
          {loading ? (
            <div className="h-full flex flex-col justify-center items-center text-red-500">
              <Loader2 className="animate-spin mb-2" size={32} />
              <span className="text-sm font-bold text-gray-500">Memuat Katalog Produk...</span>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col justify-center items-center text-red-500">
              <AlertCircle size={32} className="mb-2" />
              <span className="text-sm font-bold">{error}</span>
            </div>
          ) : filteredProduk.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-gray-400">
              <Package size={48} className="mb-3 opacity-20" />
              <span className="text-sm font-bold">Produk tidak ditemukan.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4 pb-20">
              {filteredProduk.map(p => (
                <ProdukCard key={p.id} produk={p} onTambah={handleTambahKeranjang} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KANAN: PANEL KERANJANG (40%) */}
      <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
        {/* Header Keranjang */}
        <div className="p-4 border-b border-gray-100 bg-red-50/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <ShoppingCart size={20} />
            <h2 className="font-black text-gray-900 tracking-tight">Keranjang Belanja</h2>
          </div>
          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{totalItem}</span>
        </div>

        {/* Daftar Belanja */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200">
                <ShoppingCart size={32} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Keranjang Masih Kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <KeranjangItem 
                key={item.id} item={item} 
                onTambah={() => handleTambahKeranjang(item)} 
                onKurang={handleKurangQty} 
                onHapus={handleHapusKeranjang} 
              />
            ))
          )}
        </div>

        {/* Footer Pembayaran */}
        <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-4 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-end border-b border-dashed border-gray-300 pb-4 mb-2">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Tagihan</p>
            <p className="text-3xl font-black text-red-600 tracking-tight">{formatRupiah(totalHarga)}</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setCart([])} disabled={cart.length === 0}
              className="px-4 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 hover:text-red-500 disabled:opacity-50 transition-colors flex items-center justify-center" title="Hapus Semua"
            >
              <Trash2 size={20} />
            </button>
            <button 
              onClick={() => setShowModalBayar(true)} disabled={cart.length === 0}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-lg py-3 rounded-xl uppercase tracking-widest shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
            >
              Bayar (F9)
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModalBayar && (
        <ModalBayar total={totalHarga} itemsCount={totalItem} onClose={() => setShowModalBayar(false)} onConfirm={handleProsesBayar} isLoading={isSubmitting} />
      )}
      {showModalStruk && hasilTransaksi && (
        <ModalStruk transaksi={hasilTransaksi} onClose={handleTransaksiBaru} />
      )}

      <ToastNotif message={toastError} type="error" onClose={() => setToastError('')} />
      
    </div>
  );
}