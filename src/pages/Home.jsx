import { Instagram } from "lucide-react"

function Home() {
    return (
        <div className="max-w-2xl mx-auto py-12 px-6 text-center">
            <h1 className="text-5xl font-extrabold text-brand-dark mb-4">
                Your Space 💕📚
            </h1>
            <p className="text-lg text-gray-700 max-w-xl mx-auto mb-3 italic">
                We are many voices, one space
            </p>
            <p className="text-xl text-gray-800 mb-6">
                Женское сообщество в Праге — твоё пространство для самовыражения, поддержки и роста.
                Мы читаем, встречаемся, обсуждаем и вдохновляем друг друга.
            </p>

            <a
                href="https://www.instagram.com/community.yourspace/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-brand-dark text-brand-dark px-4 py-2 rounded-xl hover:bg-brand-dark hover:text-white transition"
            >
                <Instagram className="w-5 h-5" />
                Наш Instagram
            </a>

            <div className="mt-4">
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLScu1AP1n_iihe5KNLnAvnqLKSYN6-T72syL-cTzJ2f9lF0FyQ/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-brand-dark text-brand-dark px-4 py-2 rounded-xl hover:bg-brand-dark hover:text-white transition"
                >
                    Хочешь к нам в сообщество? Заполни анкету!
                </a>
            </div>

        </div>
    )
}

export default Home
