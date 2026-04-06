import { createClient } from '@supabase/supabase-js';

// Ambil dari Dashboard Supabase -> Settings -> API
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);