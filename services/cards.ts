
import { supabase } from './supabase';
import { CardData, ThemeSettings, SocialLinks, CustomField } from '../types';
import { DEFAULT_THEME } from '../constants';


import { supabase } from './supabase';
import { CardData, ThemeSettings, SocialLinks, CustomField } from '../types';
import { DEFAULT_THEME } from '../constants';

export const CardService = {
    // Mapper: DB -> Frontend
    mapToCardData(dbCard: any): CardData {
        return {
            id: dbCard.id,
            userId: dbCard.user_id,
            usernameSlug: dbCard.username_slug, // Changed from slug
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
            isPrivate: dbCard.is_private || false, // Changed from !is_public

            // Stats
            views: dbCard.views || 0,
            clicks: dbCard.clicks || 0,
            scans: dbCard.scans || 0,
            followers: dbCard.followers || 0,
            mutuals: dbCard.mutuals || 0,
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
        return (data || []).map(this.mapToCardData);
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
            .eq('username_slug', slug) // Changed from slug
            .single();

        if (error) return null;
        return this.mapToCardData(data);
    },

    async createCard(userId: string, card: Partial<CardData>): Promise<CardData> {
        const { data, error } = await supabase
            .from('cards')
            .insert([
                {
                    user_id: userId,
                    username_slug: card.usernameSlug,
                    theme: card.theme,
                    // Flat columns
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
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return this.mapToCardData(data);
    },

    async updateCard(cardId: string, updates: Partial<CardData>): Promise<CardData> {
        const dbUpdates: any = {};

        if (updates.usernameSlug) dbUpdates.username_slug = updates.usernameSlug;
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
