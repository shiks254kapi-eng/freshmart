import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const monthly = [
  { month: 'Jun', revenue: 42000, profit: 15000 }, { month: 'Jul', revenue: 48000, profit: 17500 },
  { month: 'Aug', revenue: 45000, profit: 16000 }, { month: 'Sep', revenue: 54000, profit: 20000 },
  { month: 'Oct', revenue: 61000, profit: 23000 }, { month: 'Nov', revenue: 67000, profit: 25000 },
  { month: 'Dec', revenue: 63000, profit: 23500 }, { month: 'Jan', revenue: 58000, profit: 21000 },
  { month: 'Feb', revenue: 71000, profit: 27000 }, { month: 'Mar', revenue: 76000, profit: 29000 },
  { month: 'Apr', revenue: 79000, profit: 30000 }, { month: 'May', revenue: 84320, profit: 31950 },
]

const categories = [
  { name: 'Vegetables', value: 32000, color: '#2d8a45' },
  { name: 'Dairy', value: 18000, color: '#4caf6b' },
  { name: 'Fruits', value: 14000, color: '#a8e6b8' },
  { name: 'Grains', value: 11000, color: '#f5a623' },
  { name: 'Others', value: 9320, color: '#d4eadb' },
]

const mpesa = [
  { time: '8am', transactions: 12 }, { time: '9am', transactions: 28 },
  { time: '10am', transactions: 35 }, { time: '11am', transactions: 42 },
  { time: '12pm', transactions: 61 }, { time: '1pm', transactions: 78 },
  { time: '2pm', transactions: 54 }, { time: '3pm', transactions: 46 },
  { time: '4pm', transactions: 38 }, { time: '5pm', transactions: 55 },
  { time: '6pm', transactions: 33 }, { time: '7pm', transactions: 18 },
]

export default function Earnings() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Earnings Overview</div>
          <div className="page-sub">Revenue, profit and M-Pesa transaction history</div>
        </div>
        <button className="btn btn-outline">Download Report</button>
      </div>

      {/* TOP STATS */}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        <div className="stat-card"><div className="stat-label">This Month Revenue</div><div className="stat-value">84,320</div><div className="stat-change up">↑ 12% vs April</div></div>
        <div className="stat-card"><div className="stat-label">Net Profit</div><div className="stat-value">31,950</div><div className="stat-change up">38% margin</div></div>
        <div className="stat-card"><div className="stat-label">M-Pesa Received</div><div className="stat-value">84,320</div><div className="stat-change up">247 transactions</div></div>
        <div className="stat-card"><div className="stat-label">Avg Order Value</div><div className="stat-value">KES 341</div><div className="stat-change up">↑ KES 28 vs last month</div></div>
      </div>

      {/* REVENUE vs PROFIT CHART */}
      <div className="card mb-16">
        <div className="card-header"><div className="card-title">Revenue vs Profit — 12 Months</div></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" tick={{fontSize:11}}/>
              <YAxis tick={{fontSize:11}} tickFormatter={v=>`${v/1000}k`}/>
              <Tooltip formatter={(v)=>`KES ${v.toLocaleString()}`}/>
              <Bar dataKey="revenue" name="Revenue" fill="#4caf6b" radius={[4,4,0,0]}/>
              <Bar dataKey="profit" name="Profit" fill="#1a5c2a" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-12 mt-16" style={{justifyContent:'center'}}>
            <div className="flex gap-8" style={{alignItems:'center'}}><div style={{width:12,height:12,borderRadius:3,background:'#4caf6b'}}></div><span style={{fontSize:12,color:'var(--text2)'}}>Revenue</span></div>
            <div className="flex gap-8" style={{alignItems:'center'}}><div style={{width:12,height:12,borderRadius:3,background:'#1a5c2a'}}></div><span style={{fontSize:12,color:'var(--text2)'}}>Profit</span></div>
          </div>
        </div>
      </div>

      {/* PIE + MPESA */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Revenue by Category</div></div>
          <div className="card-body" style={{display:'flex',alignItems:'center',gap:20}}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={categories} cx={75} cy={75} innerRadius={45} outerRadius={75} dataKey="value">
                  {categories.map((c,i) => <Cell key={i} fill={c.color}/>)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
              {categories.map(c => (
                <div key={c.name} className="flex-between" style={{fontSize:12}}>
                  <div className="flex gap-8" style={{alignItems:'center'}}>
                    <div style={{width:10,height:10,borderRadius:2,background:c.color,flexShrink:0}}></div>
                    <span>{c.name}</span>
                  </div>
                  <span style={{fontWeight:700}}>KES {c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">M-Pesa Transactions Today</div>
            <div className="mpesa-logo"><span>M-PESA</span></div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={mpesa}>
                <XAxis dataKey="time" tick={{fontSize:10}}/>
                <YAxis tick={{fontSize:10}}/>
                <Tooltip/>
                <Line type="monotone" dataKey="transactions" stroke="#2d8a45" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
            <div style={{marginTop:12,background:'var(--g5)',borderRadius:8,padding:'10px 14px',display:'flex',justifyContent:'space-between'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:10,color:'var(--text3)',fontWeight:600}}>TOTAL TODAY</div>
                <div style={{fontSize:18,fontWeight:700,fontFamily:'var(--serif)'}}>KES 12,450</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:10,color:'var(--text3)',fontWeight:600}}>TRANSACTIONS</div>
                <div style={{fontSize:18,fontWeight:700,fontFamily:'var(--serif)'}}>28</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:10,color:'var(--text3)',fontWeight:600}}>FAILED</div>
                <div style={{fontSize:18,fontWeight:700,fontFamily:'var(--serif)',color:'var(--red)'}}>2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}