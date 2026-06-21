import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Cart({ cart, updateQty, clearCart }) {
    const [showCheckout, setShowCheckout] = useState(false)
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const navigate = useNavigate()

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
    const delivery = subtotal >= 500 ? 0 : 100
    const total = subtotal + delivery

    async function handlePay() {
        if (!phone || phone.length < 10) { toast.error('Enter a valid Safaricom number'); return }
        if (!address) { toast.error('Enter your delivery address'); return }
        setLoading(true)

        // This calls your backend which triggers M-Pesa STK Push
        // For now it simulates the flow
        await new Promise(r => setTimeout(r, 2000))

        setLoading(false)
        setDone(true)
        clearCart()

        // In production, call your backend like this:
        // await fetch('http://localhost:5000/api/mpesa/stkpush', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ phone, amount: total, orderId: 'ORD-0413' })
        // })
    }

    if (done) {
        return ( <
            div className = "empty"
            style = {
                { paddingTop: 80 } } >
            <
            div style = {
                { fontSize: 64, marginBottom: 16 } } > ✅ < /div> <
            h3 > Order Placed! < /h3> <
            p style = {
                { marginBottom: 24 } } > Check your phone— an M - Pesa prompt has been sent to < strong > { phone } < /strong>. Complete the payment to confirm your order.</p >
            <
            p style = {
                { fontSize: 12, color: 'var(--text3)', marginBottom: 24 } } > Your order number is < strong > ORD - 0413 < /strong></p >
            <
            button className = "btn btn-primary"
            onClick = {
                () => { setDone(false);
                    navigate('/orders') } } > View My Orders < /button> <
            /div>
        )
    }

    if (cart.length === 0) {
        return ( <
            div className = "empty" >
            <
            div className = "empty-icon" > 🛒 < /div> <
            h3 > Your cart is empty < /h3> <
            p > Add some fresh groceries to get started! < /p> <
            button className = "btn btn-primary"
            style = {
                { marginTop: 20 } }
            onClick = {
                () => navigate('/') } > Shop Now < /button> <
            /div>
        )
    }

    return ( <
        div >
        <
        div style = {
            { padding: '16px 16px 8px', borderBottom: '1px solid var(--border)' } } >
        <
        div style = {
            { fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--text1)' } } > Your Cart < /div> <
        div style = {
            { fontSize: 12, color: 'var(--text3)', marginTop: 2 } } > { cart.reduce((s, i) => s + i.qty, 0) }
        items < /div> <
        /div>

        { /* CART ITEMS */ } {
            cart.map(item => ( <
                div key = { item.id }
                className = "cart-item" >
                <
                div className = "cart-item-img" > { item.image } < /div> <
                div className = "cart-item-info" >
                <
                div className = "cart-item-name" > { item.name } < /div> <
                div className = "cart-item-price" > KES { item.price } { item.unit } < /div> <
                div className = "qty-control" >
                <
                button className = "qty-btn"
                onClick = {
                    () => updateQty(item.id, item.qty - 1) } > − < /button> <
                span className = "qty-num" > { item.qty } < /span> <
                button className = "qty-btn"
                onClick = {
                    () => updateQty(item.id, item.qty + 1) } > + < /button> <
                span style = {
                    { marginLeft: 8, fontSize: 13, fontWeight: 700, color: 'var(--g1)' } } >= KES { item.price * item.qty } < /span> <
                /div> <
                /div> <
                button className = "remove-btn"
                onClick = {
                    () => updateQty(item.id, 0) } > < Trash2 size = { 16 }
                /></button >
                <
                /div>
            ))
        }

        { /* ORDER SUMMARY */ } <
        div className = "order-summary" >
        <
        div className = "summary-row" > < span > Subtotal < /span><span>KES {subtotal}</span > < /div> <
        div className = "summary-row" >
        <
        span > Delivery < /span> <
        span style = {
            { color: delivery === 0 ? 'var(--g2)' : 'var(--text1)' } } > { delivery === 0 ? 'FREE 🎉' : `KES ${delivery}` } <
        /span> <
        /div> {
            delivery > 0 && < div style = {
                { fontSize: 11, color: 'var(--text3)', marginTop: 4 } } > Add KES { 500 - subtotal }
            more
            for free delivery < /div>} <
                div className = "summary-total" > < span > Total < /span><span>KES {total}</span > < /div> <
                /div>

            { /* CHECKOUT BUTTON */ } <
            div className = "checkout-bar" >
                <
                button className = "checkout-btn"
            onClick = {
                    () => setShowCheckout(true) } >
                Pay KES { total }
            via M - Pesa <
                /button> <
                /div>

            { /* MPESA CHECKOUT MODAL */ } {
                showCheckout && ( <
                    div className = "modal-overlay"
                    onClick = {
                        () => setShowCheckout(false) } >
                    <
                    div className = "modal-sheet"
                    onClick = { e => e.stopPropagation() } >
                    <
                    div className = "modal-handle" > < /div> <
                    div className = "mpesa-logo-big" > < span > M - PESA < /span></div >
                    <
                    div className = "modal-title" > Complete Payment < /div>

                    <
                    div style = {
                        { background: 'var(--g5)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 } } >
                    <
                    div style = {
                        { display: 'flex', justifyContent: 'space-between', fontSize: 13 } } >
                    <
                    span style = {
                        { color: 'var(--text2)' } } > Order Total < /span> <
                    span style = {
                        { fontWeight: 700, fontSize: 16, color: 'var(--g1)' } } > KES { total } < /span> <
                    /div> <
                    div style = {
                        { fontSize: 11, color: 'var(--text3)', marginTop: 4 } } > Paybill: 522522• Account: FreshMart < /div> <
                    /div>

                    <
                    div className = "form-group" >
                    <
                    label > Safaricom Phone Number < /label> <
                    input type = "tel"
                    placeholder = "07XXXXXXXX"
                    value = { phone }
                    onChange = { e => setPhone(e.target.value) }
                    maxLength = { 10 }
                    /> <
                    /div>

                    <
                    div className = "form-group" >
                    <
                    label > Delivery Address < /label> <
                    input placeholder = "e.g. Westlands, near Sarit Centre"
                    value = { address }
                    onChange = { e => setAddress(e.target.value) }
                    /> <
                    /div>

                    <
                    div style = {
                        { fontSize: 12, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.6 } } > 📱You will receive an M - Pesa STK push on your phone.Enter your PIN to complete payment. <
                    /div>

                    <
                    button className = "pay-btn"
                    onClick = { handlePay }
                    disabled = { loading } > { loading ? '⏳ Sending STK Push...' : `Pay KES ${total} Now` } <
                    /button> <
                    button style = {
                        { width: '100%', background: 'none', border: 'none', padding: '12px', fontSize: 13, color: 'var(--text3)', cursor: 'pointer', marginTop: 4 } }
                    onClick = {
                        () => setShowCheckout(false) } > Cancel < /button> <
                    /div> <
                    /div>
                )
            } <
            /div>
        )
    }