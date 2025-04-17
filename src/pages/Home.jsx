import { Instagram } from "lucide-react"

function Home() {
    return (
        <div className="relative text-center py-10 overflow-hidden">
            {/* Адаптивный анимированный круглый фон */}
            <div className="absolute inset-0 flex justify-center items-start z-[-1]">
                <div className="w-[800px] h-[800px] rounded-full bg-brand-dark opacity-10 mt-[-100px]" />
            </div>



            {/* Заголовок */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight flex flex-wrap justify-center gap-2">
                <span className="text-brand-text dark:text-brand-light">Добро пожаловать в</span>
                <span className="text-brand-dark dark:text-brand">Your Space</span>
            </h1>

            <p className="italic text-lg text-brand-dark dark:text-brand-light">
                We are many voices, one space
            </p>

            <p className="text-xl text-brand-text dark: text-brand-circle mb-6">
                Женское сообщество в Праге — твоё пространство для самовыражения, поддержки и роста.
                Мы читаем, встречаемся, обсуждаем и вдохновляем друг друга.
            </p>

            {/* <a
                href="https://www.instagram.com/community.yourspace/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-brand-dark dark:border-brand-light text-brand-dark dark:text-brand-light px-4 py-2 rounded-xl transition 
                hover:bg-brand-dark hover:text-white 
                dark:hover:bg-brand-light dark:hover:text-brand-dark"
            >
                <Instagram className="w-5 h-5" />
                Наш Instagram
            </a> */}  

            <div className="mt-4">
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLScu1AP1n_iihe5KNLnAvnqLKSYN6-T72syL-cTzJ2f9lF0FyQ/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-brand-dark dark:border-brand-light text-brand-dark dark:text-brand-light px-4 py-2 rounded-xl transition 
                hover:bg-brand-dark hover:text-white 
                dark:hover:bg-brand-light dark:hover:text-brand-dark"
                >
                    Хочешь к нам в сообщество? Заполни анкету!
                </a>
            </div>

        </div>
    )
}

export default Home
