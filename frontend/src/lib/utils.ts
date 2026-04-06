import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Fungsi bawaan untuk Tailwind (jangan dihapus)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fungsi pembantu untuk mengambil inisial nama dari string
// Contoh: "Al Arif Marpaung" -> "AL"
export function getInitials(name: string | undefined | null): string {
  if (!name) return 'U'; // Huruf U (User) sebagai default jika nama kosong
  
  return name
    .trim()
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Fungsi pembantu untuk format Rupiah (Mumpung di file utils, kita tambahkan sekalian untuk dipakai di halaman lain nanti)
export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
}