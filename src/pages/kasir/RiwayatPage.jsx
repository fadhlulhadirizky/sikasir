import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import KontenRiwayat from './KontenRiwayat';

const RiwayatPage = () => {
    // State untuk menyimpan tanggal yang dipilih (default: hari ini)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Fungsi untuk reset ke tanggal hari ini
    const handleResetDate = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="flex min-h-screen bg-[#eff3f6]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 p-8 overflow-auto">
                    {/* Kirim state dan fungsi handle ke KontenRiwayat sebagai props */}
                    <KontenRiwayat
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        onReset={handleResetDate}
                    />
                </main>
            </div>
        </div>
    );
};

export default RiwayatPage;