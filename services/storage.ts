
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
    }
};
