// Seed the database with the books and events currently hardcoded in
// src/pages/Books.jsx and src/pages/Events.jsx, so the migration to Supabase
// is lossless. Uses the service-role key to bypass RLS.
//
// Run: npm run seed
// Re-runnable: clears books / events / event_images / book_proposals before inserting.

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const url = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Helper: convert "апрель 2025" -> 2025-04-01
const RU_MONTHS = {
  'январь': '01', 'февраль': '02', 'март': '03', 'апрель': '04',
  'май': '05', 'июнь': '06', 'июль': '07', 'август': '08',
  'сентябрь': '09', 'октябрь': '10', 'ноябрь': '11', 'декабрь': '12',
}
function ruMonthToDate(str) {
  if (!str) return null
  const [mo, yr] = str.toLowerCase().split(' ')
  const mm = RU_MONTHS[mo]
  if (!mm || !yr) return null
  return `${yr}-${mm}-01`
}

// Helper: "29.11.2024" -> "2024-11-29"
function ruDateToISO(str) {
  const [d, m, y] = str.split('.')
  return `${y}-${m}-${d}`
}

const books = [
  {
    title: 'Охота на маленькую щуку',
    author: 'Юхани Карила',
    month: 'апрель 2025',
    description: `«Охота на маленькую щуку» — одновременно трогательная история любви и затейливое фэнтези. Роман-погружение в самобытный фольклор Лапландии и современную финскую жизнь. Это роман-притча, роман-сказка про большую любовь, случайное предательство, преодоление и прощение себя.
      Насыщенный точными описаниями северной природы, роман переносит читателя в какой-то доисторический мир, где миф не отличим от реальности, а человек и природа являются единым целым.

      🏆 Премия молодых писателей Финляндии (Kalevi Jantti Prize)
      🏆 Лучшая книга в жанре фэнтези в Финляндии (Tahtifantasia Prize)
      🌍 Роман переведен на 12 языков`,
    image: '/books/oxota.jpg',
    is_current: true,
  },
  {
    title: 'Милый друг',
    author: 'Ги де Мопассан',
    month: 'январь 2025',
    description: `«Милый друг» – роман французского писателя Ги де Мопассана, написанный в 1885 году, рассказывает об авантюристе, который мечтает сделать блестящую карьеру. У него нет каких-либо талантов, разве что своей внешностью он может покорить сердце любой дамы, а совесть прощает ему любую подлость. И… этого хватает для того, чтобы стать сильным мира сего.`,
    instagram: 'DFTJd__tRz8',
    image: '/books/friend.jpg',
  },
  {
    title: 'Скорбь сатаны',
    author: 'Мари Корелли',
    month: 'февраль 2025',
    description: `Молодой писатель Джеффри Темпест, прозябающий в нищете и безвестности, продает душу Сатане и получает от Князя Тьмы все, о чем только мечтал… точнее, почти все.
Теперь светское общество, ранее им пренебрегавшее, лежит у его ног. К его услугам несметное состояние, любовь прекрасной девушки, роскошь и удовольствия.
Но много ли это значит, если утрачено главное, ради чего Джеффри жил, - его талант?.....`,
    instagram: 'DHTlHX_NjrA',
    image: '/books/satana.jpg',
  },
  {
    title: 'Над пропастью во ржи',
    author: 'Джером Д. Сэлинджер',
    month: 'март 2025',
    description: `Писатель-классик, писатель-загадка, на пике своей карьеры объявивший об уходе из литературы и поселившийся в глухой американской провинции вдали от мирских соблазнов. Он ушел от нас совсем недавно - в 2010 году…
Единственный роман Сэлинджера - "Над пропастью во ржи" - стал переломной вехой в истории мировой литературы. Название книги и имя главного героя Холдена Колфилда сделались кодовыми для многих поколений молодых бунтарей от битников и хиппи до представителей современных радикальных молодежных движений.`,
    instagram: 'DH60qOetyho',
    image: '/books/ryecatcher.jpg',
  },
  {
    title: 'Вторая жизнь Уве',
    author: 'Фредрик Бакман',
    month: 'октябрь 2024',
    description: `На первый взгляд Уве – самый угрюмый человек на свете. Он, как и многие из нас, полагает, что его окружают преимущественно идиоты – соседи, которые неправильно паркуют свои машины; продавцы в магазине, говорящие на птичьем языке; бюрократы, портящие жизнь нормальным людям…

Но у угрюмого ворчливого педанта – большое доброе сердце. И когда молодая семья новых соседей случайно повреждает его почтовый ящик, это становится началом невероятно трогательной истории об утраченной любви, неожиданной дружбе, бездомных котах и древнем искусстве сдавать назад на автомобиле с прицепом. Истории о том, как сильно жизнь одного человека может повлиять на жизни многих других.`,
    instagram: 'DCxITcROHLY',
    image: '/books/uve.jpg',
  },
  {
    title: 'Человек, который принял свою жену за шляпу',
    author: 'Оливер Сакс',
    month: 'ноябрь 2024',
    description: '...',
    instagram: 'DCxUPsAtb7u',
    image: '/books/oliver.jpg',
  },
]

