import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import TabelProduk from './TabelProduk';
import RingkasanBayar from './RingkasanBayar';

const KasirPage = () => {
    return (
        <div className="flex min-h-screen bg-[#eff3f6]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 p-8 flex gap-8 overflow-hidden">
                    <TabelProduk />
                    <RingkasanBayar />
                </main>
            </div>
        </div>
    );
};
export default KasirPage;