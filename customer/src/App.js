import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { Leaf, ShoppingCart, Home, ClipboardList, MapPin } from 'lucide-react'
import HomePage from './pages/Home'
import CartPage from './pages/Cart'
import OrdersPage from './pages/Orders'
import TrackOrder from './pages/TrackOrder'
import './index.css'

export default function App() {
  // Cart state lives here so all pages can share it
  const [cart, setCart] = useState([])

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  function updateQty(id, qty) {
    if (qty === 0) setCart(prev => prev.filter(i => i.id !== id))
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  function clearCart() { setCart([]) }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ style: { fontSize: 13, borderRadius: 10 } }} />
      <div className="app-shell">

        {/* TOP NAV */}
        <div className="top-nav">
          <div className="logo"><Leaf size={18} /> FreshMart</div>
          <div className="top-nav-right">
            <NavLink to="/cart" className="cart-btn" style={{ textDecoration: 'none' }}>
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </NavLink>
          </div>
        </div>

        {/* PAGES */}
        <Routes>
          <Route path="/" element={<HomePage cart={cart} addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} updateQty={updateQty} clearCart={clearCart} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/track/:orderId" element={<TrackOrder />} />
        </Routes>

        {/* BOTTOM NAV */}
        <nav className="bottom-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <Home size={22} /> Home
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>
            <ShoppingCart size={22} /> Cart {cartCount > 0 && `(${cartCount})`}
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
            <ClipboardList size={22} /> My Orders
          </NavLink>
          <NavLink to="/track/latest" className={({ isActive }) => isActive ? 'active' : ''}>
            <MapPin size={22} /> Track
          </NavLink>
        </nav>

      </div>
    </BrowserRouter>
  )
}