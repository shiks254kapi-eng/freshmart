import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'

const MY_ORDERS = [
  { id:'0413', date:'Today, 10:30 AM', items:'Avocados x5, Bananas', total:1200, status:'in_transit', rider:'John Mwangi' },
  { id:'0398', date:'Yesterday, 2:14 PM', items:'Milk x3, Eggs, Bread', total:780, status:'delivered', rider:'Salim Kamau' },
  { id:'0381', date:'12 May, 11:00 AM', items:'Tomatoes, Sukuma Wiki', total:380, status:'delivered', rider:'Aisha Ndungu' },
  { id:'0364', date:'10 May, 9:45 AM', items:'Ugali Flour 2kg, Cooking Oil', total:460, status:'delivered', rider:'Peter Otieno' },
]

export default function Orders() {
  const navigate = useNavigate()

  const statusPill = (status) => {
    const map = {
      delivered: { label: 'Delivered ✓', cls: 'pill-delivered' },
      in_transit: { label: 'On the way 🛵', cls: 'pill-transit' },
      pending: { label: 'Pending ⏳', cls: 'pill-pending' },
    }
    const s = map[status] || map.pending
    return <span className={`pill ${s.cls}`}>{s.label}</span>
  }

  return (
    <div>
      <div style={{ padding:'16px 16px 8px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ fontFamily:'var(--serif)', fontSize:18 }}>My Orders</div>
        <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{MY_ORDERS.length} total orders</div>
      </div>

      <div style={{ height:12 }}></div>

      {MY_ORDERS.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-card-header">
            <div className="order-number">ORD-{order.id}</div>
            {statusPill(order.status)}
          </div>
          <div style={{ fontSize:12, color:'var(--text3)', marginBottom:6 }}>{order.date}</div>
          <div style={{ fontSize:13, color:'var(--text1)', marginBottom:8 }}>{order.items}</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:14, fontWeight:700, color:'var(--g1)' }}>KES {order.total.toLocaleString()}</div>
            {order.status === 'in_transit' && (
              <button
                className="btn btn-primary"
                style={{ fontSize:11, padding:'6px 12px', gap:4 }}
                onClick={() => navigate(`/track/${order.id}`)}
              >
                <MapPin size={13}/> Track Order
              </button>
            )}
          </div>
          {order.status === 'in_transit' && (
            <div style={{ marginTop:10, background:'var(--g5)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'var(--text2)' }}>
              🛵 <strong>{order.rider}</strong> is on the way to you
            </div>
          )}
        </div>
      ))}
    </div>
  )
}