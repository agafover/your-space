// One-off: create a single admin account.
// Idempotent — re-running prints existing user info instead of creating a duplicate.
//
// Run: node scripts/create-admin.mjs

import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'node:crypto'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const ADMIN_EMAIL = 'community.yourspace@gmail.com'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Check if user already exists
const { data: existing } = await supabase.auth.admin.listUsers()
const found = existing?.users?.find(u => u.email === ADMIN_EMAIL)

if (found) {
  // Idempotent reset: generate a fresh password every run, so you always end up
  // with a working admin login. Safe because only you can run this (you hold
  // the service role key).
  console.log(`User exists (${ADMIN_EMAIL}) — resetting password and confirming admin role.`)
  const newPassword = randomBytes(12).toString('base64').replace(/[+/=]/g, '').slice(0, 16)
  const { error: pwdErr } = await supabase.auth.admin.updateUserById(found.id, { password: newPassword })
  if (pwdErr) { console.error(pwdErr); process.exit(1) }
  const { error: upd } = await supabase.from('profiles').update({ role: 'admin', display_name: 'Admin' }).eq('id', found.id)
  if (upd) { console.error(upd); process.exit(1) }

  console.log('═══════════════════════════════════════════════════════════')
  console.log('  ADMIN PASSWORD RESET — SAVE IT NOW')
  console.log('═══════════════════════════════════════════════════════════')
  console.log(`  Email:    ${ADMIN_EMAIL}`)
  console.log(`  Password: ${newPassword}`)
  console.log('═══════════════════════════════════════════════════════════')
  process.exit(0)
}

// Generate a strong password
const password = randomBytes(12).toString('base64').replace(/[+/=]/g, '').slice(0, 16)

// Create the user with email pre-confirmed
const { data: created, error: createErr } = await supabase.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password,
  email_confirm: true,
})
if (createErr) { console.error(createErr); process.exit(1) }

// Promote to admin in profiles (trigger already created the row with role=null)
const { error: upd } = await supabase
  .from('profiles')
  .update({ role: 'admin', display_name: 'Admin' })
  .eq('id', created.user.id)
if (upd) { console.error(upd); process.exit(1) }

console.log('═══════════════════════════════════════════════════════════')
console.log('  ADMIN ACCOUNT CREATED — SAVE THE PASSWORD NOW')
console.log('═══════════════════════════════════════════════════════════')
console.log(`  Email:    ${ADMIN_EMAIL}`)
console.log(`  Password: ${password}`)
console.log('═══════════════════════════════════════════════════════════')
console.log('  Save this in a password manager. You can change it later')
console.log('  in the admin panel (settings page) or via password reset.')
console.log('═══════════════════════════════════════════════════════════')
