
import { supabase } from './supabase';

export interface AnalyticsEvent {
    card_id: string;
    event_type: 'view' | 'click' | 'save';
    metadata?: any;
}

export const AnalyticsService = {
    async trackEvent(event: AnalyticsEvent) {
        try {
            const { error } = await supabase
                .from('analytics')
                .insert([
                    {
                        card_id: event.card_id,
                        event_type: event.event_type,
                        metadata: event.metadata || {}
                    }
                ]);

            if (error) {
                console.error('Error tracking event:', error);
            }
        } catch (err) {
            console.error('Failed to track event:', err);
        }
    },

    async getCardAnalytics(cardId: string) {
        try {
            const { data, error } = await supabase
                .from('analytics')
                .select('*')
                .eq('card_id', cardId);

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Error fetching analytics:', err);
            return [];
        }
    },

    async getCardStats(cardId: string) {
        try {
            // We can use a count query for better performance if needed, 
            // but for now fetching all keys to aggregate client side is okay for MVP scale
            const { data, error } = await supabase
                .from('analytics')
                .select('event_type, created_at, metadata')
                .eq('card_id', cardId);

            if (error) throw error;

            const views = data.filter(e => e.event_type === 'view').length;
            const clicks = data.filter(e => e.event_type === 'click').length;

            // Simple aggregation for history (last 7 days for example)
            // This is a basic client-side aggregation. For production with millions of rows, use a materialized view.
            return {
                views,
                clicks,
                raw: data // Return raw data for graph generation
            };
        } catch (err) {
            console.error('Error fetching stats:', err);
            return { views: 0, clicks: 0, raw: [] };
        }
    },

    subscribeToAnalytics(cardId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`analytics:${cardId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'analytics',
                    filter: `card_id=eq.${cardId}`
                },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe();
    }
};
