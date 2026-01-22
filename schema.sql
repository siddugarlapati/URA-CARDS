-- Profiles Table (matches services/auth.ts)
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  email text,
  avatar_url text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Cards Table (matches types.ts CardData)
create table public.cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  username_slug text unique not null,
  name text,
  role text,
  company text,
  phone text,
  is_phone_private boolean default false,
  email text,
  is_email_private boolean default false,
  website text,
  address text,
  bio text,
  profile_image text,
  brand_logo text,
  primary_cta text,
  custom_fields jsonb default '[]'::jsonb,
  social_links jsonb default '{}'::jsonb,
  theme jsonb default '{}'::jsonb,
  is_private boolean default false,
  views integer default 0,
  clicks integer default 0,
  scans integer default 0,
  followers integer default 0,
  mutuals integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Cards
alter table public.cards enable row level security;

create policy "Public cards are viewable by everyone."
  on cards for select
  using ( true );

create policy "Users can insert their own card."
  on cards for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own card."
  on cards for update
  using ( auth.uid() = user_id );

-- Function to handle new user signup (auto-create profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
