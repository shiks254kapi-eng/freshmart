import { CheckCircle } from 'lucide-react'

const HISTORY = [
  { id:'0411', customer:'Brian Omondi', address:'Kilimani', items:'Milk x3, Eggs, Bread', amount:780, earned:100, time:'09:58 AM', date:'Today' },
  { id:'0409', customer:'James Kariuki', address:'Kasarani', items:'Potatoes 3kg, Carrots', amount:620, earned:100, time:'08:45 AM', date:'Today' },
  { id:'0401', customer:'Amina Farah', address:'Karen', items:'Avocado x5, Bananas', amount:1200, earned:100, time:'03:20 PM', date:'Yesterday' },
  { id:'0398', customer:'Peter Njoroge', address:'Westlands', items:'Ugali Flour, Cooking Oil', amount:460, earned:100, time:'01:10 PM', date:'Yesterday' },
  { id:'0385', customer:'Fatuma Hassan', address:'Eastleigh', items:'Sukuma Wiki, Tomatoes', amount:380, earned:100, time:'11:30 AM', date:'12 May' },
]

export default function History() {
  const today = HISTORY.filter(h => h.date === 'Today')
  const yesterday = HISTORY.filter(h => h.date === 'Yesterday')
  const older = HISTORY.filter(h => h.date !== 'Today' && h.date !== 'Yesterday')

  const Section = ({ title, items }) => items.length === 0 ? null : (
    <>
      <div style={{ padding:'10px 16px 6px', fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:1, background:'var(--bg)' }}>
        {title}
      </div>
      {items.map(h => (
        <div key={h.id} className="history-item">
          <div className="history-icon"><CheckCircle size={20}/></div>
          <div className="history-info">
            <div className="history-id">ORD-{h.id} • {h.customer}</div>
            <div className="history-meta">{h.address} • {h.time} • {h.items}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="history-amount">+KES {h.earned}</div>
            <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>KES {h.amount} order</div>
          </div>
        </div>
      ))}
    </>
  )

  return (
    <div>
      <div style={{ padding:'16px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ fontFamily:'var(--serif)', fontSize:18 }}>Delivery History</div>
        <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{HISTORY.length} completed deliveries</div>
      </div>

      {/* SUMMARY */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:16, background:'var(--g5)' }}>
        <div style={{ background:'var(--white)', borderRadius:10, padding:'12px', textAlign:'center', border:'1px solid var(--border)' }}>
          <div style={{ fontSize:10, color:'var(--text3)', fontWeight:600, marginBottom:4 }}>TODAY'S DELIVERIES</div>
          <div style={{ fontSize:22, fontWeight:700, fontFamily:'var(--serif)' }}>{today.length}</div>
        </div>
        <div style={{ background:'var(--white)', borderRadius:10, padding:'12px', textAlign:'center', border:'1px solid var(--border)' }}>
          <div style={{ fontSize:10, color:'var(--text3)', fontWeight:600, marginBottom:4 }}>TODAY'S EARNINGS</div>
          <div style={{ fontSize:22, fontWeight:700, fontFamily:'var(--serif)', color:'var(--g2)' }}>KES {today.length * 100}</div>
        </div>
      </div>

      <Section title="Today" items={today} />
      <Section title="Yesterday" items={yesterday} />
      <Section title="Older" items={older} />
    </div>
  )
}