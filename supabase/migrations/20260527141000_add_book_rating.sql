-- Add an explicit `rating` column on books so admins can set it directly.
-- When member voting is built later, this stays as the canonical rating
-- (or we switch to the computed average from book_votes — TBD).

alter table public.books add column rating numeric(3,1) check (rating is null or rating between 0 and 5);
