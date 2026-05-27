-- The `book_ratings` view was created with the initial schema but never used
-- by the app — `public.get_book_ratings()` (an explicit SECURITY DEFINER
-- function) is what `src/pages/Books.jsx` actually calls.
--
-- Postgres views are SECURITY DEFINER by default, which trips Supabase Advisor
-- with a "Security Definer View" warning. Dropping the dead view resolves it.

drop view if exists public.book_ratings;
