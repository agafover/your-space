// One-off: add a batch of books with just title + author.
// Idempotent — skips books that already exist by title.

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const newBooks = [
  { title: 'Собор Парижской Богоматери', author: 'Виктор Гюго' },
  { title: 'Белые одежды', author: 'Владимир Дудинцев' },
  { title: 'МЫ', author: 'Евгений Замятин' },
  { title: 'Цветы для Элджернона', author: 'Дэниел Киз' },
  { title: 'Ночь в Лиссабоне', author: 'Эрих Мария Ремарк' },
  { title: 'Мартин Иден', author: 'Джек Лондон' },
]

for (const book of newBooks) {
  const { data: existing } = await supabase.from('books').select('id').eq('title', book.title).maybeSingle()
  if (existing) {
    console.log(`skip: "${book.title}" already exists`)
    continue
  }
  const { error } = await supabase.from('books').insert(book)
  if (error) { console.error(`fail: "${book.title}": ${error.message}`); continue }
  console.log(`added: "${book.title}" — ${book.author}`)
}
