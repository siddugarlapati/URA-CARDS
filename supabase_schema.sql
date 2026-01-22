-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Extends default auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'user',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- BUSINESS CARDS TABLE
create table cards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  slug text unique not null,
  theme jsonb default '{}'::jsonb,
  content jsonb default '{}'::jsonb,
  is_public boolean default true,
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Cards
alter table cards enable row level security;
create policy "Public cards are viewable by everyone." on cards for select using (is_public = true);
create policy "Users can view own cards." on cards for select using (auth.uid() = user_id);
create policy "Users can insert own cards." on cards for insert with check (auth.uid() = user_id);
create policy "Users can update own cards." on cards for update using (auth.uid() = user_id);
create policy "Users can delete own cards." on cards for delete using (auth.uid() = user_id);

-- ANALYTICS TABLE (Real-time)
create table analytics (
  id uuid default uuid_generate_v4() primary key,
  card_id uuid references cards(id) on delete cascade not null,
  event_type text not null, -- 'view', 'click', 'save'
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Analytics
alter table analytics enable row level security;
create policy "Analytics insertable by everyone" on analytics for insert with check (true);
create policy "Users can view analytics for own cards" on analytics for select using (
  exists (select 1 from cards where cards.id = analytics.card_id and cards.user_id = auth.uid())
);

-- Function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
