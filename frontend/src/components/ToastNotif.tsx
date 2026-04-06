import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface ToastNotifProps {
  message: string | null;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function ToastNotif({ message, type, onClose }: ToastNotifProps) {
  // Otomatis hilangkan notif setelah 3 detik sesuai PRD
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    // PERBAIKAN: Posisi dikembalikan ke pojok kanan bawah sesuai PRD
    // Responsif: Di HP menggunakan left-4 right-4 (lebar penuh bermargin), di Desktop menggunakan md:right-6 md:left-auto
    <div className="fixed top-7 right-6 md:left-auto md:bottom-6 md:right-6 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
      
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-xl border md:max-w-sm w-full transition-all ${
        isSuccess 
          ? 'bg-[#FEFCE8] border-[#FEF08A] text-[#16A34A] shadow-green-900/5' 
          : 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] shadow-red-900/5'
      }`}>
        
        {/* Ikon Notifikasi */}
        {isSuccess ? (
          <CheckCircle2 size={22} className="text-[#16A34A] flex-shrink-0" />
        ) : (
          <XCircle size={22} className="text-[#DC2626] flex-shrink-0" />
        )}
        
        {/* Teks Pesan */}
        <p className="text-[14px] font-semibold font-['Poppins'] text-slate-800 leading-snug flex-1">
          {message}
        </p>
        
        {/* Tombol Tutup (Close) */}
        <button 
          onClick={onClose} 
          aria-label="Tutup notifikasi"
          className={`p-1.5 rounded-lg transition-colors ml-2 flex-shrink-0 ${
            isSuccess 
              ? 'hover:bg-[#FEF08A]/50 text-[#16A34A]' 
              : 'hover:bg-[#FECACA]/50 text-[#DC2626]'
          }`}
        >
          <X size={18} strokeWidth={2.5} />
        </button>

      </div>
    </div>
  );
}