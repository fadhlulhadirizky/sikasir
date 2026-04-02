import React, { useState } from 'react';
import { LayoutDashboard, History, LogOut, ChevronLeft } from 'lucide-react';
import logoSikasir from "../assets/logo-sikasir.svg";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div
            className={`h-screen bg-white border-r border-gray-100 flex flex-col relative font-['Poppins'] transition-[width] duration-500 ease-in-out 
      ${isOpen ? "w-48" : "w-16"}`}
        >
            {/* Tombol Collapse */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-4 bg-[#DC2626] text-white rounded-full p-1 border-4 border-[#F8FAFC] z-10"
            >
                <ChevronLeft
                    size={12}
                    strokeWidth={3}
                    className={`transition-transform duration-500 ease-in-out ${!isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Header */}
            <div style={{ transform: 'translateY(5%)' }}>
                <div className="px-4 pt-2 flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-2 mb-6 md:mb-0">
                        <img src={logoSikasir} alt="Logo" className="w-6 h-6 md:w-7 md:h-7" />
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out 
              ${isOpen ? "opacity-100 delay-200 translate-x-0" : "opacity-0 -translate-x-2"}`}
                        >
                            <span className="text-lg md:text-xl font-bold text-[#DC2626] font-['Poppins']">
                                SiKasir
                            </span>
                        </div>
                    </div>
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out 
            ${isOpen ? "opacity-100 delay-200 translate-x-0" : "opacity-0 -translate-x-2"}`}
                    >
                        <p className="text-[2vh] text-gray-400 font-semibold ml-0.5 tracking-tight">
                            Kasir / Pos
                        </p>
                    </div>
                </div>

                {/* Menu */}
                <div className="px-3 mt-3 flex-grow">
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out 
            ${isOpen ? "opacity-100 delay-200 translate-x-0" : "opacity-0 -translate-x-2"}`}
                    >
                        <p className="text-[2vh] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1 text-left pl-1">
                            Menu Utama
                        </p>
                    </div>

                    <nav className="space-y-1">
                        <button className="w-full flex items-center gap-2 px-3 py-2 bg-[#FFF1F1] text-[#DC2626] rounded-lg font-bold text-[10px] transition-all">
                            <LayoutDashboard size={15} fill="#DC2626" fillOpacity={0.15} />
                            <span
                                className={`transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 delay-200 translate-x-0" : "opacity-0 -translate-x-2"}`}
                            >
                                Kasir / Pos
                            </span>
                        </button>

                        <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-gray-50 rounded-lg font-bold text-[10px] transition-all">
                            <History size={15} />
                            <span
                                className={`transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 delay-200 translate-x-0" : "opacity-0 -translate-x-2"}`}
                            >
                                Riwayat Transaksi
                            </span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Log Out */}
            <div className="p-4 pb-4 mt-auto">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#DC2626] text-white rounded-lg font-bold text-xs shadow-md shadow-red-100">
                    <LogOut size={15} strokeWidth={2.5} />
                    <span
                        className={`transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 delay-200 translate-x-0" : "opacity-0 -translate-x-2"}`}
                    >
                        Log Out
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;