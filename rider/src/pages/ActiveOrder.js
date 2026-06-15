import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, CheckCircle, Package } from 'lucide-react'
import toast from 'react-hot-toast'

const ORDER = {
  id: '0413', customer: 'Grace Wanjiku', phone: '0712345678',
  address: 'Westlands, near Sarit Centre, Apt 4B',
  items: 'Avocados x5, Bananas x1, Rice 2kg',
  amount: 1200, paid: true,
}

const STEPS = [
  { id: 'store', label: 'Go to Store', desc: 'Pick up the items', icon: '🏪' },
  { id: 'picked', label: 'Items Picked Up', desc: 'Confirm you have the order', icon: '📦' },
  { id: 'delivering', label: 'On the Way', desc: 'Heading to customer', icon: '🛵' },
  { id: 'delivered', label: 'Delivered', desc: 'Hand over to customer', icon: '✅' },
]

export default function ActiveOrder() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  function nextStep() {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
      const messages = [
        'Heading to store to pick up order!',
        'Items picked up! Heading to customer.',
        'Almost there! Customer has been notified.',
      ]
      toast.success(messages[step])
    } else {
      setDone(true)
      toast.success('🎉 Delivery completed! KES 100 earned.')
    }
  }

  if (done) {
    return (
      <div className="empty" style={{ paddingTop: 80 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h3>Delivery Complete!</h3>
        <p style={{ marginBottom: 8 }}>ORD-{orderId} delivered successfully</p>
        <p style={{ color:'var(--g2)', fontWeight:700, fontSize:16, marginBottom:24 }}>+KES 100 added to your earnings</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Orders</button>
      </div>
    )
  }

  return (
    <div>
      {/* BACK */}
      <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={() => navigate('/')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, color:'var(--g2)', fontWeight:600, fontSize:13 }}>
          <ArrowLeft size={18}/> Orders
        </button>
        <span style={{ fontSize:13, fontWeight:700, color:'var(--text1)' }}>ORD-{orderId}</span>
      </div>

      {/* PROGRESS BAR */}
      <div style={{ padding:'14px 16px', background:'var(--g5)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1 }}>
              <div style={{
                width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                background: i < step ? 'var(--g2)' : i === step ? 'var(--accent)' : 'var(--border)',
                color: i <= step ? '#fff' : 'var(--text3)', fontSize:13, fontWeight:700, transition:'all .3s'
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <div style={{ fontSize:9, fontWeight:600, color: i === step ? 'var(--g2)' : 'var(--text3)', textAlign:'center' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height:4, background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', background:'var(--g2)', borderRadius:2, width:`${(step / (STEPS.length-1)) * 100}%`, transition:'width .4s' }}></div>
        </div>
      </div>

      <div className="section">
        {/* CURRENT STEP */}
        <div style={{ background:'var(--g1)', borderRadius:14, padding:'16px', marginBottom:14, textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:8 }}>{STEPS[step].icon}</div>
          <div style={{ fontFamily:'var(--serif)', fontSize:18, color:'#fff', marginBottom:4 }}>{STEPS[step].label}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.7)' }}>{STEPS[step].desc}</div>
        </div>

        {/* MAP */}
        <div className="map-mock">
          <div className="map-grid"></div>
          <svg style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline points="50,50 65,35 72,28" stroke="#f5a623" strokeWidth="1.5" fill="none" strokeDasharray="3,2" opacity=".8"/>
            <polyline points="50,50 30,62 22,70" stroke="#1565c0" strokeWidth="1.5" fill="none" strokeDasharray="3,2" opacity=".8"/>
          </svg>
          <div className="map-pin" style={{ top:'48%', left:'48%', transform:'translate(-50%,-50%)' }}>
            <div className="pin-dot" style={{ background:'#1a5c2a' }}></div>
            <div className="pin-label" style={{ color:'#1a5c2a' }}>Store</div>
          </div>
          <div className="map-pin" style={{ top:'28%', left:'65%' }}>
            <div className="pin-dot" style={{ background:'#f5a623' }}></div>
            <div className="pin-label" style={{ color:'#e65100' }}>You 🛵</div>
          </div>
          <div className="map-pin" style={{ top:'65%', left:'22%' }}>
            <div className="pin-dot" style={{ background:'#1565c0' }}></div>
            <div className="pin-label" style={{ color:'#1565c0' }}>Customer</div>
          </div>
        </div>

        {/* ORDER DETAILS */}
        <div style={{ background:'var(--g5)', borderRadius:12, padding:'14px', marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>{ORDER.customer}</div>
            <a href={`tel:${ORDER.phone}`} style={{ background:'var(--g2)', color:'#fff', borderRadius:8, padding:'6px 12px', fontSize:12, fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
              <Phone size={13}/> Call
            </a>
          </div>
          <div style={{ fontSize:12, color:'var(--text2)', display:'flex', alignItems:'flex-start', gap:6, marginBottom:8 }}>
            <MapPin size={14} style={{ flexShrink:0, marginTop:1, color:'var(--g2)' }}/> {ORDER.address}
          </div>
          <div style={{ fontSize:12, color:'var(--text2)', display:'flex', alignItems:'flex-start', gap:6, marginBottom:10 }}>
            <Package size={14} style={{ flexShrink:0, marginTop:1, color:'var(--g2)' }}/> {ORDER.items}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid var(--border)' }}>
            <span style={{ fontSize:13, color:'var(--text2)' }}>Order Total</span>
            <div>
              <span style={{ fontWeight:700, fontSize:15, color:'var(--g1)' }}>KES {ORDER.amount}</span>
              <span style={{ fontSize:11, color:'var(--g2)', marginLeft:8 }}>✅ Paid</span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <button className="btn btn-primary" style={{ width:'100%', padding:'14px', fontSize:15 }} onClick={nextStep}>
          {step === 0 && '🏪 I\'m at the Store — Pick Up Items'}
          {step === 1 && '📦 Items Picked Up — Start Delivery'}
          {step === 2 && '🛵 I\'m on the Way'}
          {step === 3 && '✅ Confirm Delivery Complete'}
        </button>

        {/* REPORT PROBLEM */}
        <button style={{ width:'100%', background:'none', border:'none', padding:'12px', fontSize:13, color:'var(--text3)', cursor:'pointer', marginTop:4 }}
          onClick={() => toast('Problem reported to admin', { icon:'⚠️' })}>
          ⚠️ Report a problem with this order
        </button>
      </div>
    </div>
  )
}