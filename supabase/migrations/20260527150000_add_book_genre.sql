alter table public.books add column genre text;
create index books_genre_idx on public.books(genre);
