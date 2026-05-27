import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import BackToTop from "./components/BackToTop"
import { AuthProvider } from "./lib/AuthContext"
import ProtectedRoute from "./components/admin/ProtectedRoute"

import Home from "./pages/Home"
import About from "./pages/About"
import Books from "./pages/Books"
import Calendar from "./pages/Calendar"
import Events from "./pages/Events"
import Contacts from "./pages/Contacts"
import NotFound from "./pages/NotFound"
import FAQ from "./pages/FAQ"

import AdminLogin from "./pages/admin/AdminLogin"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminBooks from "./pages/admin/AdminBooks"
import AdminEvents from "./pages/admin/AdminEvents"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen overflow-x-hidden bg-brand text-brand-text dark:bg-night dark:text-night-text">
          <Header />
          <main className="px-6 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/books" element={<Books />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/faq" element={<FAQ />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="books" element={<AdminBooks />} />
                <Route path="events" element={<AdminEvents />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <BackToTop />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
