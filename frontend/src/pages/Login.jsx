import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import logoSikasir from "../assets/logo-sikasir.svg";
import ilustrasiLogin from "../assets/ilustrasi-kasir.svg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
            <div className="flex flex-col bg-white p-6 sm:p-10 md:p-12 relative z-10 h-screen overflow-y-auto">

                <div className="flex items-center gap-2 mb-6 md:mb-0">
                    <img src={logoSikasir} alt="Logo" className="w-6 h-6 md:w-7 md:h-7" />
                    <span className="text-lg md:text-xl font-bold text-[#DC2626] font-['Poppins']">SiKasir</span>
                </div>

                <div className="w-full max-w-[300px] sm:max-w-sm mx-auto md:mx-0 flex flex-col justify-center flex-grow">
                    <div className="space-y-6">
                        <div className="text-left flex flex-col" style={{ gap: 0 }}>
                            <h1 style={{ color: '#0F172A', lineHeight: 1.1, margin: 0, transform: 'translateY(3vh)', fontSize: '35px' }} className="text-3xl sm:text-4xl md:text-[40px] font-extrabold font-['Poppins'] tracking-tight">
                                Selamat Datang
                            </h1>
                            <p style={{ marginTop: 0, marginBottom: 0, transform: 'translateY(4vh)', fontSize: '15px' }} className="text-[#64748B] text-sm sm:text-base font-medium font-['Poppins']">
                                Kasir Pintar untuk Toko Maju
                            </p>
                        </div>

                        <form onSubmit={handleLogin} style={{transform: 'translateY(3vh)'}} className="space-y-4">
                            <div className="text-left">
                                <label className="block text-[9px] md:text-[10px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider font-['Poppins']">Email</label>
                                <input type="email" className="w-full px-3 py-2 md:px-3.5 md:py-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#DC2626] outline-none text-sm" placeholder="Masukkan email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div className="text-left">
                                <label className="block text-[9px] md:text-[10px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider font-['Poppins']">Kata Sandi</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"} // Logika ganti tipe input
                                        className="w-full px-3 py-2 md:px-3.5 md:py-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#DC2626] outline-none text-sm pr-10"
                                        placeholder="Masukkan kata sandi"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-2.5 rounded-lg active:scale-[0.98] flex justify-center items-center text-sm shadow-md mt-2">
                                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Masuk"}
                            </button>
                        </form>

                        <div style={{transform: 'translateY(2vh)'}} className="text-[11px] md:text-xs text-center space-y-4">
                            <p className="text-[#64748B]">Belum punya akun? <a href="https://wa.me/6283192083302" className="text-[#DC2626] font-bold hover:underline">Daftar Sekarang</a></p>
                            <div className="text-[#94A3B8] text-[9px] uppercase tracking-widest pt-2">
                                <p style={{ marginTop: 0, marginBottom: 0, transform: 'translateY(7vh)' }}>
                                    ©2026 SiKasir - Digital UMKM </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden md:block h-8"></div>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center bg-[#DC2626] h-full overflow-hidden p-10">
                <img src={ilustrasiLogin} alt="Ilustrasi" className="w-full max-w-xs lg:max-w-sm object-contain drop-shadow-2xl" />
            </div>
        </div>
    );
};

export default Login;