import { useState } from 'react'
import { Plus, X, Bike } from 'lucide-react'
import toast from 'react-hot-toast'

const SAMPLE_RIDERS = [
    { id: 1, name: 'John Mwangi', phone: '0712345678', zone: 'Westlands', status: 'on_route', deliveries_today: 18, avg_time: 14, rating: 4.9, earnings_today: 1800 },
    { id: 2, name: 'Salim Kamau', phone: '0723456789', zone: 'Kilimani', status: 'on_route', deliveries_today: 14, avg_time: 19, rating: 4.6, earnings_today: 1400 },
    { id: 3, name: "Aisha Ndung'u", phone: '0734567890', zone: 'Karen', status: 'idle', deliveries_today: 11, avg_time: 16, rating: 4.8, earnings_today: 1100 },
    { id: 4, name: 'Peter Otieno', phone: '0745678901', zone: 'Eastleigh', status: 'on_route', deliveries_today: 9, avg_time: 22, rating: 4.5, earnings_today: 900 },
    { id: 5, name: 'Mary Njeri', phone: '0756789012', zone: 'Kasarani', status: 'offline', deliveries_today: 0, avg_time: 0, rating: 4.7, earnings_today: 0 },
]

export default function Riders() {
    const [riders, setRiders] = useState(SAMPLE_RIDERS)
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ name: '', phone: '', zone: '' })

    function addRider() {
        if (!form.name || !form.phone) { toast.error('Name and phone are required'); return }
        const newRider = { id: Date.now(), ...form, status: 'idle', deliveries_today: 0, avg_time: 0, rating: 0, earnings_today: 0 }
        setRiders(prev => [...prev, newRider])
        toast.success('Rider added!')
        setShowModal(false)
        setForm({ name: '', phone: '', zone: '' })
    }

    const statusBadge = (status) => {
        const map = { on_route: { label: 'On Route', bg: '#e8f7ed', color: '#1a5c2a' }, idle: { label: 'Idle', bg: '#fff3e0', color: '#e65100' }, offline: { label: 'Offline', bg: '#f5f5f5', color: '#666' } }
        const s = map[status] || map.idle
        return <span style = {
            { fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 10 }
        } > { s.label } < /span>
    }

    const stars = (rating) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))

    const activeRiders = riders.filter(r => r.status === 'on_route').length
    const totalDeliveries = riders.reduce((s, r) => s + r.deliveries_today, 0)
    const totalEarnings = riders.reduce((s, r) => s + r.earnings_today, 0)

    return ( <
        div >
        <
        div className = "page-header" >
        <
        div >
        <
        div className = "page-title" > Riders < /div> <
        div className = "page-sub" > Track and manage your delivery team < /div> < /
        div > <
        button className = "btn btn-primary"
        onClick = {
            () => setShowModal(true)
        } > < Plus size = { 16 }
        /> Add Rider</button >
        <
        /div>

        { /* SUMMARY CARDS */ } <
        div className = "stats-grid"
        style = {
            { gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }
        } >
        <
        div className = "stat-card" >
        <
        div className = "stat-label" > < Bike size = { 14 }
        /> Active Now</div >
        <
        div className = "stat-value" > { activeRiders } < /div> <
        div className = "stat-change up" > of { riders.length }
        riders < /div> < /
        div > <
        div className = "stat-card" >
        <
        div className = "stat-label" > Deliveries Today < /div> <
        div className = "stat-value" > { totalDeliveries } < /div> <
        div className = "stat-change up" > Across all riders < /div> < /
        div > <
        div className = "stat-card" >
        <
        div className = "stat-label" > Rider Earnings Today < /div> <
        div className = "stat-value" > KES { totalEarnings.toLocaleString() } < /div> <
        div className = "stat-change up" > KES 100 per delivery < /div> < /
        div > <
        /div>

        { /* RIDER CARDS */ } <
        div className = "grid-2" > {
            riders.map(r => ( <
                div key = { r.id }
                className = "card" >
                <
                div className = "card-body" >
                <
                div className = "flex-between mb-16" >
                <
                div className = "flex gap-12" >
                <
                div style = {
                    { width: 44, height: 44, borderRadius: '50%', background: 'var(--g5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: 'var(--g1)' }
                } > { r.name.split(' ').map(n => n[0]).join('').slice(0, 2) } <
                /div> <
                div >
                <
                div style = {
                    { fontWeight: 700, fontSize: 14 }
                } > { r.name } < /div> <
                div style = {
                    { fontSize: 12, color: 'var(--text3)' }
                } > { r.phone }• { r.zone } < /div> <
                div style = {
                    { color: 'var(--accent)', fontSize: 13, marginTop: 2 }
                } > { stars(r.rating) } < span style = {
                    { color: 'var(--text3)', fontSize: 11 }
                } > { r.rating } < /span></div >
                <
                /div> < /
                div > { statusBadge(r.status) } <
                /div> <
                div style = {
                    { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }
                } >
                <
                div style = {
                    { background: 'var(--g5)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }
                } >
                <
                div style = {
                    { fontSize: 10, color: 'var(--text3)', fontWeight: 600 }
                } > DELIVERIES < /div> <
                div style = {
                    { fontSize: 18, fontWeight: 700, fontFamily: 'var(--serif)' }
                } > { r.deliveries_today } < /div> < /
                div > <
                div style = {
                    { background: 'var(--g5)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }
                } >
                <
                div style = {
                    { fontSize: 10, color: 'var(--text3)', fontWeight: 600 }
                } > AVG TIME < /div> <
                div style = {
                    { fontSize: 18, fontWeight: 700, fontFamily: 'var(--serif)' }
                } > { r.avg_time || '—' } < span style = {
                    { fontSize: 11 }
                } > min < /span></div >
                <
                /div> <
                div style = {
                    { background: 'var(--g5)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }
                } >
                <
                div style = {
                    { fontSize: 10, color: 'var(--text3)', fontWeight: 600 }
                } > EARNED < /div> <
                div style = {
                    { fontSize: 18, fontWeight: 700, fontFamily: 'var(--serif)' }
                } > { r.earnings_today } < /div> < /
                div > <
                /div> < /
                div > <
                /div>
            ))
        } <
        /div>

        { /* ADD RIDER MODAL */ } {
            showModal && ( <
                    div className = "modal-overlay"
                    onClick = {
                        () => setShowModal(false)
                    } >
                    <
                    div className = "modal"
                    onClick = { e => e.stopPropagation() } >
                    <
                    div className = "modal-header" >
                    <
                    div className = "modal-title" > Add New Rider < /div> <
                    button className = "modal-close"
                    onClick = {
                        () => setShowModal(false)
                    } > < X size = { 20 }
                    /></button >
                    <
                    /div> <
                    div className = "form-group" > < label > Full Name < /label><input value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="e.g. John Mwangi"/ > < /div> <
                    div className = "form-group" > < label > Phone Number < /label><input value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} placeholder="07XXXXXXXX"/ > < /div> <
                    div className = "form-group" >
                    <
                    label > Delivery Zone < /label> <
                    select value = { form.zone }
                    onChange = { e => setForm({...form, zone: e.target.value }) } >
                    <
                    option value = "" > Select zone < /option> { ['Westlands', 'Kilimani', 'Karen', 'Kasarani', 'Eastleigh', 'Parklands', 'Ngong Road', 'South B', 'South C'].map(z => < option key = { z } > { z } < /option>)} < /
                        select > <
                        /div> <
                        div className = "flex gap-8"
                        style = {
                            { justifyContent: 'flex-end', marginTop: 8 }
                        } >
                        <
                        button className = "btn btn-outline"
                        onClick = {
                            () => setShowModal(false)
                        } > Cancel < /button> <
                        button className = "btn btn-primary"
                        onClick = { addRider } > Add Rider < /button> < /
                        div > <
                        /div> < /
                        div >
                    )
                } <
                /div>
        )
    }