import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManajemenProduk({ produk, setProduk }) {
    const navigate = useNavigate();

    const tambahBarang = () => {
        const nama = prompt("Masukkan Nama Barang:");
        const harga = prompt("Masukkan Harga Jual:");
        const stok = prompt("Masukkan Stok:");

        if (nama && harga && stok) {
            const baru = {
                kode: `BRG-00${produk.length + 1}`,
                nama,
                hargaJual: parseInt(harga),
                stok: parseInt(stok),
                kategori: "Umum"
            };
            setDaftarProduk([...produk, baru]);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Manajemen Produk</h1>
                <button onClick={() => navigate('/kasir')} className="text-blue-600 underline">Ke Kasir →</button>
            </div>

            <button onClick={tambahBarang} className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold mb-4">
                + Tambah Barang
            </button>

            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="p-4">Kode</th>
                        <th className="p-4">Nama</th>
                        <th className="p-4">Harga</th>
                        <th className="p-4">Stok</th>
                    </tr>
                </thead>
                <tbody>
                    {produk.map((p, i) => (
                        <tr key={i} className="border-t">
                            <td className="p-4">{p.kode}</td>
                            <td className="p-4 font-bold">{p.nama}</td>
                            <td className="p-4">Rp {p.hargaJual.toLocaleString()}</td>
                            <td className="p-4">{p.stok}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}