import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminDashboardWithRoutes from './pages/AdminDashboardWithRoutes'

function App() {
  // GitHub Pages 배포를 위한 basename 설정
  const basename = process.env.NODE_ENV === 'production' ? '/edutext-pro-korean-learning' : '/'
  
  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboardWithRoutes />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App