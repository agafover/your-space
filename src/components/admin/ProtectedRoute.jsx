import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../lib/AuthContext"

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-brand-text dark:text-night-text">
        Загрузка…
      </div>
    )
  }
  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return children
}

export default ProtectedRoute
