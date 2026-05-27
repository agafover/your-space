// One-off: restore the original ratings that were hardcoded in src/pages/Books.jsx
// before the Supabase migration.

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const ratings = [
  { title: 'Милый друг', rating: 4.0 },
  { title: 'Скорбь сатаны', rating: 4.0 },
  { title: 'Над пропастью во ржи', rating: 4.1 },
  { title: 'Вторая жизнь Уве', rating: 4.6 },
  { title: 'Человек, который принял свою жену за шляпу', rating: 3.5 },
  // Охота на маленькую щуку deliberately omitted — no rating yet.
]

for (const { title, rating } of ratings) {
  const { error, count } = await supabase
    .from('books')
    .update({ rating }, { count: 'exact' })
    .eq('title', title)
  if (error) { console.error(`Failed for "${title}":`, error.message); continue }
  console.log(`${title}: ${count ? `set rating=${rating}` : 'not found'}`)
}
