
import { supabase } from './supabase';

export const StorageService = {
    async uploadImage(file: File, folder: string = 'uploads'): Promise<string> {
        try {
            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('images') // Ensure this matches the bucket name created by the user
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    },

    async deleteImage(url: string | undefined): Promise<void> {
        if (!url) return;
        try {
            // Extract path from URL
            // URL format: https://[project].supabase.co/storage/v1/object/public/images/[folder]/[filename]
            const urlParts = url.split('/images/');
            if (urlParts.length < 2) return;

            const path = urlParts[1]; // contents after '/images/'

            // Only try to delete if it looks like it belongs to our storage
            if (path) {
                const { error } = await supabase.storage
                    .from('images')
                    .remove([path]);

                if (error) console.error('Delete warning:', error.message);
            }
        } catch (error) {
            console.error('Delete failed:', error);
            // Don't throw, just log. Deletion failure shouldn't stop the main flow.
        }
    }
};
