import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data } = await supabase.from('books').select('title, author, description').order('title')
for (const b of data ?? []) {
  const len = (b.description ?? '').trim().length
  const placeholder = (b.description ?? '').trim() === '...' || len < 30
  if (placeholder) console.log(`MISSING: "${b.title}" — ${b.author}  (description length: ${len})`)
}
