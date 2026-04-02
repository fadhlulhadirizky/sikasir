import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

const Header = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const formatted = now.toLocaleTimeString('id-ID', { hour12: false });
            setTime(formatted + ' WIB');
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
            <div className="text-left">
                <h2 style={{color:'#0F172A'}} className="text-lg font-bold text-gray-800">Kasir / Pos</h2>
                <p className="text-xs text-gray-400">Kelola data barang & inventori</p>
            </div>

            <div className="flex items-center gap-6">
                <button className="p-2 bg-gray-50 text-red-500 rounded-full hover:bg-red-50 transition-all">
                    <Bell size={20} />
                </button>

                <div className="px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Waktu {time}</span>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right">
                        <p className="text-sm font-bold text-[#0F172A] leading-none">Kasir 1</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">Kasir</p>
                    </div>
                    <div className="w-10 h-10 bg-[#DC2626] text-white flex items-center justify-center rounded-lg font-bold">
                        K1
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
