-- Admin-controlled flag: when true, the event shows up in Афиша (Calendar
-- page) and "Ближайшие мероприятия" on Home. Independent of event_date so
-- admins can plan events even without a confirmed date.

alter table public.events add column is_planned boolean not null default false;
create index events_is_planned_idx on public.events(is_planned) where is_planned = true;
