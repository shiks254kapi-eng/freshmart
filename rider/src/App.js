import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { Leaf, Home, Package, Clock, BarChart2 } from 'lucide-react'
import HomePage from './pages/Home'
import ActiveOrder from './pages/ActiveOrder'
import History from './pages/History'
import Earnings from './pages/Earnings'
import './index.css'

export default function App() {
  const [online, setOnline] = useState(true)

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ style: { fontSize: 13, borderRadius: 10 } }} />
      <div className="app-shell">

        {/* TOP NAV */}
        <div className="top-nav">
          <div className="logo"><Leaf size={18} /> FreshMart Rider</div>
          <button className="status-toggle" onClick={() => setOnline(o => !o)}>
            <div className={`status-dot ${online ? 'dot-online' : 'dot-offline'}`}></div>
            {online ? 'Online' : 'Offline'}
          </button>
        </div>

        {/* OFFLINE WARNING */}
        {!online && (
          <div className="notif-bar">
            ⚠️ You are offline — you won't receive new orders
          </div>
        )}

        {/* PAGES */}
        <Routes>
          <Route path="/" element={<HomePage online={online} />} />
          <Route path="/active/:orderId" element={<ActiveOrder />} />
          <Route path="/history" element={<History />} />
          <Route path="/earnings" element={<Earnings />} />
        </Routes>

        {/* BOTTOM NAV */}
        <nav className="bottom-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <Home size={22} /> Orders
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
            <Clock size={22} /> History
          </NavLink>
          <NavLink to="/earnings" className={({ isActive }) => isActive ? 'active' : ''}>
            <BarChart2 size={22} /> Earnings
          </NavLink>
        </nav>

      </div>
    </BrowserRouter>
  )
}