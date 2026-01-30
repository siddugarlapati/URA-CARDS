-- Friends table for QR-based friend connections
-- Run this migration in your Supabase SQL Editor
-- Add unique_id column to profiles table if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS unique_id TEXT UNIQUE;
-- Create index on unique_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_unique_id ON profiles(unique_id);
-- Function to generate a unique ID for users (8 character alphanumeric)
CREATE OR REPLACE FUNCTION generate_unique_user_id() RETURNS TEXT AS $$
DECLARE chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
-- Removed ambiguous chars
result TEXT := '';
i INTEGER;
is_unique BOOLEAN := FALSE;
BEGIN WHILE NOT is_unique LOOP result := '';
FOR i IN 1..8 LOOP result := result || substr(
    chars,
    floor(random() * length(chars) + 1)::int,
    1
);
END LOOP;
-- Check if this ID already exists
SELECT NOT EXISTS(
        SELECT 1
        FROM profiles
        WHERE unique_id = result
    ) INTO is_unique;
END LOOP;
RETURN result;
END;
$$ LANGUAGE plpgsql;
-- Update existing users to have unique IDs
UPDATE profiles
SET unique_id = generate_unique_user_id()
WHERE unique_id IS NULL;
-- Make unique_id NOT NULL after populating existing records
ALTER TABLE profiles
ALTER COLUMN unique_id
SET NOT NULL;
-- Update the handle_new_user function to generate unique_id
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN
INSERT INTO public.profiles (id, email, full_name, avatar_url, unique_id)
VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        generate_unique_user_id()
    );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- FRIENDS TABLE
CREATE TABLE IF NOT EXISTS friends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Prevent duplicate friendships
    UNIQUE(user_id, friend_id),
    -- Prevent self-friending
    CHECK (user_id != friend_id)
);
-- Create index for faster friend lookups
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
-- RLS Policies for Friends
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
-- Users can view their own friends
CREATE POLICY "Users can view their own friends" ON friends FOR
SELECT USING (auth.uid() = user_id);
-- Users can add friends
CREATE POLICY "Users can add friends" ON friends FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Users can remove their own friends
CREATE POLICY "Users can remove friends" ON friends FOR DELETE USING (auth.uid() = user_id);
-- View to get friend details (includes friend's profile info)
CREATE OR REPLACE VIEW friend_details AS
SELECT f.id,
    f.user_id,
    f.friend_id,
    p.full_name as friend_name,
    p.email as friend_email,
    p.avatar_url as friend_avatar,
    p.unique_id as friend_unique_id,
    f.created_at as added_at
FROM friends f
    JOIN profiles p ON f.friend_id = p.id;
-- Grant access to the view
GRANT SELECT ON friend_details TO authenticated;