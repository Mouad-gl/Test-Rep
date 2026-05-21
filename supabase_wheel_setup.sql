-- ─────────────────────────────────────────────────────────────────────────────
-- Lucky Wheel — Supabase table setup
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────


-- 1. Wheel segments  ──────────────────────────────────────────────────────────
--    Each row = one slice of the wheel.
--    probability controls relative weight (e.g. 10 vs 1 = 10× more likely).

create table if not exists wheel_segments (
  id            uuid primary key default gen_random_uuid(),
  label         text    not null,          -- text shown on the slice
  color         text    not null default '#22c55e',  -- CSS hex color
  probability   numeric not null default 10,         -- relative weight
  image_url     text,                      -- optional icon/image inside slice (future use)
  display_order int     not null default 0,          -- draw order (clockwise from top)
  created_at    timestamptz default now()
);

-- Example data (8 slices matching the Delta Force screenshot style)
insert into wheel_segments (label, color, probability, display_order) values
  ('500 DF',    '#22c55e', 10, 0),
  ('Try Again', '#111111', 30, 1),
  ('1000 DF',   '#22c55e',  5, 2),
  ('Try Again', '#111111', 30, 3),
  ('200 DF',    '#22c55e', 15, 4),
  ('Try Again', '#111111', 30, 5),
  ('5000 DF',   '#22c55e',  1, 6),
  ('Try Again', '#111111', 30, 7);


-- 2. Wheel config  ────────────────────────────────────────────────────────────
--    Single-row table (only one row is read — use upsert to update).

create table if not exists wheel_config (
  id                  uuid primary key default gen_random_uuid(),
  background_image    text,     -- URL of the full-page background image
  logo_image          text,     -- URL of the logo shown above the wheel
  show_store_buttons  bool    not null default false,
  apple_store_url     text    default '#',
  google_play_url     text    default '#',
  spin_button_text    text    not null default 'SPIN',
  spin_button_color   text    not null default '#22c55e',
  wheel_border_color  text    not null default '#ffffff',
  wheel_center_color  text    not null default '#ffffff',
  created_at          timestamptz default now()
);

-- Insert a default row (edit values as needed)
insert into wheel_config (
  background_image, logo_image,
  show_store_buttons, apple_store_url, google_play_url,
  spin_button_text, spin_button_color
) values (
  null, null,
  false, '#', '#',
  'SPIN', '#22c55e'
);


-- 3. Wheel popup config  ──────────────────────────────────────────────────────
--    Controls the reward popup that appears after a spin.
--    Use {reward} in win_message — it will be replaced with the segment label.

create table if not exists wheel_popup_config (
  id               uuid primary key default gen_random_uuid(),
  background_image text,     -- URL for popup card background image
  background_color text    not null default '#111827',  -- fallback solid color
  win_title        text    not null default 'You Won!',
  win_message      text    not null default 'Congratulations! You have won {reward}!',
  button_text      text    not null default 'Claim Reward',
  button_url       text,     -- where the button links (leave null for no link)
  button_color     text    not null default '#22c55e',
  created_at       timestamptz default now()
);

-- Insert a default row
insert into wheel_popup_config (
  win_title, win_message, button_text, button_color
) values (
  'You Won!',
  'Congratulations! You have won {reward}!',
  'Claim Reward',
  '#22c55e'
);


-- 4. RLS (Row Level Security)  ────────────────────────────────────────────────
--    Allow anyone to read; restrict writes to authenticated/service role.

alter table wheel_segments    enable row level security;
alter table wheel_config      enable row level security;
alter table wheel_popup_config enable row level security;

create policy "public read wheel_segments"     on wheel_segments    for select using (true);
create policy "public read wheel_config"       on wheel_config      for select using (true);
create policy "public read wheel_popup_config" on wheel_popup_config for select using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- How to configure from Supabase dashboard:
--
--  • wheel_segments      → Table Editor → add/edit rows to change prizes & colours
--  • wheel_config        → update background_image, logo_image, button colours, etc.
--  • wheel_popup_config  → update the popup title, message template, CTA button
-- ─────────────────────────────────────────────────────────────────────────────
