import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface StokBadgeProps {
  stok: number;
  stokMinimum: number;
}

export default function StokBadge({ stok, stokMinimum }: StokBadgeProps) {
  if (stok <= 0) {
    return (
      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold border border-red-200">
        <XCircle size={12} /> Habis
      </span>
    );
  }
  
  if (stok < stokMinimum) {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200">
        <AlertTriangle size={12} /> Menipis
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200">
      <CheckCircle2 size={12} /> Aman
    </span>
  );
}