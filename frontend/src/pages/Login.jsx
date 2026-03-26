import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import logoSikasir from "../assets/logo-sikasir.svg";
import ilustrasiLogin from "../assets/ilustrasi-kasir.svg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { data, error: authError } = await signIn(email, password);
        if (authError) {
            setError("Email atau kata sandi salah!");
            setLoading(false);
        } else {
            navigate("/admin");
        }
    };

    return (
        <div className="fixed inset-0 w-full h-screen grid grid-cols-1 md:grid-cols-2 font-['Inter'] overflow-hidden bg-white">

            {/* --- KOLOM KIRI --- */}
            <div className="flex flex-col bg-white p-8 md:p-12 relative z-10 h-screen">

                {/* 1. Logo (Atas) */}
                <div className="flex items-center gap-2">
                    <img
                        src={logoSikasir}
                        alt="Logo SiKasir"
                        className="w-7 h-7 object-contain"
                    />
                    <span className="text-xl font-bold text-[#DC2626] font-['Poppins']">SiKasir</span>
                </div>

                {/* 2. Form & Copyright (Tengah) */}
                <div className="w-full max-w-sm mx-auto md:mx-0 flex flex-col justify-center flex-grow">
                    <div className="space-y-6">

                        {/* Header Text - Jarak didekatkan dengan div pembungkus */}
                        <div className="text-left">
                            <h1 style={{ color: '#0F172A' }} className="text-2xl md:text-3xl font-extrabold leading-tight font-['Poppins'] tracking-tight">
                                Selamat Datang
                            </h1>
                            <p className="text-[#64748B] text-base font-medium mt-0.5">
                                Kasir Pintar untuk Toko Maju
                            </p>
                        </div>

                        {error && (
                            <div className="bg-[#FEF2F2] text-[#DC2626] p-2.5 rounded-lg text-[11px] border border-[#DC2626]/20 text-center font-medium">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="text-left">
                                <label className="block text-[10px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider font-['Poppins']">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#DC2626] outline-none transition-all text-sm"
                                    placeholder="Masukkan email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="text-left">
                                <label className="block text-[10px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider font-['Poppins']">
                                    Kata Sandi
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#DC2626] outline-none transition-all text-sm"
                                    placeholder="Masukkan kata sandi"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-2.5 rounded-lg transition-all active:scale-[0.98] flex justify-center items-center text-sm shadow-md mt-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Masuk"
                                )}
                            </button>
                        </form>

                        <div className="text-xs text-center space-y-4">
                            <p className="text-[#64748B]">
                                Belum punya akun?{' '}
                                <a href="#" className="text-[#DC2626] font-bold hover:underline">
                                    Daftar Sekarang
                                </a>
                            </p>

                            <div className="text-[#94A3B8] text-[9px] uppercase tracking-widest pt-2">
                                ©2026 SiKasir - Digital UMKM
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Footer Spacer */}
                <div className="h-8"></div>
            </div>

            {/* --- KOLOM KANAN --- */}
            <div className="hidden md:flex flex-col items-center justify-center bg-[#DC2626] h-full overflow-hidden p-10">
                <img
                    src={ilustrasiLogin}
                    alt="Ilustrasi Login SiKasir"
                    className="w-full max-w-xs lg:max-w-sm object-contain drop-shadow-2xl"
                />
            </div>

        </div>
    );
};

export default Login;