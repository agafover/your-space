// Backfill genres for the original 6 books (descriptions already exist).

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const updates = [
  { title: 'Охота на маленькую щуку', genre: 'фэнтези' },
  { title: 'Милый друг', genre: 'классика' },
  { title: 'Скорбь сатаны', genre: 'мистика' },
  { title: 'Над пропастью во ржи', genre: 'классика' },
  { title: 'Вторая жизнь Уве', genre: 'современная проза' },
  { title: 'Человек, который принял свою жену за шляпу', genre: 'нон-фикшн' },
]

for (const { title, genre } of updates) {
  const { error, count } = await supabase
    .from('books')
    .update({ genre }, { count: 'exact' })
    .eq('title', title)
  if (error) { console.error(`fail "${title}": ${error.message}`); continue }
  console.log(`${title}: ${count ? `set genre="${genre}"` : 'not found'}`)
}
