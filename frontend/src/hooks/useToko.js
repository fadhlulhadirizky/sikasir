import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useToko = () => {
    const [loading, setLoading] = useState(false);

    const getTokoInfo = async () => {
        setLoading(true);
        // Kita asumsikan ada tabel bernama 'profiles' atau 'stores' di Supabase kamu
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .single();

        setLoading(false);
        return { data, error };
    };

    return { getTokoInfo, loading };
};