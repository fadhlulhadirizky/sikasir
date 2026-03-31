import React from 'react';

const KeranjangItem = ({ name, price, qty }) => {
    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-50">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">{name}</span>
                <span className="text-[11px] text-gray-400">{qty} x Rp {price.toLocaleString('id-ID')}</span>
            </div>
            <span className="text-sm font-bold text-red-500">
                Rp {(price * qty).toLocaleString('id-ID')}
            </span>
        </div>
    );
};

export default KeranjangItem;