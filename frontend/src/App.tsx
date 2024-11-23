import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'
import TopNav from './pages/TopNav'
import Footer from './pages/Footer'
import Pricing from './pages/Pricing'
import Questions from './pages/Questions'
import MainAppPage from './pages/MainAppPage'
import Analytics from './pages/PageAnalytics'

function App() {
  return (
    <Router>
      <TopNav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/app" element={<MainAppPage />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
