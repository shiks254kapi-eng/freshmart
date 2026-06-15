import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Phone, Package, User } from 'lucide-react'
import toast from 'react-hot-toast'

const ASSIGNED_ORDERS = [
  {
    id: '0413', time: '10:31 AM', status: 'new',
    customer: 'Grace Wanjiku', phone: '0712345678',
    address: 'Westlands, near Sarit Centre, Apt 4B',
    items: 'Avocados x5, Bananas x1, Rice 2kg',
    amount: 1200, distance: '1.2 km', eta: '8 min',
    payment: 'M-Pesa', paid: true,
  },
  {
    id: '0414', time: '10:45 AM', status: 'new',
    customer: 'Brian Omondi', phone: '0723456789',
    address: 'Kilimani, Mwanzi Road, House 12',
    items: 'Milk x3, Eggs tray, Bread',
    amount: 780, distance: '2.4 km', eta: '15 min',
    payment: 'M-Pesa', paid: true,
  },
]

export default function Home({ online }) {
  const [orders, setOrders] = useState(ASSIGNED_ORDERS)
  const navigate = useNavigate()

  function acceptOrder(id) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'accepted' } : o))
    toast.success('Order accepted! Head to the store to pick up.')
    navigate(`/active/${id}`)
  }

  function rejectOrder(id) {
    setOrders(prev => prev.filter(o => o.id !== id))
    toast.error('Order rejected')
  }

  const todayDeliveries = 18
  const todayEarnings = 1800
  const rating = 4.9

  return (
    <div>
      {/* HERO */}
      <div className="rider-hero">
        <div className="rider-name">Hey, John 👋</div>
        <div className="rider-sub">{online ? '🟢 You are online and receiving orders' : '🔴 Go online to receive orders'}</div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">{todayDeliveries}</div>
            <div className="hero-stat-label">Deliveries</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{rating}</div>
            <div className="hero-stat-label">Rating ⭐</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{todayEarnings}</div>
            <div className="hero-stat-label">KES Today</div>
          </div>
        </div>
      </div>

      {/* NEW ORDERS */}
      <div className="section">
        <div className="section-title">
          {online ? `New Orders (${orders.filter(o => o.status === 'new').length})` : 'Go online to see orders'}
        </div>

        {!online ? (
          <div className="empty">
            <div className="empty-icon">📴</div>
            <h3>You are offline</h3>
            <p>Tap the Online button at the top to start receiving delivery orders</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🛵</div>
            <h3>No new orders</h3>
            <p>New delivery requests will appear here. Stay online!</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-top">
                <div>
                  <div className="order-id">ORD-{order.id}</div>
                  <div className="order-time">{order.time}</div>
                </div>
                <span className={`pill ${order.status === 'new' ? 'pill-new' : 'pill-picked'}`}>
                  {order.status === 'new' ? 'New Order' : 'Accepted'}
                </span>
              </div>

              <div className="order-card-body">
                {/* Customer */}
                <div className="info-row">
                  <User size={16} className="info-icon" />
                  <div>
                    <div className="info-label">CUSTOMER</div>
                    <div className="info-value">{order.customer}</div>
                  </div>
                  <a href={`tel:${order.phone}`} style={{ marginLeft:'auto', background:'var(--g5)', borderRadius:8, padding:'5px 10px', fontSize:12, fontWeight:600, color:'var(--g2)', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
                    <Phone size={13}/> Call
                  </a>
                </div>

                {/* Address */}
                <div className="info-row">
                  <MapPin size={16} className="info-icon" />
                  <div>
                    <div className="info-label">DELIVERY ADDRESS</div>
                    <div className="info-value">{order.address}</div>
                  </div>
                </div>

                {/* Items */}
                <div className="info-row">
                  <Package size={16} className="info-icon" />
                  <div>
                    <div className="info-label">ITEMS</div>
                    <div className="info-value">{order.items}</div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:4 }}>
                  <div style={{ background:'var(--g5)', borderRadius:8, padding:'8px', textAlign:'center' }}>
                    <div style={{ fontSize:10, color:'var(--text3)', fontWeight:600 }}>DISTANCE</div>
                    <div style={{ fontSize:14, fontWeight:700 }}>{order.distance}</div>
                  </div>
                  <div style={{ background:'var(--g5)', borderRadius:8, padding:'8px', textAlign:'center' }}>
                    <div style={{ fontSize:10, color:'var(--text3)', fontWeight:600 }}>ETA</div>
                    <div style={{ fontSize:14, fontWeight:700 }}>{order.eta}</div>
                  </div>
                  <div style={{ background:'var(--g5)', borderRadius:8, padding:'8px', textAlign:'center' }}>
                    <div style={{ fontSize:10, color:'var(--text3)', fontWeight:600 }}>AMOUNT</div>
                    <div style={{ fontSize:14, fontWeight:700 }}>KES {order.amount}</div>
                  </div>
                </div>

                {/* Payment status */}
                <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:6, fontSize:12 }}>
                  <span style={{ color: order.paid ? 'var(--g2)' : 'var(--red)', fontWeight:700 }}>
                    {order.paid ? '✅ M-Pesa Paid' : '⚠️ Payment Pending'}
                  </span>
                </div>
              </div>

              {order.status === 'new' && (
                <div className="order-card-footer">
                  <button className="btn btn-outline" onClick={() => rejectOrder(order.id)}>Reject</button>
                  <button className="btn btn-primary" onClick={() => acceptOrder(order.id)}>Accept Order</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}