import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { count: books } = await supabase.from('books').select('*', { count: 'exact', head: true })
const { count: events } = await supabase.from('events').select('*', { count: 'exact', head: true })
const { count: images } = await supabase.from('event_images').select('*', { count: 'exact', head: true })
const { data: current } = await supabase.from('books').select('title, author, read_month').eq('is_current', true).single()

console.log(`books: ${books}`)
console.log(`events: ${events}`)
console.log(`event_images: ${images}`)
console.log(`current book: "${current.title}" by ${current.author} (${current.read_month})`)
