
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

if (!supabaseUrl || !isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    console.error('Supabase configuration is missing or invalid. Please check .env.local');
}

// Export a safe client or throw a better error? 
// Be careful: createClient throws if URL is invalid.
// We will create the client only if we have what looks like valid config, 
// otherwise we export a dummy object that logs errors to prevent "crash on load"
// but fails on usage.

export const supabase = (supabaseUrl && isValidUrl(supabaseUrl) && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder');
// Using a placeholder that parses as URL prevents crash, requests will just fail (404/401)
