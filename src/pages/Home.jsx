function Home() {
    return (
        <div className="text-center py-10">
            {/* Главная секция */}
            <main className="flex flex-col items-center justify-center text-center px-6 py-16">
                <h1 className="text-5xl font-extrabold text-pink-700 mb-4">
                    Your Space 💕📚
                </h1>
                <p className="text-lg text-gray-700 max-w-xl mb-3 italic">
                    We are many voices, one space
                </p>
                <p className="text-xl text-gray-800 max-w-xl mb-6">
                    Женское сообщество в Праге — твоё пространство для самовыражения, поддержки и роста.
                    Мы читаем, встречаемся, обсуждаем и вдохновляем друг друга.
                </p>
                <a
                    href="forms.gle/Wvv3ZXb2DomyVJS77"
                    target="_blank"
                    className="inline-block bg-brand-dark text-white border-2 border-brand-dark px-6 py-3 rounded-2xl hover:bg-brand-light hover:border-brand-light transition font-medium"        >
                    <span className="ml-2">➤</span>  Заполни анкету, чтобы присоединиться к нам!

                </a>
            </main>
        </div>
    )
}

export default Home
