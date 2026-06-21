import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const STEPS = [
    { icon: '✅', title: 'Order Confirmed', time: '10:31 AM', status: 'done' },
    { icon: '📦', title: 'Being Packed', time: '10:38 AM', status: 'done' },
    { icon: '🛵', title: 'Rider Picked Up', time: '10:45 AM', status: 'active' },
    { icon: '🏠', title: 'Delivered', time: 'ETA 11:05 AM', status: 'waiting' },
]

export default function TrackOrder() {
    const { orderId } = useParams()
    const navigate = useNavigate()

    return ( <
        div > { /* BACK BUTTON */ } <
        div style = {
            { padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)' } } >
        <
        button onClick = {
            () => navigate(-1) }
        style = {
            { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--g2)', fontWeight: 600, fontSize: 13 } } >
        <
        ArrowLeft size = { 18 }
        /> Back <
        /button> <
        /div>

        { /* ORDER HEADER */ } <
        div className = "track-card" >
        <
        div className = "track-header" >
        <
        div className = "track-id" > ORD - { orderId === 'latest' ? '0413' : orderId } < /div> <
        div className = "track-status" > On the way🛵 < /div> <
        div style = {
            { fontSize: 12, color: 'var(--g4)', marginTop: 4 } } > Rider: John Mwangi• 0712345678 < /div> <
        /div>

        { /* LIVE MAP */ } <
        div className = "map-mock" >
        <
        div className = "map-grid" > < /div> <
        svg style = {
            { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } }
        viewBox = "0 0 100 100"
        preserveAspectRatio = "none" >
        <
        polyline points = "50,50 65,35 72,28"
        stroke = "#f5a623"
        strokeWidth = "1.5"
        fill = "none"
        strokeDasharray = "3,2"
        opacity = ".8" / >
        <
        polyline points = "50,50 30,62 22,70"
        stroke = "#1565c0"
        strokeWidth = "1.5"
        fill = "none"
        strokeDasharray = "3,2"
        opacity = ".8" / >
        <
        /svg> { /* Store pin */ } <
        div className = "map-pin"
        style = {
            { top: '48%', left: '48%', transform: 'translate(-50%,-50%)' } } >
        <
        div className = "pin-dot"
        style = {
            { background: '#1a5c2a' } } > < /div> <
        div className = "pin-label"
        style = {
            { color: '#1a5c2a' } } > Store < /div> <
        /div> { /* Rider pin */ } <
        div className = "map-pin"
        style = {
            { top: '28%', left: '65%' } } >
        <
        div className = "pin-dot"
        style = {
            { background: '#f5a623' } } > < /div> <
        div className = "pin-label"
        style = {
            { color: '#e65100' } } > Rider🛵 < /div> <
        /div> { /* Customer pin */ } <
        div className = "map-pin"
        style = {
            { top: '65%', left: '22%' } } >
        <
        div className = "pin-dot"
        style = {
            { background: '#1565c0' } } > < /div> <
        div className = "pin-label"
        style = {
            { color: '#1565c0' } } > You📍 < /div> <
        /div> <
        /div>

        { /* ETA BAR */ } <
        div style = {
            { display: 'flex', gap: 0, borderTop: '1px solid var(--border)' } } >
        <
        div style = {
            { flex: 1, padding: '12px 14px', textAlign: 'center', borderRight: '1px solid var(--border)' } } >
        <
        div style = {
            { fontSize: 10, color: 'var(--text3)', fontWeight: 600, marginBottom: 4 } } > DISTANCE < /div> <
        div style = {
            { fontSize: 16, fontWeight: 700, fontFamily: 'var(--serif)' } } > 1.2 km < /div> <
        /div> <
        div style = {
            { flex: 1, padding: '12px 14px', textAlign: 'center', borderRight: '1px solid var(--border)' } } >
        <
        div style = {
            { fontSize: 10, color: 'var(--text3)', fontWeight: 600, marginBottom: 4 } } > ETA < /div> <
        div style = {
            { fontSize: 16, fontWeight: 700, fontFamily: 'var(--serif)', color: 'var(--g2)' } } > 8 min < /div> <
        /div> <
        div style = {
            { flex: 1, padding: '12px 14px', textAlign: 'center' } } >
        <
        div style = {
            { fontSize: 10, color: 'var(--text3)', fontWeight: 600, marginBottom: 4 } } > RIDER < /div> <
        div style = {
            { fontSize: 13, fontWeight: 700 } } > John M. < /div> <
        /div> <
        /div> <
        /div>

        { /* TRACKING STEPS */ } <
        div style = {
            { padding: '16px 16px 0' } } >
        <
        div style = {
            { fontFamily: 'var(--serif)', fontSize: 16, marginBottom: 14 } } > Delivery Progress < /div> <
        /div>

        <
        div style = {
            { margin: '0 16px' } } > {
            STEPS.map((step, i) => ( <
                    div key = { i }
                    className = "step" > {
                        i < STEPS.length - 1 && < div className = "step-line" > < /div>} <
                        div className = { `step-dot ${step.status}` } > { step.status === 'done' ? '✓' : step.status === 'active' ? '●' : '○' } <
                        /div> <
                        div className = "step-info" >
                        <
                        div className = "step-title"
                        style = {
                            { color: step.status === 'waiting' ? 'var(--text3)' : 'var(--text1)' } } > { step.icon } { step.title } <
                        /div> <
                        div className = "step-time" > { step.time } < /div> <
                        /div> <
                        /div>
                    ))
            } <
            /div>

            { /* CALL RIDER */ } <
            div style = {
                { margin: '20px 16px', background: 'var(--g5)', borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } } >
            <
            div >
            <
            div style = {
                { fontSize: 13, fontWeight: 700 } } > John Mwangi < /div> <
            div style = {
                { fontSize: 12, color: 'var(--text3)' } } > Your delivery rider < /div> <
            /div> <
            a href = "tel:0712345678"
            style = {
                { background: 'var(--g2)', color: '#fff', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none' } } > 📞Call <
            /a> <
            /div> <
            /div>
        )
    }