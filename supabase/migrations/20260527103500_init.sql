-- Your Space — initial schema
-- Tables: profiles, invites, books, book_votes, book_proposals, events, event_images, event_rsvps
-- View: book_ratings (public aggregate)
-- RLS: enabled on every table; public reads on content tables, member writes only on own rows.

-- ============================================================
-- Enums
-- ============================================================

create type user_role as enum ('member', 'organizer', 'admin');
create type invite_status as enum ('pending', 'redeemed', 'revoked', 'expired');
create type rsvp_status as enum ('going', 'maybe', 'not_going');
create type proposal_status as enum ('proposed', 'shortlisted', 'selected', 'rejected');

-- ============================================================
-- profiles — extends auth.users with role + community fields
-- role IS NULL means "signed up but invite not yet redeemed".
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  role user_role,
  telegram_username text,
  joined_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles(role);

-- Auto-create a profile row when a new auth user appears.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: is current user an organizer or admin?
create or replace function public.is_organizer_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('organizer', 'admin')
  );
$$;

-- Helper: is current user a redeemed member (any role set)?
create or replace function public.is_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role is not null
  );
$$;

-- ============================================================
-- invites — admin-generated, single-use, optional email lock
-- ============================================================

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  email text,
  role user_role not null default 'member',
  invited_by uuid not null references public.profiles(id),
  status invite_status not null default 'pending',
  redeemed_by uuid references public.profiles(id),
  redeemed_at timestamptz,
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now()
);

create index invites_token_idx on public.invites(token);
create index invites_email_idx on public.invites(email);

