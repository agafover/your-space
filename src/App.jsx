import { BookOpen } from "lucide-react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Books from "./pages/Books"
import Calendar from "./pages/Calendar"
import Culture from "./pages/Culture"
import Education from "./pages/Education"
import Events from "./pages/Events"
import Trips from "./pages/Trips"
import Constacts from "./pages/Contacts"
import NotFound from "./pages/NotFound"
import Header from "./components/Header"




function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand text-gray-800">
        {/* Навигация */}
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-brand-dark">Your Space</div>
          <nav className="space-x-4">
            <Link to="/" className="text-brand-dark hover:underline">Главная</Link>
            <Link to="/about" className="hover:underline">О нас</Link>
            <Link to="/books" className="hover:underline">Книжный клуб</Link>
            <Link to="/culture" className="hover:underline">Культура</Link>
            <Link to="/events" className="hover:underline">Мероприятия</Link>
            <Link to="/calendar" className="hover:underline">Календарь</Link>
            <Link to="/education" className="hover:underline">Образование</Link>
            <Link to="/trips" className="hover:underline">Поездки</Link>
            <Link to="/contacts" className="hover:underline">Контакты</Link>
          </nav>

        </header>

        {/* Контент */}
        <main className="px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/books" element={<Books />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/education" element={<Education />} />
            <Route path="/events" element={<Events />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/contacts" element={<Constacts />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

