import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoSikasir from '../../assets/logo-sikasir.svg';
import ilustrasiKasir from '../../assets/ilustrasi-kasir.svg';

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-full flex font-sans overflow-hidden bg-white">

            {/* SISI KIRI: LOGIN AREA */}
            <div className="flex-1 flex flex-col p-8 lg:p-12 h-full">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <img src={logoSikasir} alt="Logo" className="w-8 h-8" />
                    <span className="text-xl font-bold text-[#e63946] tracking-tight">SiKasir</span>
                </div>

                {/* Form Wrapper */}
                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full text-left">
                    <div className="mb-8">
                        <h1 className="text-[36px] font-bold text-[#1d3557] leading-tight tracking-tight">
                            Selamat Datang
                        </h1>
                        <p className="text-[#457b9d] mt-1 text-sm font-medium opacity-80">
                            Kasir Pintar untuk Toko Maju
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-xs font-bold text-[#1d3557] mb-1.5 uppercase tracking-wide">Email</label>
                            <input
                                type="email"
                                placeholder="Masukkan email"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#a8dadc] focus:border-[#457b9d] transition-all text-sm text-slate-700 placeholder:text-slate-300"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#1d3557] mb-1.5 uppercase tracking-wide">Kata Sandi</label>
                            <div className="relative">
                                <input
                                    type="password" // Biarkan type password agar mata bawaan browser muncul
                                    placeholder="Masukkan kata sandi"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#a8dadc] focus:border-[#457b9d] transition-all text-sm text-slate-700 placeholder:text-slate-300"
                                />
                                {/* Ikon mata buatan sudah dihapus total di sini */}
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

                    <p className="text-center mt-6 text-xs text-slate-500 font-medium">
                        Belum punya akun?{' '}
                        <a href="https://wa.me/6283192083302" target="_blank" rel="noopener noreferrer">
                            <span className="text-[#e63946] font-bold cursor-pointer hover:underline">
                                Daftar Sekarang</span>
                        </a>
                    </p>
                </div>

                {/* Footer Copy */}
                <div className="text-center text-[10px] text-slate-300 font-medium tracking-wide">
                    ©2026 SIKASIR — SISTEM KASIR DIGITAL UMKM
                </div>
            </div>

            {/* SISI KANAN: ILUSTRASI */}
            <div className="hidden lg:flex flex-1 bg-[#e63946] items-center justify-center p-12 relative overflow-hidden h-full">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-black/5 rounded-full blur-2xl pointer-events-none"></div>
                <img
                    src={ilustrasiKasir}
                    alt="Ilustrasi Login"
                    className="relative z-10 w-[90%] max-w-lg ml-16 drop-shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300"
                />
            </div>
        </div>
    );
};

export default LoginPage;