import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { supabase } from '../supabaseClient'
import { ShoppingCart, TrendingUp, AlertTriangle, Bike, Star, Package } from 'lucide-react'

const weeklyData = [
  { day: 'Mon', sales: 12400 }, { day: 'Tue', sales: 18200 },
  { day: 'Wed', sales: 9800 },  { day: 'Thu', sales: 24100 },
  { day: 'Fri', sales: 21300 }, { day: 'Sat', sales: 31200 },
  { day: 'Sun', sales: 16400 },
]

const monthlyData = [
  { month: 'Jun', sales: 42000 }, { month: 'Jul', sales: 48000 },
  { month: 'Aug', sales: 45000 }, { month: 'Sep', sales: 54000 },
  { month: 'Oct', sales: 61000 }, { month: 'Nov', sales: 67000 },
  { month: 'Dec', sales: 63000 }, { month: 'Jan', sales: 58000 },
  { month: 'Feb', sales: 71000 }, { month: 'Mar', sales: 76000 },
  { month: 'Apr', sales: 79000 }, { month: 'May', sales: 84320 },
]

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, outOfStock: 0, riders: 5, satisfaction: 4.7 })

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [])

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*, customers(name), riders(name)')
      .order('created_at', { ascending: false })
      .limit(5)
    if (data) setOrders(data)
  }

  async function fetchStats() {
    const { data: ordersData } = await supabase.from('orders').select('total_amount, status')
    const { data: stockData } = await supabase.from('products').select('stock_quantity').eq('stock_quantity', 0)
    if (ordersData) {
      const revenue = ordersData.reduce((sum, o) => sum + (o.total_amount || 0), 0)
      setStats(s => ({ ...s, totalOrders: ordersData.length, revenue, outOfStock: stockData?.length || 0 }))
    }
  }

  const statusPill = (status) => {
    const map = { delivered: 'pill-delivered', in_transit: 'pill-transit', pending: 'pill-pending', cancelled: 'pill-cancelled' }
    const label = { delivered: 'Delivered', in_transit: 'In Transit', pending: 'Pending', cancelled: 'Cancelled' }
    return <span className={`pill ${map[status] || 'pill-pending'}`}>{label[status] || status}</span>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Good morning, Admin 🌿</div>
          <div className="page-sub">Nairobi • {new Date().toDateString()}</div>
        </div>
        <div className="flex gap-8">
          <button className="btn btn-outline">Export Report</button>
          <button className="btn btn-primary">+ New Order</button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label flex gap-8"><ShoppingCart size={14} /> Total Orders</div>
          <div className="stat-value">{stats.totalOrders || 247}</div>
          <div className="stat-change up">↑ 18% this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label flex gap-8"><TrendingUp size={14} /> Revenue (KES)</div>
          <div className="stat-value">{(stats.revenue || 84320).toLocaleString()}</div>
          <div className="stat-change up">↑ 12% this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label flex gap-8"><TrendingUp size={14} /> Net Profit</div>
          <div className="stat-value">31,950</div>
          <div className="stat-change up">Margin: 38%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label flex gap-8"><AlertTriangle size={14} /> Out of Stock</div>
          <div className="stat-value">{stats.outOfStock || 3}</div>
          <div className="stat-change down">↑ 1 since yesterday</div>
        </div>
        <div className="stat-card">
          <div className="stat-label flex gap-8"><Star size={14} /> Satisfaction</div>
          <div className="stat-value">{stats.satisfaction}</div>
          <div className="stat-change up">Based on 89 reviews</div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid-2 mb-16">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Weekly Sales (KES)</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `KES ${v.toLocaleString()}`} />
                <Bar dataKey="sales" fill="#2d8a45" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">12-Month Growth</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `KES ${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="sales" stroke="#2d8a45" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="card mb-16">
        <div className="card-header">
          <div className="card-title"><ShoppingCart size={16} /> Recent Orders</div>
          <button className="btn btn-outline" style={{fontSize:'11px',padding:'4px 10px'}}>View all</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Rider</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map(o => (
                <tr key={o.id}>
                  <td style={{fontWeight:600}}>ORD-{String(o.id).padStart(4,'0')}</td>
                  <td>{o.customers?.name || 'Grace Wanjiku'}</td>
                  <td className="text-muted">{o.items || 'Tomatoes, Kales'}</td>
                  <td style={{fontWeight:700}}>KES {(o.total_amount||450).toLocaleString()}</td>
                  <td>{o.riders?.name || 'John M.'}</td>
                  <td>{statusPill(o.status || 'pending')}</td>
                  <td className="text-muted">{new Date(o.created_at).toLocaleTimeString()}</td>
                </tr>
              )) : (
                // Sample rows when database is empty
                [
                  {id:'0412',customer:'Grace Wanjiku',items:'Tomatoes, Kales, Onions',amount:'450',rider:'John M.',status:'in_transit',time:'10:24 AM'},
                  {id:'0411',customer:'Brian Omondi',items:'Milk x3, Eggs, Bread',amount:'780',rider:'Salim K.',status:'delivered',time:'09:58 AM'},
                  {id:'0410',customer:'Amina Farah',items:'Avocado x5, Bananas',amount:'1,200',rider:'Aisha N.',status:'pending',time:'09:30 AM'},
                  {id:'0409',customer:'James Kariuki',items:'Potatoes 3kg, Carrots',amount:'620',rider:'Peter O.',status:'delivered',time:'08:45 AM'},
                ].map(o => (
                  <tr key={o.id}>
                    <td style={{fontWeight:600}}>ORD-{o.id}</td>
                    <td>{o.customer}</td>
                    <td className="text-muted">{o.items}</td>
                    <td style={{fontWeight:700}}>KES {o.amount}</td>
                    <td>{o.rider}</td>
                    <td>{statusPill(o.status)}</td>
                    <td className="text-muted">{o.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM ROW — Top Products + Profit */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title"><Package size={16}/> Top Selling Products</div></div>
          <div className="card-body" style={{padding:'10px 18px'}}>
            {[
              {rank:1,name:'Avocados',units:124,amount:'6,200',pct:100},
              {rank:2,name:'Sukuma Wiki',units:98,amount:'2,940',pct:79},
              {rank:3,name:'Milk 500ml',units:87,amount:'5,220',pct:70},
              {rank:4,name:'Eggs (tray)',units:64,amount:'7,680',pct:52},
              {rank:5,name:'Ugali Flour 2kg',units:51,amount:'4,590',pct:41},
            ].map(p => (
              <div key={p.rank} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid var(--g5)'}}>
                <div style={{width:22,height:22,borderRadius:'50%',background:p.rank===1?'#fef3c7':'var(--g5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:p.rank===1?'#92400e':'var(--g2)',flexShrink:0}}>{p.rank}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600}}>{p.name}</div>
                  <div style={{fontSize:10,color:'var(--text3)'}}>{p.units} units sold</div>
                  <div className="progress-wrap"><div className="progress-fill" style={{width:`${p.pct}%`,background:'var(--g3)'}}></div></div>
                </div>
                <div style={{fontSize:12,fontWeight:700}}>KES {p.amount}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="card">
            <div className="card-header"><div className="card-title">Profit Breakdown</div></div>
            <div className="card-body" style={{padding:'10px 18px'}}>
              {[
                {label:'Gross Revenue',value:'KES 84,320',color:'var(--text1)'},
                {label:'Cost of Goods',value:'− KES 45,130',color:'var(--red)'},
                {label:'Delivery Costs',value:'− KES 7,240',color:'var(--red)'},
              ].map(r => (
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--g5)',fontSize:13}}>
                  <span style={{color:'var(--text2)'}}>{r.label}</span>
                  <span style={{fontWeight:700,color:r.color}}>{r.value}</span>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0 4px',fontSize:14,borderTop:'2px solid var(--g3)',marginTop:4}}>
                <span style={{fontWeight:700}}>Net Profit</span>
                <span style={{fontWeight:700,color:'var(--g2)',fontSize:16}}>KES 31,950</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title"><CreditCardIcon/> M-Pesa Today</div></div>
            <div className="card-body">
              <div className="grid-2" style={{gap:10}}>
                <div style={{background:'var(--g5)',borderRadius:8,padding:12,textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text3)',fontWeight:600,marginBottom:4}}>TODAY</div>
                  <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--serif)'}}>12,450</div>
                  <div style={{fontSize:10,color:'var(--g2)'}}>28 transactions</div>
                </div>
                <div style={{background:'var(--g5)',borderRadius:8,padding:12,textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text3)',fontWeight:600,marginBottom:4}}>THIS MONTH</div>
                  <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--serif)'}}>84,320</div>
                  <div style={{fontSize:10,color:'var(--g2)'}}>247 transactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreditCardIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
}