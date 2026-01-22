
import { supabase } from './supabase';
import { CardData, ThemeSettings, SocialLinks, CustomField } from '../types';
import { DEFAULT_THEME } from '../constants';

export const CardService = {
    // Mapper: DB -> Frontend
    mapToCardData(dbCard: any): CardData {
        const content = dbCard.content || {};
        return {
            id: dbCard.id,
            userId: dbCard.user_id,
            usernameSlug: dbCard.slug,
            theme: dbCard.theme || DEFAULT_THEME,
            // Spread content fields
            name: content.name || '',
            role: content.role || '',
            company: content.company || '',
            phone: content.phone || '',
            isPhonePrivate: content.isPhonePrivate ?? true,
            email: content.email || '',
            isEmailPrivate: content.isEmailPrivate ?? true,
            website: content.website || '',
            address: content.address || '',
            bio: content.bio || '',
            profileImage: content.profileImage || '',
            brandLogo: content.brandLogo || '',
            primaryCTA: content.primaryCTA || 'save_contact',
            customFields: content.customFields || [],
            socialLinks: content.socialLinks || { custom: [] },
            isPrivate: !dbCard.is_public,

            // Stats (fetched separately or from counts, default to 0 for now)
            views: dbCard.views || 0,
            clicks: 0,
            scans: 0,
            followers: 0,
            mutuals: 0,
            linkedinVelocity: 0,
            retentionRate: 0,
            analyticsHistory: [],
            linkAnalytics: {},

            createdAt: dbCard.created_at,
            updatedAt: dbCard.created_at // specific update time if column exists
        };
    },

    async getUserCards(userId: string): Promise<CardData[]> {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(this.mapToCardData);
    },

    async getCardBySlug(slug: string): Promise<CardData | null> {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return null; // Handle not found gracefully
        return this.mapToCardData(data);
    },

    async createCard(userId: string, card: Partial<CardData>): Promise<CardData> {
        // Extract content from flat card object
        const content = {
            name: card.name,
            role: card.role,
            company: card.company,
            phone: card.phone,
            isPhonePrivate: card.isPhonePrivate,
            email: card.email,
            isEmailPrivate: card.isEmailPrivate,
            website: card.website,
            address: card.address,
            bio: card.bio,
            profileImage: card.profileImage,
            brandLogo: card.brandLogo,
            primaryCTA: card.primaryCTA,
            customFields: card.customFields,
            socialLinks: card.socialLinks,
        };

        const { data, error } = await supabase
            .from('cards')
            .insert([
                {
                    user_id: userId,
                    slug: card.usernameSlug,
                    theme: card.theme,
                    content: content,
                    is_public: !card.isPrivate
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return this.mapToCardData(data);
    },

    async updateCard(cardId: string, updates: Partial<CardData>): Promise<CardData> {
        // Need to fetch existing to merge content? Or just update what's passed?
        // For simplicity, let's assume we are passing full content or merging on partials is tricky with JSONB.
        // We'll update only the top level columns and specific content keys if needed.
        // But typically update sends the whole state from the editor.

        const content = {
            name: updates.name,
            role: updates.role,
            company: updates.company,
            phone: updates.phone,
            isPhonePrivate: updates.isPhonePrivate,
            email: updates.email,
            isEmailPrivate: updates.isEmailPrivate,
            website: updates.website,
            address: updates.address,
            bio: updates.bio,
            profileImage: updates.profileImage,
            brandLogo: updates.brandLogo,
            primaryCTA: updates.primaryCTA,
            customFields: updates.customFields,
            socialLinks: updates.socialLinks,
        };

        const dbUpdates: any = {};
        if (updates.usernameSlug) dbUpdates.slug = updates.usernameSlug;
        if (updates.theme) dbUpdates.theme = updates.theme;
        if (updates.isPrivate !== undefined) dbUpdates.is_public = !updates.isPrivate;
        // We merge content carefully or overwrite. Let's overwrite content for now as editor holds state.
        // Filter out undefineds from content to avoid clearing valid data if partial
        const cleanContent = Object.fromEntries(Object.entries(content).filter(([_, v]) => v !== undefined));

        // Ideally we should do a deep merge or fetch-then-update.
        // For this task, let's assume `updates` usually comes from 'save' full object.
        // If `updates` is partial, we might lose data if we overwrite `content`.
        // Let's do a patch:

        // First fetch current
        const { data: current } = await supabase.from('cards').select('content').eq('id', cardId).single();
        const newContent = { ...(current?.content || {}), ...cleanContent };

        dbUpdates.content = newContent;

        const { data, error } = await supabase
            .from('cards')
            .update(dbUpdates)
            .eq('id', cardId)
            .select()
            .single();

        if (error) throw error;
        return this.mapToCardData(data);
    }
};
