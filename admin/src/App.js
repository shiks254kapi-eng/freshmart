import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LayoutDashboard, ShoppingCart, Package, Bike, BarChart2, CreditCard, Users, Settings, Leaf, Bell, ChevronDown } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Stock from './pages/Stock'
import Riders from './pages/Riders'
import Earnings from './pages/Earnings'
import Products from './pages/Products'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="app">

        {/* TOP BAR */}
        <div className="topbar">
          <div className="logo">
            <Leaf size={20} />
            FreshMart Admin
          </div>
          <div className="topbar-right">
            <button className="notif-btn">
              <Bell size={18} />
              <span className="badge">4</span>
            </button>
            <div className="user-chip">
              <div className="avatar">AM</div>
              <span>Admin</span>
              <ChevronDown size={14} color="#fff" />
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="nav-section">Main</div>
          <NavLink to="/" end className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/orders" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <ShoppingCart size={18} /> Orders <span className="nav-badge">12</span>
          </NavLink>
          <NavLink to="/stock" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <Package size={18} /> Stock Taking
          </NavLink>
          <NavLink to="/riders" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <Bike size={18} /> Riders
          </NavLink>

          <div className="nav-section">Finance</div>
          <NavLink to="/earnings" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <BarChart2 size={18} /> Earnings
          </NavLink>
          <NavLink to="/mpesa" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <CreditCard size={18} /> M-Pesa
          </NavLink>

          <div className="nav-section">Store</div>
          <NavLink to="/products" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <Users size={18} /> Products
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <Settings size={18} /> Settings
          </NavLink>
        </div>

        {/* PAGE CONTENT */}
        <div className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/riders" element={<Riders />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  )
}