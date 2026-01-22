import { supabase } from './supabase';
import { User } from '../types';

export const authApi = {
    async signUp(email: string, password: string, fullName: string) {
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

        if (!profile) return null;

        return {
            id: profile.id,
            name: profile.full_name,
            email: profile.email,
            avatar: profile.avatar_url,
            role: profile.role
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
                        role: profile.role
                    } as User);
                } else {
                    // Fallback if profile doesn't exist yet (race condition on signup)
                    callback({
                        id: session.user.id,
                        name: session.user.user_metadata.full_name,
                        email: session.user.email || '',
                        avatar: session.user.user_metadata.avatar_url,
                        role: 'user'
                    } as User);
                }
            } else {
                callback(null);
            }
        });
    }
};
