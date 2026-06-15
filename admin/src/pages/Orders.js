import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import toast from 'react-hot-toast'
import { Plus, Search, X } from 'lucide-react'

const SAMPLE_ORDERS = [
  { id: 412, customer: 'Grace Wanjiku', phone: '0712345678', items: 'Tomatoes, Kales, Onions', amount: 450, rider: 'John M.', status: 'in_transit', zone: 'Westlands', time: '10:24 AM', payment: 'mpesa' },
  { id: 411, customer: 'Brian Omondi', phone: '0723456789', items: 'Milk x3, Eggs, Bread', amount: 780, rider: 'Salim K.', status: 'delivered', zone: 'Kilimani', time: '09:58 AM', payment: 'mpesa' },
  { id: 410, customer: 'Amina Farah', phone: '0734567890', items: 'Avocado x5, Bananas, Rice 2kg', amount: 1200, rider: 'Aisha N.', status: 'pending', zone: 'Karen', time: '09:30 AM', payment: 'mpesa' },
  { id: 409, customer: 'James Kariuki', phone: '0745678901', items: 'Potatoes 3kg, Carrots, Garlic', amount: 620, rider: 'Peter O.', status: 'delivered', zone: 'Kasarani', time: '08:45 AM', payment: 'mpesa' },
  { id: 408, customer: 'Fatuma Hassan', phone: '0756789012', items: 'Sukuma Wiki x4, Tomatoes', amount: 380, rider: 'John M.', status: 'cancelled', zone: 'Eastleigh', time: '08:12 AM', payment: 'cash' },
]

const STATUS_OPTIONS = ['all', 'pending', 'in_transit', 'delivered', 'cancelled']

export default function Orders() {
  const [orders, setOrders] = useState(SAMPLE_ORDERS)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*, customers(name,phone), riders(name)').order('created_at', { ascending: false })
    if (data && data.length > 0) setOrders(data)
  }

  async function updateStatus(orderId, status) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (!error) {
      toast.success('Order status updated!')
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      setShowModal(false)
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      toast.success('Status updated (demo mode)')
      setShowModal(false)
    }
  }

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = (o.customer || o.customers?.name || '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const statusPill = (status) => {
    const map = { delivered: 'pill-delivered', in_transit: 'pill-transit', pending: 'pill-pending', cancelled: 'pill-cancelled' }
    const label = { delivered: 'Delivered', in_transit: 'In Transit', pending: 'Pending', cancelled: 'Cancelled' }
    return <span className={`pill ${map[status] || 'pill-pending'}`}>{label[status] || status}</span>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Orders</div>
          <div className="page-sub">Manage and track all customer orders</div>
        </div>
        <button className="btn btn-primary"><Plus size={16}/> New Order</button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-8 mb-16" style={{flexWrap:'wrap'}}>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)} className="btn" style={{
            background: filter === s ? 'var(--g2)' : 'var(--white)',
            color: filter === s ? '#fff' : 'var(--text2)',
            border: '1.5px solid var(--border)',
            textTransform: 'capitalize',
            fontSize: 12,
            padding: '6px 14px'
          }}>{s === 'in_transit' ? 'In Transit' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="search-bar">
        <Search size={16} color="var(--text3)" />
        <input placeholder="Search by customer name..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Phone</th><th>Items</th>
                <th>Amount</th><th>Zone</th><th>Rider</th><th>Payment</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td style={{fontWeight:600}}>ORD-{String(o.id).padStart(4,'0')}</td>
                  <td>{o.customer || o.customers?.name}</td>
                  <td className="text-muted">{o.phone || o.customers?.phone}</td>
                  <td className="text-muted" style={{maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.items}</td>
                  <td style={{fontWeight:700}}>KES {(o.amount || o.total_amount || 0).toLocaleString()}</td>
                  <td className="text-muted">{o.zone}</td>
                  <td>{o.rider || o.riders?.name}</td>
                  <td><span className="pill pill-ok">{o.payment || 'M-Pesa'}</span></td>
                  <td>{statusPill(o.status)}</td>
                  <td>
                    <button className="btn btn-outline" style={{fontSize:11,padding:'4px 10px'}}
                      onClick={() => { setSelectedOrder(o); setNewStatus(o.status); setShowModal(true) }}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE STATUS MODAL */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Update Order ORD-{String(selectedOrder.id).padStart(4,'0')}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <p style={{fontSize:13,color:'var(--text2)',marginBottom:16}}>Customer: <strong>{selectedOrder.customer || selectedOrder.customers?.name}</strong></p>
            <p style={{fontSize:13,color:'var(--text2)',marginBottom:16}}>Items: {selectedOrder.items}</p>
            <div className="form-group">
              <label>Update Status</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex gap-8" style={{justifyContent:'flex-end',marginTop:8}}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => updateStatus(selectedOrder.id, newStatus)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}