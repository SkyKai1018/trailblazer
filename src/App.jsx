import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ShoeDetail from './pages/ShoeDetail'
import Admin from './pages/Admin'
import AdminShoeForm from './pages/AdminShoeForm'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shoe/:id" element={<ShoeDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/new" element={<AdminShoeForm />} />
        <Route path="/admin/edit/:id" element={<AdminShoeForm />} />
      </Routes>
    </Router>
  )
}

export default App
