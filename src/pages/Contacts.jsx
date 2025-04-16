function Contacts() {
  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-center">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Контакты</h1>
      <p className="text-lg text-gray-700 mb-4">
        Если хочешь задать вопрос, предложить идею или узнать больше о сообществе —
        напиши нам 💌
      </p>

      <a
        href="mailto:yourmail@example.com"
        className="inline-block mt-4 text-pink-600 hover:underline text-lg"
      >
        📧 community.yourspace@gmail.com
      </a>
    </div>
  )
}

export default Contacts
