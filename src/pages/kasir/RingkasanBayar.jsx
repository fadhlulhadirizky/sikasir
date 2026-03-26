import React from 'react';
import { Trash2, LayoutGrid } from 'lucide-react';

const RingkasanBayar = () => {
    return (
        <div className="w-[380px] bg-white rounded-xl shadow-sm border border-slate-100 p-7 flex flex-col h-full">
            <h2 className="text-lg font-bold text-[#1d3557] mb-6">Ringkasan Pembayaran</h2>
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-[#eff3f6]/50 rounded-xl mb-6 p-4">
                <LayoutGrid size={40} className="text-slate-300 mb-2" />
                <p className="text-sm text-slate-400 text-center">Keranjang masih kosong</p>
            </div>
            <div className="space-y-4 mb-6 border-t pt-6 text-sm">
                <div className="flex justify-between"><span>Sub total</span><span className="font-bold text-[#1d3557]">Rp 0</span></div>
                <div className="flex justify-between items-center">
                    <span>PPN 10%</span>
                    <input type="checkbox" className="w-10 h-5 bg-slate-200 accent-[#e63946]" defaultChecked />
                </div>
                <div className="pt-4 border-t">
                    <p className="text-xs text-slate-500">Total pembayaran</p>
                    <h3 className="text-3xl font-bold text-[#e63946]">Rp 0</h3>
                </div>
            </div>
            <button disabled className="w-full py-4 bg-slate-300 text-slate-600 rounded-lg font-bold mb-3">Bayar (F9)</button>
            <button className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-500 rounded-lg font-bold"><Trash2 size={16} /> Hapus keranjang</button>
        </div>
    );
};
export default RingkasanBayar;