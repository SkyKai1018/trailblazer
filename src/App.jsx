import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { trackPageView } from './utils/analytics'
import Home from './pages/Home'
import ShoeDetail from './pages/ShoeDetail'
import ShoeDetailEnhanced from './pages/ShoeDetailEnhanced'
import Admin from './pages/Admin'
import AdminShoeForm from './pages/AdminShoeForm'

// 追蹤路由變更的組件
function PageTracker() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname + location.search)
  }, [location])

  return null
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <PageTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shoe/:id" element={<ShoeDetail />} />
        <Route path="/shoe/:id/enhanced" element={<ShoeDetailEnhanced />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/new" element={<AdminShoeForm />} />
        <Route path="/admin/edit/:id" element={<AdminShoeForm />} />
      </Routes>
    </Router>
  )
}

export default App
