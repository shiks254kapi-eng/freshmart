const WEEKLY = [
  { day:'Mon', deliveries:12, earned:1200 },
  { day:'Tue', deliveries:15, earned:1500 },
  { day:'Wed', deliveries:9, earned:900 },
  { day:'Thu', deliveries:18, earned:1800 },
  { day:'Fri', deliveries:21, earned:2100 },
  { day:'Sat', deliveries:24, earned:2400 },
  { day:'Sun', deliveries:16, earned:1600 },
]

const max = Math.max(...WEEKLY.map(d => d.earned))

export default function Earnings() {
  const totalWeek = WEEKLY.reduce((s, d) => s + d.earned, 0)
  const totalDeliveries = WEEKLY.reduce((s, d) => s + d.deliveries, 0)

  return (
    <div>
      <div style={{ padding:'16px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ fontFamily:'var(--serif)', fontSize:18 }}>My Earnings</div>
        <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>Track your income over time</div>
      </div>

      {/* BIG EARNINGS CARD */}
      <div style={{ padding:16 }}>
        <div className="earnings-card">
          <div className="earnings-label">THIS WEEK'S EARNINGS</div>
          <div className="earnings-amount">KES {totalWeek.toLocaleString()}</div>
          <div className="earnings-grid">
            <div className="earnings-stat">
              <div className="earnings-stat-val">{totalDeliveries}</div>
              <div className="earnings-stat-label">Total Deliveries</div>
            </div>
            <div className="earnings-stat">
              <div className="earnings-stat-val">KES 100</div>
              <div className="earnings-stat-label">Per Delivery</div>
            </div>
            <div className="earnings-stat">
              <div className="earnings-stat-val">4.9 ⭐</div>
              <div className="earnings-stat-label">Your Rating</div>
            </div>
            <div className="earnings-stat">
              <div className="earnings-stat-val">14 min</div>
              <div className="earnings-stat-label">Avg Delivery Time</div>
            </div>
          </div>
        </div>

        {/* BAR CHART */}
        <div style={{ background:'var(--white)', borderRadius:12, border:'1px solid var(--border)', padding:'14px', marginBottom:14 }}>
          <div style={{ fontFamily:'var(--serif)', fontSize:15, marginBottom:4 }}>Daily Breakdown</div>
          <div style={{ fontSize:11, color:'var(--text3)', marginBottom:12 }}>KES earned per day this week</div>
          <div className="bar-chart">
            {WEEKLY.map(d => (
              <div key={d.day} className="bar-col">
                <div style={{ fontSize:9, color:'var(--text3)', fontWeight:600, marginBottom:4 }}>
                  {d.earned >= 2000 ? `${d.earned/1000}k` : d.earned}
                </div>
                <div className="bar" style={{ height:`${(d.earned / max) * 70}px`, background: d.day === 'Sat' ? 'var(--g1)' : 'var(--g3)' }}></div>
                <div className="bar-label">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DAILY BREAKDOWN TABLE */}
        <div style={{ background:'var(--white)', borderRadius:12, border:'1px solid var(--border)', overflow:'hidden' }}>
          <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--g5)', fontWeight:700, fontSize:13 }}>This Week</div>
          {WEEKLY.map((d, i) => (
            <div key={d.day} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', borderBottom: i < WEEKLY.length - 1 ? '1px solid var(--g5)' : 'none', fontSize:13 }}>
              <div>
                <div style={{ fontWeight:600 }}>{d.day}</div>
                <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{d.deliveries} deliveries</div>
              </div>
              <div style={{ fontWeight:700, color:'var(--g2)', fontSize:14 }}>KES {d.earned.toLocaleString()}</div>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 14px', background:'var(--g5)', fontWeight:700, fontSize:14 }}>
            <span>Total</span>
            <span style={{ color:'var(--g1)' }}>KES {totalWeek.toLocaleString()}</span>
          </div>
        </div>

        {/* PAYOUT INFO */}
        <div style={{ marginTop:14, background:'#e3f2fd', borderRadius:12, padding:'14px', border:'1px solid #90caf9' }}>
          <div style={{ fontWeight:700, fontSize:13, color:'#0d47a1', marginBottom:6 }}>💳 Weekly Payout</div>
          <div style={{ fontSize:12, color:'#1565c0', lineHeight:1.6 }}>
            Earnings are paid every <strong>Friday</strong> via M-Pesa to your registered number <strong>0712345678</strong>. Next payout: <strong>Friday 16 May</strong>
          </div>
        </div>
      </div>
    </div>
  )
}