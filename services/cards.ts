
import { supabase } from './supabase';
import { CardData, DbCard } from '../types';
import { DEFAULT_THEME } from '../constants';

export const CardService = {
    // Mapper: DB -> Frontend
    mapToCardData(dbCard: DbCard & { id: string, user_id: string, created_at: string, updated_at: string }): CardData {
        return {
            id: dbCard.id,
            userId: dbCard.user_id,
            usernameSlug: dbCard.username_slug || '',
            theme: dbCard.theme || DEFAULT_THEME,

            // Flat columns
            name: dbCard.name || '',
            role: dbCard.role || '',
            company: dbCard.company || '',
            phone: dbCard.phone || '',
            isPhonePrivate: dbCard.is_phone_private ?? true,
            email: dbCard.email || '',
            isEmailPrivate: dbCard.is_email_private ?? true,
            website: dbCard.website || '',
            address: dbCard.address || '',
            bio: dbCard.bio || '',
            profileImage: dbCard.profile_image || '',
            brandLogo: dbCard.brand_logo || '',
            primaryCTA: dbCard.primary_cta || 'save_contact',
            customFields: dbCard.custom_fields || [],
            socialLinks: dbCard.social_links || { custom: [] },
            isPrivate: dbCard.is_private || false,

            // Stats
            views: dbCard.views || 0,
            clicks: dbCard.clicks || 0,
            scans: dbCard.scans || 0,
            followers: dbCard.followers || 0,
            mutuals: dbCard.mutuals || 0,
            // Derived or placeholder stats
            linkedinVelocity: 0,
            retentionRate: 0,
            analyticsHistory: [],
            linkAnalytics: {},

            createdAt: dbCard.created_at,
            updatedAt: dbCard.updated_at
        };
    },

    async getUserCards(userId: string): Promise<CardData[]> {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map((item: unknown) => this.mapToCardData(item as DbCard & { id: string, user_id: string, created_at: string, updated_at: string }));
    },

    async getCardById(id: string): Promise<CardData | null> {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return this.mapToCardData(data);
    },

    async getCardBySlug(slug: string): Promise<CardData | null> {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('username_slug', slug)
            .single();

        if (error) return null;
        return this.mapToCardData(data);
    },

    /**
     * Ensures a unique slug by appending a number if the slug already exists.
     * Uses a 'like' query to find colliding slugs efficiently.
     */
    async ensureUniqueSlug(baseSlug: string): Promise<string> {
        // Normalize: lowercase and remove special chars
        let slug = baseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        if (!slug) slug = 'user';

        // Check for exact match or pattern match
        const { data, error } = await supabase
            .from('cards')
            .select('username_slug')
            .ilike('username_slug', `${slug}%`);

        if (error || !data || data.length === 0) {
            return slug;
        }

        const existingSlugs = new Set(data.map(d => d.username_slug));

        if (!existingSlugs.has(slug)) {
            return slug;
        }

        // Try increments
        let counter = 1;
        while (existingSlugs.has(`${slug}-${counter}`)) {
            counter++;
        }

        return `${slug}-${counter}`;
    },

    async createCard(userId: string, card: Partial<CardData>): Promise<CardData> {
        const uniqueSlug = await this.ensureUniqueSlug(card.usernameSlug || card.name || 'user');

        const dbPayload: DbCard = {
            user_id: userId,
            username_slug: uniqueSlug,
            theme: card.theme,
            name: card.name,
            role: card.role,
            company: card.company,
            phone: card.phone,
            is_phone_private: card.isPhonePrivate,
            email: card.email,
            is_email_private: card.isEmailPrivate,
            website: card.website,
            address: card.address,
            bio: card.bio,
            profile_image: card.profileImage,
            brand_logo: card.brandLogo,
            primary_cta: card.primaryCTA,
            custom_fields: card.customFields,
            social_links: card.socialLinks,
            is_private: card.isPrivate
        };

        const { data, error } = await supabase
            .from('cards')
            .insert([dbPayload])
            .select()
            .single();

        if (error) throw error;
        return this.mapToCardData(data);
    },

    async updateCard(cardId: string, updates: Partial<CardData>): Promise<CardData> {
        const dbUpdates: DbCard = {};

        if (updates.usernameSlug) {
            // If slug is changing, we should strictly speaking check uniqueness again, 
            // but usually updates assume the client (or UI) might have validated it, 
            // or we let DB unique constraints fail.
            // However, for safety in this refactor, we will just assign it. 
            // The UI consuming this should call ensureUniqueSlug if the user types a new slug.
            dbUpdates.username_slug = updates.usernameSlug;
        }

        if (updates.theme) dbUpdates.theme = updates.theme;
        if (updates.isPrivate !== undefined) dbUpdates.is_private = updates.isPrivate;

        // Map other fields directly
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.role !== undefined) dbUpdates.role = updates.role;
        if (updates.company !== undefined) dbUpdates.company = updates.company;
        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.isPhonePrivate !== undefined) dbUpdates.is_phone_private = updates.isPhonePrivate;
        if (updates.email !== undefined) dbUpdates.email = updates.email;
        if (updates.isEmailPrivate !== undefined) dbUpdates.is_email_private = updates.isEmailPrivate;
        if (updates.website !== undefined) dbUpdates.website = updates.website;
        if (updates.address !== undefined) dbUpdates.address = updates.address;
        if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
        if (updates.profileImage !== undefined) dbUpdates.profile_image = updates.profileImage;
        if (updates.brandLogo !== undefined) dbUpdates.brand_logo = updates.brandLogo;
        if (updates.primaryCTA !== undefined) dbUpdates.primary_cta = updates.primaryCTA;
        if (updates.customFields !== undefined) dbUpdates.custom_fields = updates.customFields;
        if (updates.socialLinks !== undefined) dbUpdates.social_links = updates.socialLinks;

        dbUpdates.updated_at = new Date().toISOString();

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