-- Redemption RPC: callable by any authenticated user; validates token + email match.
create or replace function public.redeem_invite(invite_token text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.invites;
  v_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Must be signed in to redeem an invite';
  end if;

  select * into v_invite from public.invites where token = invite_token for update;

  if not found then
    raise exception 'Invite not found';
  end if;
  if v_invite.status <> 'pending' then
    raise exception 'Invite already used or revoked';
  end if;
  if v_invite.expires_at < now() then
    update public.invites set status = 'expired' where id = v_invite.id;
    raise exception 'Invite has expired';
  end if;

  -- If invite is email-locked, current user's email must match.
  if v_invite.email is not null and v_invite.email <> (select email from auth.users where id = auth.uid()) then
    raise exception 'This invite is restricted to a different email address';
  end if;

  update public.profiles
    set role = v_invite.role
  where id = auth.uid()
  returning * into v_profile;

  update public.invites
    set status = 'redeemed',
        redeemed_by = auth.uid(),
        redeemed_at = now()
  where id = v_invite.id;

  return v_profile;
end;
$$;

grant execute on function public.redeem_invite(text) to authenticated;

-- ============================================================
-- books
-- ============================================================

create table public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  description text,
  cover_url text,
  read_month date,
  is_current boolean not null default false,
  instagram_post_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index books_read_month_idx on public.books(read_month desc);
create unique index books_only_one_current on public.books(is_current) where is_current = true;

-- ============================================================
-- book_votes — 1..5 stars per member per book; aggregate via view
-- ============================================================

create table public.book_votes (
  book_id uuid not null references public.books(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (book_id, member_id)
);

create or replace view public.book_ratings as
  select
    book_id,
    round(avg(rating)::numeric, 1) as avg_rating,
    count(*)::int as vote_count
  from public.book_votes
  group by book_id;

-- View inherits permissions from base tables but we want it publicly readable.
-- Workaround: create a SECURITY DEFINER function for aggregate access (cleaner than view perms).
create or replace function public.get_book_ratings()
returns table (book_id uuid, avg_rating numeric, vote_count int)
language sql
stable
security definer
set search_path = public
as $$
  select book_id, round(avg(rating)::numeric, 1), count(*)::int
  from public.book_votes
  group by book_id;
$$;

grant execute on function public.get_book_ratings() to anon, authenticated;

-- ============================================================
-- book_proposals — members suggest books for upcoming month
-- ============================================================

create table public.book_proposals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  proposed_by uuid not null references public.profiles(id) on delete cascade,
  reason text,
  status proposal_status not null default 'proposed',
  created_at timestamptz not null default now()
);

create index book_proposals_status_idx on public.book_proposals(status);

-- ============================================================
-- events
-- ============================================================

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  tags text[] not null default '{}',
  is_members_only boolean not null default true,
  instagram_post_id text,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_event_date_idx on public.events(event_date desc);

-- ============================================================
-- event_images — many images per event, ordered
-- ============================================================

create table public.event_images (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  image_url text not null,
  position int not null default 0
);

create index event_images_event_idx on public.event_images(event_id, position);

-- ============================================================
-- event_rsvps
-- ============================================================

create table public.event_rsvps (
  event_id uuid not null references public.events(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  status rsvp_status not null,
  responded_at timestamptz not null default now(),
  primary key (event_id, member_id)
);

-- ============================================================
-- updated_at triggers
-- ============================================================

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger books_touch_updated_at
  before update on public.books
  for each row execute function public.touch_updated_at();

create trigger events_touch_updated_at
  before update on public.events
  for each row execute function public.touch_updated_at();

-- ============================================================
-- Row-Level Security
-- ============================================================

alter table public.profiles        enable row level security;
alter table public.invites         enable row level security;
alter table public.books           enable row level security;
alter table public.book_votes      enable row level security;
alter table public.book_proposals  enable row level security;
alter table public.events          enable row level security;
alter table public.event_images    enable row level security;
alter table public.event_rsvps     enable row level security;

-- profiles ---------------------------------------------------
create policy "Members can read all profiles"
  on public.profiles for select
  using (public.is_member() or public.is_admin());

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own non-privileged fields"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete profiles"
  on public.profiles for delete
  using (public.is_admin());

-- Lock down role escalation: ordinary users cannot change their own role.
-- Enforced by a trigger because RLS can't filter at column level.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change profile.role; use redeem_invite() for first-time activation';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- invites ---------------------------------------------------
create policy "Admins manage invites"
  on public.invites for all
  using (public.is_admin())
  with check (public.is_admin());

-- books -----------------------------------------------------
create policy "Anyone can read books"
  on public.books for select
  using (true);

create policy "Organizers and admins write books"
  on public.books for all
  using (public.is_organizer_or_admin())
  with check (public.is_organizer_or_admin());

-- book_votes ------------------------------------------------
create policy "Members read their own votes"
  on public.book_votes for select
  using (auth.uid() = member_id);

create policy "Admins read all votes"
  on public.book_votes for select
  using (public.is_admin());

create policy "Members upsert their own vote"
  on public.book_votes for insert
  with check (auth.uid() = member_id and public.is_member());

create policy "Members update their own vote"
  on public.book_votes for update
  using (auth.uid() = member_id)
  with check (auth.uid() = member_id and public.is_member());

create policy "Members delete their own vote"
  on public.book_votes for delete
  using (auth.uid() = member_id or public.is_admin());

-- book_proposals --------------------------------------------
create policy "Members read proposals"
  on public.book_proposals for select
  using (public.is_member());

create policy "Members create proposals"
  on public.book_proposals for insert
  with check (auth.uid() = proposed_by and public.is_member());

create policy "Authors edit their own proposals while pending"
  on public.book_proposals for update
  using (auth.uid() = proposed_by and status = 'proposed')
  with check (auth.uid() = proposed_by);

create policy "Organizers and admins manage proposals"
  on public.book_proposals for all
  using (public.is_organizer_or_admin())
  with check (public.is_organizer_or_admin());

-- events ----------------------------------------------------
create policy "Anyone can read events"
  on public.events for select
  using (true);

create policy "Organizers and admins write events"
  on public.events for all
  using (public.is_organizer_or_admin())
  with check (public.is_organizer_or_admin());

-- event_images ----------------------------------------------
create policy "Anyone can read event images"
  on public.event_images for select
  using (true);

create policy "Organizers and admins write event images"
  on public.event_images for all
  using (public.is_organizer_or_admin())
  with check (public.is_organizer_or_admin());

-- event_rsvps ------------------------------------------------
create policy "Members read RSVPs"
  on public.event_rsvps for select
  using (public.is_member());

create policy "Members upsert their own RSVP"
  on public.event_rsvps for insert
  with check (auth.uid() = member_id and public.is_member());

create policy "Members update their own RSVP"
  on public.event_rsvps for update
  using (auth.uid() = member_id)
  with check (auth.uid() = member_id);

create policy "Members delete their own RSVP"
  on public.event_rsvps for delete
  using (auth.uid() = member_id or public.is_admin());

-- ============================================================
-- Storage buckets (created via SQL — equivalent to dashboard creation)
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('book-covers', 'book-covers', true),
  ('event-images', 'event-images', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policies: public read; only organizers/admins write to content buckets;
-- users write to their own avatars path.
create policy "Public read book-covers"
  on storage.objects for select
  using (bucket_id = 'book-covers');

create policy "Organizers write book-covers"
  on storage.objects for all
  using (bucket_id = 'book-covers' and public.is_organizer_or_admin())
  with check (bucket_id = 'book-covers' and public.is_organizer_or_admin());

create policy "Public read event-images"
  on storage.objects for select
  using (bucket_id = 'event-images');

create policy "Organizers write event-images"
  on storage.objects for all
  using (bucket_id = 'event-images' and public.is_organizer_or_admin())
  with check (bucket_id = 'event-images' and public.is_organizer_or_admin());

create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users write own avatar"
  on storage.objects for all
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
