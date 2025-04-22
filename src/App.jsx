import { BookOpen } from "lucide-react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import About from "./pages/About"
import Books from "./pages/Books"
import Calendar from "./pages/Calendar"
import Events from "./pages/Events"
import Contacts from "./pages/Contacts"
import NotFound from "./pages/NotFound"
import FAQ from "./pages/FAQ"




function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand text-brand-text dark:bg-brand-dark dark:text-brand-light">
        {/* Навигация */}
        <Header />


        {/* Контент */}
        <main className="px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/books" element={<Books />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

