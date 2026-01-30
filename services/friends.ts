import { supabase } from './supabase';
import { Friend } from '../types';

export const FriendsService = {
    /**
     * Add a friend by their unique ID
     */
    async addFriendByUniqueId(uniqueId: string): Promise<{ success: boolean; friend?: Friend; error?: string }> {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { success: false, error: 'Not authenticated' };
            }

            // Find the friend by unique ID
            const { data: friendProfile, error: profileError } = await supabase
                .from('profiles')
                .select('id, full_name, email, avatar_url, unique_id')
                .eq('unique_id', uniqueId)
                .single();

            if (profileError || !friendProfile) {
                return { success: false, error: 'User not found with this ID' };
            }

            // Check if trying to add self
            if (friendProfile.id === user.id) {
                return { success: false, error: 'Cannot add yourself as a friend' };
            }

            // Check if already friends
            const { data: existingFriend } = await supabase
                .from('friends')
                .select('id')
                .eq('user_id', user.id)
                .eq('friend_id', friendProfile.id)
                .maybeSingle();

            if (existingFriend) {
                return { success: false, error: 'Already friends with this user' };
            }

            // Add friend
            const { data: newFriend, error: insertError } = await supabase
                .from('friends')
                .insert({
                    user_id: user.id,
                    friend_id: friendProfile.id
                })
                .select()
                .single();

            if (insertError) {
                console.error('Error adding friend:', insertError);
                return { success: false, error: 'Failed to add friend' };
            }

            const friend: Friend = {
                id: newFriend.id,
                userId: user.id,
                friendId: friendProfile.id,
                friendName: friendProfile.full_name || 'Unknown',
                friendUsername: friendProfile.unique_id,
                friendAvatar: friendProfile.avatar_url,
                addedAt: newFriend.created_at
            };

            return { success: true, friend };
        } catch (err) {
            console.error('Error in addFriendByUniqueId:', err);
            return { success: false, error: 'An unexpected error occurred' };
        }
    },

    /**
     * Get all friends for the current user
     */
    async getFriends(): Promise<Friend[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('friend_details')
                .select('*')
                .eq('user_id', user.id)
                .order('added_at', { ascending: false });

            if (error) {
                console.error('Error fetching friends:', error);
                return [];
            }

            return (data || []).map(f => ({
                id: f.id,
                userId: f.user_id,
                friendId: f.friend_id,
                friendName: f.friend_name || 'Unknown',
                friendUsername: f.friend_unique_id,
                friendAvatar: f.friend_avatar,
                addedAt: f.added_at
            }));
        } catch (err) {
            console.error('Error in getFriends:', err);
            return [];
        }
    },

    /**
     * Remove a friend
     */
    async removeFriend(friendId: string): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const { error } = await supabase
                .from('friends')
                .delete()
                .eq('user_id', user.id)
                .eq('friend_id', friendId);

            if (error) {
                console.error('Error removing friend:', error);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error in removeFriend:', err);
            return false;
        }
    },

    /**
     * Check if a user is already a friend
     */
    async isFriend(friendId: string): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const { data } = await supabase
                .from('friends')
                .select('id')
                .eq('user_id', user.id)
                .eq('friend_id', friendId)
                .maybeSingle();

            return !!data;
        } catch (err) {
            console.error('Error in isFriend:', err);
            return false;
        }
    },

    /**
     * Get friend count
     */
    async getFriendCount(): Promise<number> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return 0;

            const { count, error } = await supabase
                .from('friends')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            if (error) {
                console.error('Error getting friend count:', error);
                return 0;
            }

            return count || 0;
        } catch (err) {
            console.error('Error in getFriendCount:', err);
            return 0;
        }
    }
};
