// Backfill descriptions for the books that were added through the admin
// without descriptions, plus the one seeded with "...".

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const updates = [
  {
    title: 'Возмутитель спокойствия',
    description: `Знаменитая повесть Леонида Соловьёва о приключениях Ходжи Насреддина — бродячего мудреца, шутника и заступника бедняков. Действие происходит в средневековой Бухаре. Ходжа возвращается в родной город под чужим именем и противостоит коррумпированному эмиру с помощью смекалки, юмора и народной мудрости. Книга, которая учит видеть свет даже в самых тяжёлых обстоятельствах.`,
    genre: 'классика',
  },
  {
    title: 'Коко Шанель',
    description: `Книга о легендарной Габриэль «Коко» Шанель — основательнице модного дома Chanel и одной из самых влиятельных женщин XX века. История о бедном детстве в монастыре, восхождении на вершину мировой моды, любви, потерях и непоколебимой независимости. О том, как одна женщина создала стиль, навсегда изменивший представление о женской одежде.`,
    genre: 'биография',
  },
  {
    title: 'Сад',
    description: `Роман Марии Степновой о русской аристократической семье XIX века. Княгиня Наталья Борятинская в возрасте 44 лет неожиданно рожает дочь Туську — и решает воспитать её совсем не так, как принято в свете. Книга о свободе, материнстве, эпохе перемен в России — и о саде, который становится символом всего этого.`,
    genre: 'современная проза',
  },
  {
    title: 'Человек, который принял свою жену за шляпу',
    description: `Знаменитая книга невролога Оливера Сакса — сборник клинических историй о пациентах с необычными неврологическими расстройствами. От человека, который не может узнать лица (даже своей жены), до близнецов-аутистов, видящих числовые закономерности. Каждая история — окно в загадку человеческого мозга и сознания, написанное с глубокой эмпатией и литературным даром.`,
  },
]

for (const u of updates) {
  const payload = { description: u.description }
  if (u.genre) payload.genre = u.genre
  const { error, count } = await supabase
    .from('books')
    .update(payload, { count: 'exact' })
    .eq('title', u.title)
  if (error) { console.error(`fail "${u.title}": ${error.message}`); continue }
  console.log(`${u.title}: ${count ? 'updated' : 'not found'}`)
}
