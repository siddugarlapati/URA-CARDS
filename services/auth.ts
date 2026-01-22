import { supabase } from './supabase';
import { User } from '../types';

const checkConfig = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || url.includes('YOUR_SUPABASE_URL') || !key || key.includes('YOUR_SUPABASE_ANON_KEY')) {
        console.error("CRITICAL CONFIG ERROR:", {
            VITE_SUPABASE_URL: url || '(undefined)',
            VITE_SUPABASE_ANON_KEY: key ? (key.substring(0, 5) + '...') : '(undefined)',
            Environment: import.meta.env.MODE,
            BaseURL: import.meta.env.BASE_URL
        });
        throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
    }
};

export const authApi = {
    async signUp(email: string, password: string, fullName: string) {
        checkConfig();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`
                }
            }
        });

        if (error) throw error;
        return data;
    },

    async signIn(email: string, password: string) {
        checkConfig();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getCurrentUser(): Promise<User | null> {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        // Fetch additional profile data from 'profiles' table which mirrors auth.users
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profile) {
            return {
                id: profile.id,
                name: profile.full_name,
                email: profile.email,
                avatar: profile.avatar_url,
                role: profile.role,
                createdAt: profile.created_at || new Date().toISOString()
            } as User;
        }

        // Fallback if profile doesn't exist (e.g. trigger failed or not run)
        return {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url,
            role: 'user',
            createdAt: session.user.created_at || new Date().toISOString()
        } as User;
    },

    // Real-time auth state listener
    onAuthStateChange(callback: (user: User | null) => void) {
        return supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                // We could optimize this by caching or passing the user object directly
                // but fetching from profile ensures we have the custom fields
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    callback({
                        id: profile.id,
                        name: profile.full_name,
                        email: profile.email,
                        avatar: profile.avatar_url,
                        role: profile.role,
                        createdAt: profile.created_at || new Date().toISOString()
                    } as User);
                } else {
                    // Fallback if profile doesn't exist yet (race condition on signup)
                    callback({
                        id: session.user.id,
                        name: session.user.user_metadata.full_name,
                        email: session.user.email || '',
                        avatar: session.user.user_metadata.avatar_url,
                        role: 'user',
                        createdAt: session.user.created_at || new Date().toISOString()
                    } as User);
                }
            } else {
                callback(null);
            }
        });
    }
};
