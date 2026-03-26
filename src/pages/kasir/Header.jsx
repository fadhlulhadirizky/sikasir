import React, { useState, useEffect } from 'react';
import { Clock, UserCircle, Bell } from 'lucide-react';

const Header = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Logic untuk menjalankan jam secara real-time
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup saat komponen unmount
    }, []);

    // Format waktu menjadi HH:mm:ss WIB
    const formattedTime = currentTime.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }) + ' WIB';

    return (
        <header className="w-full bg-white px-8 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-[#1d3557]">Kasir / Pos</h1>
                <p className="text-slate-500 text-sm mt-0.5">Kelola data barang & inventori</p>
            </div>

            <div className="flex items-center gap-4">
                {/* Real-time Clock Display */}
                <div className="flex items-center gap-3 px-4 py-2 bg-[#eff3f6] rounded-lg text-sm font-medium text-[#457b9d]">
                    <Clock size={18} />
                    <span className="font-semibold text-[#1d3557] tabular-nums">
                        {formattedTime}
                    </span>
                </div>

                <div className="flex items-center gap-3 pl-3 py-1 border-l-2 border-slate-100">
                    <UserCircle size={40} className="text-slate-300" />
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#1d3557]">Kasir 1</p>
                        <p className="text-xs text-slate-500">kasir</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;