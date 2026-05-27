// Change the admin account email.
// Run: node scripts/change-admin-email.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const OLD_EMAIL = 'v.d.prozorova@gmail.com'
const NEW_EMAIL = 'community.yourspace@gmail.com'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: { users } } = await supabase.auth.admin.listUsers()
const admin =
  users.find(u => u.email === NEW_EMAIL) ||
  users.find(u => u.email === OLD_EMAIL)

if (!admin) {
  console.error(`No admin user found (tried ${OLD_EMAIL} and ${NEW_EMAIL})`)
  process.exit(1)
}

if (admin.email === NEW_EMAIL) {
  console.log(`Already set: ${NEW_EMAIL}`)
  process.exit(0)
}

const { error: updErr } = await supabase.auth.admin.updateUserById(admin.id, {
  email: NEW_EMAIL,
  email_confirm: true,
})
if (updErr) { console.error(updErr); process.exit(1) }

// Mirror to profiles.email
await supabase.from('profiles').update({ email: NEW_EMAIL }).eq('id', admin.id)

console.log('═══════════════════════════════════════════════════════════')
console.log(`  Email changed: ${OLD_EMAIL} → ${NEW_EMAIL}`)
console.log('  Password unchanged — use the one you saved earlier.')
console.log('═══════════════════════════════════════════════════════════')
