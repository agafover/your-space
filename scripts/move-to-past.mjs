// One-off: mark the current book as no longer current, and import
// the book-club meeting from CalendarData into the events table.
//
// Run: node scripts/move-to-past.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// 1) clear is_current flag
const { error: clearErr, count: cleared } = await supabase
  .from('books')
  .update({ is_current: false }, { count: 'exact' })
  .eq('is_current', true)
if (clearErr) { console.error(clearErr); process.exit(1) }
console.log(`books: cleared is_current on ${cleared} row(s)`)

// 2) insert the book-club meeting if not already present
const meetingTitle = 'Встреча книжного клуба: «Охота на маленькую щуку»'
const { data: existing } = await supabase
  .from('events')
  .select('id')
  .eq('title', meetingTitle)
  .maybeSingle()

if (existing) {
  console.log(`events: meeting "${meetingTitle}" already exists, skipping`)
} else {
  const { error: insErr } = await supabase.from('events').insert({
    title: meetingTitle,
    description: 'Обсуждение апрельской книги клуба — «Охота на маленькую щуку» Юхани Карилы. Встреча прошла в уютной кофейне в Праге.',
    event_date: '2025-04-26',
    tags: ['Книги', 'Закрытое мероприятие'],
    is_members_only: true,
    cover_url: '/images/bookEventCover.jpg',
  })
  if (insErr) { console.error(insErr); process.exit(1) }
  console.log(`events: inserted meeting "${meetingTitle}"`)
}

console.log('Done.')
