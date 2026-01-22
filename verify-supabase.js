
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpgupcphbvgiobrieroo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwZ3VwY3BoYnZnaW9icmllcm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDA4OTMsImV4cCI6MjA4NDY3Njg5M30.KS_Wsf2MGr9pj0aDaJfCDkRJW8RXLB0-LPTTjpfw6OI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
    console.log('Testing Supabase Connection...');
    console.log('URL:', supabaseUrl);

    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed with error:', error.message);
            if (error.code) console.error('Error code:', error.code);
        } else {
            console.log('Connection successful! (Able to query profiles table)');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkConnection();