const events = [
  {
    title: 'Плетениe Рождественских венков',
    date: '29.11.2024',
    description:
      `✨ Уют, вдохновение и волшебство, созданное своими руками ✨\nНа нашем рождественском воркшопе мы собрались вместе, чтобы создать праздничные венки — каждый неповторимый, наполненный теплом, фантазией и заботой. 🌲💫\n\nБыло много смеха, общения и искренней радости — в этой атмосфере творчество рождалось легко и с любовью. 💖`,
    instagram: 'DDSHA_VNXGK',
    tags: ['Мастер-класс', 'Закрытое мероприятие'],
    images: [
      '/images/wreath-1.jpg', '/images/wreath-2.jpg', '/images/wreath-3.jpg',
      '/images/wreath-4.jpg', '/images/wreath-5.jpg', '/images/wreath-6.jpg',
      '/images/wreath-7.jpg', '/images/wreath-9.jpg', '/images/wreath-8.jpg',
    ],
  },
  {
    title: 'Мадам Баттерфляй',
    date: '13.12.2024',
    description:
      'Поход в Государственную оперу на оперу Джакомо Пуччини "Мадам Баттерфляй". Великолепные декорации, яркие костюмы и трогательная история любви сделали этот вечер незабываемым.',
    instagram: 'DD5EwaqO7Tc',
    tags: ['Культура', 'Закрытое мероприятие'],
    images: [
      '/images/opera-1.jpg', '/images/opera-2.jpg', '/images/opera-3.jpg',
      '/images/opera-4.jpg', '/images/opera-5.jpg', '/images/opera-6.jpg',
    ],
  },
  {
    title: 'Рождество в Дрездене',
    date: '14.12.2024',
    description:
      `Поездка в Дрезден на рождественскую ярмарку. Мы погрузились в атмосферу праздника, насладились местной кухней, купили подарки для близких,       а так же купили на пробу Дубайский шоколад от Lindt.`,
    instagram: 'DEDqgALuBib',
    tags: ['Поездки', 'Закрытое мероприятие'],
    images: [
      '/images/dresden/photo_2025-04-22_13-50-29.jpg',
      '/images/dresden/photo_2025-04-22_13-50-23.jpg',
      '/images/dresden/photo_2025-04-22_13-50-24.jpg',
      '/images/dresden/photo_2025-04-22_13-50-25.jpg',
      '/images/dresden/photo_2025-04-22_13-50-27.jpg',
      '/images/dresden/photo_2025-04-22_13-50-28.jpg',
      '/images/dresden/photo_2025-04-22_13-50-35.jpg',
      '/images/dresden/photo_2025-04-22_13-50-53.jpg',
      '/images/dresden/photo_2025-04-22_13-50-59.jpg',
      '/images/dresden/photo_2025-04-22_13-51-03.jpg',
      '/images/dresden/photo_2025-04-22_13-51-04.jpg',
      '/images/dresden/photo_2025-04-22_13-51-07.jpg',
      '/images/dresden/photo_2025-04-22_13-51-09.jpg',
      '/images/dresden/photo_2025-04-22_13-51-14.jpg',
    ],
  },
  {
    title: `Music quiz "Попса"`,
    date: '24.04.2025',
    description: `В этот вечер мы собрались в уютном кафе, чтобы проверить свои музыкальные знания и посоревноваться в дружеской атмосфере. 🎶💃\n\nКаждый из нас был готов к вызову,
    и мы с удовольствием вспоминали любимые хиты, а так же узнавали новые песни. В этот раз мы заняли 5 место. Однако, мы планируем вернуться и взять реванш!
    💪\n\nСпасибо всем участникам за отличное настроение и незабываемые моменты!`,
    tags: ['Развлечения', 'Закрытое мероприятие'],
    images: ['/images/musicQuizEvent.png'],
  },
]

async function clear(table) {
  const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw new Error(`Failed to clear ${table}: ${error.message}`)
}

async function seed() {
  console.log('Clearing existing content tables…')
  await clear('event_images')
  await clear('events')
  await clear('books')

  console.log(`Inserting ${books.length} books…`)
  const bookRows = books.map(b => ({
    title: b.title,
    author: b.author,
    description: b.description,
    cover_url: b.image,
    read_month: ruMonthToDate(b.month),
    is_current: !!b.is_current,
    instagram_post_id: b.instagram ?? null,
  }))
  const { error: bookErr } = await supabase.from('books').insert(bookRows)
  if (bookErr) throw new Error(`Books insert failed: ${bookErr.message}`)

  console.log(`Inserting ${events.length} events…`)
  for (const ev of events) {
    const { data: inserted, error: evErr } = await supabase
      .from('events')
      .insert({
        title: ev.title,
        description: ev.description,
        event_date: ruDateToISO(ev.date),
        tags: ev.tags,
        is_members_only: ev.tags?.includes('Закрытое мероприятие') ?? true,
        instagram_post_id: ev.instagram ?? null,
        cover_url: ev.images?.[0] ?? null,
      })
      .select('id')
      .single()
    if (evErr) throw new Error(`Event "${ev.title}" insert failed: ${evErr.message}`)

    const imageRows = (ev.images ?? []).map((url, i) => ({
      event_id: inserted.id,
      image_url: url,
      position: i,
    }))
    if (imageRows.length) {
      const { error: imgErr } = await supabase.from('event_images').insert(imageRows)
      if (imgErr) throw new Error(`Event images for "${ev.title}" failed: ${imgErr.message}`)
    }
  }

  console.log('Done.')
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
