-- Analytics Table
create table public.analytics (
  id uuid default gen_random_uuid() primary key,
  card_id uuid references public.cards(id) not null,
  event_type text not null, -- 'view', 'click', 'save'
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.analytics enable row level security;

-- Policies
create policy "Analytics are viewable by card owner."
  on analytics for select
  using ( auth.uid() in (
    select user_id from cards where id = analytics.card_id
  ));

create policy "Anyone can insert analytics events."
  on analytics for insert
  with check ( true ); 
