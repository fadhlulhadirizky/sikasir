import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatRupiah } from '../lib/utils';

interface DataPoint {
  tanggal: string; // Format: "2026-03-27"
  pendapatan: number;
}

interface GrafikPenjualanProps {
  data: DataPoint[];
  tinggi?: number; // Opsional: tinggi grafik (default 250)
}

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function GrafikPenjualan({ data, tinggi = 250 }: GrafikPenjualanProps) {
  // Format data sebelum masuk ke grafik (ubah "2026-03-27" jadi "Jum")
  const chartData = data.map((item) => {
    const d = new Date(item.tanggal);
    return {
      hari: HARI[d.getDay()],
      penjualan: Number(item.pendapatan) || 0
    };
  });

  if (!chartData || chartData.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200`} style={{ height: tinggi }}>
        <p className="text-sm font-medium">Belum ada data penjualan minggu ini.</p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: tinggi }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="hari" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748B' }} 
            tickFormatter={(value) => `Rp${value / 1000}k`} 
          />
          <Tooltip 
            cursor={{ fill: '#FEF2F2' }}
            formatter={(value: number) => [formatRupiah(value), 'Penjualan']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="penjualan" fill="#DC2626" radius={[6, 6, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}