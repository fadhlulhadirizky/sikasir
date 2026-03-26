import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSikasir from '../../assets/logo-sikasir.svg';

const LoginPage = () => {
    const navigate = useNavigate();

    // State untuk kontrol sembunyi/lihat password
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const waLink = "https://wa.me/6283192083302?text=Halo%20Admin%20SiKasir,%20saya%20ingin%20mendaftar%20akun%20baru%20untuk%20toko%20saya.";

    return (
        <div className="h-screen w-full flex font-sans overflow-hidden bg-white">
            {/* SISI KIRI: LOGIN AREA */}
            <div className="flex-1 flex flex-col p-8 lg:p-12 h-full relative z-10">

                {/* 1. Header: Logo */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <img src={logoSikasir} alt="Logo" className="w-8 h-8" />
                    <span className="text-xl font-bold text-[#e63946] tracking-tight">SiKasir</span>
                </div>

                {/* 2. Body: Form */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-sm text-left">
                        <div className="mb-8">
                            <h1 className="text-[36px] font-bold text-[#1d3557] leading-tight tracking-tight">Selamat Datang</h1>
                            <p className="text-[#457b9d] mt-1 text-sm font-medium opacity-80">Kasir Pintar untuk Toko Maju</p>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-xs font-bold text-[#1d3557] mb-1.5 uppercase tracking-wide">Email</label>
                                <input
                                    type="email"
                                    placeholder="Masukkan email"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#a8dadc] focus:border-[#457b9d] transition-all text-sm text-slate-700"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#1d3557] mb-1.5 uppercase tracking-wide">Kata Sandi</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"} // Mengubah tipe secara dinamis
                                        placeholder="Masukkan kata sandi"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#a8dadc] focus:border-[#457b9d] transition-all text-sm text-slate-700 pr-12"
                                    />
                                    {/* Button Toggle Mata */}
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#457b9d] transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            /* Ikon Mata Terbuka */
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            /* Ikon Mata Tertutup (Coret) */
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/kasir')}
                                className="w-full py-3 bg-[#e63946] hover:bg-[#d62828] text-white rounded-lg font-bold text-base transition-all active:scale-[0.98] mt-2 shadow-md shadow-red-100"
                            >
                                Masuk
                            </button>
                        </form>

                        <div className="text-center mt-6 relative z-50">
                            <span className="text-xs text-slate-500 font-medium">Belum punya akun? </span>
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#e63946] font-bold hover:underline text-xs bg-white py-1 inline-block"
                            >
                                Daftar Sekarang
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3. Footer */}
                <div className="text-center text-[10px] text-slate-300 font-medium tracking-wide flex-shrink-0">
                    ©2026 SIKASIR — SISTEM KASIR DIGITAL UMKM
                </div>
            </div>

            {/* SISI KANAN: ILUSTRASI */}
            <div className="hidden lg:flex flex-1 bg-[#e63946] items-center justify-center p-12 relative overflow-hidden h-full">
                <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <img
                    src="/src/assets/ilustrasi-kasir.svg"
                    alt="Ilustrasi Login"
                    className="relative z-10 w-[75%] max-w-sm drop-shadow-2xl"
                />
            </div>
        </div>
    );
};

export default LoginPage;