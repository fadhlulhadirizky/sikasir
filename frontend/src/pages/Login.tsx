import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import logoSikasir from "../assets/logo-sikasir.svg";
import ilustrasiKasir from "../assets/4957412_Mobile-login 2.svg";
import * as api from "../services/api";
import { useNavigate } from "react-router-dom";
import ToastNotif from "../components/ToastNotif";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { login } = useAuth();

    // Validasi sederhana
    const isPasswordValid = password.length >= 6 || password.length === 0;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            setError("Password minimal 6 karakter!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await api.login(email, password);

            if (!res.data?.token || !res.data?.user) {
                throw new Error("Response tidak valid: " + JSON.stringify(res));
            }

            login(res.data.token, res.data.user);

            const role = (res.data.user.role || "").toLowerCase();
            if (role === "admin") navigate("/admin/dashboard");
            else if (role === "pemilik") navigate("/pemilik/dashboard");
            else if (role === "kasir") navigate("/kasir/dashboard");
            else navigate("/login");
        } catch (err: any) {
            setError(err.message || "Email atau kata sandi salah!");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-['Inter']">
            {/* Keyframe khusus untuk animasi floating ilustrasi agar lebih smooth */}
            <style>{`
                @keyframes floatBob {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float {
                    animation: floatBob 4s ease-in-out infinite;
                }
            `}</style>

            {/* ── SISI KIRI: Logo, Form, Footer ── */}
            <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-12 relative z-10 h-screen overflow-y-auto">
                
{/* Logo Top Left - Premium SaaS Style */}
                <div className="flex items-center gap-3.5 select-none">
                    {/* 1. Frame Icon: Bikin logo seperti icon aplikasi premium */}
                    <div className="w-11 h-11 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-[0_2px_10px_rgba(220,38,38,0.1)] border border-red-100 flex items-center justify-center">
                        <img 
                            src={logoSikasir} 
                            alt="Logo SiKasir" 
                            className="w-7 h-7 object-contain drop-shadow-sm" 
                        />
                    </div>
                    
                    {/* 2. Typography & Micro-copy */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-[24px] font-bold font-['Poppins'] tracking-tight leading-none mb-1">
                            <span className="text-[#DC2626]">SiKasir</span>
                        </h2>
                        <span className="text-[9.5px] font-extrabold text-slate-400 tracking-[0.2em] leading-none">
                            Sistem Digital UMKM
                        </span>
                    </div>
                </div>

                {/* Form Wrapper - Centered */}
                <div className="w-full max-w-[380px] mx-auto my-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8">
                        <h1 className="text-[36px] md:text-[40px] font-extrabold text-[#0F172A] font-['Poppins'] leading-tight tracking-tight mb-2">
                            Selamat datang
                        </h1>
                        <p className="text-[15px] font-medium text-[#64748B] font-['Poppins']">
                            Kasir pintar untuk toko maju
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Input Email */}
                        <div>
                            <label htmlFor="email" className="block text-[13px] font-bold text-[#334155] mb-2 font-['Poppins']">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-3.5 rounded-xl border-2 border-[#F1F5F9] focus:border-[#DC2626] focus:ring-4 focus:ring-red-50 outline-none text-[15px] transition-all bg-white text-[#0F172A] placeholder-[#94A3B8]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Input Kata Sandi */}
                        <div>
                            <label htmlFor="password" className="block text-[13px] font-bold text-[#334155] mb-2 font-['Poppins']">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full pl-4 pr-12 py-3.5 rounded-xl border-2 outline-none text-[15px] transition-all bg-white text-[#0F172A] placeholder-[#94A3B8] ${
                                        !isPasswordValid && password.length > 0 
                                        ? "border-red-400 focus:ring-4 focus:ring-red-50" 
                                        : "border-[#F1F5F9] focus:border-[#DC2626] focus:ring-4 focus:ring-red-50"
                                    }`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-[#94A3B8] hover:text-[#DC2626] transition-colors p-2"
                                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                                </button>
                            </div>
                            
                            {/* Password Hint */}
                            {!isPasswordValid && password.length > 0 && (
                                <p className="text-xs text-red-500 mt-2 font-medium">
                                    Password minimal 6 karakter.
                                </p>
                            )}
                        </div>

                        {/* Tombol Submit */}
                        <button
                            type="submit"
                            disabled={loading || (!isPasswordValid && password.length > 0)}
                            className="w-full bg-[#E15151] hover:bg-[#DC2626] text-white font-bold py-4 rounded-[100px] active:scale-[0.98] flex justify-center items-center text-[15px] transition-all mt-4 font-['Poppins'] shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Masuk"
                            )}
                        </button>
                    </form>

                    {/* Link Daftar */}
                    <div className="mt-6 text-center">
                        <p className="text-[14px] text-[#64748B] font-['Poppins']">
                            Belum punya akun?{" "}
                            <a href="https://wa.me/6283192083302" className="text-[#DC2626] font-bold hover:underline">
                                Daftar sekarang
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="text-center text-[12px] text-[#CBD5E1] font-medium pb-2">
                    © 2026 SiKasir, Sistem Kasir Digital UMKM
                </div>
            </div>

            {/* ── SISI KANAN: Background Merah, Pattern, dan Ilustrasi ── */}
            <div className="hidden md:flex md:w-1/2 bg-[#DA2424] relative items-center justify-center overflow-hidden">
                
                {/* Pattern Titik-titik (Dotted Background) */}
                <div 
                    className="absolute inset-0 z-0 opacity-20" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', 
                        backgroundSize: '30px 30px' 
                    }}
                ></div>

                {/* Lingkaran Dekoratif Kiri Atas */}
                <div className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full border border-white/10 z-0 pointer-events-none"></div>
                
                {/* Lingkaran Dekoratif Kanan Bawah */}
                <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full border border-white/10 z-0 pointer-events-none"></div>

                {/* Ilustrasi Utama dengan efek floating */}
                <img
                    src={ilustrasiKasir}
                    alt="Ilustrasi Kasir"
                    className="relative z-10 w-full max-w-[500px] object-contain drop-shadow-2xl animate-float"
                />
            </div>

            {/* Notifikasi Toast */}
            {error && <ToastNotif message={error} type="error" onClose={() => setError(null)} />}
        </div>
    );
};

export default Login;